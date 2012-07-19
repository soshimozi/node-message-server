var PluginConstants = require('../../../shared/pluginconstants').PLUGINCONSTANTS;
var messages = require('../../../shared/lib/messages').MESSAGES;
var pluginbase = require('../../../pluginbase');

var DiggingPlugin = function(engine) {
	
	console.log('plugin constructor');
	
	this.engine = engine;
	
	this._handlePlayerInitRequest = function(client) {
		
	};
	
	this._handleDigHereRequest = function(client, message) {
		
	} ;
	
	this._relayMessage = function(client, message) {
		
	};
};


DiggingPlugin.prototype = new pluginbase();
DiggingPlugin.prototype.constructor=DiggingPlugin;

DiggingPlugin.prototype.request = function(client, req) {
	
	console.log('Entered my cool script!');
    console.log(client.user.name + " requests: " + req.payload.action);

    if (req.payload.action == PluginConstants.INIT_ME) {
        this._handlePlayerInitRequest(client);
    } else if (req.payload.action == PluginConstants.DIG_HERE) {
        this._handleDigHereRequest(client, req.payload);
    } else if (req.payload.action == PluginConstants.POSITION_UPDATE) {
        this._relayMessage(client, req.payload);
    }
    
	this.engine.sendToClient(client, messages.pluginMessageEvent, {random:'blah'});
};

//TODO: make this assignable from an xml file
DiggingPlugin.prototype.getPluginName = function() {
	return 'diggingplugin';
};

DiggingPlugin.prototype.userEnter = function(client) {
	console.log(client.user.name + ' entered room ' + client.room.name);
};

DiggingPlugin.prototype.userExit = function(client) {
	var msg = {};
	
	msg[PluginConstants.ACTION] = PluginConstants.REMOVE_PLAYER;
	msg[PluginConstants.NAME] = client.user.name;
    
	this.engine.sendToRoom(client.room.name, messages.pluginMessageEvent, msg);
	
	console.log(client.user.name + ' left room ' + client.room.name);
};

module.exports = DiggingPlugin;