from rest_framework import serializers
from .models import GasStation, FuelType, BonusCard, BankCard

class FuelTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = FuelType
        fields = '__all__'

class GasStationSerializer(serializers.ModelSerializer):
    fuel_types = FuelTypeSerializer(many=True, read_only=True)

    class Meta:
        model = GasStation
        fields = '__all__'


class BonusCardSerializer(serializers.ModelSerializer):
    class Meta:
        model = BonusCard
        fields = '__all__'

class BankCardSerializer(serializers.ModelSerializer):
    class Meta:
        model = BankCard
        fields = '__all__'