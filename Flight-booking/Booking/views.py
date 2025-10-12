import uuid
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import ValidationError
from .models import Booking
from .serializers import BookingSerializer
from User.permissions import IsApprovedUser 
from django.shortcuts import get_object_or_404
import traceback

from Flight.models import Flight


class BookingCreateView(generics.CreateAPIView):
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated, IsApprovedUser]

    def perform_create(self, serializer):

        try:
            flight_id = serializer.validated_data['flight'].id
            seats = serializer.validated_data['seats_booked']

            flight = get_object_or_404(Flight, id=flight_id)

            if flight.seats_available < seats:
                raise ValidationError('Not enough seats available')

            flight.seats_available -= seats
            flight.save(update_fields=['seats_available'])

            ref = str(uuid.uuid4()).replace('-', '')[:12]

            booking = serializer.save(user=self.request.user, payment_status='Paid')
            booking.booking_ref = ref
            booking.save()

        except Exception as e:
            print("=== Exception in perform_create ===")
            traceback.print_exc()
            raise e



class UserBookingListView(generics.ListAPIView):
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Booking.objects.filter(user=self.request.user)



class BookingDetailView(generics.RetrieveAPIView):
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]

    queryset = Booking.objects.all()
