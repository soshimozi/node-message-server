

arrayhelper = function() {
	
};


arrayhelper.prototype.find = function(array, comp) {
	
	var retval = [];
	
	for(var key in array) {
		if (comp(array[key])) {
			retval.push(array[key]);
		}
	}
	
	return retval;
};


arrayhelper.prototype.findOneOrDefault = function(array, comp) {
	
	var found = null;

	for(var key in array) {
		if (comp(array[key])) {
			found = array[key];
			break;
		}
	}
	
	return found;
};

arrayhelper.prototype.removeElement = function(array, element) {

	var found = -1;
	for(var i=0; i<array.length; i++) {
		if (array[i] == element) {
			found = i;
			break;
		}
	}
	
	if (found != -1) {
		array.splice(found, 1);
	}
	
};
