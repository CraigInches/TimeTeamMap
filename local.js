window.initMap = function() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 51.747615, lng: -1.314017},
     zoom: 6 
    });
    onLoad();
}

function onLoad() {
    var serverUrl = "https://services.xayto.net/TimeTeam/TimeTeam.json";
    var request = new XMLHttpRequest();
    request.addEventListener("load", parseJson);
    request.open('GET', serverUrl);
    request.send();
}

function parseJson (){
        try{
		var mapData = JSON.parse(this.responseText);
		var out='';
		for(var a in mapData){
			for(var b in mapData[a]){
				var z = b;
				for(var c in mapData[a][b]){
					for(var d in mapData[a][b][c]){
						var y = d;
						var x = mapData[a][b][c][d]["Title"];
						var w = mapData[a][b][c][d]["Location"];
						var v = mapData[a][b][c][d]["AirDate"];
						var timeteam = {season: z, episode: y, title: x, place: w, airdate: v, locale: {} };
						updateTable(timeteam);
						coOrds(timeteam);
					}
				}
			}
		}
	}
        catch(err){
            console.log(err);
        }
}

function updateTable(episode){
	var table = document.getElementById("Results");
	var newrow = table.insertRow();
	var seasonCell = newrow.insertCell(0);
	var seasonText = document.createTextNode(episode.season);
	seasonCell.appendChild(seasonText);
	var episodeCell = newrow.insertCell(1);
	var episodeText = document.createTextNode(episode.episode);
	episodeCell.appendChild(episodeText);
	var titleCell = newrow.insertCell(2);
	var titleText = document.createTextNode(episode.title);
	titleCell.appendChild(titleText);
	var placeCell = newrow.insertCell(3);
	var placeText = document.createTextNode(episode.place);
	placeCell.appendChild(placeText);
	var airCell = newrow.insertCell(4);
	var airText = document.createTextNode(episode.airdate);
	airCell.appendChild(airText);
}

function newEntry(episode, locale){
	var data = JSON.parse(locale.target.response);
	try{
		var location = data.results[0].geometry.location;
	}
	catch(err){
		console.log(episode);
	}
	episode.locale = location;
	createMarker(episode);
}

function coOrds(episode){
	var place = episode.place
	var url="https://maps.googleapis.com/maps/api/geocode/json?address=" + place + "&key=<API_KEY>";
    	var request = new XMLHttpRequest();
    	var response = 1;
    	var location = 1;
    	request.addEventListener("load", newEntry.bind(null, episode));
    	request.open('GET', url, true);
    	request.send();
    	return; 
}

function createMarker(timeTeam){
    var marker = new google.maps.Marker({
        map: map,
        position: timeTeam.locale,
        title: timeTeam.title});
    var infowindow = new google.maps.InfoWindow({
	    content: 
	    	"<div>"
	    	+ timeTeam.title + "<br>" 
	      	+ timeTeam.place + "<br>" 
	      	+ "Aired: " + timeTeam.airdate   + "<br>" 
    		+ "Season: " + timeTeam.season + "<br>" 
    		+ "Episode: " + timeTeam.episode + "<br></div>" });
    marker.setMap(map);
    marker.addListener('click', function() {
        infowindow.open(map, marker);});
}
