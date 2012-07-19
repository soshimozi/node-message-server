var pluginconstants = {
	DIG_HERE: 'DigHere',
	INIT_ME: 'InitMe',
	POSITION_UPDATE: 'PositionUpdate',
	ACTION:'Action',
	REMOVE_PLAYER:'RemovePlayer',
	NAME:'Name'
};

if (typeof(window) === 'undefined') {
	module.exports.PLUGINCONSTANTS = pluginconstants;
}

