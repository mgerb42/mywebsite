var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var fs = require('fs');
var jsdom = require("jsdom");
var async = require('async');

require('../models/currentdata');
var info = mongoose.model('currentdata');

require("../models/temperature");
var temperature = mongoose.model('temperature');

router.get('/discord', function(req, res, next) {

	res.redirect('https://discord.gg/0Z2tzxKECEj2BHwj');

});

router.get('/vpn', function(req, res, next){
	res.redirect('https://mitchellg.me:943');
});


/* GET home page. */
router.get('/', function(req, res, next) {

	renderIndex(res, {getPost : req.query.post, validation : {}});

});

router.post('/', function(req, res,next) {
	var serverTimeZone = 360;
	var clientTimeZone = req.body.timeZone;
	var timeZoneOffset = clientTimeZone - serverTimeZone;

	if (timeZoneOffset < 0){
		timeZoneOffset = timeZoneOffset/60;
	}
	else if (timeZoneOffset > 0){
		timeZoneOffset = timeZoneOffset/60;
	}
	
	var number = req.body.number;
	var date = req.body.date;
	var hours = req.body.hours;
	var minutes = req.body.minutes;
	var ampm = req.body.ampm;
	var message = req.body.message;
	var carrier = req.body.carrier;
	var invalid = {};
	var validInputs = true;

	

	var time = hours + ":" + minutes + ampm;

	if(!numberValidator(number)){
		invalid.number = 'Invalid Number';
		validInputs = false;
	}

	if(!dateValidator(date)){
		invalid.date = 'Invalid Date';
		validInputs = false;
	}

	if (!timeValidator(time)){
		invalid.time = "Invalid Time";
		validInputs = false;
	}

	if (validInputs == false){
		renderIndex(res, {validation: invalid});
	}

	else {
		number = number.replace("-", "");
		number = number.replace("-", "");
		number = number.concat(carrier);

		date = new Date(date);
		var newTime;

		//check to see if time zone sets back a day
		//if the time zone offset is greater than 24 hours and the offset is possitive
		//need to set date ahead a day
		if ((get24Hours(time) + timeZoneOffset) > 23){
			date.setDate(date.getDate() + 1);
			newTime = (get24Hours(time) + timeZoneOffset) - 24;
		}

		else if ((get24Hours(time) + timeZoneOffset) < 0){
			date.setDate(date.getDate() - 1);
			newTime = (get24Hours(time) + timeZoneOffset) + 24;
		}

		else {
			newTime = get24Hours(time) + timeZoneOffset;
		}

		date.setHours(newTime);
		date.setMinutes(getMinutes(time));
		
		var entry = new info({
			number: number,
			date: date,
			time: time,
			message: message
		});

		entry.save(function(err, entry) {
			if(err) return console.error(err);
			console.dir(entry);
		});

	  	res.render('success');
	}
});

module.exports = router;


function get24Hours(time){
	var getAMPM = time.substring((time.length - 2), time.length);
	var getHours = parseInt(time.substring(0,2));

	//if time is in the am and greater than 12:00am
	if (getAMPM == 'am' && getHours < 12){
		return (parseInt(time.substring(0,time.indexOf(':'))));
	}
	//if time is between 12:00am and 1:00am
	else if (getAMPM == 'am' && getHours == 12){
		return 0;
	}
	//return hours greater than 12
	else if (getAMPM == 'pm' && getHours < 12) {
		return (parseInt(time.substring(0,time.indexOf(':'))) + 12);
	}
	//return hour if noon
	if (getAMPM == 'pm' && getHours == 12) {
		return 12;
	}	
}

function getMinutes(time){
	var minutes = parseInt(time.substring(time.indexOf(':') + 1, time.length -2));
	return minutes;
}

function numberValidator(number){
	var re = /^\d{3}\-?\d{3}\-?\d{4}$/;
	return re.test(number);
}

function dateValidator(date){
	var re = /^\d{2}\/\d{2}\/\d{4}$/;
	return re.test(date);
}

function timeValidator(time){
	//var re = /^\d{1,2}\:\d{2}am$|^\d{1,2}\:\d{2}pm$/;
	var re = /^[0-9]\:[0-5][0-9]am$|^[0-9]\:[0-5][0-9]pm$|^1[0-2]\:[0-5][0-9]am$|^1[0-2]\:[0-5][0-9]pm$/;
	return re.test(time);
}


function renderIndex(res, json){

	if(typeof json.getPost == 'undefined'){

		getPosts(function(posts){
			res.render('index', {returnParameters : json, blogPosts : posts});
		});

	}

	else{
		res.render('index', {returnParameters : json});
	}


}

//function to get the posts - sorts them by birth time
//uses async to process them in order
//calls outerCB to process next iteration
function getPosts(callback){

	var dir = './public/posts';
	var posts = [];

	fs.readdir(dir, function(err, files){
		
		files.sort(function(a, b){
			return fs.statSync(dir + '/' + b).birthtime.getTime() -
                      fs.statSync(dir + '/' + a).birthtime.getTime();
		});
		
		async.eachSeries(files, function(file, outerCB){

			var data = fs.readFileSync(dir + '/' + file, 'utf8');
			var post = {};

				jsdom.env(data,["http://code.jquery.com/jquery.js"],function (err, window) {
					
					post.fileName = file;
					post.title = window.$("#title").text();
					post.date = window.$("#date").text();
					post.intro = window.$("#intro").text();

					posts.push(post);
					outerCB(null);
				});

		}, function(err){
			callback(posts);
		});
	});
}









