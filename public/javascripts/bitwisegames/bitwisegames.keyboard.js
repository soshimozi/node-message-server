var KEY_UP = '0';
var KEY_DOWN = '1';
	
bitwisegames.keyboard = function() {
	var keyboard = this;
	
	this.key_states = {up:KEY_UP, down:KEY_UP, left:KEY_UP, right:KEY_UP, fire:KEY_UP, space:KEY_UP};
	
	this.getValue = function(key) {
		switch(key) {
		case 'up': return 38;
		case 'down': return 40;
		case 'left': return 37;
		case 'right': return 39;
		case 'fire': return 13;
		case 'space': return 32;
		}
	};
	
	this.getKeyName = function(key) {
		switch(key) {
		case 38: return 'up';
		case 40: return 'down';
		case 37: return 'left';
		case 39: return 'right';
		case 13: return 'fire';
		case 32: return 'space';
		}
		
		return '';
	};
	
	this.getLastKeyState = function() {

		var keys = {};
		for (var attr in this.key_states) {
			if (this.key_states.hasOwnProperty(attr)) 
				keys[attr] = this.key_states[attr];
		}			

		return { key_states:keys, isKeyDown:function(key) {
			return this.key_states[key] == KEY_DOWN ? true : false;
		}, isKeyUp:function(key) {
			return this.key_states[key] == KEY_UP ? true : false;
		}};
	};
	
  	window.addEventListener('keydown', 
							function(event) {
									
									event.preventDefault();
									
									var keyName = keyboard.getKeyName(event.keyCode);
									if( keyName != '' ) {
										keyboard.key_states[keyName] = KEY_DOWN;
									}
									
									return false;
								}, false);
  	
  	window.addEventListener('keyup', 
  							function(event) {
		
  								event.preventDefault();
		
								var keyName = keyboard.getKeyName(event.keyCode);
								if( keyName != '' ) {
									keyboard.key_states[keyName] = KEY_UP;
								}
								
								return false;
							}, false);
	
};

bitwisegames.keyboard.prototype.getLastKeyState = function() {
	return this.getLastKeyState();
};
