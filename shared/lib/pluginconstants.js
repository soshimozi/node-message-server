var pluginconstants = {
	DIG_HERE: 'd',
	INIT_ME: 'im',
	DONE_DIGGING:'dd',
	ERROR:'err',
	POSITION_UPDATE: 'pu',
	ACTION:'a',
	ADD_PLAYER:'ap',
	REMOVE_PLAYER:'rp',
	NAME:'name',
	PLAYER_LIST: 'pl',
    DURATION_MS: 2000,   // 2 seconds
    BOARD_WIDTH: 640,
    BOARD_HEIGHT: 480,
    NUM_ROWS: 12,
    NUM_COLS: 16,
    ITEM_FOUND:'f',
    ITEM_ID:'id',
    SCORE:'score',
    ALREADY_DIGGING:'AlreadyDigging',
    SPOT_ALREADY_DUG:'SpotAlreadyDug',
    X:'x',
    Y:'y'
};

if (typeof(window) === 'undefined') {
	module.exports.PLUGINCONSTANTS = pluginconstants;
} else {
	window.PluginConstants = pluginconstants;
}

