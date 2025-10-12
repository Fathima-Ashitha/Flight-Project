from django.urls import path
from .views import *
urlpatterns = [
    path('create/', BookingCreateView.as_view(), name='booking_create'),
    path('bookings/', UserBookingListView.as_view(), name='user-bookings'),
    path('bookings/<int:pk>/', BookingDetailView.as_view(), name='booking-detail'),
]