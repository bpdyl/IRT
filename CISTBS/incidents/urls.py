from django.urls import path, include
from .views import IncidentListCreateView, IncidentDetailView

urlpatterns = [
    path('incidents/', IncidentListCreateView.as_view(), name='incident-list-create'),
    path('incidents/<int:pk>/', IncidentDetailView.as_view(), name='incident-detail'),
]
