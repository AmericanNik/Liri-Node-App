console.log(process.argv[2]+" "+process.argv[3]+" "+process.argv[4]);
const axios = require('axios');
var moment = require('moment');
const fs = require('fs');

require("dotenv").config();
var keys = require("./keys.js");


let Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);



let command = process.argv[2];
let parameter = process.argv[3];
let parameter2 = process.argv[4];

console.log()

function liriStart() {
  switch (command) {
    case 'concert-this':
      bandsInTown(parameter);
      break;
    case 'spotify-this-song':
      spotifySong(parameter);
      break;
    case 'movie-this':
      omdbSearch(parameter);
      break;
    case 'do-what-it-says':
      random();
      break;
    default:
    display("Undefined command, please check your spelling and try again.");
    break;
  }
}



function bandsInTown(parameter){


    	artist = parameter;
      console.log(artist);

  var queryUrl = "https://rest.bandsintown.com/artists/"+ artist +"/events?app_id=codingbootcamp";
  console.log(queryUrl);

  axios.get(queryUrl)
    .then(function (response) {
      let i = 0;


      response.data.forEach(function(element){
        dateTime = element.datetime;

        let year = dateTime.substring(0,4);
        let month = dateTime.substring(8,9);
        let day = dateTime.substring(5,7);
        let time = dateTime.substring(11,19);
        let venue = element.venue.name;
        let city = element.venue.city
        let date = month + "/" + day + "/" + year;

        let mTime = moment(dateTime.substring(0,10)).format();

        year = dateTime.substring(0,4);
        console.log("-----------"+artist+" event #:"+i+"------------------------------");
        console.log("Venue: " + venue);
        console.log("City: " + city);
        console.log("Date: " + date);
        console.log("Time: " + time);
        console.log(mTime);
        i++;

      });
  })
    .catch(function (error) {

      console.log(error);
    });
}

//spotify api

function spotifySong(parameter){

let searchSong;

  if(parameter === undefined){
    searchSong = "tacky";
  }else{
    searchSong = parameter;
  }

  spotify.search({
    type: 'track',
    query: searchSong
  }, function(error, data) {
    if (error) {
      display('Error recorded: ' + error);
      return;
    } else {
      console.log("\n---------------------------------------------------\n");
      console.log("Artist: " + data.tracks.items[0].artists[0].name);
      console.log("Song: " + data.tracks.items[0].name);
      console.log("Preview: " + data.tracks.items[3].preview_url);
      console.log("Album: " + data.tracks.items[0].album.name);
      console.log("\n---------------------------------------------------\n");

    }

  });

}

//omdb

function omdbSearch(parameter) {


  var findMovie;
  if (parameter === undefined) {
    findMovie = "Mr. Nobody";
  } else {
    findMovie = parameter;
  }

  var queryUrl = "http://www.omdbapi.com/?t=" + findMovie + "&y=&plot=short&apikey=trilogy";

  axios.get(queryUrl)
  .then(function (response) {
    // handle success
    movie = response.data;

        console.log("-----------------------------");
        console.log("Title: " + movie.Title);
        console.log("Release Year: " + movie.Year);
        console.log("IMDB Rating: " + movie.imdbRating);
        console.log("Rotten Tomatoes Rating: " + movie.Ratings[1].Value);
        console.log("Country: " + movie.Country);
        console.log("Language: " + movie.Language);
        console.log("Plot: " + movie.Plot);
        console.log("Actors: " + movie.Actors);
        console.log("-----------------------------");

  });
}

//random text

function random() {
 fs.readFile('random.txt',"utf8", function(error, data){

    var dataArr = data.split(",");
    if (dataArr[0] === "spotify-this-song") {
      let songcheck = dataArr[1]
      spotifySong(songcheck);
    }
    });
}


// function random() {
//  fs.readFile('random.txt', "utf8", function(error, data){
//
//     var dataArr = data.split(",");
//     if (dataArr[0] === "spotify-this-song") {
//       let songcheck = dataArr[1]
//       spotifySong(songcheck);
//     }
//     });
// }

liriStart();
