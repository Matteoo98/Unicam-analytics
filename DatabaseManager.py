from datetime import datetime
import math
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
        lista_comuni = [x['name'] for x in listaCitta]
        listaInfo = self.getInfoFromComune(lista_comuni)
        for y in listaInfo:
            for a in y["scuoleSuperiori"]:
                if str(a['scuola']) == 'nan':
                    a['scuola'] = "Name Not Found"
            for a in y["CorsiUniversita"]:
                if str(a['cds']) == 'nan':
                    a['cds'] = "Name Not Found"
            # y["scuoleSuperiori"] = [x['scuola'] if str(x['scuola']) == 'nan' else x for x in y["scuoleSuperiori"]]
            # y["CorsiUniversita"] = [0 if str(x['cds']) == 'nan' else x for x in y["CorsiUniversita"]]
        for x in listaCitta:
            for y in listaInfo:
                if x['name'] == y['_id']:
                    y["CorsiUniversita"].sort(key=lambda a: a['cdsCount'], reverse=True)
                    x['cds'] = y["CorsiUniversita"]
                    y["scuoleSuperiori"].sort(key=lambda a: a["scuolaCount"], reverse=True)
                    x['superiori'] = y["scuoleSuperiori"]

        return listaCitta

    def retrieveIscrittiProvincia(self, longitude, latitude, distance):
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
        lista_provincie = [x['name'] for x in listaCitta]
        listaInfo = self.getInfoFromProvincia(lista_provincie)
        for y in listaInfo:
            for a in y["scuoleSuperiori"]:
                if str(a['scuola']) == 'nan':
                    a['scuola'] = "Name Not Found"
            for a in y["CorsiUniversita"]:
                if str(a['cds']) == 'nan':
                    a['cds'] = "Name Not Found"
        for x in listaCitta:
            for y in listaInfo:
                if x['name'] == y['_id']:
                    y["CorsiUniversita"].sort(key=lambda a: a['cdsCount'], reverse=True)
                    x['cds'] = y["CorsiUniversita"]
                    y["scuoleSuperiori"].sort(key=lambda a: a["scuolaCount"], reverse=True)
                    x['superiori'] = y["scuoleSuperiori"]
        return listaCitta

    def retrieveIscrittiRegione(self, longitude, latitude, distance):
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
        lista_regioni = [x['name'] for x in listaCitta]
        listaInfo = self.getInfoFromRegione(lista_regioni)
        for y in listaInfo:
            for a in y["scuoleSuperiori"]:
                if str(a['scuola']) == 'nan':
                    a['scuola'] = "Name Not Found"
            for a in y["CorsiUniversita"]:
                if str(a['cds']) == 'nan':
                    a['cds'] = "Name Not Found"
        for x in listaCitta:
            for y in listaInfo:
                if x['name'] == y['_id']:
                    y["CorsiUniversita"].sort(key=lambda a: a['cdsCount'], reverse=True)
                    x['cds'] = y["CorsiUniversita"]
                    y["scuoleSuperiori"].sort(key=lambda a: a["scuolaCount"], reverse=True)
                    x['superiori'] = y["scuoleSuperiori"]
        return listaCitta

    def retrieveIscrittiNazione(self, longitude, latitude, distance):
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
        lista_nazioni = [x['name'] for x in listaCitta]
        listaInfo = self.getInfoFromNazione(lista_nazioni)
        for y in listaInfo:
            for a in y["scuoleSuperiori"]:
                if str(a['scuola']) == 'nan':
                    a['scuola'] = "Name Not Found"
            for a in y["CorsiUniversita"]:
                if str(a['cds']) == 'nan':
                    a['cds'] = "Name Not Found"
        for x in listaCitta:
            for y in listaInfo:
                if x['name'] == y['_id']:
                    y["CorsiUniversita"].sort(key=lambda a: a['cdsCount'], reverse=True)
                    x['cds'] = y["CorsiUniversita"]
                    y["scuoleSuperiori"].sort(key=lambda a: a["scuolaCount"], reverse=True)
                    x['superiori'] = y["scuoleSuperiori"]
        return listaCitta

    def getInfoFromComune(self, lista_comuni):
        listaInfo = []
        for x in self.collectionIscritti.aggregate([
            {
                "$match": {
                    "iscr_comune_residenza_desc": {
                        "$in": lista_comuni
                    }
                }
            },

            {"$group": {
                "_id": {
                    "cds": "$iscr_cds_desc",
                    "comune": "$iscr_comune_residenza_desc"
                },
                "iscr_tipo_titolo_sup_desc": {
                    "$push": "$iscr_tipo_titolo_sup_desc"
                },
                "count": {
                    "$sum": 1
                }
            }},
            {"$unwind": "$iscr_tipo_titolo_sup_desc"},
            {
                "$group": {
                    "_id": {
                        "scuola": "$iscr_tipo_titolo_sup_desc",
                        "comune": "$_id.comune"
                    },
                    "iscr_tipo_titolo_sup_descCount": {
                        "$sum": 1
                    },
                    "iscr_cds_desc": {
                        "$push": {
                            "cds": "$_id.cds",
                            "cdsCount": "$count"
                        }
                    }
                }
            },
            {"$unwind": "$iscr_cds_desc"},
            {
                "$group": {
                    "_id": "$_id.comune",
                    "scuoleSuperiori": {
                        "$addToSet": {
                            "scuola": "$_id.scuola",
                            "scuolaCount": "$iscr_tipo_titolo_sup_descCount"
                        }
                    },
                    "CorsiUniversita": {
                        "$addToSet": "$iscr_cds_desc"
                    }
                },
            },
        ]):
            listaInfo.append(x)
        return listaInfo

    def getInfoFromProvincia(self, lista_provincia):
        listaInfo = []
        for x in self.collectionIscritti.aggregate([
            {
                "$match": {
                    "provincia_residenza_sigla_55": {
                        "$in": lista_provincia
                    }
                }
            },

            {"$group": {
                "_id": {
                    "cds": "$iscr_cds_desc",
                    "comune": "$provincia_residenza_sigla_55"
                },
                "iscr_tipo_titolo_sup_desc": {
                    "$push": "$iscr_tipo_titolo_sup_desc"
                },
                "count": {
                    "$sum": 1
                }
            }},
            {"$unwind": "$iscr_tipo_titolo_sup_desc"},
            {
                "$group": {
                    "_id": {
                        "scuola": "$iscr_tipo_titolo_sup_desc",
                        "comune": "$_id.comune"
                    },
                    "iscr_tipo_titolo_sup_descCount": {
                        "$sum": 1
                    },
                    "iscr_cds_desc": {
                        "$push": {
                            "cds": "$_id.cds",
                            "cdsCount": "$count"
                        }
                    }
                }
            },
            {"$unwind": "$iscr_cds_desc"},
            {
                "$group": {
                    "_id": "$_id.comune",
                    "scuoleSuperiori": {
                        "$addToSet": {
                            "scuola": "$_id.scuola",
                            "scuolaCount": "$iscr_tipo_titolo_sup_descCount"
                        }
                    },
                    "CorsiUniversita": {
                        "$addToSet": "$iscr_cds_desc"
                    }
                }
            },
        ]):
            listaInfo.append(x)
        return listaInfo

    def getInfoFromRegione(self, lista_regioni):
        listaInfo = []
        for x in self.collectionIscritti.aggregate([
            {
                "$match": {
                    "iscr_regione_residenza_desc": {
                        "$in": lista_regioni
                    }
                }
            },

            {"$group": {
                "_id": {
                    "cds": "$iscr_cds_desc",
                    "comune": "$iscr_regione_residenza_desc"
                },
                "iscr_tipo_titolo_sup_desc": {
                    "$push": "$iscr_tipo_titolo_sup_desc"
                },
                "count": {
                    "$sum": 1
                }
            }},
            {"$unwind": "$iscr_tipo_titolo_sup_desc"},
            {
                "$group": {
                    "_id": {
                        "scuola": "$iscr_tipo_titolo_sup_desc",
                        "comune": "$_id.comune"
                    },
                    "iscr_tipo_titolo_sup_descCount": {
                        "$sum": 1
                    },
                    "iscr_cds_desc": {
                        "$push": {
                            "cds": "$_id.cds",
                            "cdsCount": "$count"
                        }
                    }
                }
            },
            {"$unwind": "$iscr_cds_desc"},
            {
                "$group": {
                    "_id": "$_id.comune",
                    "scuoleSuperiori": {
                        "$addToSet": {
                            "scuola": "$_id.scuola",
                            "scuolaCount": "$iscr_tipo_titolo_sup_descCount"
                        }
                    },
                    "CorsiUniversita": {
                        "$addToSet": "$iscr_cds_desc"
                    }
                }
            },
        ]):
            listaInfo.append(x)
        return listaInfo

    def getInfoFromNazione(self, lista_nazioni):
        listaInfo = []
        for x in self.collectionIscritti.aggregate([
            {
                "$match": {
                    "iscr_nazione_residenza_desc": {
                        "$in": lista_nazioni
                    }
                }
            },

            {"$group": {
                "_id": {
                    "cds": "$iscr_cds_desc",
                    "comune": "$iscr_nazione_residenza_desc"
                },
                "iscr_tipo_titolo_sup_desc": {
                    "$push": "$iscr_tipo_titolo_sup_desc"
                },
                "count": {
                    "$sum": 1
                }
            }},
            {"$unwind": "$iscr_tipo_titolo_sup_desc"},
            {
                "$group": {
                    "_id": {
                        "scuola": "$iscr_tipo_titolo_sup_desc",
                        "comune": "$_id.comune"
                    },
                    "iscr_tipo_titolo_sup_descCount": {
                        "$sum": 1
                    },
                    "iscr_cds_desc": {
                        "$push": {
                            "cds": "$_id.cds",
                            "cdsCount": "$count"
                        }
                    }
                }
            },
            {"$unwind": "$iscr_cds_desc"},
            {
                "$group": {
                    "_id": "$_id.comune",
                    "scuoleSuperiori": {
                        "$addToSet": {
                            "scuola": "$_id.scuola",
                            "scuolaCount": "$iscr_tipo_titolo_sup_descCount"
                        }
                    },
                    "CorsiUniversita": {
                        "$addToSet": "$iscr_cds_desc"
                    }
                }
            },
        ]):
            listaInfo.append(x)
        return listaInfo

    def test(self):
        pass
