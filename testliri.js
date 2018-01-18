//Liri will take in the following arguments
// * my-tweets
// * spotify-this-song
// * movie-this
// * do-what-it-says

require("dotenv").config();

//these add other programs to this one
var fs = require('fs'); //file system

var dataKeys = require("./keys.js");

var twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require('request');


var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);
var omdb = keys.omdb;

//______________ PICK USING SWITCH________________

var pick = function(caseData, functionData) {
	switch (caseData) {
		case 'my-tweets':
			getTweets();
			break;
		case 'spotify-this-song':
			getMeSpotify(functionData);
			break;
		case 'movie-this':
			getMeMovie(functionData);
			break;
		case 'do-what-it-says':
			doWhatItSays();
			break;
		default:
			console.log("Please type 'node liri' + one of the following commands:");
        console.log('> spotify-this-song + "song name"');
        console.log('> movie-this + "movie name"');
        console.log('> my-tweets: to view the latest tweets');
        console.log('> do-what-it-says: to view the latest tweets');
	}
}

//run this on load of js file
var runThis = function(argOne, argTwo) {
	pick(argOne, argTwo);
};

runThis(process.argv[2], process.argv[3]);


//____________  TWITTER  ______________________

var getTweets = function() {
	var client = new twitter(dataKeys.twitterKeys);

	var params = { screen_name: '1r1shaz', count: 20 };

	client.get('statuses/user_timeline', params, function(error, tweets, response) {

		if (!error) {
			var data = []; //empty array to hold twitter data
			for (var i = 0; i < tweets.length; i++) {
				data.push({
						'created at: ' : tweets[i].created_at,
						'Tweets: ' : tweets[i].text,
				});
			}
			console.log(data);
			writeToLog(data);
		}
	});
};


//___________  SPOTIFY  _______________________

// GET ARTIST 
var getArtistNames = function(artist) {
	return artist.name;
};

// GET SONG 
var getMeSpotify = function(songName) {
	//If it doesn't find a song, find Blink 182's What's my age again
	if (songName === undefined) {
		songName = 'The sign';
	};

	spotify.search({ type: 'track', query: songName }, function(err, data) {
		if (err) {
			console.log('Error occurred: ' + err);
			return;
		}

		var songs = data.tracks.items;
		var data = []; //empty array to hold data

		for (var i = 0; i < songs.length; i++) {
			data.push({
				'artist(s)': songs[i].artists.map(getArtistNames),
				'song name: ': songs[i].name,
				'preview song: ': songs[i].preview_url,
				'album: ': songs[i].album.name,
			});
		}
		console.log(data);
		writeToLog(data);
	});
};

//_________ OMDB ________________

var getMeMovie = function(movieName) {

	if (movieName === undefined) {
		movieName = 'Mr Nobody';
	}

	var urlHit = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=full&tomatoes=true&r=json";

	request(urlHit, function(error, response, body) {
		if (!error && response.statusCode == 200) {
			var data = [];
			var jsonData = JSON.parse(body);

			data.push({
			'Title: ' : jsonData.Title,
			'Year: ' : jsonData.Year,
			'Rated: ' : jsonData.Rated,
			'IMDB Rating: ' : jsonData.imdbRating,
			'Country: ' : jsonData.Country,
			'Language: ' : jsonData.Language,
			'Plot: ' : jsonData.Plot,
			'Actors: ' : jsonData.Actors,
			'Rotten Tomatoes Rating: ' : jsonData.tomatoRating,
			'Rotton Tomatoes URL: ' : jsonData.tomatoURL,
	});
			console.log(data);
			writeToLog(data);
}
	});

}

//_____________  WHAT I SAY ____________________

var doWhatItSays = function() {
	fs.readFile("random.txt", "utf8", function(error, data) {
		console.log(data);
		writeToLog(data);
		var dataArr = data.split(',')

		if (dataArr.length == 2) {
			pick(dataArr[0], dataArr[1]);
		} else if (dataArr.length == 1) {
			pick(dataArr[0]);
		}

	});
}


//__________ LOG _________________

var writeToLog = function(data) {
	fs.appendFile("log.txt", '\r\n\r\n');

	fs.appendFile("log.txt", JSON.stringify(data), function(err) {
		if (err) {
			return console.log(err);
		}

		console.log("log.txt was updated!");
	});
}