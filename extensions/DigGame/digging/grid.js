var PluginConstants = require('../../../shared/lib/pluginconstants').PLUGINCONSTANTS;

var grid = function() {
	
	this.cellTakenYet = new Array(PluginConstants.NUM_ROWS * PluginConstants.NUM_COLS);
	
	for(var i=0; i<this.cellTakenYet.length; i++) {
		this.cellTakenYet[i] = false;
	}
	
	this.cellWidth = PluginConstants.BOARD_WIDTH / PluginConstants.NUM_COLS;
	this.cellHeight = PluginConstants.BOARD_HEIGHT / PluginConstants.NUM_ROWS;
	
	console.log('cell width: ' + this.cellWidth + ', cell height: ' + this.cellHeight);
};

grid.prototype.tryToTakeCell = function(x, y) {
    var row = this.getRow(x, y);
    var col = this.getCol(x, y);
    var cell = row * PluginConstants.NUM_COLS + col;
    if (cell < 0 || cell >= this.cellTakenYet.length) {
        return false;
    } else if (this.cellTakenYet[cell] == true) {
        return false;
    } else {
        this.cellTakenYet[cell] = true;
        return true;
    }
};

grid.prototype.getRow = function(x, y) {
    return parseInt(y / this.cellHeight);
};


grid.prototype.getCol = function(x, y) {
    return parseInt(x / this.cellWidth);
};

module.exports = grid;
