from rest_framework import generics
from .models import Incident
from .serializers import IncidentSerializer
from django.views.generic import TemplateView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import Playbook
from django.contrib.auth.models import User
from .serializers import PlaybookSerializer
from rest_framework.permissions import AllowAny

class IncidentListCreateView(generics.ListCreateAPIView):
    queryset = Incident.objects.all()
    serializer_class = IncidentSerializer

class IncidentDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Incident.objects.all()
    serializer_class = IncidentSerializer



class IndexView(TemplateView):
    template_name = 'index.html'


class PlaybookListView(APIView):
    def get(self, request):
        playbooks = Playbook.objects.all()
        serializer = PlaybookSerializer(playbooks, many=True)
        return Response(serializer.data)

class PlaybookDetailView(APIView):
    def get(self, request, pk):
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
    permission_classes = [AllowAny]
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