bitwisegames.inputHelperClass = function() {
	
};

var inputHelper = {};

//inputHelper.newState = null;
//inputHelper.oldState = null;

inputHelper.update = function(keyboard) {
	this.oldState = this.newState;
	this.newState = keyboard.getLastKeyState();
};

inputHelper.isNewKeyPress = function(key) {
	return (typeof(this.newState) === 'undefined' ? false : this.newState.isKeyDown(key) && (typeof(this.oldState) === 'undefined' ? true : this.oldState.isKeyUp(key)) );
};


inputHelper.isKeyDown = function(key) {
	return (typeof(this.newState) === 'undefined' ? false : this.newState.isKeyDown(key));
};
