# Generated by Django 4.0.4 on 2022-06-10 14:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0022_avaliableindicators'),
    ]

    operations = [
        migrations.CreateModel(
            name='Alert',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('condition', models.CharField(max_length=200)),
                ('trigger', models.CharField(max_length=200)),
                ('value', models.FloatField(blank=True)),
                ('notificationType', models.CharField(max_length=300)),
                ('name', models.CharField(blank=True, default='Alarm', max_length=200)),
                ('message', models.CharField(blank=True, default='The alarm has been triggered', max_length=200)),
            ],
        ),
    ]
