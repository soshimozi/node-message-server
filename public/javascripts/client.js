var client = function() {

	this.handlers = {};
	this.socket = {};
	
	var client = this;
	
	this._hook = function() {
		
		// on connection to server, ask for user's name with an anonymous callback
		this.socket.on(messages.connect, function(){
			if( client.handlers.hasOwnProperty(Handlers.Connect) ) {
				client.handlers[Handlers.Connect](this, {});
			}
		});
		
		this.socket.on(messages.joinRoomEvent, function(resp) {
			resp = JSON.parse(resp);

			if( client.handlers.hasOwnProperty(Handlers.JoinRoomEvent) ) {
				client.handlers[Handlers.JoinRoomEvent](this, resp);
			}
		});
		
		this.socket.on(messages.pluginMessageEvent, function(resp) {
			resp = JSON.parse(resp);

			if( client.handlers.hasOwnProperty(Handlers.PluginMessageEvent) ) {
				client.handlers[Handlers.PluginMessageEvent](this, resp);
			}
		});
		
		this.socket.on(messages.loginResponse, function(resp) {
			resp = JSON.parse(resp);

			if (client.handlers.hasOwnProperty(Handlers.LoginResponse)) {
				client.handlers[Handlers.LoginResponse](this, resp);
			}
		});
		
	};
	
};

client.prototype.connect = function(host, port) {
	this.socket = io.connect(host + ':' + port);	
	this._hook();
};

client.prototype.sendPluginMessage = function(pluginName, roomName, pluginData) {

	var pr = {
		payload:pluginData,
		room:roomName,
		zone:'',
		pluginName:pluginName
	};
		
	this.socket.emit(requests.pluginRequest, JSON.stringify(pr));
};

client.prototype.registerHandler = function(message, handler) {
	this.handlers[message] = handler;
};

client.prototype.createPlugin = function(extension, pluginHandle, pluginName) {

	var pr = {
		extension:extension,
		pluginHandle:pluginHandle,
		pluginName:pluginName
	};
	
	return pr;
};

client.prototype.createRoom = function(zone, room, plugins) {

	// TODO: prototype message types
	var crr = {
			zone:zone,
			name:room,
			plugins:plugins
	};
	
	this.socket.emit(requests.createRoomRequest, JSON.stringify(crr));
};

client.prototype.login = function(name) {
	
	var lr = {
			user:name
	};
	
	this.socket.emit(requests.loginRequest, JSON.stringify(lr));
};
