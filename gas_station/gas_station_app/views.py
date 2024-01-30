from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import GasStation, FuelType, BonusCard, BankCard
from .serializers import GasStationSerializer, FuelTypeSerializer, BonusCardSerializer, BankCardSerializer
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.views import View
import json
@api_view(['GET'])
def get_stations_by_fuel(request):
    fuel_type = request.query_params.get('fuel')
    try:
        stations = GasStation.objects.filter(fuel_types__name=fuel_type).distinct()
        serializer = GasStationSerializer(stations, many=True)
        return Response(serializer.data)
    except FuelType.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)


@csrf_exempt
@api_view(['POST'])
def set_station(request):
    data = request.data
    station_id = data.get('station_id')

    try:

        station = GasStation.objects.get(station_id=station_id)


        station.address = data['address']
        station.save()


        FuelType.objects.filter(station=station).delete()
        fuel_types = [
            FuelType(station=station, name=item['name'], price=item['price'], amount_of_fuel=item['amount_of_fuel'])
            for item in data['fuel_types']
        ]
        FuelType.objects.bulk_create(fuel_types)

        return Response({'message': 'Station updated successfully'}, status=status.HTTP_200_OK)

    except GasStation.DoesNotExist:
        station = GasStation.objects.create(station_id=station_id, address=data['address'])
        fuel_types = [
            FuelType(station=station, name=item['name'], price=item['price'], amount_of_fuel=item['amount_of_fuel'])
            for item in data['fuel_types']
        ]
        FuelType.objects.bulk_create(fuel_types)

        return Response({'message': 'Station created successfully'}, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def get_station_info(request):
    station_id = request.query_params.get('id')
    try:
        station = GasStation.objects.get(station_id=station_id)
        serializer = GasStationSerializer(station)
        return Response(serializer.data)
    except GasStation.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
def get_bonus_card_view(request):
    bonuscard_number = request.query_params.get('bonuscard', '')

    if bonuscard_number is not None:
        try:
            bonus_card = BonusCard.objects.get(BonusCard=bonuscard_number)
            serializer = BonusCardSerializer(bonus_card)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except BankCard.DoesNotExist:
            return Response({'message': 'Bonus card not found.'}, status=status.HTTP_404_NOT_FOUND)
    else:
        return Response({'message': 'Missing bankcard parameter.'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def set_bonus_card_view(request):
    card_data = request.data
    bonus_card_number = card_data.get('BonusCard')

    try:
        bonus_card = BonusCard.objects.get(BonusCard=bonus_card_number)
        serializer = BonusCardSerializer(bonus_card, data=card_data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
    except BonusCard.DoesNotExist:
        serializer = BonusCardSerializer(data=card_data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def get_bank_card_view(request):
    bankcard_number = request.query_params.get('bankcard', None)
    if bankcard_number is not None:
        try:
            bank_card = BankCard.objects.get(BankCard=bankcard_number)
            serializer = BankCardSerializer(bank_card)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except BankCard.DoesNotExist:
            return Response({'message': 'Bank card not found.'}, status=status.HTTP_404_NOT_FOUND)
    else:
        return Response({'message': 'Missing bankcard parameter.'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def set_bank_card_view(request):
    data = request.data
    card_id = request.query_params.get('bankcard', None)

    try:
        if card_id:
            bank_card = BankCard.objects.get(BankСard=card_id)
            serializer = BankCardSerializer(bank_card, data=data)
        else:

            serializer = BankCardSerializer(data=data)

        if serializer.is_valid():
            serializer.save()
            if card_id:
                return Response({'message': 'BankCard updated successfully'}, status=status.HTTP_200_OK)
            else:
                return Response({'message': 'BankCard created successfully'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except BankCard.DoesNotExist:

        serializer = BankCardSerializer(data=data)

        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'BankCard created successfully'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AzsView(View):
    template_name = 'gas_station_app/index.html'

    def get(self, request, *args, **kwargs):
        return render(request, self.template_name)

    def post(self, request, *args, **kwargs):
        station_id = request.POST.get('station_id')
        geographical_address = request.POST.get('geographical_address')
        price_92 = request.POST.get('price_92')
        amount_92 = request.POST.get('amount_92')
        

        
        gas_station, created = GasStation.objects.get_or_create(station_id=station_id)
        gas_station.address = geographical_address
        gas_station.save()

        
        fuel_type_92, created = FuelType.objects.get_or_create(station=gas_station, name='92')
        fuel_type_92.price = price_92
        fuel_type_92.amount_of_fuel = amount_92
        fuel_type_92.save()
       


        return JsonResponse({'status': 'success'})

def fuel_column(request):
    return render(request, 'gas_station_app/kolonka.html')