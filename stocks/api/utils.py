import pandas as pd
from pandas import json_normalize
import datetime
import numpy as np
import sklearn
from sklearn import linear_model
from sklearn.utils import shuffle
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import precision_score
import json
import math
from .models import *

import time
import calendar
import finnhub
from django.conf import settings
finnhub_client = finnhub.Client(api_key=settings.FINNHUB_APIKEY)

def predict(ticker, stock_candles):

    stock_hist = pd.DataFrame(list(zip(stock_candles.get('o'), stock_candles.get('h'), stock_candles.get('l'), stock_candles.get('c'), stock_candles.get('v'), stock_candles.get('t'))),
                              columns=['Open', 'High', 'Low', 'Close', 'Volume', 'Date'])

    stock_hist['Date'] = pd.to_datetime(stock_hist['Date'], unit='s')
    stock_hist.set_index('Date', inplace=True)

    data = stock_hist[['Close']]
    data = data.rename(columns={"Close": "Actual close"})
    data["Target"] = stock_hist.rolling(2).apply(
        lambda x: x.iloc[1] > x.iloc[0])['Close']

    stock_prev = stock_hist.copy()
    stock_prev = stock_prev.shift(1)

    predictors = ['Close', 'High', 'Low', 'Open', 'Volume']

    # take only the data from row 1 forward
    data = data.join(stock_prev[predictors]).iloc[1:]

    model = RandomForestClassifier(
        n_estimators=100, min_samples_split=200, random_state=1)

    predictions = backtest(data, model, predictors)
    predictions.reset_index(inplace=True)  # making the date index a column
    predictions['Date'] = predictions['Date'].astype(str)

    predictions = predictions.iloc[-100:].values.tolist()
    # to_return_list = []
    to_return_obj = {
        'date': [],
        'target': [],
        'prediction': []
    }

    for i in range(len(predictions)):
        to_return_obj['date'].append(predictions[i][0])
        to_return_obj['target'].append(predictions[i][1])
        to_return_obj['prediction'].append(predictions[i][2])

    return to_return_obj


# make the predictions based on the data before the current date
def backtest(data, model, predictors, start=1000, step=750):

    predictions = []

    for i in range(start, data.shape[0], step):
        train = data.iloc[0:i].copy()
        test = data.iloc[i:(i+step)].copy()
        model.fit(train[predictors], train['Target'])

        preds = model.predict_proba(test[predictors])[:, 1]
        preds = pd.Series(preds, index=test.index)
        preds[preds > .55] = 1
        # preds[preds == .6] = 1
        preds[preds <= .55] = 0

        combined = pd.concat(
            {"Target": test["Target"], "Predictions": preds}, axis=1)

        predictions.append(combined)
    predictions = pd.concat(predictions)
    return predictions


def calculateATR(high, low, close, atr_period):

    price_diffs = [high - low,
                   high - close.shift(),
                   close.shift() - low]
    true_range = pd.concat(price_diffs, axis=1)
    true_range = true_range.abs().max(axis=1)

    atr = true_range.ewm(alpha=1/atr_period, min_periods=atr_period).mean()

    return atr


def from_df_to_json(final):
    final = pd.DataFrame(final)
    final.reset_index(inplace=True)
    final['Date'] = final['Date'].astype(str)
    final.reset_index(drop=True, inplace=True)
    final.columns = ['time', 'value']
    result = final.to_json(orient="records")
    parsed = json.loads(result)
    final = json.dumps(parsed, indent=4)

    return final


