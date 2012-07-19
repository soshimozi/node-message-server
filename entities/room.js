var arrayhelper = require('../util/arrayhelper');

room = function(name) {
	this.arrayhelper = new arrayhelper();
	this.name = name;
	this.plugins = {};
	this.users = [];
};
 

room.prototype.loadPlugins = function(pluginRequests, engine) {
	
	for (var i=0; i<pluginRequests.length; i++) {
		
		var pluginRequest = pluginRequests[i];
		
		var extension = engine.getExtension(pluginRequest.extension);
		if (extension != null) {
			
			var plugin = extension.getPlugin(pluginRequest.pluginHandle);
			if (plugin != null) {
				var pluginInstance = require(plugin.path);
				this.plugins[pluginRequest.pluginName] = new pluginInstance(engine);
			}
		}
		
	}	
};

room.prototype.addUser = function(user) {
	this.users.push(user);	
};

room.prototype.removeUser = function(user) {
	this.arrayhelper.removeElement(this.users, user);	
};

room.prototype.getPlugin = function(name) {
	if (this.plugins.hasOwnProperty(name)) {
		return this.plugins[name];
	}
	
	return null;	
};

room.prototype.userEntered = function(user) {
	
	this.addUser(user);
	
	for (var pluginHandle in room.plugins) {
		var plugin = room.plugins[pluginHandle];
		plugin.userEnter(socket);
	}
	
};


module.exports = room;