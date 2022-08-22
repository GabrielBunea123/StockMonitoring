from django.db import models
import datetime
from django.utils import timezone
from jsonfield import JSONField
# Create your models here.

class CompanyProfile(models.Model):
    user = models.CharField(max_length=200,blank=True,null=True,default='')
    country = models.CharField(max_length=200)
    currency = models.CharField(max_length=200)
    exchange = models.CharField(max_length=200)
    ipo = models.CharField(max_length=200)
    marketCapitalization = models.FloatField()
    name = models.CharField(max_length=200)
    phone= models.CharField(max_length=200)
    shareOutstanding = models.FloatField()
    ticker = models.CharField(max_length=200)
    weburl = models.CharField(max_length=200)
    logo = models.CharField(max_length=1000)
    finnhubIndustry = models.CharField(max_length=200)
    defaultWatchlist = models.BooleanField(default=False)

    def __str__(self):
        return self.ticker

class StockSymbol(models.Model):
    quote=models.CharField(max_length=200)
    name = models.CharField(max_length=200)

    def __str__(self):
        return self.quote

class StockCandles(models.Model):
    symbol = models.CharField(max_length=200)
    resolution = models.CharField(max_length=200)
    fromTimestamp = models.IntegerField()
    toTimestamp = models.IntegerField()
    c = JSONField() #list of close prices
    h = JSONField() #list of high prices
    l = JSONField() #list of low prices
    o = JSONField() #list of open prices
    s = models.CharField(max_length=200) #the status of the response
    t = JSONField() #list of timestamps
    v = JSONField(blank=True, null=True) #list of volumes
    localData = models.BooleanField()
    fetchDate = models.DateField(default = datetime.datetime.now)

class DailyStats(models.Model):
    ticker = models.CharField(max_length=200)
    o = models.FloatField()
    h = models.FloatField()
    l = models.FloatField()
    c = models.FloatField()
    d = models.FloatField() # price change
    dp = models.FloatField() # percent change in %
    pc = models.FloatField(blank=True,null=True)
    t = models.CharField(max_length=200)

    def __str__(self):
        return self.ticker



class UserWatchlist(models.Model):
    user = models.CharField(max_length=200,blank=True,null=True,default='')
    country = models.CharField(max_length=200)
    currency = models.CharField(max_length=200)
    exchange = models.CharField(max_length=200)
    ipo = models.CharField(max_length=200)
    marketCapitalization = models.FloatField()
    name = models.CharField(max_length=200)
    phone= models.CharField(max_length=200)
    shareOutstanding = models.FloatField()
    ticker = models.CharField(max_length=200)
    weburl = models.CharField(max_length=200)
    logo = models.CharField(max_length=1000)
    finnhubIndustry = models.CharField(max_length=200)

class AvaliableIndicators(models.Model):
    name = models.CharField(max_length=200)
    value = models.BooleanField(default=False)

    def __str__(self):
        return self.name

class Alert(models.Model):
    user = models.CharField(max_length=200, default='', blank=False)
    symbol = models.CharField(max_length=200, blank=False, default='')
    condition = models.CharField(max_length=200, blank=False) #The condition is the stock price or the supertrend
    trigger = models.CharField(max_length=200, blank=False) #The trigger is crossing up or down...etc
    value = models.FloatField(blank=True) #If the condition is stock price or volume then value is required
    notificationType = models.CharField(max_length=300, blank=False) # it is a string which separates multiiple ways to send notifications
    name = models.CharField(max_length=200, blank=True, default='Alarm')
    message = models.CharField(max_length=200, blank=True, default="The alarm has been triggered")
    isActive = models.BooleanField()

