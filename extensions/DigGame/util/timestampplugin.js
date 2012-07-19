var constants = require('../../../shared/pluginconstants').PLUGINCONSTANTS;
var messages = require('../../../shared/lib/messages').MESSAGES;

var Plugin = function() {
	
	var request = function(engine, client, req) {
		
		console.log('Entered my cool script!');
		engine.sendToClient(client, messages.pluginMessageEvent, {random:'blah'});
	}

	//TODO: make this assignable from an xml file
	var getPluginName = function() {
		return 'user_getDetails';
	}

	var userEnter = function(username) {
		console.log(username + ' entered room ' + this.name);
	}

	var userExit = function(username) {
		console.log(username + ' left room ' + this.name);
	}

	this.request = request;
	this.name = getPluginName;
	this.userEnter = userEnter;
	this.userExit = userExit;
};