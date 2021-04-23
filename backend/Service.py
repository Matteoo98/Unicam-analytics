from DatabaseManager import DatabaseManager


class Service:
    db = DatabaseManager()
    db.start_connection()

    def retrieveLocations(self, category, longitude,latitude, distance):
        if category == "comune":
            return self.db.retrieveIscrittiComune(longitude,latitude, distance)
        if category == "provincia":
            return self.db.retrieveIscrittiProvincia(longitude,latitude, distance)
        if category == "regione":
            return self.db.retrieveIscrittiRegione(longitude,latitude, distance)
        if category == "nazione":
            return self.db.retrieveIscrittiNazione(longitude,latitude, distance)
        return None

    def retrieveInfoFromCity(self, name, category):
        if category == "comune":
            return self.db.getInfoFromComune(name)
        if category == "provincia":
            return self.db.getInfoFromProvincia(name)
        if category == "regione":
            return self.db.getInfoFromRegione(name)
        if category == "nazione":
            return self.db.getInfoFromNazione(name)
        return None
