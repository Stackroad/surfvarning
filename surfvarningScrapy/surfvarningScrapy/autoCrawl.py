from scrapy.crawler import CrawlerProcess, Crawler, CrawlerRunner
from scrapy.settings import Settings
from scrapy.utils.project import get_project_settings
from scrapy import signals
from datetime import datetime
from threading import Timer
import pprint
import pymongo
from pymongo import MongoClient
from bson.objectid import ObjectId
import http.client, urllib
import time
import datetime
import multiprocessing as mp
from multiprocessing import Process, Queue
from twisted.internet import reactor
from sendEmail import sendFunc

import sys
from spiders.apelviken_spider import ApelvikenSpider
from scrapy.utils.log import configure_logging

TIME_START_END = {
    'mon': [datetime.time(7, 00), datetime.time(8, 0)],
    'tue': [datetime.time(7, 00), datetime.time(8, 0)],
    'wed': [datetime.time(7, 00), datetime.time(8, 0)],
    'thu': [datetime.time(7, 00), datetime.time(8, 0)],
    'fri': [datetime.time(7, 00), datetime.time(8, 0)],
    'sat': [datetime.time(8, 00), datetime.time(9, 0)],
    'sun': [datetime.time(8, 00), datetime.time(9, 0)],
}

def timer(firstTimeBool, day_polled, password, user):
    sleep_hour = 3600
    sleep_10_min = 600
    sleep_1_min = 60

    while True:
        print('Time to check')
        weekday = time.strftime('%a').lower()
        time_start, time_end = TIME_START_END[weekday]
        now = datetime.datetime.now().time()
        if time_start <= now <= time_end:
            print('We are in time')
            today = time.strftime('%m-%d')
            if day_polled == today:
                print('Already notified today!')
                sleep_time = sleep_hour
                time.sleep(sleep_hour)
            else:
                print('Time to notify')
                setUpDatabaseConnectionRetrive(firstTimeBool)
                day_polled = today
        else:
            print('It is not time!')
            sleep_time = sleep_10_min
            time.sleep(sleep_time)

def setUpDatabaseConnectionRetrive(firstTimeBool):

    today = datetime.datetime.today()
    tomorrow = today + datetime.timedelta(days=1)
    tomorrow = tomorrow.date()
    spot = []

    clients_apelviken = []
    clients_kosa = []
    clients_fastningen = []
    clients_lajet = []
    clients_secret_spot = []

    sys.stdout.flush()

    if firstTimeBool == True:
        client = MongoClient()
        client = MongoClient('localhost', 27017)
        client = MongoClient('mongodb://localhost:27017/')
        db = client['surfvarningdb']
        firstTimeBool = False
    else:
        db = client['surfvarningdb']

    post = db.varbergs.find_one({"date": str(tomorrow), "surfspot": "Varberg"})

    if post == None:
        print("Could not retrieve anything from database")
        sendNotify("Could not retrieve anything from database", "wind", "wind_direction", "perwelander.swe@gmail.com", password, user)
    try:
        wind = post.get("wind")
        wind_direction = post.get("wind_direction")
        console.log("wind", wind)
        console.log("wind_direction", wind_direction)

        sendNotify("TEST", wind, wind_direction, "perwelander.swe@gmail.com", password, user)

        # For Apelviken
        if wind > 3 and 180 <= wind_direction <= 360:
            for obj in db.surfvarningclients.find({"spot": "Apelviken"}):
                clients_apelviken.append(obj["email"])

            print("SENDING EMAIL Apelviken!")
            for client in clients_apelviken:
                print("client", client)
                sendNotify("Apelviken", wind, wind_direction, client, password, user)

        # For Kosa
        if wind > 7 and 270 <= wind_direction <= 315:
            for obj in db.surfvarningclients.find({"spot": "Kosa"}):
                clients_kosa.append(obj["email"])

            print("SENDING EMAIL Kosa!")
            for client in clients_kosa:
                print(client)
                sendNotify("Kosa", wind, wind_direction, client, password, user)

        # For fästningen
        if wind > 7 and 180 <= wind_direction <= 270:
            for obj in db.surfvarningclients.find({"spot": "Fästningen"}):
                clients_fastningen.append(obj["email"])

            print("SENDING EMAIL Fästningen!")
            for client in clients_fastningen:
                print("client", client)
                sendNotify("Fästningen", wind, wind_direction, client, password, user)

        # For läjet
        if wind > 7 and 180 <= wind_direction <= 315:
            for obj in db.surfvarningclients.find({"spot": "Läjet"}):
                clients_lajet.append(obj["email"])

            print("SENDING EMAIL Läjet!")
            for client in clients_lajet:
                print("client", client)
                sendNotify("Läjet", wind, wind_direction, client, password, user)

        # For secret spot
        if wind > 8 and 225 <= wind_direction <= 270:
            for obj in db.surfvarningclients.find({"spot": "Secret-Spot"}):
                clients_secret_spot.append(obj["email"])

            print("SENDING EMAIL Secret!")
            for client in clients_secret_spot:
                print("client", client)
                sendNotify("Secret Spot", wind, wind_direction, client, password, user)

    except:
        print("Something went wrong when retrieving from database")
        sys.stdout.flush()

def sendNotify(spot, wind, wind_direction, clients, password, user):
    sendFunc(spot, wind, wind_direction, clients, password, user)
    post = {"send_time": datetime.datetime.utcnow(),
        "wind": int(wind),
        "wind_direction": int(wind_direction),
        "date": date,
        "rain": int(rain),
        "surfspot": "Varberg",
        "clients" : clients
        }
    posts = db.sent_emails
    post_id = posts.insert_one(post).inserted_id
    console.log(post)
    sys.stdout.flush()

if __name__ == '__main__':
    print('Starting to run')
    infile = open('userPassword.txt', 'r')
    for l in infile:
        splitLine = l.split()
        user = splitLine[0]
        password = splitLine[1]
    infile.close()
    day_polled = ''
    firstTimeBool = True
    timer(firstTimeBool, day_polled, password, user)
