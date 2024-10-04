# signals.py

from django.db.models.signals import pre_save, post_save, post_delete, m2m_changed, pre_delete
from django.dispatch import receiver
from django.db import models
from django.utils import timezone
from django.db import transaction

from .models import (
    Incident,
    IncidentAssignment,
    IncidentRole,
    Task,
    FollowUp,
    Retrospective,
    TimelineEvent,
    Team,
)

# If you're using thread-local storage to get the current user
from django.utils.deprecation import MiddlewareMixin

# Define a thread-local storage for the current user
import threading
_thread_locals = threading.local()

def get_deleted_incidents():
    if not hasattr(_thread_locals, 'deleted_incidents'):
        _thread_locals.deleted_incidents = set()
    return _thread_locals.deleted_incidents

from backend.authentication import get_current_user


# Ensure you add 'path.to.CurrentUserMiddleware' to MIDDLEWARE in settings.py

# Utility function to get field changes
def get_field_changes(instance, pre_instance, fields):
    changes = []
    for field in fields:
        old_value = getattr(pre_instance, field, None)
        new_value = getattr(instance, field, None)
        if old_value != new_value:
            if isinstance(old_value, models.Model):
                old_value = str(old_value)
            if isinstance(new_value, models.Model):
                new_value = str(new_value)
            elif isinstance(new_value, timezone.datetime):
                new_value = new_value.strftime('%Y-%m-%d %H:%M:%S')
                if old_value:
                    old_value = old_value.strftime('%Y-%m-%d %H:%M:%S')
            changes.append(f"{field} changed from '{old_value}' to '{new_value}'")
    return changes

# Incident signals
@receiver(pre_save, sender=Incident)
def incident_pre_save(sender, instance, **kwargs):
    if instance.pk:
        try:
            instance._pre_save_instance = Incident.objects.get(pk=instance.pk)
        except Incident.DoesNotExist:
            instance._pre_save_instance = None

@receiver(post_save, sender=Incident)
def incident_post_save(sender, instance, created, **kwargs):
    user = get_current_user()
    if created:
        # Incident created
        TimelineEvent.objects.create(
            incident=instance,
            author=user,
            message=f"Incident '{instance.title}' was created.",
            event_type='incident_created',
        )
    else:
        pre_instance = getattr(instance, '_pre_save_instance', None)
        if pre_instance:
            fields_to_track = [
                'title', 'description', 'status', 'severity', 'incident_type',
                'start_datetime', 'mitigation_datetime', 'resolution_datetime',
                'closed_datetime',
            ]
            changes = get_field_changes(instance, pre_instance, fields_to_track)
            if changes:
                TimelineEvent.objects.create(
                    incident=instance,
                    author=user,
                    message="; ".join(changes),
                    event_type='incident_updated',
                )


@receiver(pre_delete, sender=Incident)
def incident_pre_delete(sender, instance, **kwargs):
    deleted_incidents = get_deleted_incidents()
    deleted_incidents.add(instance.pk)


@receiver(post_delete, sender=Incident)
def incident_post_delete(sender, instance, **kwargs):
    deleted_incidents = get_deleted_incidents()
    deleted_incidents.discard(instance.pk)
# # Handle incident deletion
# @receiver(post_delete, sender=Incident)
# def incident_post_delete(sender, instance, **kwargs):
#     user = get_current_user()
#     TimelineEvent.objects.create(
#         incident=instance,
#         author=user,
#         message=f"Incident '{instance.title}' was deleted.",
#         event_type='incident_deleted',
#     )

# IncidentAssignment signals
@receiver(post_save, sender=IncidentAssignment)
def assignment_post_save(sender, instance, created, **kwargs):
    user = get_current_user()
    if created:
        message = f"{instance.user.get_full_name()} has been assigned as {instance.role.name}"
        TimelineEvent.objects.create(
            incident=instance.incident,
            author=user,
            message=message,
            event_type='role_assigned',
        )
    else:
        # Handle updates if necessary
        pass

