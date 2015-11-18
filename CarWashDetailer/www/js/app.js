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
document.addEventListener("offline", function(){ alert("You are not connected with our server."); }, false);

$( document ).on( "mobileinit", function() {
    console.log("Car Wash initialization is started.");
    $.mobile.loader.prototype.options.text = "Menghubungkan Jaringan...";
    $.mobile.loader.prototype.options.textVisible = false;
    $.mobile.loader.prototype.options.theme = "a";
    $.mobile.loader.prototype.options.html = "";

    initialization();
    console.log("Studiwidie initialization is ended.");
});

$(document).bind('keydown', function(event) {   
    if (event.keyCode == 27) { // 27 = 'Escape' keyCode (back button)
            event.preventDefault();
        }
});

//var api_url         = "http://api.carwash.app";
var api_url         = "http://api.gogreencarwash.id";
var client_id       = "35e3f6a2f8cb3dcf27c2192f699b2dd3";
var client_secret   = "49e2fef5ef86d29cf252763e8d30335d";
var access_token    = window.localStorage.access_token;

var is_logged_in    = false;
var request_list_id = 0;
var started         = false;

function initialization () {
    if (access_token) {
        $.mobile.loading( "show" );
        
        post_url = "/detailer";
        $.ajax({ type: 'POST', url: api_url + post_url + "?access_token=" + access_token, data: 
        {
            date: Date()
        },

        xhrFields: { withCredentials: true },
        
        success: function(data, textStatus ){
            if(data.error == false) {
                console.log("Login success");

                location.hash = "today_works-page";
                is_logged_in = true;
                logged_in(data);
            } else {
                window.localStorage.access_token = "";
                access_token = "main-page";
                console.log(data.message);
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
    post_url = "/user_oauth/token";

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
            console.log(data.message);
        }
        $.mobile.loading( "hide" );
    },
    error: function(xhr, textStatus, errorThrown){ network_error(); $.mobile.loading( "hide" ); }
    });
}

function logged_in (data) {
    $.mobile.loading( "show" );
    $( "#login_login_btn" ).html( "WORKS" );
    $( "#detailer_name" ).html( data.user_data.full_name );
    $( "#user_type" ).html( data.user_data.user_type + " - " + data.user_data.location );
    $( "#user_photo" ).css( "background-image", "url(" + data.user_data.picture_url + ")" );

    if (data.user_data.user_type_id == 2) {
        getEmployee();
        $( "#pick_user" ).css( "display", "block");
    } else {
        $( "#pick_user" ).css( "display", "none");
    }

    var html = '';

    if (data.worklist) {
        for (var key in data.worklist) {
            html = html + '<a href="#" class="worklist-link" data-work_id="' + data.worklist[key].id + '" id="worklist">' + "\n";
            html = html + '<div class="worklist-list">' + "\n";
            html = html + '<div class="worklist-list-id">' + "\n";
            html = html + '<div class="worklist-list-id-name">' + data.worklist[key].full_name + '</div>' + "\n";
            html = html + '<div class="worklist-list-id-address">' + data.worklist[key].location_name + '</div>' + "\n";
            html = html + '</div>' + "\n";
            html = html + '<div class="worklist-list-car">' + data.worklist[key].car_number + '</div>' + "\n";
            html = html + '<div class="worklist-list-status">' + data.worklist[key].status + '</div>' + "\n";
            html = html + '</div>' + "\n";
            html = html + '</a>' + "\n";
        }
    } else {
        html = '<div class="worklist-empty">No worklist today</div>';
    }

    $( "#work_list" ).html( html );

    $( "#today_works" ).html( ': ' + data.today_works );
    $( "#total_works" ).html( ': ' + data.total_works );
    
    $.mobile.loading( "hide" );
}

function getEmployee() {
    post_url = "/detailer/get_employee";

    $.ajax({ type: 'POST', url: api_url + post_url + "?access_token=" + access_token, data: 
    {
        get_employee: "please"
    },

    xhrFields: { withCredentials: true },
    
    success: function(data, textStatus ){
        html = "";
        for (var key in data.employee) {
            html = html + '<option value="' + data.employee[key].id + '">' + data.employee[key].full_name + '</option>';
        }

        $( "#pick_user" ).html( html );
    },
    error: function(xhr, textStatus, errorThrown){ network_error(); $.mobile.loading( "hide" ); }
    });
}

function error_dialog(message) {
  alert(message);
}

function network_error () {
    console.log("Network Error");
    alert("You are not conected with server. Please check your server!");
    $.mobile.loading( "hide" );
    navigator.app.exitApp();
}

function requestlogin() {
    $.mobile.loading( "show" );
    post_url = "/user_oauth/login";

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

            $( "#login_login_btn" ).html( "WORKS" );
            $.mobile.changePage( "#home-page", { transition: "slide", changeHash: true });
        } else {
            console.log(data.message);
            error_dialog(data.message);
            window.localStorage.access_token = "";
            is_logged_in = false;
        }

        $.mobile.loading( "hide" );
    },
    error: function(xhr, textStatus, errorThrown){ network_error(); $.mobile.loading( "hide" ); }
    });
}

