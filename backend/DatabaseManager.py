from datetime import datetime

import pymongo


class DatabaseManager:
    client = None
    db = None
    collectionLocations = None
    collectionIscritti = None

    def start_connection(self):
        self.client = pymongo.MongoClient(
            "mongodb+srv://unicamda:unicamda@clusterunicamanalytics.khf6a.mongodb.net/iscritti_unicam?retryWrites=true&w=majority")
        self.db = self.client["iscritti_unicam"]
        self.collectionLocations = self.db["locations"]
        self.collectionIscritti = self.db["iscritti"]

    def retrieveIscrittiComune(self, longitude, latitude, distance):
        listaCitta = []
        for x in self.collectionLocations.aggregate([
            {
                "$geoNear": {
                    "near": {"type": "Point", "coordinates": [longitude, latitude]},
                    "distanceField": "dist.calculated",
                    "maxDistance": distance,
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
                    "name": {"$first": "$name"},
                    "location": {"$first": "$location"},
                    "averageYear": {"$avg": {"$toInt": {"$substr": ["$iscritti_unicam.iscr_data_nascita", 6, 4]}}},
                    "maschi": {"$sum": {"$cond": [{"$eq": ["M", "$iscritti_unicam.iscr_sesso"]}, 1, 0]}},
                    "femmine": {"$sum": {"$cond": [{"$eq": ["F", "$iscritti_unicam.iscr_sesso"]}, 1, 0]}},

                }
            },
            {
                "$addFields": {
                    "averageYear": {"$subtract": [datetime.now().year, {"$round": ["$averageYear", 0]}]},
                    "maschi": {"$concat": [{"$toString": {
                        "$toInt": {"$round": [{"$multiply": [{"$divide": ["$maschi", "$count"]}, 100]}, 0]}}}, "%"]},
                    "femmine": {"$concat": [{"$toString": {
                        "$toInt": {"$round": [{"$multiply": [{"$divide": ["$femmine", "$count"]}, 100]}, 0]}}}, "%"]}
                }
            }
        ]):
            listaCitta.append(x)

        return listaCitta

    def retrieveIscrittiProvincia(self,  longitude, latitude, distance):
        listaCitta = []
        for x in self.collectionLocations.aggregate([
            {
                "$geoNear": {
                    "near": {"type": "Point", "coordinates": [longitude, latitude]},
                    "distanceField": "dist.calculated",
                    "maxDistance": distance,
                    "query": {"category": "provincia"},
                    "includeLocs": "dist.location",
                    "spherical": "true"
                }
            }, {
                "$lookup": {
                    "from": "iscritti",
                    "localField": "name",
                    "foreignField": "provincia_residenza_sigla_55",
                    "as": "iscritti_unicam"
                }
            },
            {"$unwind": "$iscritti_unicam"},
            {
                "$group": {
                    "_id": "$iscritti_unicam.provincia_residenza_sigla_55",
                    "count": {"$sum": 1},
                    "name": {"$first": "$name"},
                    "location": {"$first": "$location"},
                    "averageYear": {"$avg": {"$toInt": {"$substr": ["$iscritti_unicam.iscr_data_nascita", 6, 4]}}},
                    "maschi": {"$sum": {"$cond": [{"$eq": ["M", "$iscritti_unicam.iscr_sesso"]}, 1, 0]}},
                    "femmine": {"$sum": {"$cond": [{"$eq": ["F", "$iscritti_unicam.iscr_sesso"]}, 1, 0]}},

                }
            },
            {
                "$addFields": {
                    "averageYear": {"$subtract": [datetime.now().year, {"$round": ["$averageYear", 0]}]},
                    "maschi": {"$concat": [{"$toString": {
                        "$toInt": {"$round": [{"$multiply": [{"$divide": ["$maschi", "$count"]}, 100]}, 0]}}}, "%"]},
                    "femmine": {"$concat": [{"$toString": {
                        "$toInt": {"$round": [{"$multiply": [{"$divide": ["$femmine", "$count"]}, 100]}, 0]}}}, "%"]}
                }
            }
        ]):
            listaCitta.append(x)

        return listaCitta

    def retrieveIscrittiRegione(self,  longitude, latitude, distance):
        listaCitta = []
        for x in self.collectionLocations.aggregate([
            {
                "$geoNear": {
                    "near": {"type": "Point", "coordinates": [longitude, latitude]},
                    "distanceField": "dist.calculated",
                    "maxDistance": distance,
                    "query": {"category": "regione"},
                    "includeLocs": "dist.location",
                    "spherical": "true"
                }
            }, {
                "$lookup": {
                    "from": "iscritti",
                    "localField": "name",
                    "foreignField": "iscr_regione_residenza_desc",
                    "as": "iscritti_unicam"
                }
            },
            {"$unwind": "$iscritti_unicam"},
            {
                "$group": {
                    "_id": "$iscritti_unicam.iscr_regione_residenza_desc",
                    "count": {"$sum": 1},
                    "name": {"$first": "$name"},
                    "location": {"$first": "$location"},
                    "averageYear": {"$avg": {"$toInt": {"$substr": ["$iscritti_unicam.iscr_data_nascita", 6, 4]}}},
                    "maschi": {"$sum": {"$cond": [{"$eq": ["M", "$iscritti_unicam.iscr_sesso"]}, 1, 0]}},
                    "femmine": {"$sum": {"$cond": [{"$eq": ["F", "$iscritti_unicam.iscr_sesso"]}, 1, 0]}},

                }
            },
            {
                "$addFields": {
                    "averageYear": {"$subtract": [datetime.now().year, {"$round": ["$averageYear", 0]}]},
                    "maschi": {"$concat": [{"$toString": {
                        "$toInt": {"$round": [{"$multiply": [{"$divide": ["$maschi", "$count"]}, 100]}, 0]}}}, "%"]},
                    "femmine": {"$concat": [{"$toString": {
                        "$toInt": {"$round": [{"$multiply": [{"$divide": ["$femmine", "$count"]}, 100]}, 0]}}}, "%"]}
                }
            }
        ]):
            listaCitta.append(x)

        return listaCitta

    def retrieveIscrittiNazione(self,  longitude, latitude, distance):
        listaCitta = []
        for x in self.collectionLocations.aggregate([
            {
                "$geoNear": {
                    "near": {"type": "Point", "coordinates": [longitude, latitude]},
                    "distanceField": "dist.calculated",
                    "maxDistance": distance,
                    "query": {"category": "nazione"},
                    "includeLocs": "dist.location",
                    "spherical": "true"
                }
            }, {
                "$lookup": {
                    "from": "iscritti",
                    "localField": "name",
                    "foreignField": "iscr_nazione_residenza_desc",
                    "as": "iscritti_unicam"
                }
            },
            {"$unwind": "$iscritti_unicam"},
            {
                "$group": {
                    "_id": "$iscritti_unicam.iscr_nazione_residenza_desc",
                    "count": {"$sum": 1},
                    "name": {"$first": "$name"},
                    "location": {"$first": "$location"},
                    "averageYear": {"$avg": {"$toInt": {"$substr": ["$iscritti_unicam.iscr_data_nascita", 6, 4]}}},
                    "maschi": {"$sum": {"$cond": [{"$eq": ["M", "$iscritti_unicam.iscr_sesso"]}, 1, 0]}},
                    "femmine": {"$sum": {"$cond": [{"$eq": ["F", "$iscritti_unicam.iscr_sesso"]}, 1, 0]}},

                }
            },
            {
                "$addFields": {
                    "averageYear": {"$subtract": [datetime.now().year, {"$round": ["$averageYear", 0]}]},
                    "maschi": {"$concat": [{"$toString": {
                        "$toInt": {"$round": [{"$multiply": [{"$divide": ["$maschi", "$count"]}, 100]}, 0]}}}, "%"]},
                    "femmine": {"$concat": [{"$toString": {
                        "$toInt": {"$round": [{"$multiply": [{"$divide": ["$femmine", "$count"]}, 100]}, 0]}}}, "%"]}
                }
            }
        ]):
            listaCitta.append(x)

        return listaCitta
