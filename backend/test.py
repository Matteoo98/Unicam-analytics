import time
import unittest
from datetime import datetime

import pandas as pd
import pymongo
from geopy.geocoders import Nominatim

from DatabaseManager import DatabaseManager


class MyTestCase(unittest.TestCase):

    def test_process_excel(self):
        client = pymongo.MongoClient(
            "mongodb+srv://unicamda:unicamda@clusterunicamanalytics.khf6a.mongodb.net/iscritti_unicam?retryWrites=true&w=majority")
        db = client["iscritti_unicam"]
        collection = db["locations"]

        geolocator = Nominatim(user_agent="unicam_analytics")
        df = pd.read_excel(r'C:\Users\matti\OneDrive\Desktop\Unicam-analytics\backend\Copia di iscritti_20210410.xlsx')
        print(df)
        comuni = df[['iscr_comune_residenza_desc', 'provincia_residenza_sigla_55',
                     'iscr_regione_residenza_desc']].drop_duplicates().dropna()
        regioni = df[['iscr_regione_residenza_desc', 'iscr_nazione_residenza_desc']].drop_duplicates().dropna()
        nazioni = df[['iscr_nazione_residenza_desc']].drop_duplicates()
        province = df[['provincia_residenza_sigla_55', 'iscr_regione_residenza_desc']].drop_duplicates().dropna()
        comuni = comuni.values.tolist()
        regioni = regioni.values.tolist()
        nazioni = nazioni.values.tolist()
        province = province.values.tolist()
        # print("----------------------------------------------------------------------")
        # for a in comuni:
        #     print("comune :", a)
        # print("----------------------------------------------------------------------")
        # for a in regioni:
        #     print("regione :", a)
        # print("----------------------------------------------------------------------")
        # for a in nazioni:
        #     print("nazione :", a)
        # print("----------------------------------------------------------------------")
        # for a in province:
        #     print("province :", a)
        # print(len(comuni))
        for x in province:
            entry = collection.find_one({"location": x[0]}, {"_id": 1, "location": 1, "category": 1})
            if entry is None:
                print("calcolo per :", x[0] + " " + x[1])
                location = geolocator.geocode(x[0] + " " + x[1])
                print(location)
                if location is not None:
                    Dict = {"name": x[0],
                            "location": {"type": "Point", "coordinates": [location.longitude, location.latitude]},
                            "category": "provincia"
                            }
                    time.sleep(10)
                    print(Dict)
                    collection.insert_one(Dict)
                    print("inserito nel db")
                    Dict.clear()
            else:
                print("Ho gia fatto questa città")

        # print("DICT ", Dict)

    def test_db(self):
        client = pymongo.MongoClient(
            "mongodb+srv://unicamda:unicamda@clusterunicamanalytics.khf6a.mongodb.net/iscritti_unicam?retryWrites=true&w=majority")
        db = client["iscritti_unicam"]
        collection = db["locations"]
        # x = collection.find_one({"location": "Camerino"}, {"_id": 1, "location": 1, "coordinate": 1})
        # print(x)
        # collection.create_index([("location", "2dsphere")])
        # MAcerata
        # x = collection.find(
        #     {
        #         "location":
        #             {"$near":
        #                 {
        #                     "$geometry": {
        #                         "type": "Point",
        #                         "coordinates": [13.150882217502017, 43.15297805]
        #                     },
        #                     "$minDistance": 0,
        #                     "$maxDistance": 100000
        #                 }
        #             }
        #     })
        x = collection.aggregate([
            {
                "$geoNear": {
                    "near": {"type": "Point", "coordinates": [13.442, 43.2991]},
                    "distanceField": "dist.calculated",
                    "maxDistance": 250000,
                    "query": {"category": "comune"},
                    "includeLocs": "dist.location",
                    "spherical": "true"
                }
            }
        ])
        for a in x:
            print(a)

    def test_geo(self):
        geolocator = Nominatim(user_agent="unicam_analytics")
        location = geolocator.geocode("Camerino ")
        print(location.address)
        print(location.longitude, location.latitude)
        # location = geolocator.reverse("43.2991, 13.442")
        # print(location.address)

    def test_geo_code(self):
        import geocoder
        g = geocoder.google('Macerata Marche')
        print(g.latlng)

    def test_geo_google(self):
        client = pymongo.MongoClient(
            "mongodb+srv://unicamda:unicamda@clusterunicamanalytics.khf6a.mongodb.net/iscritti_unicam?retryWrites=true&w=majority")
        db = client["iscritti_unicam"]
        collection = db["iscritti"]
        df = pd.read_excel(r'C:\Users\matti\OneDrive\Desktop\Unicam-analytics\backend\Copia di iscritti_20210410.xlsx')
        collection.insert_many(df.to_dict('records'))

    def test_excel_rowobj(self):
        db = DatabaseManager()
        db.start_connection()
        lista = db.test()
        for x in lista:
            print(x)

    def test_1(self):
        x = {'_id': '607f10b3f2df1ba40d57a1c3', 'name': 'Macerata',
             'location': {'type': 'Point', 'coordinates': [13.4535897, 43.3007275]}, 'category': 'comune',
             'dist': {'calculated': 0.0, 'location': {'type': 'Point', 'coordinates': [13.4535897, 43.3007275]}}}
        lista = []
        y = {'_id': '607f10b3f2df1ba40d57a1c3', 'name': 'Camerino',
             'location': {'type': 'Point', 'coordinates': [13.4535897, 43.3007275]}, 'category': 'comune',
             'dist': {'calculated': 0.0, 'location': {'type': 'Point', 'coordinates': [13.4535897, 43.3007275]}}}
        lista.append(x)
        lista.append(y)

        for a in lista:
            print(a['name'])

    def test_join(self):
        client = pymongo.MongoClient(
            "mongodb+srv://unicamda:unicamda@clusterunicamanalytics.khf6a.mongodb.net/iscritti_unicam?retryWrites=true&w=majority")
        db = client["iscritti_unicam"]
        collectionLocations = db["locations"]
        collectionIscritti = db["iscritti"]
        for x in collectionIscritti.aggregate([
            {
                "$lookup":
                    {
                        "from": "locations",
                        "let": {"order_item": "$iscr_comune_residenza_desc",
                                "order_qty": "$provincia_residenza_sigla_55"},
                        "pipeline": [
                            {"$match":
                                {"$expr":
                                    {"$or":
                                        [
                                            {"$eq": ["$name", "$$order_item"]},
                                            {"$eq": ["$name", "$$order_qty"]}
                                        ]
                                    }
                                }
                            }
                        ],
                        "as": "stockdata"
                    }
            }, {
                "$replaceRoot": {"newRoot": {"$mergeObjects": [{"$arrayElemAt": ["$stockdata", 0]}, "$$ROOT"]}}
            },
            {"$project": {"stockdata": 1}},
            {"$limit": 5}
        ]):
            print(x)

    def test_velocita(self):
        client = pymongo.MongoClient(
            "mongodb+srv://unicamda:unicamda@clusterunicamanalytics.khf6a.mongodb.net/iscritti_unicam?retryWrites=true&w=majority")
        db = client["iscritti_unicam"]
        collectionLocations = db["locations"]
        collectionIscritti = db["iscritti"]
        listaCitta = []
        for x in collectionLocations.aggregate([
            {
                "$geoNear": {
                    "near": {"type": "Point", "coordinates": [13.442, 43.2991]},
                    "distanceField": "dist.calculated",
                    "maxDistance": 10000,
                    "query": {"category": "comune"},
                    "includeLocs": "dist.location",
                    "spherical": "true"
                }
            }, {
                "$lookup": {
                    "from": "iscritti",
                    "localField": "name",
                    "foreignField": "iscr_comune_residenza_desc",
                    "as": "iscritti_unicam"
                }
            },
            {"$unwind": "$iscritti_unicam"},
            {
                "$group": {
                    "_id": "$iscritti_unicam.iscr_comune_residenza_desc",
                    "count": {"$sum": 1},
                    "name":{"$first":"$name"},
                    "location": {"$first": "$location"},
                    "averageYear": {"$avg": {"$toInt": {"$substr": ["$iscritti_unicam.iscr_data_nascita", 6, 4]}}},
                    "maschi": {"$sum": {"$cond": [{"$eq": ["M", "$iscritti_unicam.iscr_sesso"]}, 1, 0]}},
                    "femmine": {"$sum": {"$cond": [{"$eq": ["F", "$iscritti_unicam.iscr_sesso"]}, 1, 0]}},

                }
            },
            {
                "$addFields": {
                    "averageYear": {"$subtract":[datetime.now().year,{"$round": ["$averageYear", 0]}]},
                    "maschi": {"$concat": [{"$toString": {
                        "$toInt": {"$round": [{"$multiply": [{"$divide": ["$maschi", "$count"]}, 100]}, 0]}}}, "%"]},
                    "femmine": {"$concat": [{"$toString": {
                        "$toInt": {"$round": [{"$multiply": [{"$divide": ["$femmine", "$count"]}, 100]}, 0]}}}, "%"]}
                }
            }
        ]):
            listaCitta.append(x)

        for x in listaCitta:
            print(x)


if __name__ == '__main__':
    unittest.main()
