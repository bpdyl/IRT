from rest_framework import serializers
from .models import Incident,Playbook,CustomUser,Task,TimelineEvent,TimelineComment,Team,IncidentRole,IncidentAssignment,FollowUp,Retrospective,IncidentType
import requests
from django.conf import settings
import jwt
from rest_framework.exceptions import AuthenticationFailed


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['_id', 'username', 'name','email','role']

class TeamSerializer(serializers.ModelSerializer):
    members = UserSerializer(many=True, read_only=True)
    member_ids = serializers.PrimaryKeyRelatedField(
        many=True, queryset=CustomUser.objects.all(), write_only=True, source='members'
    )

    class Meta:
        model = Team
        fields = ['id', 'name', 'description', 'members', 'member_ids']

class IncidentAssignmentSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(queryset=CustomUser.objects.all(), required=False, allow_null=True)
    role = serializers.PrimaryKeyRelatedField(queryset=IncidentRole.objects.all())
    class Meta:
        model = IncidentAssignment
        fields = ['id', 'incident', 'user', 'role']

    def validate(self, data):
        user = data.get('user')
        incident = data.get('incident')
        if user and incident:
            user_teams = set(user.teams.all())
            incident_teams = set(incident.teams.all())
            if not user_teams.intersection(incident_teams):
                raise serializers.ValidationError('User must be a member of one of the incident\'s teams.')
        return data

class IncidentSerializer(serializers.ModelSerializer):
    reported_by = UserSerializer(read_only=True)
    team_ids = serializers.PrimaryKeyRelatedField(
        many=True, queryset=Team.objects.all(), write_only=True, source='teams', required=False
    )
    teams = TeamSerializer(many=True, read_only=True)
    assignments = IncidentAssignmentSerializer(many=True, required=False)

    class Meta:
        model = Incident
        fields = [
            'id', 'incident_type', 'title', 'description', 'reported_by',
            'reported_date', 'start_datetime', 'mitigation_datetime',
            'resolution_datetime', 'closed_datetime', 'status',
            'initial_entry_point', 'severity', 'affected_users',
            'affected_systems', 'related_incidents', 'playbook',
            'teams', 'team_ids', 'assignments',
        ]
        read_only_fields = ['id', 'reported_by', 'reported_date']

    def create(self, validated_data):
        teams_data = validated_data.pop('teams', [])
        assignments_data = validated_data.pop('assignments', [])
        incident = Incident.objects.create(**validated_data)
        incident.teams.set(teams_data)

        for assignment_data in assignments_data:
            assignment_data['incident'] = incident.id 
            print(f'I am here with assignment data: {assignment_data}')
            serializer = IncidentAssignmentSerializer(data=assignment_data)
            serializer.is_valid(raise_exception=True)
            serializer.save()

        return incident

    def update(self, instance, validated_data):
        teams_data = validated_data.pop('teams', [])
        assignments_data = validated_data.pop('assignments', [])

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if teams_data:
            instance.teams.set(teams_data)

        if assignments_data:
            existing_assignments = {a.user_id: a for a in instance.assignments.all()}
            for assignment_data in assignments_data:
                user_id = assignment_data['user'].id
                if user_id in existing_assignments:
                    # Update existing assignment
                    assignment = existing_assignments.pop(user_id)
                    assignment.role = assignment_data['role']
                    assignment.save()
                else:
                    # Create a new assignment
                    assignment_data['incident'] = instance
                    serializer = IncidentAssignmentSerializer(data=assignment_data)
                    serializer.is_valid(raise_exception=True)
                    serializer.save()

            # Delete any assignments that weren't updated
            if existing_assignments:
                for assignment in existing_assignments.values():
                    assignment.delete()


        return instance


class IncidentRoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = IncidentRole
        fields = '__all__'

class IncidentTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = IncidentType
        fields = '__all__'