def get_supertrend(data, multiplier, symbol):

    # return superTrendData
    df = pd.DataFrame(list(zip(data.get('o'), data.get('h'), data.get('l'), data.get('c'), data.get('t'))),
                      columns=['Open', 'High', 'Low', 'Close', 'Date'])
    df['Date'] = pd.to_datetime(df['Date'], unit='s')
    df.set_index('Date', inplace=True)

    high = df['High']
    low = df['Low']
    close = df['Close']

    atr = calculateATR(high, low, close, 10)

    # df['atr'] = df['tr'].rolling(atr_period).mean()

    # HL2 is the average of high and low prices
    hl2 = (high + low) / 2

    # upperband and lowerband calculation
    final_upperband = upperband = hl2 + (multiplier * atr)
    final_lowerband = lowerband = hl2 - (multiplier * atr)

    # initialize Supertrend column to True
    supertrend = [True] * len(df)

    for i in range(1, len(df.index)):
        curr, prev = i, i-1

        # if current close price goes above upperband
        if close[curr] > final_upperband[prev]:
            supertrend[curr] = True
        # if current close price goes below lowerband
        elif close[curr] < final_lowerband[prev]:
            supertrend[curr] = False
        # else, the trend continues
        else:
            supertrend[curr] = supertrend[prev]

            # adjustment to the final bands
            if supertrend[curr] == True and final_lowerband[curr] < final_lowerband[prev]:
                final_lowerband[curr] = final_lowerband[prev]
            if supertrend[curr] == False and final_upperband[curr] > final_upperband[prev]:
                final_upperband[curr] = final_upperband[prev]

        # to remove bands according to the trend direction
        if supertrend[curr] == True:
            final_upperband[curr] = np.nan
        else:
            final_lowerband[curr] = np.nan

    df['Supertrend'] = supertrend

    # convert the needed dfs to json

    backtest_supertrend(df, 100000)

    final_lowerband = from_df_to_json(final_lowerband)
    final_upperband = from_df_to_json(final_upperband)
    buy_or_sell = from_df_to_json(df['buy_or_sell'])

    # structure the data
    superTrendData = {
        "upperBand": final_upperband,
        "lowerBand": final_lowerband,
        "buy_or_sell": buy_or_sell,
    }

    superTrendData = json.dumps(superTrendData)

    return superTrendData


def backtest_supertrend(df, investment):
    is_uptrend = df['Supertrend']
    close = df['Close']

    # initial condition
    in_position = False
    equity = investment
    commission = 5
    share = 0
    entry = []
    exitList = []

    # if the supertrend is upwards and stops sell else buy
    buy = [True] * len(df)

    for i in range(2, len(df)):
        # if not in position & price is on uptrend -> buy
        if not in_position and is_uptrend[i]:
            share = math.floor(equity / close[i] / 100) * 100
            equity -= share * close[i]
            entry.append((i, close[i]))
            in_position = True
            buy[i] = True  # buy
            # print(f'Buy {share} shares at {round(close[i],2)} on {df.index[i].strftime("%Y/%m/%d")}')
        # if in position & price is not on uptrend -> sell
        elif in_position and not is_uptrend[i]:
            equity += share * close[i] - commission
            exitList.append((i, close[i]))
            in_position = False
            buy[i] = False  # sell
            # print(f'Sell at {round(close[i],2)} on {df.index[i].strftime("%Y/%m/%d")}')
        else:
            buy[i] = None
    # if still in position -> sell all shares
    if in_position:
        equity += share * close[i] - commission

    earning = equity - investment
    roi = round(earning/investment*100, 2)
    print(
        f'Earning from investing $100k is ${round(earning,2)} (ROI = {roi}%)')

    df['buy_or_sell'] = buy  # add the buy or sell to the data frame

    # return buy

    # return entry, exitList, equity


def get_stock_candles(ticker, resolution, fromTimestamp):
    today = datetime.date.today() #check if the data was already fetched for today
    existingStockCandles = StockCandles.objects.filter(
        symbol=ticker, resolution=resolution, fetchDate=today)
    if existingStockCandles.exists():
        hist_data = {
            'o': existingStockCandles[0].o,
            'h': existingStockCandles[0].h,
            'l': existingStockCandles[0].l,
            'c': existingStockCandles[0].c,
            'v': existingStockCandles[0].v,
            't': existingStockCandles[0].t
        }
        return hist_data

    else:
        hist_data = finnhub_client.stock_candles(
            ticker, resolution, int(fromTimestamp), calendar.timegm(time.gmtime()))
        ohlcvtData = {
            'c': [],
            'h': [],
            'l': [],
            'o': [],
            't': [],
            'v': [],
        }
        for i in range(len(hist_data['c'])):
            ohlcvtData['c'].append(hist_data['c'][i])
            ohlcvtData['h'].append(hist_data['h'][i])
            ohlcvtData['l'].append(hist_data['l'][i])
            ohlcvtData['o'].append(hist_data['o'][i])
            ohlcvtData['t'].append(hist_data['t'][i])
            ohlcvtData['v'].append(hist_data['v'][i])

        newStockCandles = StockCandles(symbol=ticker, resolution=resolution,
                                        fromTimestamp=int(fromTimestamp), toTimestamp=calendar.timegm(time.gmtime()),
                                        c=ohlcvtData['c'], h=ohlcvtData['h'], l=ohlcvtData['l'], o=ohlcvtData['o'], t=ohlcvtData['t'], v=ohlcvtData['v'], 
                                        localData=True, fetchDate=today)
        newStockCandles.save()
        return hist_data

