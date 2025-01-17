from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework.routers import DefaultRouter
from .views import (
    IncidentListCreateView,
    IncidentDetailView,
    TaskListCreateView,
    FollowUpListCreateView,
    FollowUpDetailView,
    TaskDetailView,
    PlaybookListView,
    PlaybookDetailView,
    CopyPlaybookView,
    SyncUserView,
    LoginView,
    IncidentSuggestionView,
    UserListCreateView,
    TimelineEventListCreateView,
    TimelineEventDetailView,
    TimelineCommentListCreateView,
    TimelineCommentDetailView,
    RetrospectiveDetailView,
    RetrospectiveTemplateListCreateView,
     # New views for teams and roles
    TeamViewSet,
    IncidentRoleViewSet,
    IncidentAssignmentViewSet,
    SeverityListView,  # Add SeverityListView
    # UsersByTeamsView,  # Add UsersByTeamsView
    fetch_team_users,
    IncidentTypeCreateView,
)

router = DefaultRouter()
# Register viewsets for teams, roles, and assignments
router.register(r'teams', TeamViewSet, basename='team')
router.register(r'incident-roles', IncidentRoleViewSet, basename='incident-role')
router.register(r'incident-assignments', IncidentAssignmentViewSet, basename='incident-assignment')

urlpatterns = [
    # Include router URLs
    path('', include(router.urls)),
    #Existing URL patterns
    path('login',LoginView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('user/sync', SyncUserView.as_view(), name='sync-user'),
    path('users/', UserListCreateView.as_view(), name='user-list-create'),
    path('incidents/', IncidentListCreateView.as_view(), name='incident-list-create'),
    path('incidents/<uuid:pk>/', IncidentDetailView.as_view(), name='incident-detail'),
    path('incidents/<uuid:incident_id>/tasks/', TaskListCreateView.as_view(), name='task-list-create'),
    path('tasks/<uuid:pk>/', TaskDetailView.as_view(), name='task-detail'),
    path('incidents/<uuid:incident_id>/follow_ups/', FollowUpListCreateView.as_view(), name='followup-list-create'),
    path('follow_ups/<uuid:pk>/', FollowUpDetailView.as_view(), name='task-detail'),
    path('incidents/<uuid:incident_id>/retrospective/', RetrospectiveDetailView.as_view(), name='retrospective-detail'),
    path('retrospective-templates/', RetrospectiveTemplateListCreateView.as_view(), name='retrospective-template-list-create'),
    path('playbooks/', PlaybookListView.as_view(), name='playbook_list'),
    path('playbooks/<uuid:pk>/', PlaybookDetailView.as_view(), name='playbook_detail'),
    path('playbooks/<uuid:pk>/update/', PlaybookDetailView.as_view(), name='playbook_update'),
    path('playbooks/<uuid:pk>/copy/', CopyPlaybookView.as_view(), name='copy_playbook'),
    # Timeline Events URLs
    path('incidents/<uuid:incident_id>/timeline-events/', TimelineEventListCreateView.as_view(), name='timeline-event-list-create'),
    path('timeline-events/<int:pk>/', TimelineEventDetailView.as_view(), name='timeline-event-detail'),
    # Timeline Comments URLs
    path('timeline-events/<int:event_id>/comments/', TimelineCommentListCreateView.as_view(), name='timeline-comment-list-create'),
    path('timeline-comments/<int:pk>/', TimelineCommentDetailView.as_view(), name='timeline-comment-detail'),
    # helper API URLS for incident creation 
    path('severities/', SeverityListView.as_view(), name='severities-list'),
    path('users-by-teams/', fetch_team_users, name='users-by-teams'),
    path('incident-types/', IncidentTypeCreateView.as_view(), name='incident-types'),
    path('incidents/suggestions/', IncidentSuggestionView.as_view(), name='incident-suggestions'),
]
