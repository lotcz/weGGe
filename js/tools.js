/*
	Return first of the arguments that is not null;
*/
function _coalesce( value1, value2 ) {
	if (value1 == null)	return value2;
	return value1;
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
	for ( var i = 0, max = arr2.length; i < max; i++) {
		arr1.push(arr2[i]);
	} 
}

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