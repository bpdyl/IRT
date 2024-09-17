from django.db.models.signals import pre_save, post_save, post_delete, m2m_changed
from django.dispatch import receiver
from django.contrib.auth import get_user_model
from django.db import models
from django.utils import timezone

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

from backend.authentication import get_current_user

User = get_user_model()

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
        instance._pre_save_instance = Incident.objects.get(pk=instance.pk)

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
        # Incident updated
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

@receiver(post_delete, sender=Incident)
def incident_post_delete(sender, instance, **kwargs):
    user = get_current_user()
    TimelineEvent.objects.create(
        incident=instance,
        author=user,
        message=f"Incident '{instance.title}' was deleted.",
        event_type='incident_deleted',
    )

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

@receiver(post_delete, sender=IncidentAssignment)
def assignment_post_delete(sender, instance, **kwargs):
    user = get_current_user()
    message = f"{instance.user.get_full_name()} has been removed from role {instance.role.name}"
    TimelineEvent.objects.create(
        incident=instance.incident,
        author=user,
        message=message,
        event_type='role_removed',
    )

# Task signals
# @receiver(pre_save, sender=Task)
# def task_pre_save(sender, instance, **kwargs):
#     if instance.pk:
#         instance._pre_save_instance = Task.objects.get(pk=instance.pk)

@receiver(post_save, sender=Task)
def task_post_save(sender, instance, created, **kwargs):
    user = get_current_user()
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

@receiver(post_delete, sender=Task)
def task_post_delete(sender, instance, **kwargs):
    user = get_current_user()
    message = f"Task '{instance.title}' has been deleted."
    TimelineEvent.objects.create(
        incident=instance.incident,
        author=user,
        message=message,
        event_type='task_deleted',
    )

# FollowUp signals
@receiver(pre_save, sender=FollowUp)
def followup_pre_save(sender, instance, **kwargs):
    if instance.pk:
        instance._pre_save_instance = FollowUp.objects.get(pk=instance.pk)

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
    user = get_current_user()
    message = f"Follow-up '{instance.title}' has been deleted."
    TimelineEvent.objects.create(
        incident=instance.incident,
        author=user,
        message=message,
        event_type='followup_deleted',
    )

# Retrospective signals
@receiver(pre_save, sender=Retrospective)
def retrospective_pre_save(sender, instance, **kwargs):
    if instance.pk:
        instance._pre_save_instance = Retrospective.objects.get(pk=instance.pk)

@receiver(post_save, sender=Retrospective)
def retrospective_post_save(sender, instance, created, **kwargs):
    user = get_current_user()
    if created:
        message = f"{user.get_full_name()} has been assigned as Retrospective Owner"
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
            if pre_instance.summary != instance.summary:
                changes.append("Retrospective summary has been updated.")
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
    user = get_current_user()
    message = f"Retrospective for incident '{instance.incident.title}' has been deleted."
    TimelineEvent.objects.create(
        incident=instance.incident,
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
