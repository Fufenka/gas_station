from django.db import models


class GasStation(models.Model):
    station_id = models.IntegerField(unique=True)
    address = models.CharField(max_length=255)

    def __str__(self):
        return f"GasStation {self.station_id}: {self.address}"


class FuelType(models.Model):
    station = models.ForeignKey(GasStation, related_name='fuel_types', on_delete=models.CASCADE)
    name = models.CharField(max_length=50)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    amount_of_fuel = models.IntegerField()

    def __str__(self):
        return f"{self.station} - {self.name}: {self.price}, {self.amount_of_fuel} liters"


class BonusCard(models.Model):
    id = models.AutoField(primary_key=True)
    BonusCard = models.CharField(max_length=50, unique=True)
    CardHolder = models.CharField(max_length=255)
    Balance = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return self.BonusCard

class BankCard(models.Model):
    BankCard = models.CharField(max_length=50, unique=True)
    CardHolder = models.CharField(max_length=255)
    Balance = models.DecimalField(max_digits=10, decimal_places=2)
    code = models.CharField(max_length=3)

    def __str__(self):
        return self.BankCard

