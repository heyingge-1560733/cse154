// CSE 154
// A6
// Yingge He
// 5-19-2016
// This program will show a collections of books. When users click on
// one book, infomation about the book will be shown.
(function() {
	"use strict";

	// set up the page when window loads by displaying all books in the folder
	window.onload = function() {
		request(loadAllBooks, "books", "");
		document.getElementById("back").onclick = loadAllBooksHelper;
	};

	// a helper function to loadAllBooks
	function loadAllBooksHelper() {
		request(loadAllBooks, "books", "");
	}

	// add all books in the folder to the web page by processing response data
	function loadAllBooks() {
		document.getElementById("singlebook").style.display = "none"; // clear up allbooks div
		document.getElementById("allbooks").innerHTML = "";
		var books = this.responseXML.querySelectorAll("book");
		for (var i = 0; i < books.length; i++) {
			var title = books[i].querySelector("title").textContent;
			var folder = books[i].querySelector("folder").textContent;
			var img = document.createElement("img");
			img.src = "books/" + folder + "/cover.jpg";
			img.alt = title;
			img.id = folder;
			img.onclick = loadSingleBook;
			var p =document.createElement("p");
			p.innerHTML = title;
			p.id = folder;
			p.onclick = loadSingleBook;
			var div = document.createElement("div");
			div.appendChild(img);
			div.appendChild(p);
			document.getElementById("allbooks").appendChild(div);
		}
	}

	// display infomation on the web page of the book when being clicked
	function loadSingleBook() {
		document.getElementById("cover").src = "books/" + this.id + "/cover.jpg";
		document.getElementById("singlebook").style.display = "block";
		document.getElementById("allbooks").innerHTML = ""; // clear up "allbooks" div
		request(loadInfo, "info", this.id);
		request(loadDescription, "description", this.id);
		request(loadReviews, "reviews", this.id);
	}

	// add its title, author and stars to the page from response data
	function loadInfo() {
		var info = JSON.parse(this.responseText);
		document.getElementById("title").innerHTML = info.title;
		document.getElementById("author").innerHTML = info.author;
		document.getElementById("stars").innerHTML = info.stars;
	}

	// add its description to the page from response data
	function loadDescription() {
		document.getElementById("description").innerHTML = this.responseText;
	}

	// add its reviewers and their reviews to the page from response data
	function loadReviews() {
		document.getElementById("reviews").innerHTML = this.responseText;
	}

	// make a request to the server with given mode and title
	// run given function when receiving response
	function request(func, mode, title) {
		var ajax = new XMLHttpRequest();
		ajax.onload = func;
		var url = "https://webster.cs.washington.edu/students/heyingge/hw6" +
				  "/bestreads.php?mode=" + mode + "&title=" + title;
		ajax.open("GET", url, true);
		ajax.send();
	}
})();