from rest_framework import serializers 
from .models import Booking

class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = '__all__'
        read_only_fields = ('user', 'booking_ref', 'created_at', 'payment_status')
