weggeCreator.prototype = new weggeViewer();

function weggeCreator() {
	this.base = weggeViewer;
	this.base();
	
	this.pause = function() {
		if (this.host3D) {
			if (this.host3D.animationPaused) {	
				this.host3D.startAnimation();
			} else {
				this.host3D.stopAnimation();
			}
		}
	}
	
	this.start = function() {
		if (this.level && this.resources && this.resources.initialized) {	
			this.fillLevelTree();
			this.initHost3D();
			this.host3D.startAnimation();
		}
	}
	
	/* LEVEL */
	
	this.newLevel = function() {
		this.host3D.stopAnimation();
		this.level = new weggeLevel();		
	}
	
	this.levelSaved = function (data) { 
		console.log("Scene saved:" + data); 
		if (!isNaN(data)) {
			this.level.id = parseInt(data);
		}				
	} 
	
	this.saveLevel = function() {
		var jsonString = this.level.getJSON();
		$.post("php/saveLevel.php", { "level_id":scene.id,"level_json":jsonString }, 
			_bind(this, this.levelSaved)
		);
	}
		
	/* RESOURCES */
	
	this.resourceSaved = function( data ) {
		console.log("Resource saved:" + data); 
		if (!isNaN(data)) {
			this.savingResource.id = parseInt(data);
		}
	}
	
	this.saveResource = function( res ) {
		this.savingResource = res;
		$.post("php/saveResource.php", { "resource_id":res.resource_id, "resource_json":res.getJSON() }, 
			_bind(this, this.resourceSaved)
		);
	}
	
	
	/* UI */
	
	this.ui = new weggeUI();
	this.menuContainer = this.ui.addContainer();
	this.menuContainer.css({height:"55px",paddingLeft:"150px",paddingTop:"15px"});
	this.menu = this.ui.addMenu( {
			links: [
						{title:'New',onselect:_bind(this, this.newLevel)},
						{title:'Load'},
						{title:'Save',onselect:_bind(this, this.saveLevel)},
						{title:'Reload',onselect:_bind(this, this.reloadLevel)},
						{title:'Pause',onselect:_bind(this, this.pause)},
					],
			css:{top:0,left:0},
			element:this.menuContainer
		}
	);
	
	/* NODES */
	
	this.editNode = function( node ) {		
		if (this.nodeForm) {
			this.nodeForm.remove();
		}
		this.nodeForm = this.ui.addContainer();
		this.nodeForm.css({top:"70px",display:"inline-block",position:"absolute",paddingRight:"15px"});
		this.ui.addFormItems( this.nodeForm, node.json );
		console.log(node);
	}
	
	this.levelNodeTree = this.ui.addContainer();
	this.levelNodeTree.css({top:"70px",left:"0px",minWidth:"250px",maxWidth:"50%",width:"auto",display:"inline-block"/*,height:"100%"*/});
	
	this.addNode = function( node ) {
		var el = $("<li></li>");
		var fnc = function () {
			this.editNode(node);
		}
		var link = $("<a></a>").appendTo(el).click( _bind(this,fnc) );
		if (node.json && node.json.type) {
			link.append( node.json.type + " " );
		}
		link.append( $("<i>(" + _getTypeName(node) + ")</i>") );
		if (node.children && node.children.length > 0) {
			var sub = $("<ul class=\"node-tree\"></ul>").appendTo(el);
			for (var i = 0, max = node.children.length; i < max ; i++) {
				sub.append( this.addNode(node.children[i]) );
			}			
		}
		return el;
	}
	
	this.fillLevelTree = function () {
		this.levelNodeTree.empty();
		if (this.level) {
			var el = $("<ul class=\"node-tree\"></ul>").appendTo(this.levelNodeTree);
			el.append( this.addNode(this.level) );
			this.ui.addMenu( {
					links: [
						{title:'Add',onselect:_bind(this, this.newLevel)},
						{title:'Delete'},
						{title:'Go to',onselect:_bind(this, this.saveLevel)}
					],
					css:{fontSize:"4mm", marginTop:"10px", marginBottom:"10px"},
					element:this.levelNodeTree
				}
			);
		}
	}
	
	/* INIT */
	this.loadResources();
}