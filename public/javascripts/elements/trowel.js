function trowel(game) {
	
	game.registerImage('trowel-animation-texture', '/images/trowel-dig-animation.png')
	game.registerImage('trowel-up', '/images/trowel-up.png');
	game.registerImage('trowel-down', '/images/trowel-down.png');
	
	var img = game.getImage('trowel-animation-texture').image;
	
	this._sprite = new bitwisegames.animatedSprite(
			img,
			Vector.create([0, 0]),
			16.0,
			Vector.create([0, 0]));
	
	var animation = new bitwisegames.frameAnimation(6, 40, 40, 0, 0, 10.0, false);
	this._sprite.animations['dig'] = animation;
	
	animation = new bitwisegames.frameAnimation(1, 40, 40, 0, 0, 2.0, false);
	this._sprite.animations['up'] = animation;
	
	animation = new bitwisegames.frameAnimation(1, 40, 40, 0, 41, 2.0, false);
	this._sprite.animations['down'] = animation;

	this._digging = false;
	this._sprite.setIsAnimating(false);
	this._sprite.setCurrentAnimationName('up');
};

trowel.prototype = {
	constructor:trowel,
	dig:function() {
		console.log('dig here!');
		this._sprite.setCurrentAnimationName('dig');
		this._sprite.setIsAnimating(true);
		this._digging = true;
	},
	stopDigging:function() {
		this._sprite.setCurrentAnimationName('up');
		this._sprite.setIsAnimating(false);
		this._digging = false;
	},
	getIsDigging:function() {
		return this._digging;
	},
	draw:function(gameTime, context) {
		this._sprite.update(gameTime);
		this._sprite.draw(gameTime, context)
	},
	getX:function() {
		return this._sprite.getX();
	},
	getY:function() {
		return this._sprite.getY();
	}
};