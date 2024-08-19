from django.contrib import admin
from .models import (Incident, IncidentType,System,Investigation, Remediation, Recovery,
Resources, Communication,Reference, Playbook)
# Register your models here.

admin.site.register(Incident)
admin.site.register(IncidentType)
admin.site.register(System)
admin.site.register(Investigation)
admin.site.register(Remediation)
admin.site.register(Recovery)
admin.site.register(Resources)
admin.site.register(Communication)
admin.site.register(Reference)
admin.site.register(Playbook)
