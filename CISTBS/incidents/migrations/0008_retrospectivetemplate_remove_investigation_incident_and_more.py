# Generated by Django 5.0.7 on 2024-09-29 01:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('incidents', '0007_alter_incident_incident_type_alter_incident_status_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='RetrospectiveTemplate',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('content', models.TextField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
        ),
        migrations.RemoveField(
            model_name='investigation',
            name='incident',
        ),
        migrations.RemoveField(
            model_name='investigation',
            name='investigator',
        ),
        migrations.RemoveField(
            model_name='recovery',
            name='incident',
        ),
        migrations.RemoveField(
            model_name='recovery',
            name='recovery_lead',
        ),
        migrations.RemoveField(
            model_name='reference',
            name='incident',
        ),
        migrations.RemoveField(
            model_name='remediation',
            name='incident',
        ),
        migrations.RemoveField(
            model_name='remediation',
            name='remediator',
        ),
        migrations.RemoveField(
            model_name='resources',
            name='assigned_to',
        ),
        migrations.RemoveField(
            model_name='resources',
            name='incident',
        ),
        migrations.RenameField(
            model_name='retrospective',
            old_name='summary',
            new_name='content',
        ),
        migrations.AddField(
            model_name='incident',
            name='mitigation_description',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='incident',
            name='resolution_description',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='retrospective',
            name='current_step',
            field=models.CharField(choices=[('Gather and Confirm Data', 'Gather and Confirm Data'), ('Write Retrospective Document', 'Write Retrospective Document'), ('Publish Retrospective Document', 'Publish Retrospective Document')], default='Gather and Confirm Data', max_length=50),
        ),
        migrations.AddField(
            model_name='retrospective',
            name='due_date',
            field=models.DateField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='retrospective',
            name='status',
            field=models.CharField(choices=[('Draft', 'Draft'), ('In Progress', 'In Progress'), ('Completed', 'Completed'), ('Published', 'Published')], default='Draft', max_length=20),
        ),
        migrations.AddField(
            model_name='retrospective',
            name='template',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.DeleteModel(
            name='Communication',
        ),
        migrations.DeleteModel(
            name='Investigation',
        ),
        migrations.DeleteModel(
            name='Recovery',
        ),
        migrations.DeleteModel(
            name='Reference',
        ),
        migrations.DeleteModel(
            name='Remediation',
        ),
        migrations.DeleteModel(
            name='Resources',
        ),
    ]