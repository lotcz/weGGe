weggeCreator.prototype = new weggeViewer();

function weggeCreator() {
	this.base = weggeViewer;
	this.base();
	
	this.ui = new weggeUI();
	
	this.info = this.ui.addContainer().css({position:"absolute",bottom:"0px",right:"0px"}).hide();
	
	this.showInfo = function( text ) {
		this.info.html( text ).show();
	}
	
	this.hideInfo = function () {
		this.info.hide();
	}
	
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
			this.resetUI();
			this.fillLevelTree();
			this.nodeBeingEdited = this.level;
			this.initHost3D();
			this.host3D.startAnimation();
		}
	}
	
	/* LEVEL */
	
	this.startLoadingLevel = function( level_id ) {
		this.resetHost3D();	
		$.get("php/loadLevel.php",
			{level_id: level_id},
			_bind(this, this.levelLoaded)
		);		
	}
	
	this.newLevelSaved = function () {
		this.level = this.nodeBeingEdited;
		this.start();
	}
	
	this.newLevel = function() {
		if (this.host3D) {
			this.host3D.stopAnimation();
		}
		var level = new weggeLevel();
		this.editNode( level, _bind(this, this.newLevelSaved) );
	}
	
	this.levelDeleted = function() {
		this.resetHost3D();
		this.level = false;
		this.resetUI();		
	}
	
	this.deleteLevel = function() {
		if (this.level && this.level.id > 0) {
			if (confirm("Delete level?")) {
				$.get("php/deleteLevel.php",
					{level_id:this.level.id},
					_bind(this, this.levelDeleted)
				);
			}
		}
	}
	
	this.loadSelectedLevel = function() {
	
	}
	
	this.selectLevel = function( level ) {
		this.startLoadingLevel(level.level_id);
		this.levelLoadCancel();
	}
	
	this.levelLoadCancel = function() {
		if (this.levelList) {
			this.levelList.remove();
			this.levelList = false;
			this.ui.removeOverlay();
		}
	}
	
	this.showLevelList = function( levels_json ) {
		this.levelLoadCancel();
		this.ui.addOverlay();
		this.levelList = this.ui.addContainer()
			.css({left:"50px",right:"50px",top:"70px",bottom:"20px",opacity:1,position:"fixed",zIndex:"99999999999999"});
		
		if (levels_json.length > 0) {
			this.ui.addNodeList( levels_json, _bind(this, this.selectLevel), this.levelList ).css({margin:"auto"});
		} else {
			this.levelList.append("No levels available in weGGe database.");
		}
		
		this.ui.addMenu( {
				links: [
							{title:'Load',onselect:_bind(this, this.loadSelectedLevel)},
							{title:'Cancel',onselect:_bind(this, this.levelLoadCancel)},
						],
				css:{top:0,left:0},
				element:this.levelList 
			}
		);
	}
	
	this.loadLevelList = function() {
		$.get("php/loadLevels.php",			
			_bind(this, this.showLevelList)
		);
	}
	
	this.levelSaved = function (data) { 		
		if (!isNaN(data)) {
			this.level.id = parseInt(data);
			console.log("Level " + this.level.id + " saved.");
		} else {
			console.log("Level not saved successfully:" + data); 
		}
	}
	
	this.saveLevel = function() {
		if (this.level) {
			var jsonString = JSON.stringify(this.level.getJSON());
			$.post("php/saveLevel.php", { "level_id":this.level.id,"level_json":jsonString }, 
				_bind(this, this.levelSaved)
			);
		} else {
			console.log("Cannot save - no level is loaded.");
		}
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
	
	
	this.resetUI = function() {
		if (this.nodeForm) {
			this.nodeForm.remove();
		}
		this.levelNodeTree.empty();
		this.ui.removeOverlay();
	}
	
	/* MENU */
		
	this.menuContainer = this.ui.addContainer();
	this.menuContainer.css({height:"55px",paddingLeft:"150px",paddingTop:"15px"}).addClass("main-menu");
	this.ui.addMenu( {
			links: [
						{title:'New',onselect:_bind(this, this.newLevel)},
						{title:'Load',onselect:_bind(this, this.loadLevelList)},
						{title:'Save',onselect:_bind(this, this.saveLevel)},
						{title:'Delete',onselect:_bind(this, this.deleteLevel)},
						{title:'Reload',onselect:_bind(this, this.reloadLevel)},
						{title:'Pause',onselect:_bind(this, this.pause)},
					],
			css:{top:0,left:0},
			element:this.menuContainer
		}
	);
	
	/* NODES */
	
	this.nodeTypeSelected = function ( ntype ) {
		var node = new window["wegge" + ntype]();
		this.nodeBeingEdited.children.push( node );
		$("ul:first", this.nodeBeingEdited.treeContainer).append(this.addTreeNode(node));
		this.editNode(node);
		this.nodeTypeCancel();
	}
	
	this.nodeTypeCancel = function() {
		if (this.nodeTypeForm) {
			this.nodeTypeForm.remove();
		}
	}
	
	this.removeNode = function() {
		if (this.nodeBeingEdited && (this.nodeBeingEdited !== this.level)) {
			this.nodeBeingEdited.treeContainer.remove();
			this.level.removeNode(this.nodeBeingEdited);
			this.nodeCancel();
		}
	}
	
	this.newNode = function() {
		this.nodeCancel();
		this.nodeTypeCancel();
		this.nodeTypeForm = this.ui.addContainer();
		this.nodeTypeForm.css({top:"70px",display:"inline-block",position:"absolute",paddingRight:"15px",paddingBottom:"10px",paddingLeft:"15px"});
		this.ui.addNodeList( weggeNode.prototype.availableTypes, _bind(this, this.nodeTypeSelected), this.nodeTypeForm );
		this.ui.addMenu( {
				links: [
							{title:'Cancel',onselect:_bind(this, this.nodeTypeCancel)},
						],
				css:{top:0,left:0},
				element:this.nodeTypeForm
			}
		);
		
	}
	
	this.nodeCancel = function() {
		if (this.nodeForm) {
			this.nodeForm.remove();
		}
	}
	
	this.nodeSave = function() {
		this.nodeCancel();
	}
		
	this.editNode = function( node, onsave ) {		
		this.nodeCancel();
		this.nodeTypeCancel();
		this.nodeBeingEdited = node;
		$(".selected", this.levelNodeTree).removeClass("selected");
		$("a:first",this.nodeBeingEdited.treeContainer).addClass("selected");
		this.nodeForm = this.ui.addContainer();
		this.nodeForm.css({top:"70px",display:"inline-block",position:"absolute",paddingRight:"15px",paddingBottom:"10px"});
		this.ui.addFormItems( this.nodeForm, node.json );
		this.ui.addMenu( {
				links: [
							{title:'Save',onselect:_coalesce(onsave, _bind(this, this.nodeSave))},
							{title:'Cancel',onselect:_bind(this, this.nodeCancel)},
						],
				css:{top:0,left:0},
				element:this.nodeForm
			}
		);
		if (this.nodeBeingEdited.wrapper) {
			//this.showTransformControls(this.nodeBeingEdited);
		}		
	}
	
	this.levelNodeTree = this.ui.addContainer();
	this.levelNodeTree.css({top:"70px",left:"0px",minWidth:"250px",maxWidth:"50%",width:"auto",display:"inline-block"/*,height:"100%"*/});
	
	this.addTreeNode = function( node ) {
		var el = $("<li></li>");
		var fnc = function () {
			this.editNode(node);
		}
		var link = $("<a></a>").appendTo(el).click( _bind(this,fnc) );
		if (node.json && node.json.type) {
			link.append( node.json.type );
		}
		//link.append( $(" <i>(" + _getTypeName(node) + ")</i>") );
		node.treeContainer = el;
		var sub = $("<ul class=\"node-tree\"></ul>").appendTo(el);
		if (node.children && node.children.length > 0) {			
			for (var i = 0, max = node.children.length; i < max ; i++) {
				sub.append( this.addTreeNode(node.children[i]) );
			}			
		}
		return el;
	}
	
	this.fillLevelTree = function () {		
		if (this.level) {
			var el = $("<ul class=\"node-tree\"></ul>").appendTo(this.levelNodeTree);
			el.append( this.addTreeNode(this.level) );
			/* node menu */
			this.ui.addMenu( {
					links: [
						{title:'ADD',onselect:_bind(this, this.newNode)},
						{title:'REMOVE',onselect:_bind(this, this.removeNode)},
						{title:'Go to',onselect:_bind(this, this.saveLevel)}
					],
					css:{fontSize:"4mm", marginTop:"10px", marginBottom:"10px"},
					element:this.levelNodeTree
				}
			);
		}
	}

	/* TRANSFORM CONTROLS */
	
	this.onTransformControlsChange = function () {
	
	}
	
	this.hideTransformControls = function () {
		if (this.transformControls) {
			this.host3D.scene.remove(this.transformControls);
			this.transformControls = false;
		}		
	}
	
	this.showTransformControls = function( node ) {
		this.hideTransformControls();
		this.transformControls = new THREE.TransformControls( this.host3D.camera, this.ui.element.get(0) /*this.host3D.renderer.domElement*/ );
		this.transformControls.addEventListener( 'change', _bind(this, this.onTransformControlsChange));
		this.transformControls.attach( node.wrapper );
		this.host3D.scene.add( this.transformControls );		
		this.showInfo("\"W\" translate | \"E\" rotate | \"R\" scale | \"+\" increase size | \"-\" decrease size, Press \"Q\" twice to toggle world/local space");
	}
	
	
	
	/* INIT */
	this.loadResources();
}