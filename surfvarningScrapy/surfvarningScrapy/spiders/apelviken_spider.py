import http.client, urllib
import pymongo
from pymongo import MongoClient
import datetime
import scrapy

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
        wind = response.xpath('normalize-space(//*[@id="day-1"]/article/div[1]/div[5]/div/p/text())')[0].extract()
        wind_direction = response.xpath('//*[@id="day-1"]/article/div[1]/div[5]/div/span/svg')[0].extract()
        rain = response.xpath('normalize-space(//*[@id="day-1"]/article/div[1]/div[4]/div/p/text())')[0].extract()
        day = response.xpath('normalize-space(//*[@id="day-1"]/article/div[1]/div[1]/h3/time[2]/text())')[0].extract()

        msgSplit = msgRaw.split(' ')
        msgSplit = msgSplit[0]
        msg = float(msgSplit.replace(',','.'))

        client = MongoClient()
        client = MongoClient('localhost', 27017)
        client = MongoClient('mongodb://localhost:27017/')
        db = client['surfvarning']

        post = {"fetched time": datetime.datetime.utcnow(),
            "wind": wind,
            "day": day
            }
        posts = db.posts
        post_id = posts.insert_one(post).inserted_id
        print('Post ID: ', post_id)


#response.xpath('//*[@id="day-2"]/article/div[1]/div[5]/div/span/svg')[0].extract()
