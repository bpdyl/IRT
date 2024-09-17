from rest_framework import generics
from django.views.generic import TemplateView
from rest_framework import status
from rest_framework import viewsets, permissions
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from backend.authentication import CustomJWTAuthentication
from rest_framework_simplejwt.tokens import RefreshToken
from django.shortcuts import get_object_or_404
from django.http import JsonResponse   #Added to return JSON response for suggestions
from .models import (
    Playbook,
    CustomUser,
    Incident,
    Task,
    FollowUp,
    Retrospective,
    TimelineEvent,
    TimelineComment,
    Team,
    IncidentRole,
    IncidentType,
    IncidentAssignment,
)
from django.contrib.auth.models import User
from .serializers import (
    PlaybookSerializer,
    AuthTokenSerializer,
    TaskSerializer,
    UserSerializer,
    IncidentSerializer,
    TimelineEventSerializer,
    TimelineCommentSerializer,
    TeamSerializer,
    IncidentRoleSerializer,
    IncidentAssignmentSerializer,
    FollowUpSerializer,
    IncidentTypeSerializer,
    RetrospectiveSerializer,
)


### New API View for Incident Suggestions
class IncidentSuggestionView(APIView):  # New class for handling auto-complete suggestions
    def get(self, request):
        query = request.GET.get('q', '')  # Get the query from the URL
        incident_list = [
            "Network Failure", "Server Downtime", "Data Breach", "DDoS Attack",
            "Phishing Attack", "Malware Infection", "Ransomware Attack",
            "Unauthorized Access", "Insider Threat", "Application Bug",
            "Database Corruption", "Configuration Error", "Hardware Failure",
            "Software Vulnerability Exploit", "Power Outage", "Credential Theft",
            "Spyware Infection", "Physical Security Breach",
            "Third-Party Vendor Breach", "Social Engineering Attack"
        ]  # added manually

        filtered_incidents = [
            incident for incident in incident_list if query.lower() in incident.lower()
        ]

        return JsonResponse(filtered_incidents[:10], safe=False)  # Return max 10 matching results

# New view to get severity choices
class SeverityListView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [CustomJWTAuthentication]
    def get(self, request):
        # Fetch severity choices from the model
        severities = [{'name': sev[0], 'label': sev[1]} for sev in Incident.SEVERITY_CHOICES]
        return Response(severities, status=status.HTTP_200_OK)


# Fetch Users Based on Team IDs
@api_view(['GET'])
@permission_classes([IsAuthenticated])
@authentication_classes([CustomJWTAuthentication])
def fetch_team_users(request):
    team_ids = request.GET.get('team_ids', '').split(',')
    users = CustomUser.objects.filter(teams__id__in=team_ids).distinct()  # Users in selected teams
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)

class IncidentTypeCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [CustomJWTAuthentication]
    queryset = IncidentType.objects.all()
    serializer_class = IncidentTypeSerializer

# @api_view(['GET'])
# @permission_classes([IsAuthenticated])
# @authentication_classes([CustomJWTAuthentication])
# def fetch_incident_types(request):
#     incident_types = IncidentType.objects.all()
#     return Response([{"name": type.name, "id": type.id} for type in incident_types], status=status.HTTP_200_OK)
# # View to fetch users by selected teams
# @api_view(['GET'])
# def UsersByTeamsView(request):
#     team_ids = request.data.get('teamIds', [])
#     if not team_ids:
#         return Response({"detail": "No team IDs provided"}, status=status.HTTP_400_BAD_REQUEST)

#     # Get users from the selected teams
#     users = CustomUser.objects.filter(teams__id__in=team_ids).distinct()
#     user_data = [{"id": user.id, "name": user.name or user.email} for user in users]

#     return Response(user_data, status=status.HTTP_200_OK)

class TeamViewSet(viewsets.ModelViewSet):
    queryset = Team.objects.all()
    serializer_class = TeamSerializer
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [CustomJWTAuthentication]

class IncidentRoleViewSet(viewsets.ModelViewSet):
    serializer_class = IncidentRoleSerializer
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [CustomJWTAuthentication]
    def get_queryset(self):
        queryset = IncidentRole.objects.all()
        incident_id = self.request.query_params.get('incident_id')
        if incident_id:
            queryset = queryset.filter(incident_id=incident_id)
        return queryset

class IncidentAssignmentViewSet(viewsets.ModelViewSet):
    queryset = IncidentAssignment.objects.all()
    serializer_class = IncidentAssignmentSerializer
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [CustomJWTAuthentication]

class IncidentListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [CustomJWTAuthentication]
    queryset = Incident.objects.all()
    serializer_class = IncidentSerializer

class IncidentDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [CustomJWTAuthentication]
    queryset = Incident.objects.all()
    serializer_class = IncidentSerializer

class TaskListCreateView(generics.ListCreateAPIView):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [CustomJWTAuthentication]

    def get_queryset(self):
        """Get tasks related to a specific incident."""
        incident_id = self.kwargs['incident_id']
        return Task.objects.filter(incident_id=incident_id)

    def perform_create(self, serializer):
        """Create a new task under the given incident."""
        incident_id = self.kwargs['incident_id']
        print(f'Incident id : {incident_id}')
        incident = Incident.objects.get(id=incident_id)
        print(f'Incident and requested user: {self.request.user}: type of incident {type(incident)}')
        serializer.save(created_by=self.request.user, incident=incident)

class TaskDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [CustomJWTAuthentication]
    queryset = Task.objects.all()


