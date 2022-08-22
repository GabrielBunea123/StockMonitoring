from django.urls import path
from .views import *

urlpatterns = [
    path('', index, name="home"),
    path('stock-details/<str:symbol>', index, name="stock-details"),
    path('predictions', index, name="predictions"),
    path('stock-prediction/<str:symbol>', index, name="stock-prediction"),
    path('chart/<str:ticker>', index, name="chart"),
    path('profile', index, name="profile"),
    path('register', index, name="register"),
    path("login", index, name="login"),
]
