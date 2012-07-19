var fs = require('fs')
	, filepath = require('path')
	, DOMParser = require('xmldom').DOMParser;

extensionmanager = function() {
	this.extensions = {};
};


extensionmanager.prototype.getExtension = function(name) {
	if (this.extensions.hasOwnProperty(name)) {
		return this.extensions[name];
	}
	
	return null;
};

extensionmanager.prototype.loadExtensions = function(path) {
	var stat = fs.lstatSync(path);
	
	if( stat.isDirectory() ) {
		// we have a directory: do a tree walk
		var files = fs.readdirSync(path)
    
		var f, l = files.length;
		for (var i = 0; i < l; i++) {
			f = filepath.join(path, files[i]);
			this.loadExtensions(f);
		}
		
		if (!filepath.existsSync(path + '/extension.xml'))
			return;
		
		var extension = { 
				name:'', 
				plugins:{},
				getPlugin: function(handle) {
					if (this.plugins.hasOwnProperty(handle)) {
						return this.plugins[handle];
					}
					
					return null;
				}
			};
		
		var data = fs.readFileSync(path + '/extension.xml', 'utf-8');
		var doc = new DOMParser().parseFromString(data,'text/xml');
		
		var nameNodes = doc.documentElement.getElementsByTagName("Name"); 
		if (nameNodes.length > 0) {
			var textnode = nameNodes.item(0).childNodes[0];
			extension.name = textnode.nodeValue;
		}
		
		var pluginNodes = doc.documentElement.getElementsByTagName("Plugin");
		if (pluginNodes.length > 0) {
			
			for(var i=0; i<pluginNodes.length; i++) {
				var plugin = {
						handle:'', 
						path:''};
				
				var handleNodes = pluginNodes.item(i).getElementsByTagName("Handle");
				if (handleNodes.length > 0) {
					var textnode = handleNodes.item(0).childNodes[0];
					plugin.handle = textnode.nodeValue;
				}

				var pathNodes = pluginNodes.item(i).getElementsByTagName("Path");
				if (pathNodes.length > 0) {
					var textnode = pathNodes.item(0).childNodes[0];
					
					var pluginPath = textnode.nodeValue;
					pluginPath = filepath.join(path, pluginPath);
					
					plugin.path = pluginPath;
				}
				
				extension.plugins[plugin.handle] = plugin;
			}
		}
	
		console.log('adding extension:');
		console.log(extension);
		
		this.extensions[extension.name] = extension;
	} 	
};

module.exports = extensionmanager;


