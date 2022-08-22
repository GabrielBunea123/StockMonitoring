from rest_framework import serializers
from .models import *

class UserSerializer(serializers.Serializer):
    user = serializers.CharField()

class GetDailyStatsSerializer(serializers.Serializer):
    quote = serializers.CharField()

class GetCompanySerializer(serializers.ModelSerializer):
    class Meta:
        model=CompanyProfile
        fields="__all__"
        depth=1

class GetUserWatchlistSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserWatchlist
        fields="__all__"
        depth=1

class GetCompanyFinnhubSerializer(serializers.Serializer):
    symbol = serializers.CharField()

class SearchQuoteSerializer(serializers.Serializer):
    quote = serializers.CharField()

class StockSymbolSearchQuoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = StockSymbol
        fields="__all__"
        depth=1

class StockCandlesSerializer(serializers.Serializer):
    symbol = serializers.CharField()
    resolution = serializers.CharField() #the period of time
    fromTimestamp = serializers.IntegerField()
    # toTimestamp = serializers.IntegerField()
class OhlcvtDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = StockCandles
        fields="__all__"
        depth=1

class GetMarketNewsSerializer(serializers.Serializer):
    symbol = serializers.CharField()
    _from = serializers.CharField()
    to = serializers.CharField()

class DailyStatsSerializer(serializers.ModelSerializer):
    class Meta:
        model = DailyStats
        fields="__all__"
        depth=1

class AvaliableIndicatorsSerializer(serializers.ModelSerializer):
    class Meta:
        model = AvaliableIndicators
        fields="__all__"
        depth = 1

class AlertSerializer(serializers.ModelSerializer):
    class Meta:
        model=Alert
        fields=['condition','trigger','value','notificationType', 'name', 'message', 'isActive', 'symbol']
        depth=1
        