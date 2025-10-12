from django.db import models

# Create your models here.
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    CHOICES = [
        ('Pending', 'PENDING'),
        ('Approved', 'APPROVED'),
        ('Rejected', 'REJECTED'),
    ]
    approval_status = models.CharField(max_length=10, choices=CHOICES, default='PENDING')
