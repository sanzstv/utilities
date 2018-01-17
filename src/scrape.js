let FileSaver = require('file-saver');

$('.submit').click(getUrl);
$('.download').click(downloadResults);

/*
 *	Returns a list of links from the web address
 *	provided by the user. Calls displayLinks function
 *  with list of anchor tags that were found.
 *
 *	Input is fetched from search bar. Clears previous results 
 *	so that a new search can be input and displayed.
 *
 */
function getUrl(){
	let url = $('#url-input').val();
	$('#results').empty();
	let links;
	let images;
	//regex to match anchor tags
	let link_regex = /<a.*>.*<\/a>/ig;

	$.get(url, function(response){
		links = response.match(link_regex);
		displayLinks(links, url);
	});
	return;
}

/*
 *	Formats url strings so that relative urls will be clickable
 *	using accessed url.
 *  Also sets target="_blank" to open in new tabs because there's gonna be a lot of links
 */

function formatUrl(url){
	let formatted = $('#results a:last');
	formatted[0].target="_blank";
	let file = /file:\/\//;
	formatted[0].href = formatted[0].href.replace(file, url);
	return;
}
/*
 *	Prepares links and displays them to end user in HTML.
 *
 *	If no links are passed in, display message.
 *
 *  Calls format url function to account for relative urls.
 */
function displayLinks(anchors, url){
	//none found
	if(anchors.length == 0){
		$('#results').innerHTML = "Sorry. No links were found on this page. Are you sure you typed the correct url?"
	}
	else{
		$('#results').innerHTML = `<h2>Results for ${url}</h2>`;
	}

	//go through anchors array, adding one by one to DOM.
	for(let i in anchors){
		$('#results').append(`${anchors[i]}<br/>`);
		formatUrl(url);
	}

	return;
}

/*
 *	Download links as a text file.	
 *
 *	Uses https://github.com/eligrey/FileSaver.js saveAs
 *	implementation to save file to computer.
 *
 */
function downloadResults(){

	//there are no links to display, download shouldn't work
	if($('#results').children().length == 0 ){
		window.alert('Please scrape a link first.')
		return;
	}
	let filename = "links";
	let body = $('#results').html();
	body = '<!DOCTYPE html><html lang ="en"><body>'+body+'</body></html>';
	let text_file = new Blob([body],{type: "text/plain;charset=utf-8"});
	FileSaver.saveAs(text_file, filename+".html");
	return;
}