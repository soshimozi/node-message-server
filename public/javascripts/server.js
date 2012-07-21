var server = function() {

	this.handlers = {};
	this.socket = {};
	
	var self = this;
	
	this._hook = function() {
		
		// on connection to server, ask for user's name with an anonymous callback
		this.socket.on(messages.connect, function(){
			if( self.handlers.hasOwnProperty(Handlers.Connect) ) {
				self.handlers[Handlers.Connect](this, {});
			}
		});
		
		this.socket.on(messages.joinRoomEvent, function(resp) {
			resp = JSON.parse(resp);

			if( self.handlers.hasOwnProperty(Handlers.JoinRoomEvent) ) {
				self.handlers[Handlers.JoinRoomEvent](this, resp);
			}
		});
		
		this.socket.on(messages.pluginMessage, function(resp) {
			resp = JSON.parse(resp);

			if( self.handlers.hasOwnProperty(Handlers.PluginMessageEvent) ) {
				self.handlers[Handlers.PluginMessageEvent](this, resp);
			}
		});
		
		this.socket.on(messages.loginResponse, function(resp) {
			resp = JSON.parse(resp);

			if (self.handlers.hasOwnProperty(Handlers.LoginResponse)) {
				self.handlers[Handlers.LoginResponse](this, resp);
			}
		});
		
	};
	
};

server.prototype.connect = function(host, port) {
	this.socket = io.connect(host + ':' + port);	
	this._hook();
};

server.prototype.sendPluginMessage = function(pluginName, roomName, pluginData) {

	var pr = {
		payload:pluginData,
		room:roomName,
		zone:'',
		pluginName:pluginName
	};
		
	this.socket.emit(requests.pluginRequest, JSON.stringify(pr));
};

server.prototype.addEventListener = function(event, handler) {
	this.handlers[event] = handler;
};

server.prototype.registerHandler = function(message, handler) {
	this.handlers[message] = handler;
};

server.prototype.createPlugin = function(extension, pluginHandle, pluginName) {

	var pr = {
		extension:extension,
		pluginHandle:pluginHandle,
		pluginName:pluginName
	};
	
	return pr;
};

server.prototype.createRoom = function(zone, room, plugins) {

	// TODO: prototype message types
	var crr = {
			zone:zone,
			name:room,
			plugins:plugins
	};
	
	this.socket.emit(requests.createRoomRequest, JSON.stringify(crr));
};

server.prototype.login = function(name) {
	
	var lr = {
			user:name
	};
	
	this.socket.emit(requests.loginRequest, JSON.stringify(lr));
};
