# STATS-UNICAM#ESSE3

![Alt text](1.jpg?raw=true "Titolo")

The objective of this project is to perform data analysis on the data of Unicam ESSE3 dataset. 

The analysis must consider the information available in the main ESSE3 database to identify meaningful information.

The Main objectives are:
- Classify students enrolled in Unicam based on:
  - Academic course
  - Gender
  - Age
  - High school diploma
  - Location:
    -  State, Region, Province, City of provenience

 We have implemented a mobile application to dinamically visualize the provided analytics.

The user is able to visualize students based on the above classification criteria.
The visualization is implemented by means of a geolocation visualization (map). 

# Frontend

### Prerequisites

- NodeJS 14
- Expo 4.4.1
- npm 6.14.12


### Installation

Enter to the directory ./frontend/ and run via terminal
```bash
npm install
```

### Usage
Alway inside ./frontend/ directory, run

```bash
npm start
```



This will open the expo metro-bundler on your default browser, at this point you can choose different ways to start the application:

![Screenshot (3)](https://user-images.githubusercontent.com/56272257/116522645-b732eb00-a8d5-11eb-9b58-acdc2d0fba6c.png)


- run it on your physical device by shooting the QRcode through Expo Go app available on [Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent&hl=it&gl=US) or
[App Store](https://apps.apple.com/it/app/expo-go/id982107779)

- [Android Studio](https://developer.android.com/studio) or even [Xcode](https://developer.apple.com/documentation/xcode/running-your-app-in-the-simulator-or-on-a-device) simulator if you are on MacOS



Remember to allow the use of your geo-localization on your device after the first start.

If you are using your physical device, take care to be connected on the same network if you want to use it wireless via LAN, or choose TUNNEL if you are on different networks, finally LOCAL if you want to wire it to your computer (Android requires ADB permissions).

# How to run dockerized server locally
![Alt text](docs/diagrams/SystemArchitectureDocker.png?raw=true "dock")

## Architecture
The following system starts from the ETL procedure by which polishes the input data to finally put them in the MongoDB. 
The user, by the dedicated UI uses the controller API to ask for data. Those are provided by specific queries from the DB manager to the MongoDB, and then provided to the the controller.
## Prerequisites
The server is deployed on heroku and the expo app communicates with it, but if you want to run the server in your local machine, then you need to install:
- Docker
- Python 3.8 at least
## Usage
Then you have to get in the \backend folder and execute the following commands:
```bash
docker build -t <your username>/unicam-analytics .
```
(Don't forget the dot).
The above command uses the Dockerfile placed in the backend folder to create a docker image
the -t flag is used to give a name to the newly-created image.
This task may take up to 16 minutes to finish running, depending on your internet connection.

Run the below command to verify that you successfully built a docker image. If you see your image(unicam-analytics) listed there, that means it was successful.
```bash
docker image ls
```
Then let's run our image container
```bash
docker run -p 5000:5000 <your username>/unicam-analytics
```
In the above command the -p flag is used to publish a container’s port to the host.
Here, we’re mapping port 5000 inside our docker container to port 5000 on our host machine so that we can access the app at localhost:5000.
This allows you to test your app locally which will be hosted on http://localhost:5000.
End the server by pressing “Ctrl + C”.

# How to deploy dockerized server on heroku
![Alt text](docs/diagrams/SystemArchitectureHeroku.png?raw=true "herk")

## Architecture
The system basically works like the local one, but we have to consider that all the back-end is clustered in a Docker image and then uploaded on the Heroku server, to run remotely in a shared way.
## Prerequisites
Before to deploy your server on heroku you need to have:
- Docker 
- Heroku account
## Usage
If you want to build your server with docker and then deploy it on heroku follow these steps:
- build docker image of the program
```bash
docker build -t <your username>/unicam-analytics .
```
- login to heroku
```bash
heroku login
```
- sign into Container Registry
```bash
heroku container:login
```
- push your Docker-based app
```bash
heroku container:push web
```
- deploy the changes
```bash
heroku container:release web
```
# Execute ETL process
Here we describe the ETL procedure (if you use dark theme open the picture separately).
![Alt text](docs/diagrams/ETLdiagram.svg?raw=true "etl")
To remake the entire process with your own datasource see the [ETL documentation](backend/ETL-Config/help.MD)

## Authors
[Matteo Molteni](https://github.com/Matteoo98) 

[Mattia Romagnoli](https://github.com/Mattia-98) 

[Vittorio Rinaldi](https://github.com/victor356) 

[Tommaso Cippitelli](https://github.com/Tcippy) 


## License 
[MIT](https://choosealicense.com/licenses/mit/)
