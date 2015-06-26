var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
require('../models/currentdata');
var info = mongoose.model('currentdata');

/* GET home page. */
router.get('/', function(req, res, next) {
  	res.render('index');
});

router.post('/', function(req, res,next) {

	var number = req.body.number;
	var date = req.body.date;
	var time = req.body.time;
	var message = req.body.message;
	var carrier = req.body.carrier;
	var invalid = {};
	var validInputs = true;

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
		res.render('index', invalid);
	}
	else {
		number = number.replace("-", "");
		number = number.replace("-", "");
		number = number.concat(carrier);

		date = new Date(date);
		date.setHours(get24Hours(time));
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

	  	console.log(entry);
	  	res.render('index');
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