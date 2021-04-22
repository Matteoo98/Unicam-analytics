from backend.DatabaseManager import DatabaseManager


class Service:
    db = DatabaseManager()
    db.start_connection()

    def retrieveLocations(self, category, longitude, latitude, distance):
        if category == "comune":
            return self.db.retrieveIscrittiComune(category, longitude, latitude, distance)
        if category == "provincia":
            return self.db.retrieveIscrittiProvincia(category, longitude, latitude, distance)
        if category == "regione":
            return self.db.retrieveIscrittiRegione(category, longitude, latitude, distance)
        if category == "nazione":
            return self.db.retrieveIscrittiNazione(category, longitude, latitude, distance)
        return None
