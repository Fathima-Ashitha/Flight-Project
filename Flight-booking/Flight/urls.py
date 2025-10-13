from django.urls import path
from .views import *
urlpatterns = [
    path('create/', CreateFlightView.as_view(), name='flights'),
    path('search/', FlightSearchView.as_view(), name='flight_search'),
    path('<int:flight_id>/', FlightDetailView.as_view(), name='flight_detail'),  
    path('', AdminFlightListView.as_view(), name='admin-flight-list'),
    path('<str:flight_no>/status/', UpdateFlightStatusByFlightNoView.as_view(), name='update-flight-status-by-no'),
]