from django.db import models

from django.db import models
import uuid
from backend.settings import AUTH_USER_MODEL

from django.contrib.auth.models import AbstractUser, BaseUserManager


class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, password, **extra_fields)

class CustomUser(AbstractUser):
    _id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    email = models.EmailField(unique=True)
    name = models.CharField(max_length=255)
    role = models.CharField(max_length=50, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active				= models.BooleanField(default=True)
    is_staff				= models.BooleanField(default=False)
    is_superuser			= models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.email
    

    def has_perm(self, perm, obj = None):
        return self.is_superuser
    
    def has_module_perms(self, app_label):
        return True


class IncidentType(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(null=True, blank=True)

    def __str__(self):
        return self.name

class Playbook(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255)
    description = models.TextField()  # Brief description of the playbook
    content = models.TextField()  # Full content of the playbook in Markdown/ HTML/Text
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='playbooks')
    incident_type = models.ForeignKey(IncidentType, on_delete=models.CASCADE, related_name='playbooks')
    is_editable = models.BooleanField(default=True)
    def __str__(self):
        return self.title


class Incident(models.Model):
    INCIDENT_STATUS_CHOICES = [
        ('Identified', 'Identified'),
        ('Investigating', 'Investigating'),
        ('Mitigated', 'Mitigated'),
        ('Resolved', 'Resolved'),
        ('Closed', 'Closed'),
    ]
    SEVERITY_CHOICES = [
        ('Low', 'Low'),
        ('Medium', 'Medium'),
        ('High', 'High'),
        ('Critical', 'Critical'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    incident_type = models.ForeignKey(IncidentType, on_delete=models.SET_NULL,null=True, related_name='incidents')
    title = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    reported_by = models.ForeignKey(AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='reported_incidents')
    reported_date = models.DateTimeField(auto_now_add=True)
    start_datetime = models.DateTimeField(null=True, blank=True)
    mitigation_datetime = models.DateTimeField(null=True, blank=True)
    resolution_datetime = models.DateTimeField(null=True, blank=True)
    closed_datetime = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=INCIDENT_STATUS_CHOICES,default='Identified')
    initial_entry_point = models.CharField(max_length=50, null=True, blank=True)
    severity = models.CharField(max_length=20, choices=SEVERITY_CHOICES)
    affected_users = models.ManyToManyField(AUTH_USER_MODEL, related_name='affected_incidents', blank=True)
    affected_systems = models.ManyToManyField('System', related_name='incidents', blank=True)
    related_incidents = models.ManyToManyField('self', blank=True,symmetrical=False)
    playbook = models.ForeignKey(Playbook, on_delete=models.SET_NULL, null=True, blank=True, related_name='incidents')
    teams = models.ManyToManyField('Team', related_name='incidents', blank=True)
    mitigation_description = models.TextField(null=True, blank=True)
    resolution_description = models.TextField(null=True, blank=True)
    # The assignments field is handled via the IncidentAssignment model
    # The retrospective is linked via the Retrospective model

    def __str__(self):
        return self.title
    
class IncidentRole(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(null=True, blank=True)

    def __str__(self):
        return self.name

class IncidentAssignment(models.Model):
    incident = models.ForeignKey(Incident, on_delete=models.CASCADE, related_name='assignments')
    user = models.ForeignKey(AUTH_USER_MODEL, on_delete=models.CASCADE)
    role = models.ForeignKey(IncidentRole, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.user} as {self.role} in {self.incident}"
    
class Team(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(null=True, blank=True)
    members = models.ManyToManyField(AUTH_USER_MODEL, related_name='teams', blank=True)

    def __str__(self):
        return self.name
    
class Task(models.Model):
    PRIORITY_CHOICES = [
        ('Low', 'Low'),
        ('Medium', 'Medium'),
        ('High', 'High'),
    ]
    STATUS_CHOICES = [
        ('Todo', 'Todo'),
        ('In Progress', 'In Progress'),
        ('Completed', 'Completed'),
    ]
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    incident = models.ForeignKey('Incident', on_delete=models.CASCADE, related_name='tasks')
    title = models.CharField(max_length=255)
    description = models.TextField()
    due_date = models.DateField(null=True, blank=True)
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES)
    created_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    assignee = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_tasks')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Todo')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

class FollowUp(models.Model):
    PRIORITY_CHOICES = [
        ('Low', 'Low'),
        ('Medium', 'Medium'),
        ('High', 'High'),
    ]
    STATUS_CHOICES = [
        ('Todo', 'Todo'),
        ('In Progress', 'In Progress'),
        ('Done', 'Done'),
    ]
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    incident = models.ForeignKey('Incident', on_delete=models.CASCADE, related_name='followups')
    title = models.CharField(max_length=255)
    description = models.TextField()
    due_date = models.DateField(null=True, blank=True)
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES)
    created_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    assignee = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_followups')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Todo')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title
    

class TimelineEvent(models.Model):
    incident = models.ForeignKey(Incident, on_delete=models.CASCADE, related_name='timeline_events')
    author = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    message = models.TextField()
    event_type = models.CharField(max_length=50)  # e.g., 'task_created', 'incident_updated', etc.
    data = models.JSONField(blank=True, null=True)  # Optional field to store additional data

    def __str__(self):
        return f"{self.incident.title} - {self.event_type} at {self.timestamp}"

class TimelineComment(models.Model):
    event = models.ForeignKey(TimelineEvent, on_delete=models.CASCADE, related_name='comments')
    author = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    message = models.TextField()

    def __str__(self):
        return f"Comment by {self.author} at {self.timestamp}"
    

class Retrospective(models.Model):
    incident = models.OneToOneField(
        Incident,
        on_delete=models.CASCADE,
        related_name='retrospective'
    )
    title = models.CharField(max_length=255, null=True, blank=True)
    owner = models.ForeignKey(
        CustomUser,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )
    due_date = models.DateField(null=True, blank=True)
    status = models.CharField(
        max_length=20,
        choices=[
            ('Draft', 'Draft'),
            ('In Progress', 'In Progress'),
            ('Completed', 'Completed'),
            ('Published', 'Published'),
        ],
        default='Draft'
    )
    content = models.TextField()  # Store the filled-out template
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    # Optionally, store the template used
    template = models.TextField(null=True, blank=True)
    current_step = models.CharField(
        max_length=50,
        choices=[
            ('Gather and Confirm Data', 'Gather and Confirm Data'),
            ('Write Retrospective Document', 'Write Retrospective Document'),
            ('Publish Retrospective Document', 'Publish Retrospective Document'),
        ],
        default='Gather and Confirm Data'
    )

    def __str__(self):
        return f"Retrospective for {self.incident.title}"

class RetrospectiveTemplate(models.Model):
    name = models.CharField(max_length=255)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class System(models.Model):
    SYSTEM_TYPE_CHOICES = [
        ('Workstation', 'Workstation'),
        ('Server', 'Server'),
        ('Network Device', 'Network Device'),
        ('Application', 'Application'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    system_type = models.CharField(max_length=50, choices=SYSTEM_TYPE_CHOICES)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    location = models.CharField(max_length=255, null=True, blank=True)
    owner = models.ForeignKey(AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)


