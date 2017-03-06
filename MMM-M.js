  /* Magic Mirror
    * Module: MMM-MLBStandings
    *
    * By John Wade
    * MIT Licensed.
    */
   
Module.register("MMM-M", {

       // Module config defaults.
       defaults: {
           key: "",
           updateInterval: 10 * 60 * 1000, // every 10 minutes
           animationSpeed: 5,
           initialLoadDelay: 10, // 0 seconds delay
           retryDelay: 2500,
           rotateInterval: 10 * 1000
       },

       // Define required scripts.
       getScripts: function() {
           return ["moment.js"];
       },
       
       getStyles: function() {
           return ["MMM-M.css"];
       },

       // Define start sequence.
       start: function() {
           Log.info("Starting module: " + this.name);

           // Set locale.
           moment.locale(config.language);
           this.today = "";
           this.movies = [];
           this.url = "https://www.amctheatres.com/movies";
           this.loaded = true;
           this.activeItem = 0;
           this.rotateInterval = null;
           this.scheduleUpdate();
       },

       getDom: function() {
       	
         var wrapper = document.createElement("div");
         wrapper.className = "wrapper";
         wrapper.style.maxWidth = this.config.maxWidth;

         var header = document.createElement("header");
         header.className = "header";
         header.innerHTML = "In Theaters Now";
         wrapper.appendChild(header);
         
         var keys = Object.keys(this.movies);
			if(keys.length > 0){
           	if(this.activeItem >= keys.length){
				this.activeItem = 0;
			}
           	var movie = this.movies[keys[this.activeItem]];
           	//var title = movie.Text.content;
           	var title = movie.attributes.alt;
           	var img = movie.attributes.dataset.src;
         
         var movieLogo = document.createElement("div");
         var movieIcon = document.createElement("img");
         movieIcon.src = movie.attributes.src;
         movieIcon.classList.add("imgDes");
         movieLogo.appendChild(movieIcon);
         wrapper.appendChild(movieLogo);
         
          var des = document.createElement("p");
         des.classList.add("small", "bright", "p");
         des.innerHTML = title;
         wrapper.appendChild(des);
         }
         return wrapper;
     },

       processMovies: function(data) {
           this.today = data.Today;
           this.movies = data;
           this.week = data.Week;
       },
       
       scheduleCarousel: function() {
       		console.log("Scheduling Movies...");
	   		this.rotateInterval = setInterval(() => {
				this.activeItem += 2;
				this.updateDom(this.config.animationSpeed);
			}, this.config.rotateInterval);
	   },

       scheduleUpdate: function() {
           setInterval(() => {
               this.getMovies();
           }, this.config.updateInterval);

           this.getMovies(this.config.initialLoadDelay);
       },

       getMovies: function() {
           this.sendSocketNotification('GET_M', this.url);
       },

       socketNotificationReceived: function(notification, payload) {
           if (notification === "M_RESULT") {
               this.processMovies(payload);
               if(this.rotateInterval == null){
			   	this.scheduleCarousel();
			   }
               this.updateDom(this.config.animationSpeed);
           }
       },

   });
