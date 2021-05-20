import json
import logging
import time
import sys

import pandas as pd
import pymongo
from geopy import Nominatim
from pymongo import errors as mongoerrors

logging.basicConfig(
    format='%(asctime)s %(levelname)-8s %(message)s',
    level=logging.INFO,
    datefmt='%Y-%m-%d %H:%M:%S')
logger = logging.getLogger('ETL-Process')


def run():
    logger.info("Starting ETL process...")
    json_config = None
    df = None
    client = None
    db = None
    collection_locations = None
    collection_excel = None
    comuni = None
    province = None
    regioni = None
    nazioni = None
    with open('settings.json') as f:
        json_config = json.load(f)
    geolocator = Nominatim(user_agent="unicam_analytics")
    ###############################################################################################
    logger.info("Connecting to the target db...")
    try:
        client = pymongo.MongoClient(json_config['connection_url'])
        db = client[json_config['db_name']]
        collection_locations = db[json_config['db_collection_for_locations']]
        collection_excel = db[json_config['db_collection_for_excel']]
    except mongoerrors.PyMongoError:
        logger.error("Failed to connect to the target db")
        sys.exit(1)  # exiing with a non zero value is better for returning from an error
    logger.info("Successfully connected to the target db")
    ###############################################################################################
    logger.info("Reading excel...")
    try:
        df = pd.read_excel(json_config['excel_name'])
    except Exception as e:
        logger.error("Error :", e)
        sys.exit(1)  # exiing with a non zero value is better for returning from an error
    logger.info("Excel file read correctly")
    ######################################################################################################
    logger.info("Inserting whole excel file into " + json_config['db_collection_for_locations'] + " ...")
    try:
        collection_excel.insert_many(df.to_dict('records'))
    except mongoerrors.PyMongoError:
        logger.error("Failed to insert the excel in the collection")
        sys.exit(1)  # exiing with a non zero value is better for returning from an error
    logger.info("Excel file inserted correctly in the collection " + json_config['db_collection_for_locations'])
    ##############################################################################################################
    logger.info("Starting calculation coordinates phase...")
    comuni = df[['iscr_comune_residenza_desc', 'provincia_residenza_sigla_55',
                 'iscr_regione_residenza_desc']].drop_duplicates().dropna()
    regioni = df[['iscr_regione_residenza_desc', 'iscr_nazione_residenza_desc']].drop_duplicates().dropna()
    nazioni = df[['iscr_nazione_residenza_desc']].drop_duplicates()
    province = df[['provincia_residenza_sigla_55', 'iscr_regione_residenza_desc']].drop_duplicates().dropna()
    comuni = comuni.values.tolist()
    regioni = regioni.values.tolist()
    nazioni = nazioni.values.tolist()
    province = province.values.tolist()
    for x in comuni:
        location = None
        entry = collection_locations.find_one({"name": x[0]}, {"_id": 1, "location": 1, "category": 1})
        if entry is None:
            logger.info("calculate coordinates for :" + x[0] + " " + x[1] + " " + x[2])
            try:
                location = geolocator.geocode(x[0] + " " + x[1] + " " + x[2])
            except Exception as e:
                logger.error("Error :", e)
                sys.exit(1)  # exiing with a non zero value is better for returning from an error
            if location is not None:
                logger.info("found location for " + x[0] + " " + x[1] + " " + x[2])
                Dict = {"name": x[0],
                        "location": {"type": "Point", "coordinates": [location.longitude, location.latitude]},
                        "category": "comune"
                        }
                time.sleep(10)
                try:
                    collection_locations.insert_one(Dict)
                except mongoerrors.PyMongoError:
                    logger.error("Failed to insert the excel in the collection")
                    sys.exit(1)  # exiing with a non zero value is better for returning from an error
                logger.info("Location inserted in db : " + x[0])
                Dict.clear()
        else:
            logger.info("Location is already in the collection")
    for y in province:
        location = None
        entry = collection_locations.find_one({"name": y[0]}, {"_id": 1, "location": 1, "category": 1})
        if entry is None:
            logger.info("calculate coordinates for :" + y[0] + " " + y[1])
            try:
                location = geolocator.geocode(y[0] + " " + y[1])
            except Exception as e:
                logger.error("Error :", e)
                sys.exit(1)  # exiing with a non zero value is better for returning from an error
            if location is not None:
                logger.info("found location for " + y[0] + " " + y[1])
                Dict = {"name": y[0],
                        "location": {"type": "Point", "coordinates": [location.longitude, location.latitude]},
                        "category": "provincia"
                        }
                time.sleep(10)
                try:
                    collection_locations.insert_one(Dict)
                except mongoerrors.PyMongoError:
                    logger.error("Failed to insert the excel in the collection")
                    sys.exit(1)  # exiing with a non zero value is better for returning from an error
                logger.info("Location inserted in db : " + y[0])
                Dict.clear()
        else:
            logger.info("Location is already in the collection")
    for z in regioni:
        location = None
        entry = collection_locations.find_one({"name": z[0]}, {"_id": 1, "location": 1, "category": 1})
        if entry is None:
            logger.info("calculate coordinates for :" + z[0] + " " + z[1])
            try:
                location = geolocator.geocode(z[0] + " " + z[1])
            except Exception as e:
                logger.error("Error :", e)
                sys.exit(1)  # exiing with a non zero value is better for returning from an error
            if location is not None:
                logger.info("found location for " + z[0] + " " + z[1])
                Dict = {"name": z[0],
                        "location": {"type": "Point", "coordinates": [location.longitude, location.latitude]},
                        "category": "regione"
                        }
                time.sleep(10)
                try:
                    collection_locations.insert_one(Dict)
                except mongoerrors.PyMongoError:
                    logger.error("Failed to insert the excel in the collection")
                    sys.exit(1)  # exiing with a non zero value is better for returning from an error
                logger.info("Location inserted in db : " + z[0])
                Dict.clear()
        else:
            logger.info("Location is already in the collection")
    for w in nazioni:
        location = None
        entry = collection_locations.find_one({"name": w[0]}, {"_id": 1, "location": 1, "category": 1})
        if entry is None:
            logger.info("calculate coordinates for :" + w[0])
            try:
                location = geolocator.geocode(w[0])
            except Exception as e:
                logger.error("Error :", e)
                sys.exit(1)  # exiing with a non zero value is better for returning from an error
            if location is not None:
                logger.info("found location for " + w[0])
                Dict = {"name": w[0],
                        "location": {"type": "Point", "coordinates": [location.longitude, location.latitude]},
                        "category": "nazione"
                        }
                time.sleep(10)
                try:
                    collection_locations.insert_one(Dict)
                except mongoerrors.PyMongoError:
                    logger.error("Failed to insert the excel in the collection")
                    sys.exit(1)  # exiing with a non zero value is better for returning from an error
                logger.info("Location inserted in db : " + w[0])
                Dict.clear()
        else:
            logger.info("Location is already in the collection")
    logger.info("Finished calculation coordinates phase")
    ######################################################################
    logger.info("Creating 2dspehere index in the collection " + json_config['db_collection_for_locations'])
    try:
        collection_locations.create_index([(json_config['db_collection_for_locations'], "2dsphere")])
    except mongoerrors.PyMongoError:
        logger.error("Failed to create 2dspehere index in the collection " + json_config['db_collection_for_locations'])
        sys.exit(1)  # exiing with a non zero value is better for returning from an error
    #########################################################################
    logger.info("Finished ETL process !")


if __name__ == "__main__":
    run()
