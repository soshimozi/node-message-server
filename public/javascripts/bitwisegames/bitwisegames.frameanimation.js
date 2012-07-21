createRectangle = function(x, y, width, height) {
	var rect = {};
	rect.width = width;
	rect.height = height;
	rect.x = x;
	rect.y = y;
	
	rect.intersects = function(r) {
		return !(r.x > this.x + this.width || r.x + r.width < this.x || r.y > this.y + this.height || r.y + r.height < this.y);
	};
	
	return rect;
};

rectanglesIntersect = function(r1, r2) {
	return !(r1.x > r2.x + r2.width || r1.x + r1.width < r2.x || r1.y > r2.y + r2.height || r1.y + r1.height < r2.y);
};

bitwisegames.frameAnimation = function(numberOfFrames, frameWidth, frameHeight, xOffset, yOffset, fps, onetime) {
	
	this.currentFrame = 0;
	
	this.frameLength = parseFloat(Math.max(1.0 / parseFloat(fps), .001));
	this.timer = 0.0;
	this.xOffset = xOffset;
	this.yOffset = yOffset;
	this.frameWidth = frameWidth;
	this.onetime = onetime;
	this.onetime_fired = false;
	
	this.frames = [];
	
	for(var i=0; i < numberOfFrames; i++ ) {
		var rect = createRectangle(xOffset + (i * frameWidth), yOffset, frameWidth, frameHeight);
		this.frames[i] = rect;
	}
};

bitwisegames.frameAnimation.prototype.getFramesPerSecond = function() {
	return parseInt(1.0 / this.frameLength);
};

bitwisegames.frameAnimation.prototype.setFramesPerSecond = function(value) {
	this.frameLength = parseFloat(Math.max(1.0 / parseFloat(value), .001));
};

bitwisegames.frameAnimation.prototype.getCurrentRect = function() {
	return this.frames[this.currentFrame];
};

bitwisegames.frameAnimation.prototype.getCurrentFrame = function() {
	return this.currentFrame;
};

bitwisegames.frameAnimation.prototype.setCurrentFrame = function(value) {
	this.currentFrame = parseInt(Math.max(0, Math.min(this.frames.length - 1, parseInt(value))));
};

bitwisegames.frameAnimation.prototype.update = function(gameTime) {

	// TODO: make gameTime object smarter
	this.timer += parseFloat(gameTime.elapsedGameTime().getTime() / 1000);
	if (this.timer >= this.frameLength) {
		this.timer = 0;
		
		if (!this.onetime_fired) {
			this.currentFrame++;
			if (this.currentFrame >= this.frames.length) {
				this.currentFrame = 0;
				
				if (this.onetime) {
					this.onetime_fired = true;
				}
			}
		}
	}
};

bitwisegames.frameAnimation.prototype.clone = function() {
	return new bitwisegames.frameAnimation(this.frames.length, this.frameWidth, this.frameHeight, this.xOffset, this.yOffset);
};