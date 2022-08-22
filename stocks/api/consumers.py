import json
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
from channels.db import database_sync_to_async
from .models import Alert
from django.contrib.auth.models import User


class NotificationConsumer(WebsocketConsumer):
    def connect(self):
        self.accept()
        self.user = self.scope["user"]

    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        self.price = text_data_json['price']
        self.symbol = text_data_json['symbol']

        alert = self.get_alert(self)

    @database_sync_to_async
    def get_alert(self):
        current_alert = Alert.objects.filter(symbol=self.symbol, user=self.user.id, isActive=True)
        if current_alert.exists():
            current_alert = current_alert[0]
            #check the case scenarios
            if current_alert.condition == self.symbol:
                print(self.symbol)
            elif current_alert.condition=="Supertrend":
                print("supertrend")
            elif current_alert.condition=='Buy/Sell':
                print("Buy/Sell")
            elif current_alert.condition=="Volume":
                print("Volume")
        else:print("Alert doesn't exist ")

        
    
    
