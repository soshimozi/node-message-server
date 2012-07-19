
var messages = {
		connect:'connect',
		pluginMessageEvent:'pluginMessageEvent',
		joinRoomEvent:'joinRoomEvent',
		loginResponse:'loginResponse'
		};


var requests = {
	pluginRequest:'pluginRequest',
	createRoomRequest:'createRoomRequest',
	loginRequest:'loginRequest'
};

if (typeof(window) === 'undefined') {
	exports.MESSAGES = messages;
	exports.REQUESTS = requests;
}


