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

    def geo_spatial_query(self, longitude, latitude, distance):
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
            }
        ]):
            listaCitta.append(x)
        return listaCitta

    def retrieveIscrittiComune(self, longitude, latitude, distance):
        listaCitta = self.geo_spatial_query(longitude, latitude, distance)

        for a in listaCitta:
            for z in self.collectionIscritti.aggregate([
                {
                    "$project": {
                        "_id": 1,
                        "iscr_comune_residenza_desc": 1,
                        "iscr_cds_desc": 1,
                        "iscr_sesso": 1,
                        "year": {"$substr": ["$iscr_data_nascita", 6, 4]},
                    }
                },
                {"$match": {"iscr_comune_residenza_desc": a['name']}},
                {
                    "$group": {
                        "_id": "$iscr_comune_residenza_desc",
                        "count": {"$sum": 1},
                        "maschi": {"$sum": {"$cond": [{"$eq": ["M", "$iscr_sesso"]}, 1, 0]}},
                        "femmine": {"$sum": {"$cond": [{"$eq": ["F", "$iscr_sesso"]}, 1, 0]}},
                        "averageYear": {"$avg": {"$toInt": "$year"}}

                    }
                },
                {
                    "$addFields": {
                        "averageYear": {"$round": ["$averageYear", 0]},
                        "maschi": {"$concat": [{"$toString": {
                            "$toInt": {"$round": [{"$multiply": [{"$divide": ["$maschi", "$count"]}, 100]}, 0]}}},
                            "%"]},
                        "femmine": {"$concat": [{"$toString": {
                            "$toInt": {"$round": [{"$multiply": [{"$divide": ["$femmine", "$count"]}, 100]}, 0]}}},
                            "%"]}
                    }
                }
            ]):
                a["iscritti"] = z['count']
                a["maschi"] = z['maschi']
                a["femmine"] = z['femmine']
                a["etaMedia"] = datetime.now().year - z['averageYear']

        return listaCitta

    def retrieveIscrittiProvincia(self, longitude, latitude, distance):
        listaCitta = self.geo_spatial_query(longitude, latitude, distance)
        for a in listaCitta:
            for z in self.collectionIscritti.aggregate([
                {
                    "$project": {
                        "_id": 1,
                        "provincia_residenza_sigla_55": 1,
                        "iscr_sesso": 1,
                        "year": {"$substr": ["$iscr_data_nascita", 6, 4]},
                    }
                },
                {"$match": {"provincia_residenza_sigla_55": a['name']}},
                {
                    "$group": {
                        "id": {"$first": "$provincia_residenza_sigla_55"},
                        "_id": "$id",
                        "count": {"$sum": 1},
                        "maschi": {"$sum": {"$cond": [{"$eq": ["M", "$iscr_sesso"]}, 1, 0]}},
                        "femmine": {"$sum": {"$cond": [{"$eq": ["F", "$iscr_sesso"]}, 1, 0]}},
                        "averageYear": {"$avg": {"$toInt": "$year"}}
                    }
                },
                {
                    "$addFields": {
                        "averageYear": {"$round": ["$averageYear", 0]},
                        "maschi": {"$concat": [{"$toString": {
                            "$toInt": {"$round": [{"$multiply": [{"$divide": ["$maschi", "$count"]}, 100]}, 0]}}},
                            "%"]},
                        "femmine": {"$concat": [{"$toString": {
                            "$toInt": {"$round": [{"$multiply": [{"$divide": ["$femmine", "$count"]}, 100]}, 0]}}},
                            "%"]}
                    }
                }
            ]):
                a["iscritti"] = z['count']
                a["maschi"] = z['maschi']
                a["femmine"] = z['femmine']
                a["etaMedia"] = datetime.now().year - z['averageYear']

        return listaCitta

    def retrieveIscrittiRegione(self, longitude, latitude, distance):
        listaCitta = self.geo_spatial_query(longitude, latitude, distance)
        for a in listaCitta:
            for z in self.collectionIscritti.aggregate([
                {
                    "$project": {
                        "_id": 1,
                        "iscr_regione_residenza_desc": 1,
                        "iscr_sesso": 1,
                        "year": {"$substr": ["$iscr_data_nascita", 6, 4]},
                    }
                },
                {"$match": {"iscr_regione_residenza_desc": a['name']}},
                {
                    "$group": {
                        "id": {"$first": "$iscr_regione_residenza_desc"},
                        "_id": "$id",
                        "count": {"$sum": 1},
                        "maschi": {"$sum": {"$cond": [{"$eq": ["M", "$iscr_sesso"]}, 1, 0]}},
                        "femmine": {"$sum": {"$cond": [{"$eq": ["F", "$iscr_sesso"]}, 1, 0]}},
                        "averageYear": {"$avg": {"$toInt": "$year"}}
                    }
                },
                {
                    "$addFields": {
                        "averageYear": {"$round": ["$averageYear", 0]},
                        "maschi": {"$concat": [{"$toString": {
                            "$toInt": {"$round": [{"$multiply": [{"$divide": ["$maschi", "$count"]}, 100]}, 0]}}},
                            "%"]},
                        "femmine": {"$concat": [{"$toString": {
                            "$toInt": {"$round": [{"$multiply": [{"$divide": ["$femmine", "$count"]}, 100]}, 0]}}},
                            "%"]}
                    }
                }
            ]):
                a["iscritti"] = z['count']
                a["maschi"] = z['maschi']
                a["femmine"] = z['femmine']
                a["etaMedia"] = datetime.now().year - z['averageYear']

        return listaCitta

    def retrieveIscrittiNazione(self, longitude, latitude, distance):
        listaCitta = self.geo_spatial_query(longitude, latitude, distance)
        for a in listaCitta:
            for z in self.collectionIscritti.aggregate([
                {
                    "$project": {
                        "_id": 1,
                        "iscr_nazione_residenza_desc": 1,
                        "iscr_sesso": 1,
                        "year": {"$substr": ["$iscr_data_nascita", 6, 4]},
                    }
                },
                {"$match": {"iscr_nazione_residenza_desc": a['name']}},
                {
                    "$group": {
                        "id": {"$first": "$iscr_nazione_residenza_desc"},
                        "_id": "$id",
                        "count": {"$sum": 1},
                        "maschi": {"$sum": {"$cond": [{"$eq": ["M", "$iscr_sesso"]}, 1, 0]}},
                        "femmine": {"$sum": {"$cond": [{"$eq": ["F", "$iscr_sesso"]}, 1, 0]}},
                        "averageYear": {"$avg": {"$toInt": "$year"}}
                    }
                },
                {
                    "$addFields": {
                        "averageYear": {"$round": ["$averageYear", 0]},
                        "maschi": {"$concat": [{"$toString": {
                            "$toInt": {"$round": [{"$multiply": [{"$divide": ["$maschi", "$count"]}, 100]}, 0]}}},
                            "%"]},
                        "femmine": {"$concat": [{"$toString": {
                            "$toInt": {"$round": [{"$multiply": [{"$divide": ["$femmine", "$count"]}, 100]}, 0]}}},
                            "%"]}
                    }
                }
            ]):
                a["iscritti"] = z['count']
                a["maschi"] = z['maschi']
                a["femmine"] = z['femmine']
                a["etaMedia"] = datetime.now().year - z['averageYear']

        return listaCitta



