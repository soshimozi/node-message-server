var fs = require('fs')
  , messages = require('./shared/lib/messages').MESSAGES
  , requests = require('./shared/lib/messages').REQUESTS
  , roommanager = require('./roommanager')
  , usermanager = require('./usermanager')
  , extensionmanager = require('./extensionmanager')
  , arrayhelper = require('./util/arrayhelper');


var engine = function() {
	
	this.arrayhelper = new arrayhelper();
	this.plugins = {};
	this.usernames = {};
	this.rooms = {};
	this.clients = [];
	this.socket_manager = {};
	this.roommanager = new roommanager(this);
	this.extensionmanager = new extensionmanager();
	this.usermanager = new usermanager();
	
	this.leaveRoom = function(socket, name) {
		
		var room = this.roommanager.getRoom(name);
		if (room != null) {

			for (var pluginHandle in room.plugins) {
				var plugin = room.plugins[pluginHandle];
				plugin.userExit(this, socket);
			}
			
			socket.leave(room.name);
			socket.room = null;
			
			room.removeUser(socket.user);
				
			socket.emit(messages.leaveRoomEvent, JSON.stringify({result:true, room:{name:name}}));
		}
	};
	
	this.joinRoom = function(socket, name) {
		var room = this.roommanager.getRoom(name);
		if (room != null) {

			socket.join(room.name);
			socket.room = room;

			console.log('room found:');
			console.log(room);
			
			room.userEntered(socket.user);
			socket.emit(messages.joinRoomEvent, JSON.stringify({result:true, room:{name:name}}));
		}
	};
	
	this.createRoom = function(socket, name, plugins) {
		this.roommanager.createRoom(name, plugins);
		this.joinRoom(socket, name);
	};
	
	this.handleCreateRoom = function (socket, request) {
		if (this.isClientLoggedIn(socket)) {
			this.createRoom(socket, request.name, request.plugins);
		}
		
		// TODO: Maybe send error message back?
	};
	
	this.handlePluginRequest = function(socket, request) {
		if (this.isClientLoggedIn(socket)) {
			var room = this.roommanager.getRoom(request.room);
			if (room != null) {
		
				var plugin = room.getPlugin(request.pluginName);
				if (plugin != null) {
					plugin.request( socket, request);
				}
			}
		}
	};
	
	this.handleLoginRequest = function(socket, request) {
		if (!this.isClientLoggedIn(socket)) {
		
			var accepted = this.usermanager.addUser(request.user);
			if (accepted) {
				socket.user = this.usermanager.getUser(request.user);
			}
			
			socket.emit(messages.loginResponse, JSON.stringify({accepted:accepted}));
		}
	};
	
	this._hook = function() {
		
		var self = this;

		this.socket_manager.on('connection', function (client) {
			
			self.clients.push(client);
			
			
			console.log("Total clients: " + self.clients.length);
			
			client.on(requests.createRoomRequest, function(req) { 
				req = JSON.parse(req);
				self.handleCreateRoom(client, req);
			});
			
			client.on(requests.pluginRequest, function(req) {
				req = JSON.parse(req);
				self.handlePluginRequest(client, req);
			});
			
			client.on(requests.loginRequest, function(req) {
				req = JSON.parse(req);
				self.handleLoginRequest(client, req);
			});
			
			client.on('disconnect', function(){
				
				if (client.room != null) {
					console.log('about to leave room: ' + client.room.name);
					self.leaveRoom(client, client.room.name);
				}
				
				
				console.log("disconnect");		
			});
	
		});
		
	};

};

engine.prototype.isClientLoggedIn = function(client) {
	if (typeof(client.user) !== 'undefined' && client.user !== null) {
		return true;
	}
	
	return false;
};

engine.prototype.getExtension = function(name) {
	var extension = this.extensionmanager.getExtension(name);
	return extension;
};

engine.prototype.broadcastFiltered = function(clientFilter, message, payload) {
		
};
	
engine.prototype.broadcast = function(message, payload) {
		
};
	
engine.prototype.sendToRoom = function(room, message, payload) {
	this.socket_manager.in(room).emit(message, JSON.stringify(payload));
};

engine.prototype.sendToClient = function(client, message, payload) {
	client.emit(message, JSON.stringify(payload));	
};
	
engine.prototype.initialize = function(extension_directory) {
	this.extensionmanager.loadExtensions(extension_directory);	
};
	
engine.prototype.listen = function(server) {
		
	var io = require('socket.io').listen(server);
	
	io.configure( function(){
		io.set('log level', 1);
	});
		
	this.socket_manager = io.sockets;
	this._hook();
};
	
module.exports = engine;