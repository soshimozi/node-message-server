

gameitem = function(game) {
	
	this.scaleX = .25;
	this.scaleY = .25;
	
	this._scaleMov = 0;
	
	this.game = game;
	
	this.position = {x: 0, y: 0};
	this._itemType = 0;
	this.textures = ['item1', 'item2', 'item3', 'item4'];
	this.offsets = [[-121, -45], [-37, -54], [-87, -87], [-185, -87]]
};

gameitem.prototype = new gameitem();
//gameitem.prototype.constructor=gameitem;
gameitem.prototype.setX = function(x) {
	this.position.x = x;
};
gameitem.prototype.setY = function(y) {
	this.position.y = y;
};
gameitem.prototype.update = function(gameTime) {
	var k = .25;
	var decay =  .8;
	
	this._scaleMov *= decay;
	this._scaleMov += (1 - this.scaleX) * k;
	
	this.scaleX = this.scaleY = this.scaleX + this._scaleMov;
};
gameitem.prototype.draw = function(gameTime, context) {

	if( this._itemType >= 0 && this._itemType < this.textures.length) {
		var img = this.game.getImage(this.textures[this._itemType]).image;
		
		var destWidth = img.width * this.scaleX;
		var destHeight = img.height * this.scaleY;
		
		var offset = this.offsets[this._itemType];
		
		context.drawImage(img, 0, 0, img.width, img.height, this.position.x + offset[0], this.position.y + offset[1], destWidth, destHeight);
	}
};
gameitem.prototype.setItemType = function(itemType) {
	this._itemType = itemType;
};