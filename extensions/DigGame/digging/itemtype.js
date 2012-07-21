
var typeMap = {};

var registerEnum = function(type) {
    typeMap[type.itemTypeId] = type;
};

var findEnumById = function(id) {
    return typeMap[id];
};

var isValidId = function(id) {
    return typeMap.hasOwnProperty(id);
};

var itemTypes = function(itemTypeId, points, probabilityCutoff) {
    this.itemTypeId = itemTypeId;
    this.points = points;
    this.probabilityCutoff = probabilityCutoff;
    
    registerEnum(this);
};

var NOTHING = new itemTypes(-1, 0, 0);
var CHEAP = new itemTypes(0, 100, .7);
var GOOD = new itemTypes(1, 500, .5);
var GREAT = new itemTypes(2, 2500, .25);
var RARE = new itemTypes(3, 30000, .1);

var getRandomItemType = function() {
	var chance = Math.random();
	if (chance < RARE.probabilityCutoff) {
	    return RARE;
	} else if (chance < GREAT.probabilityCutoff) {
	    return GREAT;
	} else if (chance < GOOD.probabilityCutoff) {
	    return GOOD;
	} else if (chance < CHEAP.probabilityCutoff) {
	    return CHEAP;
	} else {
	    return NOTHING;
	}
};

var ItemType = function(itemTypeId, points, probabilityCutoff) {

    this.itemTypeId = itemTypeId;
    this.points = points;
    this.probabilityCutoff = probabilityCutoff;
    
    registerEnum(this);

};

itemTypes.prototype.getPoints = function() {
	return this.points;
};


itemTypes.prototype.getItemTypeId = function() {
    return this.itemTypeId;
};

module.exports = ItemType;
module.exports.getRandomItemType = getRandomItemType;