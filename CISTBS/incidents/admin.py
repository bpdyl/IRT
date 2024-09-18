from django.contrib import admin
from .models import (Incident, IncidentType,System,Investigation, Remediation, Recovery,
Resources, Communication,Reference, Playbook,Task,Team,IncidentRole,IncidentAssignment,TimelineEvent, TimelineComment)
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
admin.site.register(Task)
admin.site.register(Team)
admin.site.register(IncidentRole)
admin.site.register(IncidentAssignment)
admin.site.register(TimelineEvent)
admin.site.register(TimelineComment)



from django.contrib import admin

# # Register your models here.
from django.contrib.auth.admin import UserAdmin

from .models import CustomUser


class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = ('email','first_name','last_name', 'is_staff', 'is_active','is_superuser','_id',)
    list_filter = ('email', 'is_staff', 'is_active','is_superuser',)
    fieldsets = (
        (None, {'fields': ('first_name','last_name','email','username','password',)}),
        ('Permissions', {'fields': ('is_staff', 'is_active',)}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('first_name','last_name','email','username','password1', 'password2','is_staff', 'is_active',)}
        ),
    )
    search_fields = ('email','username','first_name','last_name')
    ordering = ('email','username','first_name','last_name')

admin.site.register(CustomUser, CustomUserAdmin)