# Update IncidentAssignment post_delete signal
@receiver(post_delete, sender=IncidentAssignment)
def assignment_post_delete(sender, instance, **kwargs):
    deleted_incidents = get_deleted_incidents()
    incident_id = instance.incident_id
    if incident_id in deleted_incidents:
        # The incident is being deleted; skip creating TimelineEvent
        return
    else:
        # Proceed to create TimelineEvent
        user = get_current_user()
        if not user or not user.is_authenticated:
            user = None
        message = f"{instance.user.get_full_name()} has been removed from role {instance.role.name}"
        TimelineEvent.objects.create(
            incident_id=incident_id,
            author=user,
            message=message,
            event_type='role_removed',
        )

# Task signals
@receiver(pre_save, sender=Task)
def task_pre_save(sender, instance, **kwargs):
    if instance.pk:
        try:
            instance._pre_save_instance = Task.objects.get(pk=instance.pk)
        except Task.DoesNotExist:
            instance._pre_save_instance = None

@receiver(post_save, sender=Task)
def task_post_save(sender, instance, created, **kwargs):
    user = get_current_user()
    print(f'User: {user}')
    if created:
        message = f"Task '{instance.title}' has been added."
        TimelineEvent.objects.create(
            incident=instance.incident,
            author=user,
            message=message,
            event_type='task_created',
        )
    else:
        pre_instance = getattr(instance, '_pre_save_instance', None)
        if pre_instance:
            fields_to_track = ['title', 'description', 'status', 'priority', 'assignee']
            changes = get_field_changes(instance, pre_instance, fields_to_track)
            if changes:
                TimelineEvent.objects.create(
                    incident=instance.incident,
                    author=user,
                    message="; ".join(changes),
                    event_type='task_updated',
                )

# Update Task post_delete signal
@receiver(post_delete, sender=Task)
def task_post_delete(sender, instance, **kwargs):
    deleted_incidents = get_deleted_incidents()
    incident_id = instance.incident_id
    if incident_id in deleted_incidents:
        return
    else:
        user = get_current_user()
        if not user or not user.is_authenticated:
            user = None
        message = f"Task '{instance.title}' has been deleted."
        TimelineEvent.objects.create(
            incident_id=incident_id,
            author=user,
            message=message,
            event_type='task_deleted',
        )

# FollowUp signals
@receiver(pre_save, sender=FollowUp)
def followup_pre_save(sender, instance, **kwargs):
    if instance.pk:
        try:
            instance._pre_save_instance = FollowUp.objects.get(pk=instance.pk)
        except FollowUp.DoesNotExist:
            instance._pre_save_instance = None

@receiver(post_save, sender=FollowUp)
def followup_post_save(sender, instance, created, **kwargs):
    user = get_current_user()
    if created:
        message = f"Follow-up '{instance.title}' has been added."
        TimelineEvent.objects.create(
            incident=instance.incident,
            author=user,
            message=message,
            event_type='followup_created',
        )
    else:
        pre_instance = getattr(instance, '_pre_save_instance', None)
        if pre_instance:
            fields_to_track = ['title', 'description', 'status', 'priority', 'assignee']
            changes = get_field_changes(instance, pre_instance, fields_to_track)
            if changes:
                TimelineEvent.objects.create(
                    incident=instance.incident,
                    author=user,
                    message="; ".join(changes),
                    event_type='followup_updated',
                )

@receiver(post_delete, sender=FollowUp)
def followup_post_delete(sender, instance, **kwargs):
    deleted_incidents = get_deleted_incidents()
    incident_id = instance.incident_id
    if incident_id in deleted_incidents:
        return
    else:
        user = get_current_user()
        if not user or not user.is_authenticated:
            user = None
        message = f"Follow-up '{instance.title}' has been deleted."
        TimelineEvent.objects.create(
            incident_id=incident_id,
            author=user,
            message=message,
            event_type='followup_deleted',
        )

