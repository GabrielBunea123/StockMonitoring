import calendar
import datetime
import json
import os
import time
from itertools import chain

import finnhub
import numpy as np
import pandas as pd
import requests
from django.conf import settings
from django.db.models import Q
from django.http import JsonResponse
from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.views import ObtainAuthToken
from django.contrib.auth.models import User

from .models import *
from .serializers import *
from .utils import *

finnhub_client = finnhub.Client(api_key=settings.FINNHUB_APIKEY)


class GetUser(APIView):
    def get(self, request, format=None):
        tokenKey = request.headers['Authorization']
        user = User.objects.filter(auth_token=tokenKey)
        if user.exists():
            return Response(UserSerializer(user).data, status=status.HTTP_200_OK)
        return Response({"404": "Not found"}, status=status.HTTP_404_NOT_FOUND)


class GetCompanyProfile(generics.ListAPIView):
    def get(self, request, format=None):

        companyProfiles = CompanyProfile.objects.all()
        data = GetCompanySerializer(companyProfiles, many=True).data

        return Response(data, status=status.HTTP_200_OK)


class GetUserWatchlist(generics.ListAPIView):
    def get(self, request):
        tokenKey = request.headers['Authorization']
        user = User.objects.filter(auth_token=tokenKey)
        if user.exists():
            userWatchlist = UserWatchlist.objects.filter(
                user=user[0].id)
            data = GetUserWatchlistSerializer(userWatchlist, many=True).data

            return Response(data, status=status.HTTP_200_OK)
        return Response({"404": "Not found"}, status=status.HTTP_404_NOT_FOUND)


class GetStockFullHistoryData(APIView):
    serializer_class = StockCandlesSerializer

    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            ticker = serializer.data.get("symbol")
            fromTimestamp = serializer.data.get("fromTimestamp")
            resolution = serializer.data.get("resolution")

            hist_data = get_stock_candles(ticker, resolution, fromTimestamp)
            return Response(hist_data, status=status.HTTP_200_OK)
        return Response({"Bad request": "Something went wrong"}, status=status.HTTP_400_BAD_REQUEST)


class SuperTrend(APIView):
    serializer_class = StockCandlesSerializer

    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():

            ticker = serializer.data.get("symbol")
            fromTimestamp = serializer.data.get("fromTimestamp")
            resolution = serializer.data.get("resolution")

            hist_data = get_stock_candles(ticker, resolution, fromTimestamp) #from utils.py function
            supertrend = get_supertrend(
                data=hist_data, multiplier=2.0, symbol=ticker)#from utils.py function

            return Response(supertrend, status=status.HTTP_200_OK)
        return Response({"Bad request": "Something went wrong"}, status=status.HTTP_400_BAD_REQUEST)


class GetStockCandles(APIView):
    serializer_class = GetDailyStatsSerializer

    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            symbol = serializer.data.get("quote")

            stockCandles = finnhub_client.stock_candles(
                symbol, 'D', 1525450745, calendar.timegm(
                    time.gmtime())  # get data from 2017 till now
            )

            return Response(stockCandles, status=status.HTTP_200_OK)
        return Response({"Bad request": "Something went wrong"}, status=status.HTTP_400_BAD_REQUEST)


class GetCompanyProfileFinnhub(APIView):
    serializer_class = GetCompanyFinnhubSerializer

    def post(self, request, format=None):

        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            symbol = serializer.data.get("symbol")
            profile = finnhub_client.company_profile2(symbol=symbol)
            return Response(profile, status=status.HTTP_200_OK)
        return Response({"Bad request": "Something went wrong"}, status=status.HTTP_400_BAD_REQUEST)


class GetDailyStats(APIView):
    serializer_class = GetDailyStatsSerializer

    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            quote = serializer.data.get("quote")

            today = str(datetime.date.today())
            today = datetime.datetime.strptime(
                today, '%Y-%m-%d').strftime('%d/%m/%y')
            today_timestamp = time.mktime(
                datetime.datetime.strptime(today, "%d/%m/%y").timetuple())

            dailyStats = DailyStats.objects.filter(
                ticker=quote, t=str(int(today_timestamp)))

            if dailyStats.exists():
                data = DailyStatsSerializer(dailyStats[0]).data
                return Response(data, status=status.HTTP_200_OK)

            else:
                stats = finnhub_client.quote(quote)
                daily_stats = DailyStats(ticker=quote, o=stats.get('o'), h=stats.get('h'), l=stats.get('l'), c=stats.get(
                    'c'), d=stats.get('d'), dp=stats.get('dp'), pc=stats.get('pc'), t=str(int(today_timestamp)))
                daily_stats.save()

                return Response(stats, status=status.HTTP_200_OK)

            return Response({"404": "Not found"}, status=status.HTTP_200_OK)
        return Response({"Bad request": "Something went wrong"}, status=status.HTTP_400_BAD_REQUEST)


class SearchQuote(APIView):
    serializer_class = SearchQuoteSerializer

    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            quote = serializer.data.get("quote")
            searchResult = finnhub_client.symbol_lookup(quote)
            return Response(searchResult, status=status.HTTP_200_OK)
        return Response({"Bad request": "Something went wrong"}, status=status.HTTP_400_BAD_REQUEST)


class GetCompanyNews(APIView):
    serializer_class = GetMarketNewsSerializer

    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            symbol = serializer.data.get("symbol")
            _from = serializer.data.get("_from")
            to = serializer.data.get("to")
            company_news = finnhub_client.company_news(
                symbol, _from=_from, to=to)
            return Response(company_news, status=status.HTTP_200_OK)
        return Response({"Bad request": "Something went wrong"}, status=status.HTTP_400_BAD_REQUEST)


