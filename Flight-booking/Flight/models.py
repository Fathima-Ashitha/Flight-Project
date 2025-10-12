from django.db import models

# Create your models here.
from django.conf import settings

class Flight(models.Model):
    STATUS_CHOICES = [
    ('On-time', 'On-time'),
    ('Delayed', 'Delayed'),
    ('Cancelled', 'Cancelled'),
]
    flight_no = models.CharField(max_length=20)
    origin = models.CharField(max_length=100)
    destination = models.CharField(max_length=100)
    departure_time = models.DateTimeField()
    arrival_time = models.DateTimeField()
    total_seats = models.IntegerField(default=0)
    seats_available = models.IntegerField(default=0)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='On-time')

    def __str__(self):
        return f"{self.flight_no} {self.origin}->{self.destination}"