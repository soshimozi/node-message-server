bitwisegames.gameTime = function() {
	
	var now = new Date();
	
	this.start = now;
	this.lastFrameTime = now;
	this.thisFrameTime = now;
	
	this.update = function() { 
		this.lastFrameTime = this.thisFrameTime; 
		this.thisFrameTime = new Date(); 
	};
	
	this.elapsedGameTime = function() { 
		return new Date((new Date()).getTime() - this.lastFrameTime.getTime()); 
	};
};