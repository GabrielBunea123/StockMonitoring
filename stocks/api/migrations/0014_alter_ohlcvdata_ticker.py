# Generated by Django 4.0.4 on 2022-05-14 07:13

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0013_alter_ohlcvdata_ticker'),
    ]

    operations = [
        migrations.AlterField(
            model_name='ohlcvdata',
            name='ticker',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.companyprofile'),
        ),
    ]
