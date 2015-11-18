function onAppReady() {
    if( navigator.splashscreen && navigator.splashscreen.hide ) {
        navigator.splashscreen.hide() ;
    }

    $(function() {
        $( "body>[data-role='panel']" ).panel().enhanceWithin();
    });

    $('.gallery').flickity({
	  cellAlign: 'left',
	  contain: true
	});

    initialization();
}

document.addEventListener("app.Ready", onAppReady, false) ;

document.addEventListener("online", function() { }, false);

function onOnline() {
}

document.addEventListener("offline", function(){ alert("You are not connected with our server."); }, false);

$( document ).on( "mobileinit", function() {
    console.log("Car Wash initialization is started.");
    $.mobile.loader.prototype.options.text = "Menghubungkan Jaringan...";
    $.mobile.loader.prototype.options.textVisible = false;
    $.mobile.loader.prototype.options.theme = "a";
    $.mobile.loader.prototype.options.html = "";

    $(document).bind('keydown', function(event) {   
        if (event.keyCode == 27) { // 27 = 'Escape' keyCode (back button)
                event.preventDefault();
            }
    });

    console.log("Studiwidie initialization is ended.");
});

var api_url         = "http://api.carwash.app";
//var api_url         = "http://api.gogreencarwash.id";
var client_id       = "2d48ad81ef13471a99dccbf57981a27c";
var client_secret   = "4d3e131d2244763fec17955c4fb93d94";
var access_token    = window.localStorage.access_token;

var is_logged_in    = false;

function initialization () {
    //$.mobile.loading( "show" );
    if (access_token) {
        post_url = "/public_access";

        $.ajax({ type: 'POST', url: api_url + post_url + "?access_token=" + access_token, data: 
        {
            date: Date()
        },

        xhrFields: { withCredentials: true },
        
        success: function(data, textStatus ){
            if(data.error == false) {
                console.log("Login success");

                is_logged_in = true;
                logged_in(data);
            } else {
                window.localStorage.access_token = "";
                access_token = "";
                location.hash = "main-page";
                console.log(data.message);
                error_dialog(data.message);
            }
            $.mobile.loading( "hide" );
        },
        error: function(xhr, textStatus, errorThrown){ network_error(); $.mobile.loading( "hide" );  }
        });

    } else {
    };
}

function request_token_access (authorization_code) {
    $.mobile.loading( "show" );
    post_url = "/oauth/token";

    $.ajax({ type: 'POST', url: api_url + post_url, data: 
    {
        client_id: client_id,
        client_secret: client_secret,
        code: authorization_code.authorization_code,
        grant_type: "authorization_code"
    },

    xhrFields: { withCredentials: true },
    
    success: function(data, textStatus ){
        $.mobile.loading( "hide" );

        if(data.error == false) {
            console.log("Saving access_token");
            window.localStorage.access_token = data.access_token;
            access_token = data.access_token;
            initialization();
        } else {
            error_dialog(data.message);
            console.log(data.message);
        }
        $.mobile.loading( "hide" );
    },
    error: function(xhr, textStatus, errorThrown){ network_error(); $.mobile.loading( "hide" ); }
    });
}

function logged_in (data) {
    $.mobile.loading( "show" );
    $( "#last_cleaning" ).html( data.last_cleaning );
    $( "#next_cleaning" ).html( data.next_cleaning );

    $( "#panel_profile_picture" ).css( "background-image", "url("+data.user_data.picture_url+")" );
    $( "#panel_referral_code" ).html( data.user_data.referral_code );
    $( "#panel_email" ).html( data.user_data.email );

    $( "#home_header" ).css( "background-image", "url("+data.user_data.cover_url+")" );
    $( "#home_profile_picture" ).css( "background-image", "url("+data.user_data.picture_url+")" );
    $( "#home_full_name" ).html( data.user_data.full_name );
    $( "#home_address" ).html( data.user_data.address );
    $( "#home_car_number" ).html( data.member_cars );

    $( "#main_login_btn" ).html( "PROFILE" );
    $( "#main_create_account_btn" ).html( "LOGOUT" );

    $( "#info_content" ).html( data.info );
    $( "#price_content" ).html( data.price_list );
    $( "#news_content" ).html( data.news );

    $.mobile.loading( "hide" );
}

function error_dialog(message) {
  alert(message);
}

function network_error () {
    console.log("Network Error");
    alert("You are not conected with server. Please check your server!");
    navigator.app.exitApp();
}

// Button
$( document ).on( "vclick", "#main_login_btn", function() {
    if (is_logged_in) {
        $.mobile.changePage( "#home-page", { transition: "slide", changeHash: true });
    } else {
        $.mobile.changePage( "#login-page", { transition: "slide", changeHash: true });
    };
});

$( document ).on( "vclick", "#main_create_account_btn", function() {
    if (is_logged_in) {
        window.localStorage.access_token = "";
        $( "#main_login_btn" ).html( "LOGIN" );
        $( "#main_create_account_btn" ).html( "CREATE AN ACCOUNT" );
        is_logged_in = false;
        $("#main_create_account_btn").toggle();
        $("#or_1").toggle();
        $("#login_create_account_btn").toggle();
        $("#or_2").toggle();
    } else {
        $.mobile.changePage( "#registration-page", { transition: "slide", changeHash: true });
    };
});

