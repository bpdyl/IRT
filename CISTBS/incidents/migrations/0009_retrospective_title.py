# Generated by Django 5.0.7 on 2024-09-29 14:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('incidents', '0008_retrospectivetemplate_remove_investigation_incident_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='retrospective',
            name='title',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
    ]
