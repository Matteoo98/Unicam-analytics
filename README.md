# STATS-UNICAM#ESSE3

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

This will open the expo metro-bundler on your default browser, at this point you can choose different kinds of simulators:

- run it on your physical smartphone via previous installation of Expo Go app from [Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent&hl=it&gl=US) or
[App Store](https://apps.apple.com/it/app/expo-go/id982107779)

- [Android Studio](https://developer.android.com/studio) or even [Xcode](https://developer.apple.com/documentation/xcode/running-your-app-in-the-simulator-or-on-a-device) simulator if you are on MacOS

Remember to allow the use of your geo-localization on your device after the first start.

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License 
[MIT](https://choosealicense.com/licenses/mit/)
