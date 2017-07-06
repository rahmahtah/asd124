var checkTime;

//Initialize function
var init = function () {
    // TODO:: Do your initialization job
    console.log('init() called');
    
    document.addEventListener('visibilitychange', function() {
        if(document.hidden){
            // Something you want to do when hide or exit.
        } else {
            // Something you want to do when resume.
        }
    });
 
    var vol = tizen.tvaudiocontrol.getVolume();
    
    // add eventListener for keydown
    document.addEventListener('keydown', function(e) {
    	document.getElementById("pres_but").innerHTML = e.keyCode;
    	switch(e.keyCode){
    	case 37: //LEFT arrow
    		break;
    	case 38: //UP arrow
    		break;
    	case 39: //RIGHT arrow
    		break;
    	case 40: //DOWN arrow
    		break;
    	case 13: //OK button
    		break;
    	case 10009: //RETURN button
		tizen.application.getCurrentApplication().exit();
    		break;
    	case 447: //vniz
    		if (vol > 0) { vol -= 1; }
    		tizen.tvaudiocontrol.setVolume(vol);
    		document.getElementById("vol_lvl").innerHTML = vol;
    		break;
    	case 448: //verh
    		if (vol < 100) { vol += 1; }
    		tizen.tvaudiocontrol.setVolume(vol);
    		document.getElementById("vol_lvl").innerHTML = vol;
    		break;
    	case 449: //mute
    		var curr_vol = tizen.tvaudiocontrol.getVolume();
    		if (curr_vol !== 0) {
    			vol = curr_vol;
    			tizen.tvaudiocontrol.setVolume(0);
    		} else {
    			tizen.tvaudiocontrol.setVolume(vol);
    			vol = 0;
    		}
    		document.getElementById("vol_lvl").innerHTML = vol;
    		break;
    	default:
    		console.log('Key code : ' + e.keyCode);
    		break;
    	}
    });
        
    var onVolumeChanged = function(volume) {
    	document.getElementById("vol_lvl").innerHTML = tizen.tvaudiocontrol.getVolume();
	};
    
	tizen.tvaudiocontrol.setVolumeChangeListener(onVolumeChanged);
	
    document.getElementById("tv_model").innerHTML = webapis.productinfo.getModel();
    document.getElementById("fw_ver").innerHTML = webapis.productinfo.getFirmware();
    document.getElementById("vol_lvl").innerHTML = tizen.tvaudiocontrol.getVolume();
    document.getElementById("ip_addr").innerHTML = webapis.network.getIp();
    
    var watchID = tizen.filesystem.addStorageStateChangeListener(onStorageStateChanged);
};

function onStorageStateChanged(storage) {
    if (storage.state == "MOUNTED") {
    	var asd = document.getElementById("usb_list");
    	asd.innerHTML = "MOUNTED " + storage.label;
    	tizen.filesystem.resolve(
    		    storage.label,
    		    function(dir) {
    		    	var onsuccess = function(files) {
    		    		console.log(files.length);
    		    		for (var i = 0; i < files.length; i++) {
    		    			name = files[i].name;
    		    			console.log(name);
    		    			if (name.match(/.*\.(mp4|avi|mkv)$/i)) {
    		    				asd.innerHTML += "<br /><button onclick=make_video_player(\"" + files[i].fullPath + "\")>Play video</button>" + files[i].name;
    		    			}
    		    			if (name.match(/.*\.(jpg|png|gif)$/i)) {
    		    				asd.innerHTML += "<br /><button onclick=make_image_viewer(\"" + files[i].fullPath + "\")>Show image</button>" + files[i].name;
    		    			}
    		    		}
					};
					var onerror = function(e) {
						console.log("fadsfasf" + e);
					};
					dir.listFiles(onsuccess, onerror);
    		    }, 
    		    function(e) {
    		    	console.log(storage.label);
    		    	console.log("Error " + e.message);
    		    }, 
    		    "r"
    	);
//    	tizen.filesystem.resolve(storage.label, function(dir) {console.log("success");}, function(e) {console.log("error");});
    } else {
    	document.getElementById("usb_list").innerHTML = "UNMOUNTED " + storage.label;
    }
    	
}

function make_video_player(src) {
	document.getElementById("player").innerHTML = "<video src=\"" + src + "\" controls><br />";
}

function make_image_viewer(src) {
	document.getElementById("player").innerHTML = "<img src=\"" + src + "\"><br />";
}

// window.onload can work without <body onload="">
window.onload = init;

function startTime() {
    var today = new Date();
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();
    m = checkTime(m);
    s = checkTime(s);
    document.getElementById('divbutton1').innerHTML='Current time: ' + h + ':' + m + ':' + s;
    setTimeout(startTime, 10);
}

function checkTime(i) {
    if (i < 10) {
        i='0' + i;
    }
    return i;
}
