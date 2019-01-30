<?php
	# CSE 154
	# A6
	# Yingge He
	# 5-19-2016
	# This PHP server will generate a variety of data about different
	# books dependng on the parameters it is sent.
	$mode = $_GET["mode"];
	$title = $_GET["title"];

	if ($mode == "books") {
		loadBooks();
	} else if ($mode == "info") {
		loadInfo($title);
	} else if ($mode == "description") {
		loadDescription($title);
	} else {
		loadReviews($title);
	}

	# output all books as XML
	function loadBooks() {
		$dom = new DOMDocument();
		$books_tag = $dom->createElement("books");
		$dom->appendChild($books_tag);
		$books = scandir("books");
		for ($i=0; $i < 2; $i++) { // remove the first 2 indexes("." and "..")
			array_shift($books);
		}
		foreach ($books as $book) {
			$book_tag = $dom->createElement("book");
			$info = glob("books/".$book."/info.txt")[0];
			$title_tag = $dom->createElement("title");
			$title_tag->appendChild($dom->createTextNode(file($info, FILE_IGNORE_NEW_LINES)[0]));
			$book_tag->appendChild($title_tag);
			$folder_tag = $dom->createElement("folder");
			$folder_tag->appendChild($dom->createTextNode($book));
			$book_tag->appendChild($folder_tag);
			$books_tag->appendChild($book_tag);
		}
		header("Content-type: text/xml");
		print($dom->saveXML());
	}

	# output the infomation of the book as JSON
	function loadInfo($title) {
		list($title, $author, $stars) = file("books/".$title."/info.txt", FILE_IGNORE_NEW_LINES);
		$data = array(
			"title"=>$title,
			"author"=>$author,
			"stars"=>$stars,
		);
		header("Content-type: application/json");
		print json_encode($data); // parse JSON into string
	}

	# output the description of the book as plain text
	function loadDescription($title) {
		header("Content-type: text/plain");
		print file_get_contents("books/".$title."/description.txt");
	}

	# output the reviews of the book as HTML
	function loadReviews($title) {
		$reviews = glob("books/".$title."/review*.txt");
		foreach ($reviews as $review) {
			list($name, $stars, $text) = file($review, FILE_IGNORE_NEW_LINES);
?>
			<h3><?=$name ?><span><?=" ".$stars ?></span></h3>
			<p><?=$text ?></p>
<?php
		}
	}
?>