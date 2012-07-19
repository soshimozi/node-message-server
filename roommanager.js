var messages = require('./shared/lib/messages').MESSAGES
  , requests = require('./shared/lib/messages').REQUESTS
  , roomentity = require('./entities/room');


roommanager = function(engine) {
	this.engine = engine;
	this.rooms = {};
	this.arrayhelper = new arrayhelper();
};


roommanager.prototype.createRoom = function(name, plugins) {

	var room = this.getRoom(name);
	if (room == null) {
		
		room = new roomentity(name);
		room.loadPlugins(plugins, this.engine);
		
		this.rooms[name] = room;		
	}
	
	return room;
};

roommanager.prototype.getRoom = function(name) {
	if (this.rooms.hasOwnProperty(name)) {
		return this.rooms[name];
	}
	
	return null;
};

module.exports = roommanager;