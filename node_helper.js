/* Magic Mirror
    * Module: MMM-MLBStandings
    *
    * By Cowboysdude
    * MIT Licensed.
    */
const NodeHelper = require('node_helper');
fs = require('fs');
var striptags = require('striptags');
var request = require("request");
var cheerio = require('cheerio');
var himalaya = require('himalaya');
 
 module.exports = NodeHelper.create({
 	
 	 start: function() {
 	 	this.movies = {
            data: null
        };
        this.path = "modules/MMM-M/movies.json";
    	console.log("Starting module: " + this.name);
    },
  
  getMovies: function (url) {
  request({
            url: url,
            method: 'GET'
        }, (error, response, body) => {
  if (!error && response.statusCode == 200) {
       var $ = cheerio.load(body);
       var tempmovies = $('div[class="MoviePostersGrid-container row"]').html();
       var movies = striptags(tempmovies, '<img>');
    
       var result = himalaya.parse(movies);
       this.sendSocketNotification('M_RESULT',result);
         this.movies.data = result;
     console.log(result);    
          this.fileWrite();
        }
      });
         },
    
   fileWrite: function() {
        fs.writeFile(this.path, JSON.stringify(this.movies.data) , function(err) {
            if (err) {
                return console.log(err);
            }
            console.log("The movie file was saved!");
        });
         
    },
    

 socketNotificationReceived: function(notification, payload) {
        if (notification === 'GET_M') {
                this.getMovies(payload);
            }
        }
    });