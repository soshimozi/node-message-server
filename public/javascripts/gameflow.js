
function GameFlow(host, port, game) {
	//GameFlow = function(host, port) {
	
	var self = this;
	this._diggame = game;
	
	this.initialize = function() {
		
		//create a new ElectroServer instance
		this._server = new server();
		
		this._server.addEventListener(Handlers.Connect, function(socket, message) {
			self.onConnectionEvent(socket, message);
		});
		
		this._server.addEventListener(Handlers.LoginResponse, function(socket, message) {
			self.onLoginResponse(socket, message);
		});
		
		this._server.addEventListener(Handlers.ConnectionClosed, function(socket, message) {
			console.log("Connection closed.");
		});
		
		this._server.connect(host, port);		
	};
	
	this.onConnectionEvent = function(socket, message) {
		this._server.login(this._diggame.uid);
	};
	
	this.onLoginResponse = function(socket, message) {
		
		if (message.accepted) {
			this._diggame.server = this._server;
			this._diggame.initialize();
		} else {
			console.log("error loggin in");
		}		
	};
	
	this.initialize();
};
