/*
	Return first of the arguments that is not null;
*/
function _coalesce( value1, value2 ) {
	if (value1 == null)	return value2;
	return value1;
}

/*
	Return HTML element by id.
*/
function _getById(id) {
	return document.getElementById(id);
}

/*
	Create new HTML element.
*/
function _create( parent, tag, content ) {
	var el = document.createElement(tag);
	el.innerHTML = content;	
	parent.appendChild(el);
	return el;
}

/*
	Remove element from an array.
*/
function _remove( arr, el ) {
	arr.splice( arr.indexOf( el ), 1 );
}

/*
	Copy elements from second array into the first.
*/
function _append( arr1, arr2 ) {
	if (!_isArray(arr1) && arr1 !== null) arr1 = [arr1];
	if (!_isArray(arr2) && arr2 !== null) arr2 = [arr2];
	for ( var i = 0, max = arr2.length; i < max; i++) {
		arr1.push(arr2[i]);
	} 
}

// adds an element to the array if it does not already exist
function _appendIfNotExist(arr1, arr2) { 
    for ( var i = 0, max = arr2.length; i < max; i++) {
		if (arr1.indexOf(arr2[i]) == -1) {
			arr1.push(arr2[i]);
		}
	} 
};

/*
	Returns random integer number between a and b.
*/
function _random( a, b ) {
	return a + Math.floor(Math.random() * (b - a));
}

/* 
	Returns true if probability check for n% succeeds.
	Example: _prob( 30 ) -- this will return true in 30% of cases.
*/
function _prob( n ) {
	return (Math.random() <= (n/100));
}

function _dynamicSort(property) {
    var sortOrder = 1;
    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a,b) {
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
}

function _round( num, digits ) {
	var x = Math.pow(10, _coalesce(digits, 2));
	return Math.round(num * x) / x;
}

function _b( b ) {
	return (b !== null) && (b != "0") && (b != "false") && b;
}

function _boolToInt(b) {
	return (b) ? 1 : 0; 
}

function _isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function _isObject( o ) {
	return ((o !== null) && (typeof o === 'object'));
}

function _isArray( a ) {
	return (Object.prototype.toString.call( a ) === '[object Array]' );
}

function _getArrayForSQL(arr) {
	var s = "";
	for (var i = 0,max = arr.length; i < max; i++) {
		if (_isNumeric(arr[i])) {
			s += arr[i] + ','
		} else {
			s+= '\'' + arr[i] + '\',';
		}
	}
	if (s.length > 0) {
		s = s.substr(0,s.length-1);
	}
	return s;
}

function _getJSON( url, onsuccess, onerror ) {
	var xmlhttp = new XMLHttpRequest();

	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
			var result;
			try {
				result = JSON.parse(xmlhttp.responseText);				
			} catch(e) {
				console.log("JSON parse error.");
				console.log(xmlhttp.responseText);
				if (onerror) {
					onerror();
				}
			}
			if (_isObject(result)) {
				onsuccess(result);
			}
		} else {			
			//console.log("JSON GET result: " + xmlhttp.status);			
		}
	}

	xmlhttp.open("GET", url, true);
	xmlhttp.send();
}

function _bind( scope, fn ) {
	return function () {
		fn.apply( scope, arguments );
	};
};

function _getTypeName (obj) { 
	if (_isObject(obj)) {
	   var funcNameRegex = /function (.{1,})\(/;
	   var results = (funcNameRegex).exec((obj).constructor.toString());
	   return (results && results.length > 1) ? results[1] : "";
	} else {
		return obj;
	}
};

/* VECTORS */

function _v(x, y, z) {
	return _arrayToVector([x,y,z]);
}

function _applyArrayToVector( v, arr ) {
	v.set( parseFloat(arr[0]), parseFloat(arr[1]), parseFloat(arr[2]) );
}

function _arrayToVector( arr ) {
	v = new THREE.Vector3();
	_applyArrayToVector( v, arr );
	return v;
}

function _vectorToArray( v ) {
	return [v.x,v.y,v.z];
}

function _getColorHex( style ) {
	var c = new THREE.Color();
	c.setStyle(style);
	return c.getHex();
}

function _randomColor() {
	return new THREE.Color(Math.random(),Math.random(),Math.random());	
}

function _randomColorHex() {
	return "#" + _randomColor().getHexString();
}

/* COOKIES */

function _createCookie(name, value, days) {
    var expires;

    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toGMTString();
    } else {
        expires = "";
    }
    document.cookie = encodeURIComponent(name) + "=" + encodeURIComponent(value) + expires + "; path=/";
}

function _readCookie(name) {
    var nameEQ = encodeURIComponent(name) + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
    }
    return null;
}

function _eraseCookie(name) {
    _createCookie(name, "", -1);
}