class TaskSerializer(serializers.ModelSerializer):
    assignee = UserSerializer(read_only=True)  # Show full user details in response
    assignee_id = serializers.PrimaryKeyRelatedField(queryset=CustomUser.objects.all(), write_only=True, source='assignee')

    class Meta:
        model = Task
        fields = ['id', 'title', 'description', 'due_date', 'priority','status','created_by', 'assignee', 'assignee_id', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_by', 'created_at', 'updated_at']

class FollowUpSerializer(serializers.ModelSerializer):
    assignee = UserSerializer(read_only=True)  # Show full user details in response
    assignee_id = serializers.PrimaryKeyRelatedField(queryset=CustomUser.objects.all(), write_only=True, source='assignee')

    class Meta:
        model = FollowUp
        fields = ['id', 'title', 'description', 'due_date', 'priority','status','created_by', 'assignee', 'assignee_id', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_by', 'created_at', 'updated_at']


class TimelineCommentSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.username', read_only=True)

    class Meta:
        model = TimelineComment
        fields = ['id', 'event', 'author', 'author_name', 'timestamp', 'message']
        read_only_fields = ['id', 'author', 'timestamp', 'author_name']

class TimelineEventSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.username', read_only=True)
    comments = TimelineCommentSerializer(many=True, read_only=True)

    class Meta:
        model = TimelineEvent
        fields = [
            'id',
            'incident',
            'author',
            'author_name',
            'timestamp',
            'message',
            'event_type',
            'data',
            'comments',
        ]
        read_only_fields = ['id', 'author', 'timestamp', 'author_name', 'comments']


class PlaybookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Playbook
        fields = ['id', 'title', 'description', 'content', 'created_at', 'updated_at','is_editable']

class RetrospectiveSerializer(serializers.ModelSerializer):
    class Meta:
        model = Retrospective
        fields = '__all__'

class AuthTokenSerializer(serializers.Serializer):
    auth_token = serializers.CharField()
    def validate_auth_token(self, auth_token):
        auth_token = str.replace(str(auth_token), 'Bearer ', '')

        # Fetch Auth0 JWKS (JSON Web Key Set)
        auth0_domain = settings.AUTH0_DOMAIN
        jwks_url = f'https://{auth0_domain}/.well-known/jwks.json'
        try:
            jwks = requests.get(jwks_url).json()
        except requests.exceptions.RequestException as e:
            raise AuthenticationFailed(f'Failed to fetch JWKS: {e}')
                
        # Get the kid (Key ID) from the header of the JWT
        header = jwt.get_unverified_header(auth_token)
        rsa_key = {}
        for key in jwks["keys"]:
            if key["kid"] == header["kid"]:
                rsa_key = {
                    "kty": key["kty"],
                    "kid": key["kid"],
                    "use": key["use"],
                    "n": key["n"],
                    "e": key["e"],
                }
        
        if not rsa_key:
            raise AuthenticationFailed('Unable to find the appropriate key.')

        # Decode the token using the fetched public key
        try:

            # decoded_token = jwt.decode(auth_token, rsa_key, algorithms=["RS256"], audience=settings.AUTH0_AUDIENCE)
            decoded_token = jwt.decode(auth_token, options={"verify_signature": False})
            # print(f'decoded_token: {decoded_token}')
            return decoded_token
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Token has expired')
        except jwt.MissingRequiredClaimError:
            raise AuthenticationFailed('Invalid token claims')
        except jwt.PyJWTError:
            raise AuthenticationFailed('Invalid token')

    def create(self, validated_data):
        decoded_token = validated_data
        auth_token = self.initial_data.get('auth_token')
        auth0_domain = settings.AUTH0_DOMAIN
        userinfo_url = f'https://{auth0_domain}/userinfo'
        headers = {'Authorization': f'{auth_token}'}
        try:
            userinfo_response = requests.get(userinfo_url, headers=headers)
            userinfo_response.raise_for_status()
            userinfo = userinfo_response.json()
        except requests.exceptions.RequestException as e:
            raise AuthenticationFailed(f'Failed to fetch user info: {e}')

        # Extract email and name from the user info response
        email = userinfo.get('email')
        name = userinfo.get('name')
        user, created = CustomUser.objects.get_or_create(email=email, defaults={'name': name,'username':email})
        return user