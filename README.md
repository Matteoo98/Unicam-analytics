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

# Prerequisites

- NodeJS 14
- Expo 4.4.1
- npm 6.14.12


# Installation

Enter to the directory ./frontend/ and run via terminal
```bash
npm install
```

# Usage
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
The server is deployed on heroku and the expo app communicate with it, but if you want to run the server in your local machine, then you need:
- Docker
- Python 3.8 at least

Then you have to enter in the backend folder and execute the following commands:
```bash
docker build -t <your username>/unicam-analytics .
```
The above command usese the Dockerfile placed in the backend folder to create a docker image
```bash
docker run -it -p 5000:5000 <your username>/unicam-analytics
```
In the above command the -p flag is used to publish a container’s port to the host. Here, we’re mapping port 5000 inside our docker container to port 5000 on our host machine so that we can access the app at localhost:5000,
The -d flag runs the container in background and prints the container ID.
This allows you to test your app locally. Which will be hosted on http://localhost:5000.
End the server by pressing “Ctrl + C”.

## Authors
[Matteo Molteni](https://github.com/Matteoo98) 

[Mattia Romagnoli](https://github.com/Mattia-98) 

[Vittorio Rinaldi](https://github.com/victor356) 

[Tommaso Cippitelli](https://github.com/Tcippy) 


## License 
[MIT](https://choosealicense.com/licenses/mit/)