class FollowUpListCreateView(generics.ListCreateAPIView):
    serializer_class = FollowUpSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [CustomJWTAuthentication]

    def get_queryset(self):
        """Get tasks related to a specific incident."""
        incident_id = self.kwargs['incident_id']
        return FollowUp.objects.filter(incident_id=incident_id)

    def perform_create(self, serializer):
        """Create a new task under the given incident."""
        incident_id = self.kwargs['incident_id']
        incident = Incident.objects.get(id=incident_id)
        serializer.save(created_by=self.request.user, incident=incident)

class FollowUpDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = FollowUpSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [CustomJWTAuthentication]
    queryset = FollowUp.objects.all()

class TimelineEventListCreateView(generics.ListCreateAPIView):
    serializer_class = TimelineEventSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        incident_id = self.kwargs['incident_id']
        return TimelineEvent.objects.filter(incident_id=incident_id).order_by('-timestamp')

    def perform_create(self, serializer):
        incident_id = self.kwargs['incident_id']
        serializer.save(author=self.request.user, incident_id=incident_id)

class TimelineEventDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = TimelineEvent.objects.all()
    serializer_class = TimelineEventSerializer
    permission_classes = [IsAuthenticated]

class TimelineCommentListCreateView(generics.ListCreateAPIView):
    serializer_class = TimelineCommentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        event_id = self.kwargs['event_id']
        return TimelineComment.objects.filter(event_id=event_id).order_by('timestamp')

    def perform_create(self, serializer):
        event_id = self.kwargs['event_id']
        serializer.save(author=self.request.user, event_id=event_id)

class TimelineCommentDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = TimelineComment.objects.all()
    serializer_class = TimelineCommentSerializer
    permission_classes = [IsAuthenticated]

class IndexView(TemplateView):
    template_name = 'index.html'

class UserListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [CustomJWTAuthentication]
    serializer_class = UserSerializer
    queryset = CustomUser.objects.all()

class PlaybookListView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [CustomJWTAuthentication]
    def get(self, request):
        print(f'Request made by : {request.user}')
        playbooks = Playbook.objects.all()
        serializer = PlaybookSerializer(playbooks, many=True)
        return Response(serializer.data)

class PlaybookDetailView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [CustomJWTAuthentication]
    def get(self, request, pk):
        print(f'Request made by : {request.user}')
        playbook = get_object_or_404(Playbook, pk=pk)
        serializer = PlaybookSerializer(playbook)
        return Response(serializer.data)

    def post(self, request, pk):
        playbook = get_object_or_404(Playbook, pk=pk)
        content = request.data.get('content', '')
        print(f'New content : {content}')
        if content:
            playbook.content = content
            playbook.save()
            return Response({"message": "Playbook updated successfully"}, status=status.HTTP_200_OK)
        return Response({"error": "Content is required"}, status=status.HTTP_400_BAD_REQUEST)
    
class CopyPlaybookView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [CustomJWTAuthentication]

    def post(self, request, pk):
        playbook = get_object_or_404(Playbook, pk=pk)
        
        # Create a new Playbook instance by copying the original one
        created_by = request.user if request.user.is_authenticated else User.objects.first()
        new_playbook = Playbook.objects.create(
            title=f"{playbook.title} (Copy)",
            description=playbook.description,
            incident_type = playbook.incident_type,
            content=playbook.content,
            created_by=created_by,  # assuming the logged-in user is the owner of the copy
            is_editable=True,  # Make the copied playbook editable
        )

        serializer = PlaybookSerializer(new_playbook)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class LoginView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        serializer = AuthTokenSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            return Response({
                'access': str(refresh.access_token),
                'refresh': str(refresh),
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SyncUserView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = AuthTokenSerializer(data=request.data)
        auth0_user_id = request.data.get('sub')  # Auth0 user ID
        email = request.data.get('email', '')
        first_name = request.data.get('firstName', '')
        last_name = request.data.get('lastName', '')
        nickname = request.data.get('nickname', '')

        # Check if the user exists in the local database
        user, created = User.objects.get_or_create(username=auth0_user_id)

        if created:
            # Set user details depending on the type of user
            if first_name and last_name:
                user.first_name = first_name
                user.last_name = last_name
            else:
                # If no first_name and last_name, use nickname or name
                user.first_name = nickname
                user.last_name = ''  # Optionally leave last_name empty for Auth0 DB users
            user.email = email
            user.save()
            message = "User created and synced."
        else:
            # Optionally, update user details if necessary
            user.email = email
            if first_name and last_name:
                user.first_name = first_name
                user.last_name = last_name
            else:
                user.first_name = nickname
            user.save()
            message = "User already exists and synced."

        return Response({"message": message, "user_id": user.id}, status=status.HTTP_200_OK)

# from rest_framework.response import Response
# from rest_framework.decorators import api_view
# from rest_framework import status
#
# from .models import Incident
# from .serializers import *
#
# @api_view(['GET', 'POST'])
# def incidents_list(request):
#     if request.method == 'GET':
#         data = Incident.objects.all()
#
#         serializer = IncidentSerializer(data, context={'request': request}, many=True)
#
#         return Response(serializer.data)
#
#     elif request.method == 'POST':
#         serializer = IncidentSerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(status=status.HTTP_201_CREATED)
#
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
#
# @api_view(['PUT', 'DELETE'])
# def incidents_detail(request, pk):
#     try:
#         incident = Incident.objects.get(pk=pk)
#     except Incident.DoesNotExist:
#         return Response(status=status.HTTP_404_NOT_FOUND)
#
#     if request.method == 'PUT':
#         serializer = IncidentSerializer(incident, data=request.data,context={'request': request})
#         if serializer.is_valid():
#             serializer.save()
#             return Response(status=status.HTTP_204_NO_CONTENT)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
#
#     elif request.method == 'DELETE':
#         incident.delete()
#         return Response(status=status.HTTP_204_NO_CONTENT)
