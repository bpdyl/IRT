from django.db import models

from django.db import models
from django.contrib.auth.models import User  
import uuid

class IncidentType(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()

    def __str__(self):
        return self.name

class Playbook(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255)
    description = models.TextField()  # Brief description of the playbook
    content = models.TextField()  # Full content of the playbook in Markdown/ HTML/Text
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='playbooks')
    incident_type = models.ForeignKey(IncidentType, on_delete=models.CASCADE, related_name='playbooks')
    is_editable = models.BooleanField(default=True)
    def __str__(self):
        return self.title


class Incident(models.Model):
    INCIDENT_STATUS_CHOICES = [
        ('Identified', 'Identified'),
        ('Investigating', 'Investigating'),
        ('Contained', 'Contained'),
        ('Eradicated', 'Eradicated'),
        ('Recovered', 'Recovered'),
        ('Closed', 'Closed'),
    ]
    SEVERITY_CHOICES = [
        ('Low', 'Low'),
        ('Medium', 'Medium'),
        ('High', 'High'),
        ('Critical', 'Critical'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    incident_type = models.ForeignKey(IncidentType, on_delete=models.CASCADE, related_name='incidents')
    title = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    reported_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reported_incidents')
    reported_date = models.DateTimeField(auto_now_add=True)
    start_datetime = models.DateTimeField(null=True, blank=True)
    end_datetime = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=INCIDENT_STATUS_CHOICES)
    initial_entry_point = models.CharField(max_length=50, null=True, blank=True)
    severity = models.CharField(max_length=20, choices=SEVERITY_CHOICES)
    affected_users = models.ManyToManyField(User, related_name='affected_incidents', blank=True)
    affected_systems = models.ManyToManyField('System', related_name='incidents', blank=True)
    related_incidents = models.ManyToManyField('self', blank=True)
    playbook = models.ForeignKey(Playbook, on_delete=models.SET_NULL, null=True, blank=True, related_name='incidents')

    def __str__(self):
        return self.title

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
    owner = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)

class Investigation(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    incident = models.ForeignKey(Incident, on_delete=models.CASCADE, related_name='investigations')
    scope = models.TextField()
    total_impacted_users = models.IntegerField(null=True, blank=True)
    user_actions = models.TextField(null=True, blank=True)
    related_activities = models.TextField(null=True, blank=True)
    message_analysis = models.JSONField(null=True, blank=True)
    link_attachment_analysis = models.JSONField(null=True, blank=True)
    attack_type = models.CharField(max_length=100, null=True, blank=True)
    severity_assessment = models.TextField(null=True, blank=True)
    investigation_date = models.DateTimeField(auto_now_add=True)
    investigator = models.ForeignKey(User, on_delete=models.CASCADE, related_name='investigations')

    def __str__(self):
        return f"Investigation for {self.incident.title}"

class Remediation(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    incident = models.ForeignKey(Incident, on_delete=models.CASCADE, related_name='remediations')
    containment_steps = models.TextField()
    tools_used = models.JSONField(null=True, blank=True)
    account_actions = models.TextField(null=True, blank=True)
    blocking_actions = models.TextField(null=True, blank=True)
    forensic_actions = models.TextField(null=True, blank=True)
    purge_actions = models.TextField(null=True, blank=True)
    mobile_containment = models.TextField(null=True, blank=True)
    monitoring_actions = models.TextField(null=True, blank=True)
    assistance = models.TextField(null=True, blank=True)
    software_upgrades = models.TextField(null=True, blank=True)
    remediation_date = models.DateTimeField(auto_now_add=True)
    remediator = models.ForeignKey(User, on_delete=models.CASCADE, related_name='remediations')

    def __str__(self):
        return f"Remediation for {self.incident.title}"

class Communication(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    incident = models.ForeignKey(Incident, on_delete=models.CASCADE, related_name='communications')
    leadership_communication = models.TextField(null=True, blank=True)
    documentation = models.TextField(null=True, blank=True)
    legal_communication = models.TextField(null=True, blank=True)
    user_communication = models.TextField(null=True, blank=True)
    customer_communication = models.TextField(null=True, blank=True)
    insurance_communication = models.TextField(null=True, blank=True)
    law_enforcement_communication = models.TextField(null=True, blank=True)
    vendor_communication = models.TextField(null=True, blank=True)
    communication_date = models.DateTimeField(auto_now_add=True)
    communicator = models.ForeignKey(User, on_delete=models.CASCADE, related_name='communications')

    def __str__(self):
        return f"Communication for {self.incident.title}"

class Recovery(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    incident = models.ForeignKey(Incident, on_delete=models.CASCADE, related_name='recoveries')
    recovery_plan = models.TextField()
    training_reinforcement = models.TextField(null=True, blank=True)
    it_security_staff_update = models.TextField(null=True, blank=True)
    control_failures = models.TextField(null=True, blank=True)
    additional_resources = models.TextField(null=True, blank=True)
    recovery_date = models.DateTimeField(auto_now_add=True)
    recovery_lead = models.ForeignKey(User, on_delete=models.CASCADE, related_name='recoveries')

class Resources(models.Model):
    RESOURCE_TYPE_CHOICES = [
        ('Financial', 'Financial'),
        ('Personnel', 'Personnel'),
        ('Logistical', 'Logistical'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    resource_type = models.CharField(max_length=50, choices=RESOURCE_TYPE_CHOICES)
    description = models.TextField()
    incident = models.ForeignKey(Incident, on_delete=models.CASCADE, related_name='resources')
    assigned_to = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    resource_status = models.CharField(max_length=20, choices=[
        ('Allocated', 'Allocated'),
        ('In Progress', 'In Progress'),
        ('Used', 'Used'),
        ('Closed', 'Closed'),
    ])

class Reference(models.Model):
    REFERENCE_TYPE_CHOICES = [
        ('UserActions', 'UserActions'),
        ('HelpDeskActions', 'HelpDeskActions'),
        ('ExternalResources', 'ExternalResources'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    reference_type = models.CharField(max_length=50, choices=REFERENCE_TYPE_CHOICES)
    title = models.CharField(max_length=255)
    url = models.URLField(null=True, blank=True)
    incident = models.ForeignKey(Incident, on_delete=models.CASCADE, related_name='references', null=True, blank=True)


