from rest_framework import serializers
from .models import Flight

class Flightserializer(serializers.ModelSerializer):
    class Meta:
        model = Flight
        fields = '__all__'


class FlightStatusUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Flight
        fields = ['status']

    def update(self, instance, validated_data):
        instance.status = validated_data.get('status', instance.status)
        instance.save(update_fields=['status'])  # update only 'status'
        return instance
