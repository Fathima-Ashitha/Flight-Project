from django.db import models

# Create your models here.
from django.conf import settings
from Flight.models import Flight

class Booking(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='bookings')
    flight = models.ForeignKey(Flight, on_delete=models.CASCADE, related_name='bookings')
    seats_booked = models.PositiveIntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)
    payment_status = models.CharField(max_length=20, default='Pending')
    booking_ref = models.CharField(max_length=50, unique=True)