function onSuccessBefore(imageURI) {
    post_url = "/detailer/image_update";
    $.ajax({ type: 'POST', url: api_url + post_url + "?access_token=" + access_token, data: 
    {
        request_list_id: request_list_id,
        photo_data: imageURI,
        is_after: '0'
    },

    xhrFields: { withCredentials: true },
    
    success: function(data, textStatus ){
        if(data.error == false) {
            console.log("update work data");
            get_cardata (data);
        } else {
            window.localStorage.access_token = "";
            access_token = "main-page";
            console.log(data.message);
        }
        $.mobile.loading( "hide" );
    },
    error: function(xhr, textStatus, errorThrown){ network_error(); $.mobile.loading( "hide" );  }
    });
}

function onSuccessAfter(imageURI) {
    post_url = "/detailer/image_update";
    $.ajax({ type: 'POST', url: api_url + post_url + "?access_token=" + access_token, data: 
    {
        request_list_id: request_list_id,
        photo_data: imageURI,
        is_after: '1'
    },

    xhrFields: { withCredentials: true },
    
    success: function(data, textStatus ){
        if(data.error == false) {
            console.log("update work data");
            get_cardata (data);
        } else {
            window.localStorage.access_token = "";
            access_token = "main-page";
            console.log(data.message);
        }
        $.mobile.loading( "hide" );
    },
    error: function(xhr, textStatus, errorThrown){ network_error(); $.mobile.loading( "hide" );  }
    });
}

function onFail(message) {
    alert('Failed because: ' + message);
}

function get_cardata (data) {
    $( "#list_car_number" ).html( data.car_number + ", " + data.car_detail );
    $( "#list_car_photo" ).css( "background-image", "url(" + data.car_photo + ")" );

    $( "#list_address" ).html( data.location_name );

    $( "#images_before" ).html( data.photos.before );
    $( "#images_after" ).html( data.photos.after );

    request_list_id = data.request_list_id;

    if (data.is_taken) {
        $( "#start_work" ).html( "Finish" );
    } else {
        $( "#start_work" ).html( "Start Working" );
        $( "#work_photos" ).css("display", "none");
    }
}

function startWork() {
    $.mobile.loading( "show" );
    console.log(api_url + post_url + "?access_token=" + access_token);
    post_url = "/detailer/start_working";
    $.ajax({ type: 'POST', url: api_url + post_url + "?access_token=" + access_token, data: 
    {
        request_list_id: request_list_id
    },

    xhrFields: { withCredentials: true },
    
    success: function(data, textStatus ){
        if(data.error == false) {
            console.log("get work data");
            $( "#start_work" ).html( "Finish" );
            $( "#work_photos" ).css("display", "block");
        } else {
            console.log(data.message);
        }
        $.mobile.loading( "hide" );
    },
    error: function(xhr, textStatus, errorThrown){ network_error(); $.mobile.loading( "hide" );  }
    });
}

function stopWork() {
    $.mobile.loading( "show" );
    console.log(api_url + post_url + "?access_token=" + access_token);
    post_url = "/detailer/finish_working";
    $.ajax({ type: 'POST', url: api_url + post_url + "?access_token=" + access_token, data: 
    {
        request_list_id: request_list_id
    },

    xhrFields: { withCredentials: true },
    
    success: function(data, textStatus ){
        if(data.error == false) {
            //alert(data.message);
            $.mobile.changePage( "#home-page", { transition: "slide", changeHash: true });
        } else {
            console.log(data.message);
        }
        $.mobile.loading( "hide" );
    },
    error: function(xhr, textStatus, errorThrown){ network_error(); $.mobile.loading( "hide" );  }
    });
}


// Button Action
$( document ).on( "vclick", "#login_login_btn", function() {
    if (is_logged_in) {
            $.mobile.changePage( "#today_works-page", { transition: "slide", changeHash: true });
    } else {
        requestlogin();
    };
});
 
$( document ).on( "vclick", "#capture_1", function() {
    navigator.camera.getPicture(onSuccessBefore, onFail, 
    { quality: 50,
    destinationType: Camera.DestinationType.DATA_URL });
});

$( document ).on( "vclick", "#capture_2", function() {
    navigator.camera.getPicture(onSuccessAfter, onFail, 
    { quality: 50,
    destinationType: Camera.DestinationType.DATA_URL });
});

$( document ).on( "vclick", "#worklist", function() {
    $.mobile.loading( "show" );
    console.log(api_url + post_url + "?access_token=" + access_token);
    post_url = "/detailer/workdetail";
    $.ajax({ type: 'POST', url: api_url + post_url + "?access_token=" + access_token, data: 
    {
        request_list_id: $( this ).data('work_id')
    },

    xhrFields: { withCredentials: true },
    
    success: function(data, textStatus ){
        if(data.error == false) {
            console.log("get work data");
            if (data.is_taken) {
                started = true;
            } else {
                started = false;
            }
            get_cardata (data);
            $.mobile.changePage( "#work_detail-page", { transition: "slide", changeHash: true });
        } else {
            window.localStorage.access_token = "";
            access_token = "main-page";
            console.log(data.message);
        }
        $.mobile.loading( "hide" );
    },
    error: function(xhr, textStatus, errorThrown){ network_error(); $.mobile.loading( "hide" );  }
    });
});

$( document ).on( "vclick", "#start_work", function() {
    if (started == false) {
        startWork();
    } else {
        stopWork();
    }
});

// Page