# Retrospective signals
@receiver(pre_save, sender=Retrospective)
def retrospective_pre_save(sender, instance, **kwargs):
    if instance.pk:
        try:
            instance._pre_save_instance = Retrospective.objects.get(pk=instance.pk)
        except Retrospective.DoesNotExist:
            instance._pre_save_instance = None

@receiver(post_save, sender=Retrospective)
def retrospective_post_save(sender, instance, created, **kwargs):
    user = get_current_user()
    if created:
        message = f"Retrospective has been created."
        TimelineEvent.objects.create(
            incident=instance.incident,
            author=user,
            message=message,
            event_type='retrospective_created',
        )
    else:
        pre_instance = getattr(instance, '_pre_save_instance', None)
        if pre_instance:
            changes = []
            if pre_instance.title != instance.title:
                changes.append("Retrospective title has been updated.")
            if pre_instance.status != instance.status:
                changes.append(f"Retrospective status changed from '{pre_instance.status}' to '{instance.status}'.")
            if pre_instance.due_date != instance.due_date:
                changes.append(f"Retrospective due date changed from '{pre_instance.due_date}' to '{instance.due_date}'.")
            if pre_instance.content != instance.content:
                changes.append("Retrospective content has been updated.")
            if pre_instance.owner != instance.owner:
                changes.append(f"Retrospective owner changed from '{pre_instance.owner}' to '{instance.owner}'")
            if changes:
                TimelineEvent.objects.create(
                    incident=instance.incident,
                    author=user,
                    message="; ".join(changes),
                    event_type='retrospective_updated',
                )

@receiver(post_delete, sender=Retrospective)
def retrospective_post_delete(sender, instance, **kwargs):
    deleted_incidents = get_deleted_incidents()
    incident_id = instance.incident_id
    if incident_id in deleted_incidents:
        return
    else:
        user = get_current_user()
        if not user or not user.is_authenticated:
            user = None
        message = f"Retrospective for incident '{instance.incident.title}' has been deleted."
        TimelineEvent.objects.create(
            incident_id=incident_id,
            author=user,
            message=message,
            event_type='retrospective_deleted',
        )


# Team m2m_changed signals
@receiver(m2m_changed, sender=Incident.teams.through)
def incident_teams_changed(sender, instance, action, pk_set, **kwargs):
    user = get_current_user()
    if action == 'post_add':
        teams = Team.objects.filter(pk__in=pk_set)
        team_names = ", ".join([team.name for team in teams])
        message = f"Teams have been added: {team_names}"
        TimelineEvent.objects.create(
            incident=instance,
            author=user,
            message=message,
            event_type='teams_added',
        )
    elif action == 'post_remove':
        teams = Team.objects.filter(pk__in=pk_set)
        team_names = ", ".join([team.name for team in teams])
        message = f"Teams have been removed: {team_names}"
        TimelineEvent.objects.create(
            incident=instance,
            author=user,
            message=message,
            event_type='teams_removed',
        )

# Incident status change signals
@receiver(post_save, sender=Incident)
def incident_status_change(sender, instance, created, **kwargs):
    user = get_current_user()
    if not created:
        pre_instance = getattr(instance, '_pre_save_instance', None)
        if pre_instance and pre_instance.status != instance.status:
            # Log status change
            message = f"Incident status changed from '{pre_instance.status}' to '{instance.status}'"
            TimelineEvent.objects.create(
                incident=instance,
                author=user,
                message=message,
                event_type='incident_status_changed',
            )
            # Additional logic for specific statuses
            if instance.status == 'Mitigated':
                TimelineEvent.objects.create(
                    incident=instance,
                    author=user,
                    message="Incident has been mitigated.",
                    event_type='incident_mitigated',
                )
            elif instance.status == 'Resolved':
                TimelineEvent.objects.create(
                    incident=instance,
                    author=user,
                    message="Incident has been resolved.",
                    event_type='incident_resolved',
                )
            elif instance.status == 'Closed':
                TimelineEvent.objects.create(
                    incident=instance,
                    author=user,
                    message="Incident has been closed.",
                    event_type='incident_closed',
                )
