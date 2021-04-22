from flask import Flask, request
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


@app.route('/', methods=['GET'])
def home():
    return "Welcome"


if __name__ == "__main__":
    app.run(debug=True)
