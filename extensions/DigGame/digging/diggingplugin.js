var PluginConstants = require('../../../shared/lib/pluginconstants').PLUGINCONSTANTS;
var messages = require('../../../shared/lib/messages').MESSAGES;
var pluginbase = require('../../../pluginbase');
var playerinfo = require('./playerinfo');
var grid = require('./grid');
var ItemType = require('./itemtype');

var DiggingPlugin = function(engine) {
	
	this.engine = engine;
	this.grid = new grid();
	this.playerInfoMap = {};
	this.delayQueue = [];
	
	this._handlePlayerInitRequest = function(client, message) {
		
        var message2 = {};
        
        message2[PluginConstants.ACTION] = PluginConstants.ADD_PLAYER;
        message2[PluginConstants.NAME] = client.user.name;
        
        this._sendAndLog("addUser", message2);

        // add the new user to the user list
        this.playerInfoMap[client.user.name] = new playerinfo(client.user.name);

        var playerListMessage = {};
        
        playerListMessage[PluginConstants.ACTION] = PluginConstants.PLAYER_LIST;
        playerListMessage[PluginConstants.PLAYER_LIST] = this.getFullPlayerList();
        
        this.engine.sendPluginMessageToUser(client.user.name, playerListMessage);
        
        console.log("Message sent to " + client.user.name + ": ");
        console.log(playerListMessage);
	};
	
	this.getFullPlayerList = function() {
		
		var list = [];
		for(var pid in this.playerInfoMap) {
			list.push(this.playerInfoMap[pid]);
		}
		return list;
	};
	
	this._handleDigHereRequest = function(client, message) {
        var pInfo = this.playerInfoMap[client.user.name];
        if (pInfo == null) {
            console.log("No user info found for " + client.user.name);
            return;
        } else if (pInfo.isDigging()) {
            this.sendErrorMessage(playerName, PluginConstants.ALREADY_DIGGING);
            return;
        } else {
            var x = message[PluginConstants.X];
            var y = message[PluginConstants.Y];
            console.log("row, col: " + this.grid.getRow(x, y) + ", " + 
                    this.grid.getCol(x, y));
            var okayToDigHere = this.grid.tryToTakeCell(x, y);
            if (okayToDigHere) {
                pInfo.startDigging(x, y);
                this.queueCallbackToFinishDigging(pInfo);
            } else {
                this.sendErrorMessage(client.user.name, PluginConstants.SPOT_ALREADY_DUG);
            }
        }		
	};
	
	this._handleDiggingFinished = function(pInfo) {
		
        var playerName = pInfo.getPlayerName();
        console.log("handleDiggingFinished: " + playerName);
        if (!this.playerInfoMap.hasOwnProperty(playerName)) {
            console.log(playerName + " already left the room");
            return;
        }

        var obj = {};
        
        obj[PluginConstants.ACTION] = PluginConstants.DONE_DIGGING;
        obj[PluginConstants.NAME] = playerName;

        var itemFound = ItemType.getRandomItemType();
        console.log(itemFound);
        
        pInfo.addToScore(itemFound.getPoints());
        
        var score = pInfo.getScore();
        var itemWasFound = itemFound.getPoints() != 0;

        obj[PluginConstants.SCORE] = score;
        obj[PluginConstants.ITEM_FOUND] = itemWasFound;
        obj[PluginConstants.ITEM_ID] = itemFound.getItemTypeId();

        pInfo.stopDigging();
        this._sendAndLog("handleDiggingFinished", obj);
	};
	
	this._relayMessage = function(client, message) {
		
	};
	
    this._sendAndLog = function(fromMethod, message) {
        var initializedPlayers = [];

        for (var pInfoId in this.playerInfoMap) {
        	var pInfo = this.playerInfoMap[pInfoId];
        	initializedPlayers.push(pInfo.getPlayerName());
        }

        if (initializedPlayers.length < 1) {
            return;     // nobody to send the message to
        }

        this.engine.sendPluginMessageToUsers(initializedPlayers, message);
        console.log(fromMethod + ": " + JSON.stringify(message));
    };	
    
    this.tickQueue = function() {
    	
        if (this.delayQueue.length == 0) {
            return;
        }
        
        try {
            var pInfo = this.delayQueue.shift();
            if (pInfo != null) {
                this._handleDiggingFinished(pInfo);
            }
        } catch (exception) {
            console.log("Exception while running tickQueue: " + exception);
        }
    };
    
    this.queueCallbackToFinishDigging = function(pInfo) {
    	
        var playerName = pInfo.getPlayerName();
        var self = this;
        
        console.log("Delayed message for " + playerName + " queued.");
        this.delayQueue.push(pInfo);
        var callback = setTimeout(function() {
            		self.tickQueue();
            }, PluginConstants.DURATION_MS);
            
        //pInfo.setCallBackId(callback);
    };
    
    this.sendErrorMessage = function(playerName, error) {
        var message = {};
        message[PluginConstants.ACTION] = PluginConstants.ERROR;
        message[PluginConstants.ERROR] = error;
        this.engine.sendPluginMessageToUser(playerName, message);
        console.log("Message sent to " + playerName + ": " + JSON.stringify(message));
    };    
};

DiggingPlugin.prototype = new pluginbase();
DiggingPlugin.prototype.constructor=DiggingPlugin;

DiggingPlugin.prototype.request = function(client, req) {
	
    console.log(client.user.name + " requests: " + req.payload[PluginConstants.ACTION]);

    if (req.payload[PluginConstants.ACTION] == PluginConstants.INIT_ME) {
        this._handlePlayerInitRequest(client, req.payload);
    } else if (req.payload[PluginConstants.ACTION] == PluginConstants.DIG_HERE) {
        this._handleDigHereRequest(client, req.payload);
    } else if (req.payload[PluginConstants.ACTION] == PluginConstants.POSITION_UPDATE) {
        this._relayMessage(client, req.payload);
    }
    
	//this.engine.sendToClient(client, messages.pluginMessageEvent, {random:'blah'});
};

//TODO: make this assignable from an xml file
DiggingPlugin.prototype.getPluginName = function() {
	return 'diggingplugin';
};

DiggingPlugin.prototype.userEnter = function(client) {
	console.log(client.user.name + ' entered room ' + client.room.name);
};

DiggingPlugin.prototype.userExit = function(client) {
	
    if (this.playerInfoMap.hasOwnProperty(client.user.name)) {
        delete this.playerInfoMap[client.user.name];
    }
    
	var msg = {};
	
	msg[PluginConstants.ACTION] = PluginConstants.REMOVE_PLAYER;
	msg[PluginConstants.NAME] = client.user.name;
    
	//console.log(client.user.name + ' left room ' + client.room == null ? 'none' : client.room.name);
	this._sendAndLog("userExit", msg);
};

module.exports = DiggingPlugin;