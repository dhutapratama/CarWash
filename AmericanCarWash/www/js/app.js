function onAppReady() {
    if( navigator.splashscreen && navigator.splashscreen.hide ) {
        navigator.splashscreen.hide() ;
    }

    $("#glide").glide({
        type: "carousel"
    });

    $(function() {
        $( "body>[data-role='panel']" ).panel().enhanceWithin();
    });


}
document.addEventListener("app.Ready", onAppReady, false) ;

$( document ).on( "pagecreate", "#map-page", function() {
	var map;
	var markers = [];
	var center = {lat: -6.1826977, lng: 106.7883417};
    var acw_1 = {lat: -6.1816177, lng: 106.7883417};
    var acw_2 = {lat: -6.1826277, lng: 106.7883317};
    var acw_3 = {lat: -6.1836377, lng: 106.7883217};
    var acw_4 = {lat: -6.1846477, lng: 106.7883117};

	//initMap();

	function initMap() {
		map = new google.maps.Map(document.getElementById('map-canvas'), {
			zoom: 15,
			center: center,
			mapTypeId: google.maps.MapTypeId.TERRAIN
		});

		// This event listener will call addMarker() when the map is clicked.
		map.addListener('click', function(event) {
			addMarker(event.latLng);
		});

		// Adds a marker at the center of the map.
		//addMarker(center);
		addMarker(acw_1, "Spot A");
		addMarker(acw_2, "Spot B");
		addMarker(acw_3, "Spot C");
		addMarker(acw_4, "Spot D");
	}

	// Adds a marker to the map and push to the array.

	function addMarker(location, labelname) {
		var image = 'http://google-maps-icons.googlecode.com/files/carrepair.png';

		var marker = new google.maps.Marker({
			position: location,
			map: map,
			label: labelname,
			title: labelname,
			icon: image
		});
		markers.push(marker);
	}

	// Sets the map on all markers in the array.
	function setMapOnAll(map) {
		for (var i = 0; i < markers.length; i++) {
			markers[i].setMap(map);
		}
	}

	// Removes the markers from the map, but keeps them in the array.
	function clearMarkers() {
		setMapOnAll(null);
	}

	// Shows any markers currently in the array.
	function showMarkers() {
		setMapOnAll(map);
	}

	// Deletes all markers in the array by removing references to them.
	function deleteMarkers() {
		clearMarkers();
		markers = [];
	}

	var defaultLatLng = new google.maps.LatLng(-6.1826977, 106.7883417);  // Default to Hollywood, CA when no geolocation support

	if ( navigator.geolocation ) {
		function success(pos) {
			// Location found, show map with these coordinates
			drawMap(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
		}

		function fail(error) {
			drawMap(defaultLatLng);  // Failed to find location, show default map
		}

		// Find the users current position.  Cache the location for 5 minutes, timeout after 6 seconds
		navigator.geolocation.getCurrentPosition(success, fail, {maximumAge: 500000, enableHighAccuracy:true, timeout: 6000});
	} else {
		drawMap(defaultLatLng);  // No geolocation support, show default map
	}

	function drawMap(latlng) {
		var myOptions = {
			zoom: 15,
			center: latlng,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};

		var map = new google.maps.Map(document.getElementById("map-canvas"), myOptions);

		// Add an overlay to the map of current lat/lng
		var marker = new google.maps.Marker({
			position: latlng,
			map: map,
			title: "Greetings!"
		});
		addMarker(acw_1, "Spot A");
		addMarker(acw_2, "Spot B");
		addMarker(acw_3, "Spot C");
		addMarker(acw_4, "Spot D");
	}
});

$( document ).on( "pagechange", "#main-page", function() {
	$("#glide").glide({
        type: "carousel"
    });
});
