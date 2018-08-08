import http.client, urllib
import pymongo
from pymongo import MongoClient
import datetime
import scrapy
import math

class ApelvikenSpider(scrapy.Spider):
    name = "apelviken"
    page_url = "https://www.klart.se/se/hallands-l%C3%A4n/v%C3%A4der-varberg/"

    def start_requests(self):
        urls = [
            "https://www.klart.se/se/hallands-l%C3%A4n/v%C3%A4der-varberg/"
        ]
        for url in urls:
            yield scrapy.Request(url=url, callback=self.parse)

    def parse(self, response):
        print(response.css('title::text').extract())
        wind = response.xpath('normalize-space(//*[@id="day-2"]/article/div[1]/div[5]/div/p/text())')[0].extract().split()[0]
        wind_direction = response.xpath('//*[@id="day-2"]/article/div[1]/div[5]/div/span/svg')[0].extract().split()[4]
        rain = response.xpath('normalize-space(//*[@id="day-2"]/article/div[1]/div[4]/div/p/text())')[0].extract()[0]
        # day_month = response.xpath('normalize-space(//*[@id="day-2"]/article/div[1]/div[1]/h3/time[0])')[0].extract().split()
        date = response.xpath('//*[@id="day-2"]/article/div[1]/div[1]/h3/time[2]')[0].extract().split()[1].split('"')[1].split('T')[0]

        client = MongoClient()
        client = MongoClient('localhost', 27017)
        client = MongoClient('mongodb://localhost:27017/')
        db = client['surfvarningdb']

        # if math.isint(float(wind)):
        #     print("error wind")
        # elif math.isnan(float(wind_direction)):
        #     print("error wind_direction")
        # elif math.isnan(float(day)):
        #     print("error day")
        # elif math.isnan(float(month)):
        #     print("error month")
        # elif math.isnan(float(rain)):
        #     print("error rain")

        post = {"fetch_time": datetime.datetime.utcnow(),
            "wind": int(wind),
            "wind_direction": int(wind_direction),
            "date": date,
            "rain": int(rain),
            "surfspot": "Varberg"
            }

        print("POST", post)
        posts = db.varberg
        post_id = posts.insert_one(post).inserted_id
        print('Post ID: ', post_id)
