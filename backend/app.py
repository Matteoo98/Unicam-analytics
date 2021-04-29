from flask import Flask, request
import os
from Service import Service

app = Flask(__name__)
service = Service()


@app.route('/calculateLocations', methods=['GET'])
def giveLocations():
    category = request.args.get('category', type=str)
    longitude = request.args.get('longitude', type=float)
    latitude = request.args.get('latitude', type=float)
    distance = request.args.get('distance', type=float)
    lista = service.retrieveLocations(category, longitude, latitude, distance)
    for y in lista:
        y['_id'] = str(y['_id'])
    return {"lista": lista}


# @app.route('/giveInfoFromCity', methods=['GET'])
# def giveInfoFromCity():
#     name = request.args.get('name', type=str)
#     category = request.args.get('category', type=str)
#     lista = service.retrieveInfoFromCity(name, category)
#     for y in lista:
#         y['_id'] = str(y['_id'])
#     return {"lista": lista}


@app.route('/', methods=['GET'])
def home():
    return "Welcome"


if __name__ == "__main__":
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)