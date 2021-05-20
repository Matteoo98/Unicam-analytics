# ETL & DB DOCUMENTATION

In this documentation is possible to find all informations regarding the ETL process and the db configuration.

# Prerequisites
- Python 3.8 at least
- Docker
- pip
- MongoDB local or cloud
- Excel file

# Data source format
The Excel file must be in .xlsx or .xls format in order to be processed correctly.

Moreover the Excel file must have columns name equals to example.xlsx file located in the ETL-Config folder.

In particular the interested columns name that has to be equal are:
- iscr_comune_residenza_desc 
- provincia_residenza_sigla_55
- iscr_regione_residenza_desc
- iscr_nazione_residenza_desc

# Setting.json
Another important step in order to execute the ETL process or the server locally is to set the correct parameters in the file setting.json located in the ETL-Config folder.
In particular must be set these parameters:
- excel_name (the name of the excel file, example : example.xlsx)
- connection_url (the connection url to the MongoDB, example : 'mongodb://localhost:27017/' or "mongodb+srv://example:example@clusterexample.khf6a.mongodb.net/example?retryWrites=true&w=majority")
- db_name (the name of the target db)
- db_collection_for_excel (the name of the collection where all the rows of the excel has to be saved)
- db_collection_for_locations (the name of the collection where all the locations and their coordinates has to be saved)


# ETL execution
If you want to execute the ETL process you must need to read all the steps before.

If the environment is ready you have to do these steps:

in the root folder 
```
cd ETL-Config
```
build the docker image
```
docker build -t <your username>/unicam-analytics-etl .
```
run the docker image
```
docker run <your username>/unicam-analytics-etl 
```
the above task could take at least 2 hours.