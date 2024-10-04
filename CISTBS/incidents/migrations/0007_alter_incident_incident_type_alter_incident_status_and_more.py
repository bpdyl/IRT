# Generated by Django 5.0.7 on 2024-09-17 14:12

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('incidents', '0006_incidentrole_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='incident',
            name='incident_type',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='incidents', to='incidents.incidenttype'),
        ),
        migrations.AlterField(
            model_name='incident',
            name='status',
            field=models.CharField(choices=[('Identified', 'Identified'), ('Investigating', 'Investigating'), ('Mitigated', 'Mitigated'), ('Resolved', 'Resolved'), ('Closed', 'Closed')], default='Identified', max_length=20),
        ),
        migrations.AlterField(
            model_name='incidenttype',
            name='description',
            field=models.TextField(blank=True, null=True),
        ),
    ]
