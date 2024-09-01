from rest_framework import serializers
from .models import Incident,Playbook,CustomUser
import requests
from django.conf import settings
import jwt
from rest_framework.exceptions import AuthenticationFailed


class IncidentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Incident
        fields = '__all__'

class PlaybookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Playbook
        fields = ['id', 'title', 'description', 'content', 'created_at', 'updated_at','is_editable']

class AuthTokenSerializer(serializers.Serializer):
    auth_token = serializers.CharField()
    print(f'Auth token sent by cleint : {auth_token}')
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