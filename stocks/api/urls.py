from django.urls import path
from .views import *

urlpatterns = [
    path('get-company-profile',GetCompanyProfile.as_view()),
    path('get-user-watchlist', GetUserWatchlist.as_view()),
    path('get-company-profile-finnhub',GetCompanyProfileFinnhub.as_view()),
    path('get-daily-stats',GetDailyStats.as_view()),
    path('search-quote',SearchQuote.as_view()),
    path('get-company-news',GetCompanyNews.as_view()),
    path('get-market-news',GetMarketNews.as_view()),
    path('get-stock-basic-financials',GetStockBasicFinancials.as_view()),
    path('add-to-watch-list',AddToWatchList.as_view()),
    path('stock-prediction/<str:symbol>',StockPrediction.as_view()),
    path('get-stock-full-stats',GetStockFullHistoryData.as_view()),
    path('get-stock-candles',GetStockCandles.as_view()),
    path('recommendation-trends', RecommendationTrends.as_view()),
    path('supertrend', SuperTrend.as_view()),
    path('filter-all-companies-ticker', FilterAllCompaniesTicker.as_view()),
    path('avaliable-indicators', GetAvaliableIndicators.as_view()),
    path('create-alert', CreateAlert.as_view()),
    path('get-user', GetUser.as_view()),
    path('get-user-alerts', GetActiveUserAlerts.as_view()),
    path('get-all-user-alerts', GetAllUserAlerts.as_view()),
    # path('run-web-socket',RunWebSocketForStock.as_view()),
    # path('get-all-companies-ticker', GetAllCompaniesTicker.as_view()),
]
