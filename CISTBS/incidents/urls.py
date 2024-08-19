from django.urls import path, include
from .views import IncidentListCreateView, IncidentDetailView,playbook_detail_view

urlpatterns = [
    path('incidents/', IncidentListCreateView.as_view(), name='incident-list-create'),
    path('incidents/<int:pk>/', IncidentDetailView.as_view(), name='incident-detail'),
    path('playbook/<int:playbook_id>/', playbook_detail_view, name='playbook_detail'),
]
