from django.urls import path
from .views import get_stations_by_fuel, set_station, get_station_info, get_bonus_card_view, \
    get_bank_card_view, set_bank_card_view, set_bonus_card_view, AzsView, fuel_column

urlpatterns = [
    path('stations/', get_stations_by_fuel, name='get_stations_by_fuel'),
    path('setStation/', set_station, name='set_station'),
    path('getStationInfo/', get_station_info, name='get_station_info'),
    path('get-bonus-cards/', get_bonus_card_view, name='get_bonus_card_view'),
    path('get-bank-cards/', get_bank_card_view, name='get_bank_card_view'),
    path('set-bank-cards/', set_bank_card_view, name='set_bank_card_view'),
    path('set-bonus-cards/', set_bonus_card_view, name='set_bonus_card_view'),
    path('', AzsView.as_view(), name='azs_view'),
    path('fuel_column/', fuel_column, name='fuel_column'),
]
