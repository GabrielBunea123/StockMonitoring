# Generated by Django 4.0.4 on 2022-06-01 11:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0017_remove_userwatchlist_isinuserwatchlist'),
    ]

    operations = [
        migrations.CreateModel(
            name='StockSymbol',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('quote', models.CharField(max_length=200)),
            ],
        ),
    ]
