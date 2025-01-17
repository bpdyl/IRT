# Generated by Django 5.0.7 on 2024-08-29 00:53

import django.contrib.auth.validators
import django.db.models.deletion
import django.utils.timezone
import uuid
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
    ]

    operations = [
        migrations.CreateModel(
            name='IncidentType',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('description', models.TextField()),
            ],
        ),
        migrations.CreateModel(
            name='CustomUser',
            fields=[
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('username', models.CharField(error_messages={'unique': 'A user with that username already exists.'}, help_text='Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.', max_length=150, unique=True, validators=[django.contrib.auth.validators.UnicodeUsernameValidator()], verbose_name='username')),
                ('first_name', models.CharField(blank=True, max_length=150, verbose_name='first name')),
                ('last_name', models.CharField(blank=True, max_length=150, verbose_name='last name')),
                ('date_joined', models.DateTimeField(default=django.utils.timezone.now, verbose_name='date joined')),
                ('_id', models.UUIDField(default=uuid.uuid4, primary_key=True, serialize=False)),
                ('email', models.EmailField(max_length=254, unique=True)),
                ('name', models.CharField(max_length=255)),
                ('role', models.CharField(blank=True, max_length=50, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('is_active', models.BooleanField(default=True)),
                ('is_staff', models.BooleanField(default=False)),
                ('is_superuser', models.BooleanField(default=False)),
                ('groups', models.ManyToManyField(blank=True, help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.', related_name='user_set', related_query_name='user', to='auth.group', verbose_name='groups')),
                ('user_permissions', models.ManyToManyField(blank=True, help_text='Specific permissions for this user.', related_name='user_set', related_query_name='user', to='auth.permission', verbose_name='user permissions')),
            ],
            options={
                'verbose_name': 'user',
                'verbose_name_plural': 'users',
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Incident',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('title', models.CharField(max_length=255)),
                ('description', models.TextField(blank=True, null=True)),
                ('reported_date', models.DateTimeField(auto_now_add=True)),
                ('start_datetime', models.DateTimeField(blank=True, null=True)),
                ('end_datetime', models.DateTimeField(blank=True, null=True)),
                ('status', models.CharField(choices=[('Identified', 'Identified'), ('Investigating', 'Investigating'), ('Contained', 'Contained'), ('Eradicated', 'Eradicated'), ('Recovered', 'Recovered'), ('Closed', 'Closed')], max_length=20)),
                ('initial_entry_point', models.CharField(blank=True, max_length=50, null=True)),
                ('severity', models.CharField(choices=[('Low', 'Low'), ('Medium', 'Medium'), ('High', 'High'), ('Critical', 'Critical')], max_length=20)),
                ('affected_users', models.ManyToManyField(blank=True, related_name='affected_incidents', to=settings.AUTH_USER_MODEL)),
                ('related_incidents', models.ManyToManyField(blank=True, to='incidents.incident')),
                ('reported_by', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='reported_incidents', to=settings.AUTH_USER_MODEL)),
                ('incident_type', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='incidents', to='incidents.incidenttype')),
            ],
        ),
        migrations.CreateModel(
            name='Communication',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('leadership_communication', models.TextField(blank=True, null=True)),
                ('documentation', models.TextField(blank=True, null=True)),
                ('legal_communication', models.TextField(blank=True, null=True)),
                ('user_communication', models.TextField(blank=True, null=True)),
                ('customer_communication', models.TextField(blank=True, null=True)),
                ('insurance_communication', models.TextField(blank=True, null=True)),
                ('law_enforcement_communication', models.TextField(blank=True, null=True)),
                ('vendor_communication', models.TextField(blank=True, null=True)),
                ('communication_date', models.DateTimeField(auto_now_add=True)),
                ('communicator', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='communications', to=settings.AUTH_USER_MODEL)),
                ('incident', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='communications', to='incidents.incident')),
            ],
        ),
        migrations.CreateModel(
            name='Investigation',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('scope', models.TextField()),
                ('total_impacted_users', models.IntegerField(blank=True, null=True)),
                ('user_actions', models.TextField(blank=True, null=True)),
                ('related_activities', models.TextField(blank=True, null=True)),
                ('message_analysis', models.JSONField(blank=True, null=True)),
                ('link_attachment_analysis', models.JSONField(blank=True, null=True)),
                ('attack_type', models.CharField(blank=True, max_length=100, null=True)),
                ('severity_assessment', models.TextField(blank=True, null=True)),
                ('investigation_date', models.DateTimeField(auto_now_add=True)),
                ('incident', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='investigations', to='incidents.incident')),
                ('investigator', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='investigations', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Playbook',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('title', models.CharField(max_length=255)),
                ('description', models.TextField()),
                ('content', models.TextField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('is_editable', models.BooleanField(default=True)),
                ('created_by', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='playbooks', to=settings.AUTH_USER_MODEL)),
                ('incident_type', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='playbooks', to='incidents.incidenttype')),
            ],
        ),
        migrations.AddField(
            model_name='incident',
            name='playbook',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='incidents', to='incidents.playbook'),
        ),
        migrations.CreateModel(
            name='Recovery',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('recovery_plan', models.TextField()),
                ('training_reinforcement', models.TextField(blank=True, null=True)),
                ('it_security_staff_update', models.TextField(blank=True, null=True)),
                ('control_failures', models.TextField(blank=True, null=True)),
                ('additional_resources', models.TextField(blank=True, null=True)),
                ('recovery_date', models.DateTimeField(auto_now_add=True)),
                ('incident', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='recoveries', to='incidents.incident')),
                ('recovery_lead', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='recoveries', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Reference',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('reference_type', models.CharField(choices=[('UserActions', 'UserActions'), ('HelpDeskActions', 'HelpDeskActions'), ('ExternalResources', 'ExternalResources')], max_length=50)),
                ('title', models.CharField(max_length=255)),
                ('url', models.URLField(blank=True, null=True)),
                ('incident', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='references', to='incidents.incident')),
            ],
        ),
        migrations.CreateModel(
            name='Remediation',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('containment_steps', models.TextField()),
                ('tools_used', models.JSONField(blank=True, null=True)),
                ('account_actions', models.TextField(blank=True, null=True)),
                ('blocking_actions', models.TextField(blank=True, null=True)),
                ('forensic_actions', models.TextField(blank=True, null=True)),
                ('purge_actions', models.TextField(blank=True, null=True)),
                ('mobile_containment', models.TextField(blank=True, null=True)),
                ('monitoring_actions', models.TextField(blank=True, null=True)),
                ('assistance', models.TextField(blank=True, null=True)),
                ('software_upgrades', models.TextField(blank=True, null=True)),
                ('remediation_date', models.DateTimeField(auto_now_add=True)),
                ('incident', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='remediations', to='incidents.incident')),
                ('remediator', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='remediations', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Resources',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('resource_type', models.CharField(choices=[('Financial', 'Financial'), ('Personnel', 'Personnel'), ('Logistical', 'Logistical')], max_length=50)),
                ('description', models.TextField()),
                ('resource_status', models.CharField(choices=[('Allocated', 'Allocated'), ('In Progress', 'In Progress'), ('Used', 'Used'), ('Closed', 'Closed')], max_length=20)),
                ('assigned_to', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL)),
                ('incident', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='resources', to='incidents.incident')),
            ],
        ),
        migrations.CreateModel(
            name='System',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=255)),
                ('system_type', models.CharField(choices=[('Workstation', 'Workstation'), ('Server', 'Server'), ('Network Device', 'Network Device'), ('Application', 'Application')], max_length=50)),
                ('ip_address', models.GenericIPAddressField(blank=True, null=True)),
                ('location', models.CharField(blank=True, max_length=255, null=True)),
                ('owner', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.AddField(
            model_name='incident',
            name='affected_systems',
            field=models.ManyToManyField(blank=True, related_name='incidents', to='incidents.system'),
        ),
    ]
