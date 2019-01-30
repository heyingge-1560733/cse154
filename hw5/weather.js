// CSE 154
// A5
// Yingge He
// 5-12-2016
// This program will allow user to look up the weather and forecast of cities.

(function() {
	"use strict";

	var response; // the data (responseXML) about weather of input city

	// give events driven functions to buttons and request city list when the window loads.
	window.onload = function() {
		var input = document.getElementById("citiesinput");
		input.disabled = "disabled";
		request("cities");
		document.getElementById("search").onclick = search;
		document.getElementById("temp").onclick = showTemp;
		document.getElementById("precip").onclick = showPrecip;
	};

	// When search button is clicked, run this function.
	function search() {
		clearPage();
		loadingDisplay("block");
		var input = document.getElementById("citiesinput").value;
		document.getElementById("resultsarea").style.display = "block";
		request("oneday&city=" + input); // request data of current day weather
		request("week&city=" + input); // request forecast data
		showTemp();
	}

	// a request function used to send data and request XML from the server.
	function request(mode) {
		var ajax = new XMLHttpRequest();
		var keyWord = mode.split("&")[0];
		if (keyWord == "cities") {
			ajax.onload = loadCities;
		} else if (keyWord == "oneday") {
			ajax.onload = loadLocationHelper;
		} else {
			ajax.onload = loadForecastHelper;
		}
		var url = "https://webster.cs.washington.edu/cse154/weather.php?mode=" + mode;
		ajax.open("GET", url, true);
		ajax.send();
	}

	// load cities obtained from response text as options.
	function loadCities() {
		var cities = this.responseText.split("\n");
		for (var i = 0; i < cities.length; i++) {
			var option = document.createElement("option");
			option.innerHTML = cities[i];
			document.getElementById("cities").appendChild(option);
		}
		document.getElementById("citiesinput").disabled = 0;
		document.getElementById("loadingnames").style.display = "none";
	}

	// If an error occurs, it will be displayed on the page.
	// If not, load the infomation of city, time and description of weather.
	function loadLocationHelper() {
		if (this.status == 410) {
			document.getElementById("nodata").style.display = "block";
			loadingDisplay("none");
		} else if (this.status == 200) {
			response = this.responseXML;
			loadLocation();
		} else {
			var alert = "Sorry, we did not find what you want. Error " + this.status;
			document.getElementById("errors").innerHTML = alert;
			document.getElementById("resultsarea").style.display = "none";
		}			
	}

	// display name of the city, current time and description of weather
	function loadLocation() {
		var name = document.createElement("p");
		name.className = "title";
		name.innerHTML = response.querySelector("name").textContent;
		var date = document.createElement("p");
		date.innerHTML = Date();
		var description = document.createElement("p");
		description.innerHTML = response.querySelector("symbol").getAttribute("description");
		document.getElementById("location").appendChild(name);
		document.getElementById("location").appendChild(date);
		document.getElementById("location").appendChild(description);
		document.getElementById("loadinglocation").style.display = "none";
		loadGraph();
	}

	// load the graph area, including a slider and precipitation probability histograms.
	function loadGraph() {
		loadSlider();
		document.getElementById("buttons").style.display = "block";
		loadPrecip();
		document.getElementById("loadinggraph").style.display = "none";
	}
	
	// load the slider. The temperature which the slider shows represents the temperature
	// for the current day. Move the slder, the temperature will be updated.
	function loadSlider() {
		document.getElementById("slider").style.display = "block";
		document.getElementById("slider").onchange = slide;
		document.getElementById("slider").value = 0;
	}

	// load precipitation probability histograms.
	function loadPrecip() {
		var temp = response.querySelector("temperature").textContent;
		document.getElementById("currentTemp").innerHTML = Math.round(temp) + "&#8457";
		var chanceList = response.querySelectorAll("clouds");
		var tr = document.createElement("tr");
		for (var i = 0; i < 7; i++) {
			var td = document.createElement("td");
			var div = document.createElement("div");
			var chance = chanceList[i].getAttribute("chance");
			div.innerHTML = chance + "%";
			div.style.height = chance + "px"; //set heights for each column
			td.appendChild(div);
			tr.appendChild(td);
		}
		document.getElementById("graph").style.display = "none"; //hide the graph when loaded
		document.getElementById("graph").appendChild(tr); //append the histogram in html
	}

	// If an error occurs, it will be displayed on the page.
	// If not, load the infomation of weather forecast each day of the following week.
	function loadForecastHelper() {
		if (this.status == 410) {
			document.getElementById("nodata").style.display = "block";
			loadingDisplay("none");
		} else if (this.status == 200) {
			var data = JSON.parse(this.responseText).weather;
			loadForecast(data);
		} else {
			var alert = "Sorry, we did not find what you want. Error " + this.status;
			document.getElementById("errors").innerHTML = alert;
			document.getElementById("resultsarea").style.display = "none";
		}
	}

	// load the infomation of weather forecast each day of the following week.
	function loadForecast(data) {
		var row1 = document.createElement("tr"); // create two rows
		var row2 = document.createElement("tr");
		for (var i = 0; i < data.length; i++) { // add weather icons and temperatures in each row
			var img = document.createElement("img");
			img.src = "https://openweathermap.org/img/w/" + data[i].icon + ".png";
			img.alt = "weatherIcon";
			var td = document.createElement("td");
			td.appendChild(img);
			row1.appendChild(td);
			var div = document.createElement("div");
			div.innerHTML = Math.round(data[i].temperature) + "&#176";
			var td = document.createElement("td");
			td.appendChild(div);
			row2.appendChild(td);
		}
		document.getElementById("forecast").appendChild(row1); // append rows into html
		document.getElementById("forecast").appendChild(row2);
		document.getElementById("loadingforecast").style.display = "none";
	}

	// set up the functions for slider. At the furthest left position it should
	// show the current temperature. One position to the right it should show the
	// prediction for the next 3 hour block of time.
	function slide() {
		var list = response.querySelectorAll("temperature");
		var temp = list[this.value / 3].textContent;
		document.getElementById("currentTemp").innerHTML = Math.round(temp) + "&#8457";
	}

	// when clicking the "Precipitation" button, hides slider and show precipitation graph.
	function showTemp() {
		document.getElementById("temps").style.display = "block";
		document.getElementById("graph").style.display = "none";
	}

	// when clicking the "Temperature" button, hides precipitation graph and show slider.
	function showPrecip() {
		document.getElementById("temps").style.display = "none";
		document.getElementById("graph").style.display = "block";
	}

	// hide or display the selected loading icons 
	function loadingDisplay(display) {
		var loading = document.querySelectorAll(".loading");
		for (var i = 1; i < loading.length; i++) {
			loading[i].style.display = display;
		}
	}

	// clear all the weather infomation on the webpage page
	function clearPage() {
		document.getElementById("buttons").style.display = "none";
		document.getElementById("slider").style.display = "none";
		document.getElementById("nodata").style.display = "none";
		document.getElementById("location").innerHTML = "";
		document.getElementById("graph").innerHTML = "";
		document.getElementById("forecast").innerHTML = "";
	}
})();