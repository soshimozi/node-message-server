var DigGame = function(viewport, output, width, height) {
	
	EventTarget.call(this);
	
	var self = this;
	this.uid = 'user' + Math.floor((Math.random()*1000)+1);

	this.canvasWidth = width;
	this.canvasHeight = height;
	this.output = output;
	this.viewport = viewport;
	
	this.trowel = null;
	this.playerList = {};
	this.server = {};
	this.images = {};
	this.mousePosition = {x:0, y:0};
	
	this.initialized = false;
	this.gameTime = new bitwisegames.gameTime();
	
	this.audioContext =  new webkitAudioContext();
	
	this.diggingSound = null;
	this.foundSound = null;
	this.nothingSound = null;
	this.foundItems = [];
	this.sprites = [];
	this.arrayhelper = new arrayhelper();
	
	this.registerImage('background', '/images/background.png');
	this.registerImage('item1', '/images/Item0001.png');
	this.registerImage('item2', '/images/Item0002.png');
	this.registerImage('item3', '/images/Item0003.png');
	this.registerImage('item4', '/images/Item0004.png');
	
	this.loadSound = function(url, sound) {
	  var request = new XMLHttpRequest();
	  request.open('GET', url, true);
	  request.responseType = 'arraybuffer';
	
	  // Decode asynchronously
	  request.onload = function() {
	    self.audioContext.decodeAudioData(request.response, function(buffer) {
	      sound.buffer = buffer;
	      sound.loaded = true;
	    }, function(e) {
	    	 console.log('error:', e);
	    } );
	  }
	  
	  request.send();
	};	
			  
	this.playSound = function(buffer) {
		try {
		
		  var source = this.audioContext.createBufferSource(); // creates a sound source
		  source.buffer = buffer;                    // tell the source which sound to play
		  source.connect(this.audioContext.destination);       // connect the source to the context's destination (the speakers)
		  source.noteOn(0);                          // play the source now
		}
		catch(ex) {
			console.error('playSound:', ex);
		}
	};
	
	this.logMessage = function(message) {
		var html = $(this.output).html();
		$(this.output).html(html + '<br />' + message);
	};
	
	this.getImage = function(id) {
		return this.images[id];
	};
	
	this.initialize = function() {

		// let's not leak
		if (this.trowel != null) {
			delete this.trowel;
		}
		
		this.trowel = new trowel(this);
		this.initialized = true;
		this.sprites = [];
		this.foundItems = [];
		
		this.viewport.addEventListener('mousedown', 
				function(ev) {
					ev.preventDefault();
					self.mouseDown(ev);
					return false;
				}, false);
		
	  	this.viewport.addEventListener('mousemove', 
	  			function(ev) {
		  			ev.preventDefault();
		  			self.mouseMove(ev);
					return false;
					
				}, false);
	  	

		this.server.registerHandler(Handlers.JoinRoomEvent, function(socket, message) {
			self.handleJoinRoomEvent(socket, message);
		});
		
		this.server.registerHandler(Handlers.PluginMessageEvent, function(socket, message) {
			self.handlePluginMessage(socket, message);
		});	

		this.joinRoom();
	};
	
	this.joinRoom = function() {
		var plugin = this.server.createPlugin('DigGame', 'DiggingPlugin', 'DiggingPlugin');
		this.server.createRoom('', 'lobby', [plugin]);
	};
	
	
	this.refreshPlayerList = function() {
		this.fire('refreshUserList');
	};
	
	this.handlePluginMessage = function(socket, message) {
		
		console.log('plugin message event');
		console.log(message);
		
		if (message[PluginConstants.ACTION] == window.PluginConstants.ADD_PLAYER) {
			this.handleAddPlayer(socket, message);	
		} else if (message[PluginConstants.ACTION] == window.PluginConstants.PLAYER_LIST) {
			this.handlePlayerList(socket, message);
		} else if (message[PluginConstants.ACTION] == window.PluginConstants.REMOVE_PLAYER) {
			this.handleRemovePlayer(socket, message);
		} else if (message[PluginConstants.ACTION] == window.PluginConstants.ERROR) {
			this.handleError(socket, message);
		} else if (message[PluginConstants.ACTION] == window.PluginConstants.DONE_DIGGING) {
			this.handleDoneDigging(socket, message);
		}
		
	};
	
	this.handleJoinRoomEvent = function(socket, message) {
		console.log('join room!');
		
		var pluginMessage = {};
		
		pluginMessage[window.PluginConstants.ACTION] = window.PluginConstants.INIT_ME;
		this.server.sendPluginMessage('DiggingPlugin', 'lobby', pluginMessage);
	};
	
	this.handleDoneDigging = function(socket, message) {
		console.log("done digging");
		
		
		// see if we won anything!
		if (this.playerList.hasOwnProperty(message[PluginConstants.NAME])) {
			var player = this.playerList[message[PluginConstants.NAME]];
			
			player.score = message[PluginConstants.SCORE];
			
			if (player.isMe) {
				
				if (message[PluginConstants.ITEM_FOUND] == true) {
					
					var item = new gameitem(this);
					
					item.setX(this.trowel.getX());
					item.setY(this.trowel.getY());
					item.setItemType(message[PluginConstants.ITEM_ID]);
					
					this.foundItems.push(item);
					
					var sp = new textsprite('You found something!');
					sp.fade();
					
					sp.setX(this.viewport.width / 2);
					sp.setY(this.viewport.height / 2);
					sp.setTextAlign("center");
					this.sprites.push(sp);
					
					this.playSound(this.foundSound.buffer);
				} else {
					
					this.addTextSprite('Nothing found.', this.viewport.width / 2, this.viewport.height / 2, 'center', true, 1.5);
					
//					var sp = new textsprite('Nothing found.');
//					sp.fade(function() {
//						this.arrayhelper.removeElement(this.sprites, sp);
//						delete sp;
//					});
//
//					sp.setX(this.viewport.width / 2);
//					sp.setY(this.viewport.height / 2);
//					sp.setTextAlign("center");
//					sp.setFadeTime(2.0);
//					this.sprites.push(sp);
					
					this.playSound(this.nothingSound.buffer);
				}
				
				this.trowel.stopDigging();
				this.updateTrowelPosition();
			}
			
			console.log(player);
			this.refreshPlayerList();
		}
	};
	
	this.addTextSprite = function(text, x, y, textalign, fade, fadetime) {

		var sp = new textsprite(text);
		
		if (fade) {
			sp.fade();
		}

		sp.setX(x);
		sp.setY(y);
		sp.setTextAlign(textalign);
		
		this.sprites.push(sp);
	};
	
	this.handleError = function(socket, message) {
		var error = message[PluginConstants.ERROR];
		
		switch (error) {
			case PluginConstants.SPOT_ALREADY_DUG:
				this.trowel.stopDigging();
				this.playSound(this.nothingSound.buffer);
				
				var sp = new textsprite('That spot has already been dug.');
				sp.fade();

				sp.setX(this.viewport.width / 2);
				sp.setY(this.viewport.height / 2);
				sp.setTextAlign("center");
				this.sprites.push(sp);
				
				this.updateTrowelPosition();
			break;
			default:
				trace("Error not handled: " + error);
		}				
	};
	
	this.handleRemovePlayer = function(socket, message) {
		delete this.playerList[message[PluginConstants.NAME]];
		this.refreshPlayerList();
	};
	
	this.handleAddPlayer = function(socket, message) {
		var player = { name: message[PluginConstants.NAME], score: 0, isMe: message[PluginConstants.NAME] == this.uid };
		this.playerList[player.name] = player;
		
		this.refreshPlayerList();
	};
	
	this.handlePlayerList = function(socket, message) {
		console.log('handlePlayerList');
			
 		var messagePlayers = message[PluginConstants.PLAYER_LIST];
 		console.log(messagePlayers);
 
 		for(var i=0; i<messagePlayers.length; i++) {
 			var thisMessage = messagePlayers[i];
 			this.playerList[thisMessage[PluginConstants.NAME]] = {name:thisMessage[PluginConstants.NAME], score: thisMessage[PluginConstants.SCORE], isMe:thisMessage[PluginConstants.NAME] == this.uid };
 		}
 		
 		this.refreshPlayerList();
	};
		
	this.allImagesLoaded = function() {
		
		for (var key in this.images) {
			var img = this.images[key];
	      if(img.loaded === false) {
	         return false;
	      }
	   }  

	   return true;
	};	
	
	this.draw = function(context) {

		this.gameTime.update();
		
		if (this.initialized) {

			if( !this.allImagesLoaded() ) {
	
				this.logMessage('loading images...');
				
				setTimeout(function() {
					return function() {
						self.draw.call(context);
					};
				}, 100);   // wait 100 ms	
				
			} else {

				context.save();
				context.fillStyle = 'cornflowerblue';
				context.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
				context.restore();
				
				var backgroundImage = this.images['background'].image;
				
				context.drawImage(backgroundImage, 0, 0);
				
				for(var i=0; i<this.foundItems.length;i++) {
					this.foundItems[i].update(this.gameTime);
					this.foundItems[i].draw(this.gameTime, context);
				}

				for(var i=0; i<this.sprites.length;i++) {
					var sprite = this.sprites[i];
					
					if (typeof(sprite) != 'undefined') {
						sprite.update(this.gameTime);
					}
					
					if (typeof(sprite) != 'undefined') {
						sprite.draw(this.gameTime, context);
					}
				}
				
				this.trowel.draw(this.gameTime, context);
			}
		}
		
	};
	
	this.updateTrowelPosition = function() {
		if (!this.trowel.getIsDigging()) {
			this.trowel._sprite.setX(this.mousePosition.x);
			this.trowel._sprite.setY(this.mousePosition.y);
		}
	};

	this.startDigging = function() {
		var pluginMessage = {};
		
		pluginMessage[window.PluginConstants.ACTION] = window.PluginConstants.DIG_HERE;
		pluginMessage[window.PluginConstants.X] = this.trowel._sprite.getX();
		pluginMessage[window.PluginConstants.Y] = this.trowel._sprite.getY();
		
		// TODO: save room we are in and use that to send message
		this.server.sendPluginMessage('DiggingPlugin', 'lobby', pluginMessage);
		
		this.trowel.dig();
		this.playSound(this.diggingSound.buffer);
	};
	
	this.mouseDown = function(ev) {
		if (!this.trowel.getIsDigging()) {
			this.startDigging();
		}
	};
	
	this.mouseMove = function(ev) {
		
			if (ev.layerX || ev.layerX == 0) { // Firefox
					x = ev.layerX;
					y = ev.layerY;
				} else if (ev.offsetX || ev.offsetX == 0) { // Opera
					x = ev.offsetX;
					y = ev.offsetY;
				}	
				
			this.mousePosition.x = x;
			this.mousePosition.y = y;
			
			this.updateTrowelPosition();
	};

	this.diggingSound = {};
	this.foundSound = {};
	this.nothingSound = {};
	
	this.loadSound('/sounds/DiggingSound.wav', this.diggingSound);
	this.loadSound('/sounds/FoundSound.wav', this.foundSound);
	this.loadSound('/sounds/NothingSound.wav', this.nothingSound);
	
	

	
};

DigGame.prototype = new EventTarget();
DigGame.prototype.constructor = DigGame;
DigGame.prototype.updateUserPanel = function(){
    this.fire("updateUserPanel");
};

DigGame.prototype.registerImage = function(id, src) {
	
	var rec = {id:id, image:new Image(), loaded:false};
	rec.image.src = src;
	rec.image.onload = function() {
		rec.loaded = true;
	};
	
	this.images[id] = rec;
};


