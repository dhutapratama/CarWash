// Variable Initialization
var client_id           = '';
var client_secret       = '';
var code                = '';
var grant_type          = '';
var access_token        = '';

var api_url   = 'http://api.carwash.com'; // Production
//var api_url = 'http://api.americancarwash.com'; // Development

// For example:

// var el ;
// el = document.getElementById("id_myButton") ;
// el.addEventListener("click", myEventHandler, false) ;

function onAppReady() {
    if( navigator.splashscreen && navigator.splashscreen.hide ) {   // Cordova API detected
        navigator.splashscreen.hide();
        initialization();
    }
    
}
document.addEventListener("app.Ready", onAppReady, false) ;
//document.addEventListener("backbutton", onAppBackButton, false);
//document.addEventListener("resume", onResume, false);
//document.addEventListener("menubutton", onMenuKeyDown, false);
//document.addEventListener("online", online, false);
//document.addEventListener("offline", offline, false);
//document.addEventListener("volumeupbutton", onVolumeUpKeyDown, false);
//document.addEventListener("intel.xdk.camera.picture.add",onSuccess); 
//document.addEventListener("intel.xdk.camera.picture.busy",onSuccess); 
//document.addEventListener("intel.xdk.camera.picture.cancel",onSuccess); 
// document.addEventListener("deviceready", onAppReady, false) ;
// document.addEventListener("onload", onAppReady, false) ;

function exitApp() {
    navigator.app.exitApp();
}

$( document ).on( "vclick", "#goto-mycar", function() {
    location.hash = "mycar-page";
});

function onSuccess(evt) {

  if (evt.success == true)
  {
    alert(evt.filename);
    // create image 
    var image = document.createElement('img');
    image.src=intel.xdk.camera.getPictureURL(evt.filename);
    image.id=evt.filename;
    document.body.appendChild(image);

    $('#gambar').html("<img src="+intel.xdk.camera.getPictureURL(evt.filename)+" width='250' />");
  }
  else
  {
    if (evt.message != undefined)
    {
        alert(evt.message);
    }
    else
    {
        alert("error capturing picture");
    }
  }
}

function initialization() {
    $.mobile.loader.prototype.options.text          = "";
    $.mobile.loader.prototype.options.textVisible   = false;
    $.mobile.loader.prototype.options.theme         = "b";
    $.mobile.loader.prototype.options.html          = "";
    $(function() {
        $( "body>[data-role='panel']" ).panel().enhanceWithin();
    });
    
    /*
    var post_url = "/login";
	username = window.localStorage.username;
	password = window.localStorage.password;

	console.log("Login check with saved username & password in the localStorage.");

	$.ajax({ type: 'POST', url: api_url + post_url, data: 
        {
            username: username, 
            password: password,
        },

        xhrFields: { withCredentials: true },
        
        success: function(data, textStatus ){
            
            // JSON response
            var obj = jQuery.parseJSON( data );

            if(obj.logged_in === true) {
                console.log("Login berhasil, username & password localStorage benar.");

                set_nama(obj.nama);

                setTimeout(function (){
                    location.hash = "home-page";
                }, 2000);
            } else {
                console.log("Login gagal, username & password di localStorage salah.");

                setTimeout(function (){
                    location.hash = "public-page";
                }, 2000);
            }
        },
        error: function(xhr, textStatus, errorThrown){
            console.log("Network error");
            location.hash = "network-error";
        }
    });
    */
} 



$( document ).on( "vclick", "#exitApp", function() {
    //console.log("Exiting applications.");
    //ExitApp();
    //intel.xdk.camera.takePicture(10,true,"jpg");
});

// Logout
$( document ).on( "vclick", "#logout", function() {
    $.mobile.loading( "show" );

    post_url = "/login/logout";

    $.ajax({ type: 'POST', url: api_url + post_url, data: 
        {
            request: "logout"
        },
        
        success: function(data, textStatus ){
            $.mobile.loading( "hide" );
            // JSON response
            var obj = jQuery.parseJSON( data );

            if(obj.logged_in === false) {
                console.log("Logout berhasil.");

                $('#home-notif').html(obj.notification);
                $('#home-popup').popup('open');

                window.localStorage.username = '';
                window.localStorage.password = '';

                setTimeout(function (){
                    location.hash = "public-page";
                }, 2000);
                
            } else {
                $.mobile.loading( "hide" );

                $('#home-notif').html(obj.notification);
                $('#home-popup').popup('open');

                console.log("Logout gagal, server mengalami masalah.");
            }
        },
        error: function(xhr, textStatus, errorThrown){ network_error(); $.mobile.loading( "hide" ); }
    });
});    

// --------------------------------- Start Login Page ---------------------------------

$( document ).on( "vclick", "#login-button", function() {
    $.mobile.loading( "show" );

    post_url = "/login";
    username = $( "#login-username" ).val();
    password = $( "#login-password" ).val();

    $.ajax({ type: 'POST', url: api_url + post_url, data: 
        {
            username: username, 
            password: password,
        },

        xhrFields: { withCredentials: true },
        
        success: function(data, textStatus ){
            $.mobile.loading( "hide" );
            // JSON response
            var obj = jQuery.parseJSON( data );

            if(obj.logged_in === true) {
                console.log("Login berhasil, username & password disimpan ke localStorage.");

                $('#login-notif').html(obj.notification);
                $('#login-popup').popup('open');

                window.localStorage.username = username;
                window.localStorage.password = password;

                set_nama(obj.nama);
                reset_all_input();

                setTimeout(function (){
                    location.hash = "home-page";
                }, 2000);
                
            } else {
                $.mobile.loading( "hide" );

                $('#login-notif').html(obj.notification);
                $('#login-popup').popup('open');

                console.log("Login gagal, username & password salah.");
            }
        },
        error: function(xhr, textStatus, errorThrown){ network_error(); $.mobile.loading( "hide" ); }
    });
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
                console.log("Registrasi berhasil.");

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

$( document ).on( "pagecreate", "#map-page", function() {
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
                zoom: 10,
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
        }

    });