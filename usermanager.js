
usermanager = function() {
	this.users = {};
};

usermanager.prototype.addUser = function(name, client) {
	
	console.log('add user:' + name);
	
	if (!this.users.hasOwnProperty(name)) {
		this.users[name] = {name:name, buddies:[], client: client};
		return true;
	}
	
	return false;
};

usermanager.prototype.getUser = function(name) {
	
	if (this.users.hasOwnProperty(name)) {
		return this.users[name];
	}
	
	return null;
};

module.exports = usermanager;