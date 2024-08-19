from django.urls import path, include
from .views import IncidentListCreateView, IncidentDetailView,PlaybookListView,PlaybookDetailView,CopyPlaybookView

urlpatterns = [
    path('incidents/', IncidentListCreateView.as_view(), name='incident-list-create'),
    path('incidents/<int:pk>/', IncidentDetailView.as_view(), name='incident-detail'),
    path('playbooks/', PlaybookListView.as_view(), name='playbook_list'),
    path('playbooks/<uuid:pk>/', PlaybookDetailView.as_view(), name='playbook_detail'),
    path('playbooks/<uuid:pk>/update/', PlaybookDetailView.as_view(), name='playbook_update'),
    path('playbooks/<uuid:pk>/copy/', CopyPlaybookView.as_view(), name='copy_playbook'),
]
