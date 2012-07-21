
var textsprite = function(text) {
	
	this.fps = 60;
	this.frameLength = 1.0 / parseFloat(this.fps);
	
	this._text = text;
	this._fade = false;
	this._fadeCallback = null;
	this.timer = 0;
	this.alpha = 1.0;
	this.color = [255,255,0];
	this.font = 'Italic 20pt Arial Bold';
	this.position = [0, 0];
	this.textAlign = 'left';
	this.alphaDiff = 0.016;
	this._visible = true;
};

textsprite.prototype = new textsprite();

textsprite.prototype.draw = function(gameTime, context) {
	
	if (this._visible) {
		context.save();
		context.fillStyle = "rgba("+this.color[0]+","+this.color[1]+","+this.color[2]+","+this.alpha+")";
		context.font = this.font;
		context.textAlign = this.textAlign;
		context.fillText(this._text, this.position[0], this.position[1]);
		context.restore();
	}
};

textsprite.prototype.setAlpha = function(a) {
	this.alpha = a;
};

textsprite.prototype.setTextAlign = function(a) {
	this.textAlign = a;
};

textsprite.prototype.show = function() {
	this._visible = true;
};

textsprite.prototype.hide = function() {
	this._visible = false;
};

textsprite.prototype.setFadeTime = function(t) {
	
	var frames = parseFloat(t) * this.fps;
	
	console.log('frames: ' + frames);
	
	this.alphaDiff = 1.0 / parseFloat(frames);
	console.log('alphaDiff: ' + this.alphaDiff);
	
	//var frames = parseFloat(t) / this.frameLength;
	
	// now divide frames by 100
	
	//this.frameLength = parseFloat(t) / 20.0;
};

textsprite.prototype.setText = function(t) {
	this._text = t;
};

textsprite.prototype.setX = function(x) {
	this.position[0] = x;
};

textsprite.prototype.setY = function(y) {
	this.position[1] = y;
};

textsprite.prototype.setTextColor = function(r,g,b) {
	this.color = [r, g, b];
};

textsprite.prototype.setFont = function(f) {
	this.font = f;
};

textsprite.prototype.update = function(gameTime, context) {
	this.timer += parseFloat(gameTime.elapsedGameTime().getTime() / 1000);
	if (this.timer >= this.frameLength) {
		this.timer = 0;
		
		if (this._fade) {
			this.alpha = this.alpha - this.alphaDiff;
		
			if (this.alpha <= 0) {
				this.alpha = 0;

				this._fade = false;
				this._visible = false;
				//if (typeof(this._fadeCallback) === 'function') {
				//	this._fadeCallback();
				//}
			}
		}
	}
};

textsprite.prototype.fade = function(callback) {
	this._fade = true;
	this._fadeCallback = callback;
};