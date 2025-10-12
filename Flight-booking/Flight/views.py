from rest_framework import generics, filters
from .models import Flight
from .serializers import *
from rest_framework.permissions import IsAuthenticated
from User.permissions import IsApprovedUser

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

class FlightSearchView(generics.ListAPIView):
    queryset = Flight.objects.all()
    serializer_class = Flightserializer
    permission_classes = [IsAuthenticated, IsApprovedUser]
    filter_backends = [filters.SearchFilter]
    search_fields = ['origin', 'destination', 'flight_number']

    def get_queryset(self):
        qs = super().get_queryset()
        # filter by date/availability
        origin = self.request.query_params.get('origin')
        destination = self.request.query_params.get('destination')
        date = self.request.query_params.get('date')  # YYYY-MM-DD
        if origin:
            qs = qs.filter(origin__icontains=origin)
        if destination:
            qs = qs.filter(destination__icontains=destination)
        if date:
            qs = qs.filter(departure_time__date=date)
        return qs
    

#RetrieveAPIView can also be used
class FlightDetailView(APIView):
    def get(self, request, flight_id):
        try:
            flight = Flight.objects.get(id=flight_id)
        except Flight.DoesNotExist:
            return Response({'error': 'Flight not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = Flightserializer(flight)
        return Response(serializer.data, status=status.HTTP_200_OK)
    

from rest_framework import generics, permissions

class AdminFlightListView(generics.ListAPIView):
    queryset = Flight.objects.all().order_by('departure_time')  # Optional: sort by time
    serializer_class = Flightserializer
    permission_classes = [permissions.IsAdminUser]  # Restrict to admin only



from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import Flight
from .serializers import FlightStatusUpdateSerializer

class UpdateFlightStatusByFlightNoView(APIView):
    def patch(self, request, flight_no):
        flight = get_object_or_404(Flight, flight_no=flight_no)
        serializer = FlightStatusUpdateSerializer(flight, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
