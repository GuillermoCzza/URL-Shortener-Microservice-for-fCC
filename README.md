# URL Shortener Microservice

Node.js URL shortener webapp. en GETting the root ("/"), or the inputted date as a UNIX timestamp and as a string date (both as fields in a json) when GETting "/api/:date?/". The requested date may be a valid date string or a UNIX timestamp, and if left empty, it will default to the current time.

In order to choose the port and the MONGO_URI, you must fill them out in the .env file. The port is 3000 by default, and I've left the MONGO_URI variable empty for GitHub.
 
Made from freeCodeCamp's boilerplate code for the URL Shortener Microservice https://www.freecodecamp.org/learn/back-end-development-and-apis/back-end-development-and-apis-projects/url-shortener-microservice.
