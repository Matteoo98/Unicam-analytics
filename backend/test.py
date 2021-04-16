import time
import unittest
import pandas as pd
import pymongo
from geopy.geocoders import Nominatim


class MyTestCase(unittest.TestCase):


    def test_process_excel(self):
        Dict = {}
        geolocator = Nominatim(user_agent="unicam_analytics")
        df = pd.read_excel(r'C:\Users\matti\OneDrive\Desktop\Unicam-analytics\backend\Copia di iscritti_20210410.xlsx')
        print(df)
        comuni = df[['iscr_comune_residenza_desc','iscr_regione_residenza_desc']].drop_duplicates().dropna()
        regioni = df[['iscr_regione_residenza_desc','iscr_nazione_residenza_desc']].drop_duplicates().dropna()
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
        print(len(comuni))
        for x in comuni:
            print("calcolo per :", x[0]+" "+x[1])
            location = geolocator.geocode(x[0]+" "+x[1])
            Dict[x[0]+" "+x[1]] = [location.latitude, location.longitude]
            time.sleep(10)
            print(Dict)
        print("DICT ", Dict)

    def test_db(self):
        client = pymongo.MongoClient(
            "mongodb+srv://unicamda:unicamda@clusterunicamanalytics.khf6a.mongodb.net/iscritti_unicam?retryWrites=true&w=majority")
        db = client["iscritti_unicam"]
        collection = db["locations"]
        Dict = {}
        Dict["Porto Recanati Marche"]=[1,2]
        collection.insert_one(Dict)


    def test_geo(self):
        geolocator = Nominatim(user_agent="unicam_analytics")
        location = geolocator.geocode("PU Marche")
        print(location.address)
        print(location.latitude, location.longitude)

    def test_geo_code(self):
        import geocoder
        g = geocoder.google('Mountain View, CA')
        print(g.latlng)

    def test_geo_google(self):
        import requests
        url = 'https://maps.googleapis.com/maps/api/geocode/json'
        params = {'sensor': 'false', 'address': 'Mountain View, CA'}
        r = requests.get(url, params=params)
        results = r.json()['results']
        location = results[0]['geometry']['location']
        print(location['lat'], location['lng'])


    def test_struct(self):
        a = "Porto Recanati , Italia"
        x = {
            a:"c",
            "x":"d"
        }
        print(x)
        Dict = {}
        Dict["paolo"]=[1,2]
        print(Dict)

if __name__ == '__main__':
    unittest.main()
