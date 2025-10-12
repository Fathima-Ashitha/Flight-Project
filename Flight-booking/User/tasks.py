from celery import shared_task
from django.core.mail import send_mail
from .models import CustomUser
from django.conf import settings

@shared_task
def send_account_approved_email(user_id):
    try:
        user = CustomUser.objects.get(pk=user_id)
        send_mail(
            subject="Your AirBooking account is approved",
            message=f"Hello {user.username},\nYour account has been approved. You can now log in.",
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[user.email],
            fail_silently=False
        )
    except CustomUser.DoesNotExist:
        return