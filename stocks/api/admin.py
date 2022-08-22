from django.contrib import admin
from .models import *
# Register your models here.
admin.site.register(CompanyProfile)
admin.site.register(StockSymbol)
admin.site.register(UserWatchlist)
admin.site.register(DailyStats)
admin.site.register(AvaliableIndicators)
admin.site.register(Alert)
admin.site.register(StockCandles)