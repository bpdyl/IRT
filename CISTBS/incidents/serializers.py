from rest_framework import serializers
from .models import Incident,Playbook


class IncidentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Incident
        fields = '__all__'

class PlaybookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Playbook
        fields = ['id', 'title', 'description', 'content', 'created_at', 'updated_at','is_editable']