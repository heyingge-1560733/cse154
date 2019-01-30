// CSE 154
// A3
// Yingge He
// 4-21-2016
// Split the input text into words and display them one by one to train reading speed.
// Click on buttons will respond to a change in style of word displayed.

(function() {
	"use strict";

	var list = []; // an array to store words that will be displayed
	var speed = 171; // the speed of animation
	var timer = null; // set up the timer

	window.onload = function() {
		document.getElementById("start").onclick = start;
		document.getElementById("stop").onclick = stop;
		document.getElementById("medium").onchange = changeSize;
		document.getElementById("big").onchange = changeSize;
		document.getElementById("bigger").onchange = changeSize;
		document.getElementById("speed").onchange = changeSpeed;
	};

	// start the animation
	function start() {
		var inputText = document.getElementById("inputText");
		list = inputText.value.split(/[ \t\n]+/);
		timer = setInterval(play, speed);
		document.getElementById("start").disabled = true;
		document.getElementById("stop").disabled = false;
		document.getElementById("inputText").disabled = true;
	}
	
	// stop the animation and return everything to default
	function stop() {
		var box = document.getElementById("display");
		box.innerHTML = "";
		clearInterval(timer);
		list = [];
		timer = null;
		document.getElementById("start").disabled = false;
		document.getElementById("stop").disabled = true;
		document.getElementById("inputText").disabled = false;
	}
	
	// display words in the array
	function play() {
		if (list.length == 0) {
			stop();
		} else {
			var str = list[0];
			var char = str.charAt(str.length - 1);
			if (char == ',' || char == '.' || char == '!' ||
				char == '?' || char == ';' || char == ':') {
				str = str.substring(0, str.length - 1);
				list[0] = str;
				list.unshift(str);
			}
			playOnce(str);
		}
	}
	
	// display the given word in the display box;
	function playOnce(str) {
		var box = document.getElementById("display");
		box.innerHTML = str;
		list.shift();
	}

	// change font size of text in the display box;
	function changeSize() {
		var box = document.getElementById("display");
		box.style.fontSize = this.value;
	}

	// change speed of animation in the display box;
	function changeSpeed() {
		speed = this.value;
		if (timer !== null) {
			clearInterval(timer);
			timer = setInterval(play, speed);
		}
	}
}());