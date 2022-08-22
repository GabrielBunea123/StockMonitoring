# Generated by Django 4.0.4 on 2022-05-10 18:12

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0010_rename_ohlcv_ohlcvdata'),
    ]

    operations = [
        migrations.RenameField(
            model_name='ohlcvdata',
            old_name='closePrice',
            new_name='c',
        ),
        migrations.RenameField(
            model_name='ohlcvdata',
            old_name='highPrice',
            new_name='h',
        ),
        migrations.RenameField(
            model_name='ohlcvdata',
            old_name='lowPrice',
            new_name='l',
        ),
        migrations.RenameField(
            model_name='ohlcvdata',
            old_name='openPrice',
            new_name='o',
        ),
        migrations.RenameField(
            model_name='ohlcvdata',
            old_name='date',
            new_name='t',
        ),
        migrations.RenameField(
            model_name='ohlcvdata',
            old_name='volume',
            new_name='v',
        ),
    ]