$( document ).on( "vclick", "#login_login_btn", function() {
    $.mobile.loading( "show" );
    post_url = "/oauth/login";

    $.ajax({ type: 'POST', url: api_url + post_url, data: 
    {
        username: $( "#login_username_text" ).val(),
        password: $( "#login_password_text" ).val(),
        client_id: client_id
    },

    xhrFields: { withCredentials: true },
    
    success: function(data, textStatus ){
        if(data.error == false) {
            console.log("Authenticating apps");
            request_token_access(data);

            $("#main_create_account_btn").toggle();
            $("#or_1").toggle();
            $("#login_create_account_btn").toggle();
            $("#or_2").toggle();

            $.mobile.changePage( "#home-page", { transition: "slide", changeHash: true });
        } else {
            console.log(data.message);
            error_dialog(data.message);
        }

        $.mobile.loading( "hide" );
    },
    error: function(xhr, textStatus, errorThrown){ network_error(); $.mobile.loading( "hide" ); }
    });
});

$( document ).on( "vclick", "#panel_logout_menu", function() {
    if (is_logged_in) {
        window.localStorage.access_token = "";
        $( "#main_login_btn" ).html( "LOGIN" );
        $( "#main_create_account_btn" ).html( "CREATE AN ACCOUNT" );
        is_logged_in = false;
        $("#main_create_account_btn").toggle();
        $("#or_1").toggle();
        $("#login_create_account_btn").toggle();
        $("#or_2").toggle();
        $.mobile.changePage( "#main-page", { transition: "slide", changeHash: true });
    } else {
        $.mobile.changePage( "#registration-page", { transition: "slidetop", changeHash: true });
    };
});

$( document ).on( "vclick", "#register-button", function() {
    $.mobile.loading( "show" );

    post_url = "/login/register";
    nama     = $( "#daftar-nama" ).val();
    email    = $( "#daftar-email" ).val();
    username = $( "#daftar-username" ).val();
    password = $( "#daftar-password" ).val();
    passconf = $( "#daftar-passconf" ).val();

    $.ajax({ type: 'POST', url: api_url + post_url, data: 
        {
            nama: nama, 
            email: email,
            username: username, 
            password: password,
            passconf: passconf,
        },

        xhrFields: { withCredentials: true },
        
        success: function(data, textStatus ){
            $.mobile.loading( "hide" );
            // JSON response
            var obj = jQuery.parseJSON( data );

            if(obj.logged_in === true) {
                console.log("Registrasi berhasil");

                $('#login-notif').html(obj.notification);
                $('#login-popup').popup('open');

                window.localStorage.username = username;
                window.localStorage.password = password;

                set_nama( nama );

                setTimeout(function (){
                    location.hash = "home-page";
                }, 2000);
                
            } else {
                $.mobile.loading( "hide" );

                $('#login-notif').html(obj.notification);
                $('#login-popup').popup('open');

                console.log("Registrasi gagal, " . obj.notification);
            }
        },
        error: function(xhr, textStatus, errorThrown){ network_error(); $.mobile.loading( "hide" ); }
    });
});


// Page
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

$( document ).on( "pagecreate", "#mycar-page", function() {
    $.mobile.loading( "show" );
    post_url = "/user/mycars";

    $.ajax({ type: 'GET', url: api_url + post_url + "?access_token=" + access_token,

    xhrFields: { withCredentials: true },
    
    success: function(data, textStatus ){

        if(data.error == false) {
            $( "#mycar_list" ).html( data.member_car );
            $( "#mycar_list" ).listview( "refresh" );
            console.log("Car listed");
        } else {
            console.log(data.message);
        }
        $.mobile.loading( "hide" );
    },
    error: function(xhr, textStatus, errorThrown){ network_error(); $.mobile.loading( "hide" ); }
    });
});

$( document ).on( "pagebeforeshow", "#cleaning_detail-page", function() {
    $.mobile.loading( "show" );
    post_url = "/user/last_cleaning";

    $.ajax({ type: 'GET', url: api_url + post_url + "?access_token=" + access_token,

    xhrFields: { withCredentials: true },
    
    success: function(data, textStatus ){

        if(data.error == false) {
            $( "#cleaning_detail_time" ).html( data.time );
            $( "#cleaning_detail_date" ).html( data.date );
            $( "#cleaning_detail_year" ).html( data.year );
            $( "#cleaning_detail_status" ).html( data.status );
            $( "#cleaning_detail_address_1" ).html( data.address );
            $( "#cleaning_detail_address_2" ).html( data.address );

            var photo_before = data.photos_before;
            var photo_after = data.photos_after;
            var photos_before = '';
            var photos_after = '';

            if (photo_before) {
                for (var key in photo_before) {
                    photos_before = photos_before + '<li><img src="'+photo_before[key]+'" width="49%"></li>';
                }
            } else {
                photos_before = '<li><br />Not Available</li>';
            };

            if (photo_after) {
                for (var key in photo_after) {
                    photos_after = photos_after + '<li><img src="'+photo_after[key]+'" width="49%"></li>';
                }
            } else {
                photos_after = '<li><br />Not Available</li>';
            };
            

            $( "#cleaning_detail_photo_before" ).html( photos_before );
            $( "#cleaning_detail_photo_after" ).html( photos_after );

            $.mobile.loading( "hide" );
            console.log("Last cleaning photos request");
        } else {
            console.log(data.message);
        }
    },
    error: function(xhr, textStatus, errorThrown){ network_error(); }
    });
});

$( document ).on( "pagecreate", "#home-page", function() {
    $.mobile.loading( "show" );
    $( "#last_cleaning, #next_cleaning" ).listview( "refresh" );
    $.mobile.loading( "hide" );
    $( "#last_cleaning, #next_cleaning" ).listview( "refresh" );
});