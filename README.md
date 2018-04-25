# MovieDB

Simple REST API  interacting with [OMDb API](http://www.omdbapi.com/)

## Demo

[https://agile-dusk-33742.herokuapp.com/](https://agile-dusk-33742.herokuapp.com/)

## Endpoints

 - `/movies` - *GET* all movies ordered by *id*
 - `/movies?orderByTitle=asc` - *GET* all movies sorted by *title* in ascending order
 - `/movies?orderByTitle=desc` - *GET* all movies sorted by *title* in descending order
 - `/movies` - *POST* new movie; request body must contains movie *title* eg `{ "title": "Terminator" }`; returns created movie object
 - `/comments` - *GET* all comments
 - `/comments?movieId={int}` - *GET* all comments for a given *movie id*
 - `/comments` - *POST* new comment; request body must contains *movieId* and comment text *body* eg `{ "movieId": 1, "body": "Great movie!" }`; returns created comment object

## Requirements

 - `node 8.11+`
 - `npm 5.8.0+`

## Installation

 1. `git clone` this repo
 2. `cd` into created directory
 3. run `npm install`
 4. in root directory create `.env` file based on `.env.template` file or set environment variable
 5. run `npm start`

## ENV variables

 - `DATABASE_URL` - databse connection string eg. `postgresql://127.0.0.1:5432/moviedb`
 - `OMDB_API_KEY` - your OMDb API key
 - `TEST_DATABASE_URL` - *(optional)* test database connection string