class GetMarketNews(APIView):
    def get(self, request, format=None):
        general_news = finnhub_client.general_news('general', min_id=0)
        return Response(general_news, status=status.HTTP_200_OK)


class GetStockBasicFinancials(APIView):
    # use this serializer because we only need the stock symmbol
    serializer_class = GetCompanyFinnhubSerializer

    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            symbol = serializer.data.get("symbol")
            data = finnhub_client.company_basic_financials(symbol, 'all')
            return Response(data, status=status.HTTP_200_OK)
        return Response({"Bad request": "Something went wrong"}, status=status.HTTP_400_BAD_REQUEST)


class AddToWatchList(APIView):
    serializer_class = GetUserWatchlistSerializer

    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            tokenKey = request.headers['Authorization']
            user = User.objects.filter(auth_token=tokenKey)

            if user.exists():
                user = user[0].id
            else:
                return Response({"404": "Not found"}, status=status.HTTP_404_NOT_FOUND)

            country = serializer.data.get("country")
            currency = serializer.data.get("currency")
            exchange = serializer.data.get("exchange")
            ipo = serializer.data.get("ipo")
            marketCapitalization = serializer.data.get("marketCapitalization")
            name = serializer.data.get("name")
            phone = serializer.data.get("phone")
            shareOutstanding = serializer.data.get("shareOutstanding")
            ticker = serializer.data.get("ticker")
            weburl = serializer.data.get("weburl")
            logo = serializer.data.get("logo")
            finnhubIndustry = serializer.data.get("finnhubIndustry")

            if UserWatchlist.objects.filter(ticker=ticker, user=user).exists() or CompanyProfile.objects.filter(ticker=ticker, defaultWatchlist=True).exists():
                # if the market is already there
                return Response({"Found": "The market is already in your watch list"}, status=status.HTTP_200_OK)

            watchList = UserWatchlist(user=user, country=country, currency=currency, exchange=exchange, ipo=ipo, marketCapitalization=marketCapitalization,
                                      name=name, phone=phone, shareOutstanding=shareOutstanding, ticker=ticker, weburl=weburl, logo=logo, finnhubIndustry=finnhubIndustry)
            watchList.save()
            return Response({"Added": "The market has been added"}, status=status.HTTP_200_OK)
        return Response({"Bad request": "Something went wrong"}, status=status.HTTP_400_BAD_REQUEST)


class StockPrediction(APIView):
    def get(self, request, symbol, format=None):
        stockCandles = finnhub_client.stock_candles(
            symbol, 'D', 1525450745, calendar.timegm(
                time.gmtime())  # get data from 2017 till now
        )
        data = predict(symbol, stockCandles)  # function from utils
        return Response(json.dumps({'data': data}), status=status.HTTP_200_OK)


# for the navbar candlestick searchbar
class FilterAllCompaniesTicker(APIView):
    serializer_class = GetDailyStatsSerializer

    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            quote = serializer.data.get('quote')
            stocks_by_ticker = StockSymbol.objects.filter(
                quote__icontains=quote)
            stocks_by_name = StockSymbol.objects.filter(name__icontains=quote)

            stocks = list(chain(stocks_by_ticker, stocks_by_name))

            data = StockSymbolSearchQuoteSerializer(stocks, many=True).data

            return Response(data, status=status.HTTP_200_OK)
        return Response({"Bad request": "Something went wrong"}, status=status.HTTP_400_BAD_REQUEST)


class RecommendationTrends(APIView):
    serializer_class = GetDailyStatsSerializer

    def post(self, request, format=None):

        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            symbol = serializer.data.get("quote")
            recommendation_trends = finnhub_client.recommendation_trends(
                symbol)

            return Response(recommendation_trends, status=status.HTTP_200_OK)
        return Response({"Bad request": "Something went wrong"}, status=status.HTTP_400_BAD_REQUEST)


class GetAvaliableIndicators(generics.ListAPIView):
    queryset = AvaliableIndicators.objects.all()
    serializer_class = AvaliableIndicatorsSerializer


class GetUserAlerts(APIView):
    serializer_class = AlertSerializer

    def get(self, request, format=None):
        # get the current user
        tokenKey = request.headers['Authorization']
        user = User.objects.filter(auth_token=tokenKey)

        if user.exists():
            user = user[0].id
        else:
            return Response({"404": "Not found"}, status=status.HTTP_404_NOT_FOUND)
        # got the current user

        existingAlerts = Alert.objects.filter(user=user, isActive=True)
        if existingAlerts.exists():
            return Response(AlertSerializer(existingAlerts, many=True).data, status=status.HTTP_200_OK)
        return Response({"404": "NOT FOUND"}, status=status.HTTP_404_NOT_FOUND)


class CreateAlert(APIView):
    serializer_class = AlertSerializer

    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            # get the current user
            tokenKey = request.headers['Authorization']
            user = User.objects.filter(auth_token=tokenKey)

            if user.exists():
                user = user[0].id
            else:
                return Response({"404": "Not found"}, status=status.HTTP_404_NOT_FOUND)
            # got the current user

            condition = serializer.data.get('condition')
            symbol = serializer.data.get('symbol')
            trigger = serializer.data.get('trigger')
            value = serializer.data.get("value")
            notificationType = serializer.data.get("notificationType")
            name = serializer.data.get("name")
            message = serializer.data.get("message")
            isActive = serializer.data.get("isActive")

            newAlert = Alert(user=user, condition=condition, symbol=symbol, trigger=trigger, value=value,
                             notificationType=notificationType, name=name, message=message, isActive=isActive)
            newAlert.save()

            return Response(AlertSerializer(newAlert).data, status=status.HTTP_200_OK)
        return Response({"Bad request": "Something went wrong"}, status=status.HTTP_400_BAD_REQUEST)
