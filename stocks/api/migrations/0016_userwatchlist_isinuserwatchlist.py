# Generated by Django 4.0.4 on 2022-05-14 07:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0015_companyprofile_defaultwatchlist'),
    ]

    operations = [
        migrations.AddField(
            model_name='userwatchlist',
            name='isInUserWatchlist',
            field=models.BooleanField(default=False),
        ),
    ]
