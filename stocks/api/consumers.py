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
        print(self.price)

        alert = self.get_alert()
        print(alert)
        if alert:
            self.send(text_data=json.dumps({
                'alert_name': alert.name,
                'alert_message':alert.message,
                'symbol':self.symbol, 
                'condition':alert.condition,
                'value':alert.value,
                'trigger':alert.trigger
            }))
        else:
            self.send(text_data=json.dumps({
                "message":"no alarms registered"
            }))
        


    # @database_sync_to_async
    def get_alert(self):
        current_alert = Alert.objects.filter(symbol=self.symbol, user=self.user.id, isActive=True)
        if current_alert.exists():
            current_alert = current_alert[0]
            #check the case scenarios
            if current_alert.condition == self.symbol or current_alert.condition=="Volume":

                if current_alert.trigger=="Crossing":

                    if current_alert.value>self.price or current_alert.value<self.price:
                        current_alert.isActive = False
                        current_alert.save()
                        return current_alert

                elif current_alert.trigger=="Crossing up" or current_alert.trigger=="Greater than":

                    if current_alert.value>self.price:
                        current_alert.isActive = False
                        current_alert.save()
                        return current_alert

                elif current_alert.trigger=="Crossing down" or current_alert.trigger=="Less than":

                    if current_alert.value<self.price:
                        current_alert.isActive = False
                        current_alert.save()
                        return current_alert
        else:
            self.close()


        
    
    
