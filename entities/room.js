var arrayhelper = require('../util/arrayhelper');

room = function(name) {
	this.arrayhelper = new arrayhelper();
	this.name = name;
	this.plugins = {};
	this.users = [];
	
	this.getPluginList = function() {
		
		var list = [];
		for(var key in this.plugins) {
			list.push(this.plugins[key]);
		}
		return list;
	};
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

room.prototype.userExit = function(client) {

	var list = this.getPluginList().concat();
	
	if (list.length > 0) {

		var localClient = client;
		var localSelf = this;

		console.log(localClient);
		
	    setTimeout(function() {
	    	var plugin = list.shift();
	    	
	    	plugin.userExit(client);
	        if(list.length > 0) {
	            setTimeout(arguments.callee, 1);
	        } else {
	        	localSelf.removeUser(localClient.user)
	        }
	    }, 1);
		
	}
    
	
//	for (var pluginHandle in this.plugins) {
//		var plugin = this.plugins[pluginHandle];
//		plugin.userExit(client);
//	}
	
	this.removeUser(client.user);
};

room.prototype.userEnter = function(client) {
	
	this.addUser(client.user);
	
	var list = this.getPluginList().concat();
	
	if (list.length > 0) {

		var localClient = client;
		var localSelf = this;

	    setTimeout(function() {
	    	list.shift().userEnter(localClient);
	        if(list.length > 0) {
	            setTimeout(arguments.callee, 1);
	        } 
	    }, 1);
		
	}
	
//	for (var pluginHandle in this.plugins) {
//		var plugin = this.plugins[pluginHandle];
//		plugin.userEnter(client);
//	}
	
};


module.exports = room;