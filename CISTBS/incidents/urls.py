from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView
from .views import IncidentListCreateView, IncidentDetailView,PlaybookListView,PlaybookDetailView,CopyPlaybookView, SyncUserView,LoginView
from .views import IncidentSuggestionView  # <-- Added import for the new suggestion view

urlpatterns = [
    path('login',LoginView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('user/sync', SyncUserView.as_view(), name='sync-user'),
    path('incidents/', IncidentListCreateView.as_view(), name='incident-list-create'),
    path('incidents/<int:pk>/', IncidentDetailView.as_view(), name='incident-detail'),
    path('playbooks/', PlaybookListView.as_view(), name='playbook_list'),
    path('playbooks/<uuid:pk>/', PlaybookDetailView.as_view(), name='playbook_detail'),
    path('playbooks/<uuid:pk>/update/', PlaybookDetailView.as_view(), name='playbook_update'),
    path('playbooks/<uuid:pk>/copy/', CopyPlaybookView.as_view(), name='copy_playbook'),
    path('incidents/suggestions/', IncidentSuggestionView.as_view(), name='incident-suggestions'),  #Added URL for suggestions
]
