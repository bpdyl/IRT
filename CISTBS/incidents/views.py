from rest_framework import generics
from .models import Incident
from .serializers import IncidentSerializer

class IncidentListCreateView(generics.ListCreateAPIView):
    queryset = Incident.objects.all()
    serializer_class = IncidentSerializer

class IncidentDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Incident.objects.all()
    serializer_class = IncidentSerializer





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