
var PlayerInfo = function(name) {

    this.name = name;
    this.digging = false;
    this.score = 0;
    this.x = -1;
    this.y = -1;
};

PlayerInfo.prototype.getPlayerName = function() {
    return this.name;
};

PlayerInfo.prototype.getScore = function() {
    return this.score;
};

PlayerInfo.prototype.isDigging = function() {
    return this.digging;
};

PlayerInfo.prototype.addToScore = function(newPoints) {
    this.score += newPoints;
    return this.score;
};

PlayerInfo.prototype.startDigging = function(x, y) {
    if (this.digging) {
        return false;
    } else {
    	this.digging = true;
        this.x = x;
        this.y = y;
        return true;
    }
};

PlayerInfo.prototype.stopDigging = function() {
    this.digging = false;
    this.x = -1;
    this.y = -1;
}


module.exports = PlayerInfo;
