# Generated by Django 3.2.15 on 2023-12-18 12:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('gas_station_app', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='BonusCard',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('LoyaltyСard', models.CharField(max_length=50)),
                ('CardHolder', models.CharField(max_length=255)),
                ('Balance', models.DecimalField(decimal_places=2, max_digits=10)),
            ],
        ),
    ]
