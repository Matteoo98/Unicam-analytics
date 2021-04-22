import time
import unittest
import pandas as pd
import pymongo
from geopy.geocoders import Nominatim

from backend.DatabaseManager import DatabaseManager


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
                    "near": {"type": "Point", "coordinates": [13.0683092, 43.1357641]},
                    "distanceField": "dist.calculated",
                    "maxDistance": 10000,
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
        db.retrieveIscrittiFromCity()

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


if __name__ == '__main__':
    unittest.main()
