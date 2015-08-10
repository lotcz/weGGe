WEGGE_CREATOR_MODE = true;
var WEGGE_CREATOR_HELPERS = [];

function weggeCreator() {
	this.base = weggeViewer;
	this.base();
	
	this.start = function() {
		if (this.level && this.resources && this.resources.initialized) {
			this.resetUI();
			this.fillLevelTree();
			this.nodeBeingEdited = this.level;
					
			this.resetHost3D();
			this.host3D = new weggeHost3D();
			WEGGE_CREATOR_HELPERS = [];
			this.level.initialize(this.host3D, this.resources);
			//this.host3D.scene.fog	= new THREE.FogExp2( 0x000000, 0.001 );

			if (WEGGE_CREATOR_HELPERS.length > 0) {
				for (var i = WEGGE_CREATOR_HELPERS.length-1; i >= 0; i--) {
					this.host3D.scene.add(WEGGE_CREATOR_HELPERS[i]);
				}
			}
			this.host3D.onAnimationFrame = _bind(this, this.animationFrame);
			this.host3D.onHost3DStateChanged = _bind(this, this.host3DStateChanged);
		
			if (!this.controls) {
				this.controls = new weggeControls({ "camera":this.host3D.camera, element: document });
				this.controls.resetToDefault();
				this.controls.movementSpeed = 500;				
				this.controls.movementEnabled = true;
				this.controls.onControlsStateChanged = _bind(this, this.controlsStateChanged);
			}
			
			this.controls.initialize( this.host3D.camera, this.level.json.cameraLatitude, this.level.json.cameraLongitude );			
			
			this.controls.lookEnabled = this.level.json.creator.lookEnabled;
			this.host3D.renderingPaused = this.level.json.creator.renderingPaused;
			this.host3D.animationPaused = this.level.json.creator.animationPaused;
			this.host3D.physicsPaused = this.level.json.creator.physicsPaused;
			
			this.updateMenuButtonsHost();
			this.updateMenuButtonsControls();
			
			if (!this.level.json.creator.renderingPaused) {
				this.host3D.startRendering();
			}
			
		} else {
			console.log("Level or resources not initialized.");	
		}
		this.ui.hideLoading();
	}
	
	this.onKeyUp = function ( e ) {
		var key = e.keyCode ? e.keyCode : e.charCode;

		switch( key ) {
			case 32: /* space */
				if (this.controls) {
					this.controls.toggleLook();
				}
			break;
		}
	};
	
	document.addEventListener( 'keyup', _bind( this, this.onKeyUp ), false );
	
	this.host3DStateChanged = function() {
		this.updateMenuButtonsHost();
		if (this.level) {
			if (!this.level.json.creator) {
				this.level.json.creator = {};
			}
			this.level.json.creator.renderingPaused = _boolToInt(this.host3D.renderingPaused);
			this.level.json.creator.animationPaused = _boolToInt(this.host3D.animationPaused);
			this.level.json.creator.physicsPaused = _boolToInt(this.host3D.physicsPaused);
		}
	}
	
	this.controlsStateChanged = function() {
		this.updateMenuButtonsControls();
		if (this.level) {
			if (!this.level.json.creator) {
				this.level.json.creator = {};
			}
			this.level.json.creator.lookEnabled = _boolToInt(this.controls.lookEnabled);
		}
	}
	
	/* LEVEL */
	
	this.levelLoaded = function( data ) { 
		console.log("level loaded:");
		console.log(data);
		this.ui.showLoading("Initializing...");
		if (data.level_id) {
			this.level = new weggeLevel();
			this.level.loadFromJSON(data.level_id, data.level_json);			
			this.start();			
		} else {
			console.log( data );
		}
	}
	
	this.startLoadingLevel = function( level_id ) {
		this.loadResources();
		this.ui.showLoading();
		this.resetHost3D();	
		$.get("php/loadLevel.php",
			{level_id: level_id},
			_bind(this, this.levelLoaded)
		);		
	}
	
	this.newLevelSaved = function () {
		this.start();
	}
	
	this.newLevel = function() {
		this.resetUI();
		this.resetHost3D();		
		this.level = new weggeLevel();
		this.editNode( this.level, _bind(this, this.newLevelSaved) );
	}
	
	this.levelDeleted = function() {
		this.resetUI();	
		this.resetHost3D();
		this.level = false;			
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

	this.selectLevel = function( level ) {
		this.resetUI();
		this.startLoadingLevel(level.level_id);		
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
							{title:'Cancel',onselect:_bind(this, this.levelLoadCancel)},
						],
				css:{top:0,left:0},
				element:this.levelList 
			}
		);
	}
	
	this.reloadLevel = function() {		
		this.resetUI();
		if (this.level && this.level.id) {
			this.startLoadingLevel(this.level.id);
		} else {
			console.log("No level loaded. Nothing  to reload.");
		}
	}
	
	this.loadLevelList = function() {
		$.get("php/loadLevels.php",			
			_bind(this, this.showLevelList)
		);
	}
	
	this.levelSaved = function (data) { 		
		if (!isNaN(data)) {
			this.level.id = parseInt(data);
			console.log("Level saved. ID=" + this.level.id);
		} else {
			console.log("Level not saved successfully:" + data); 
		}
	}
	
	this.saveLevel = function() {
		if (this.level) {
			var json = this.level.getJSON();
			if (this.controls) {
				json.cameraLatitude = this.controls.lat;
				json.cameraLongitude = this.controls.lon;
			}
			if (this.host3D && this.host3D.camera) {
				json.cameraPosition = [this.host3D.camera.position.x,this.host3D.camera.position.y,this.host3D.camera.position.z];
			}
			var jsonString = JSON.stringify(json);
			$.post("php/saveLevel.php", { "level_id":this.level.id,"level_json":jsonString }, 
				_bind(this, this.levelSaved)
			);
		} else {
			console.log("Cannot save - no level is loaded.");
		}
	}
		
	this.resetUI = function() {
		if (this.nodeForm) {
			this.nodeForm.remove();
		}		
		this.resourcesManager.hide();
		this.nodeTypeCancel();
		this.levelLoadCancel();
		this.levelNodeTree.empty();
		this.hideTransformControls();
		this.ui.removeOverlay();
	}
	
	/* RESOURCES */
	this.resourcesManager = new weggeResourcesManager( { 
			ui:this.ui,
			resources:this.resources,
			onResourceSelected: _bind(this, this.resourceSelected)
		}
	);
	
	this.openResourcesManager = function() {
		if (this.resources) {
			if (this.host3D) {
				this.host3D.stopAnimation();
			}
			this.resourcesManager.show(this.resources);
		} else {
			console.log("Resources are not initialized. Cannot open resource manager.");
		}
	}
		
	/* NODES */
	
	this.nodeTypeSelected = function ( ntype ) {
		var node = new window["wegge" + ntype]();
		this.nodeBeingEdited.children.push( node );
		$("ul:first", this.nodeBeingEdited.treeContainer).append(this.addTreeNode(node));
		if (this.nodeBeingEdited.addChildWrapper) {
			this.nodeBeingEdited.addChildWrapper(node.initialize(this.resources));
		}
		this.nodeTypeCancel();
		this.editNode(node);		
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
		weggeNode.prototype.availableTypes.sort();
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
		this.nodeBeingEdited.applyJSON();
		this.showTransformControls(this.nodeBeingEdited);
		this.nodeCancel();
	}
		
	this.renderNodeForm = function(node, onsave) {
		this.nodeBeingEdited  = node;
		this.nodeCancel();
		this.nodeTypeCancel();		
		$(".selected", this.levelNodeTree).removeClass("selected");
		$("a:first",this.nodeBeingEdited.treeContainer).addClass("selected");
		this.nodeForm = this.ui.addContainer();
		this.nodeForm.css({top:"70px",display:"inline-block",width:"450px",position:"absolute",paddingRight:"15px",paddingBottom:"10px",maxHeight:"85%",overflow:"auto"});
		this.ui.addFormItems( this.nodeForm, node.json );
		this.ui.addMenu( {
				links: [
							{title:'Save',onselect: _coalesce(onsave, _bind(this, this.nodeSave))},
							{title:'Look at',onselect: _bind(this, this.lookAt)},
							{title:'Cancel',onselect:_bind(this, this.nodeCancel)},
						],
				css:{top:0,left:0},
				element:this.nodeForm
			}
		);
	}
	
	this.lookAt = function() {
		this.controls.lookAt(this.nodeBeingEdited.wrapper.position);		
	}
	
	this.cloneNode = function() {	
		if (this.nodeBeingEdited && (this.nodeBeingEdited !== this.level)) {
			this.nodeSave();
			var clone = this.nodeBeingEdited.clone();
			this.host3D.scene.add(clone.initialize(this.resources));
			this.levelTreeNode.append(this.addTreeNode(clone));
			this.level.children.push( clone );			
		}
	}
	
	this.editNode = function( node, onsave ) {	
		this.nodeBeingEdited = node;	
		this.renderNodeForm( this.nodeBeingEdited, onsave  )
		this.showTransformControls(this.nodeBeingEdited);				
	}
	
	this.addTreeNode = function( node ) {
		var el = $("<li></li>");
		var fnc = function () {
			this.editNode(node);
		}
		var link = $("<a></a>").appendTo(el).click( _bind(this,fnc) );

		if (node.json.name) {
			link.append( node.json.name + "&nbsp;" );
		}
		if (node.json.type) {
			link.append( $("<i> (" + node.json.type + ")</i>") );
		}

		node.treeContainer = el;
		var sub = $("<ul class=\"node-tree\"></ul>").appendTo(el);
		if (node.children && node.children.length > 0) {			
			for (var i = 0, max = node.children.length; i < max ; i++) {
				sub.append( this.addTreeNode(node.children[i]) );
			}			
		}
		return el;
	}
	
	this.levelTreeNode = false;
	
	this.fillLevelTree = function () {		
		if (this.level) {
			var el = $("<ul class=\"node-tree\"></ul>").appendTo(this.levelNodeTree);
			this.levelTreeNode = this.addTreeNode(this.level);
			el.append( this.levelTreeNode );
			/* node menu */
			this.ui.addMenu( {
					links: [
						{title:'ADD',onselect:_bind(this, this.newNode)},
						{title:'REMOVE',onselect:_bind(this, this.removeNode)},
						{title:'CLONE',onselect:_bind(this, this.cloneNode)}
					],
					css:{fontSize:"4mm", marginTop:"10px", marginBottom:"10px"},
					element:this.levelNodeTree
				}
			);
		}
	}

	/* TRANSFORM CONTROLS */
	
	this.onTransformControlsChange = function ( event ) {
		if (event && event.target && event.target.object && this.nodeBeingEdited && this.nodeBeingEdited.basicPropsEdited) {
			this.nodeBeingEdited.basicPropsEdited();
			this.renderNodeForm(this.nodeBeingEdited);
		}
	}
	
	this.onTransformControlsChangeCallback = _bind(this, this.onTransformControlsChange);
	
	this.hideTransformControls = function () {
		if (this.transformControls) {
			this.host3D.scene.remove(this.transformControls);
			this.transformControls.removeEventListener( 'change', this.onTransformControlsChangeCallback );
			this.transformControls.destroy();			
			this.transformControls = false;
		}		
	}
	
	this.showTransformControls = function( node ) {
		if (node.wrapper && this.host3D && this.host3D.initialized) {
			this.hideTransformControls();
			this.transformControls = new THREE.TransformControls( this.host3D.camera, this.ui.element[0] /*this.host3D.renderer.domElement*/ );
			this.transformControls.addEventListener( 'change', this.onTransformControlsChangeCallback);
			this.transformControls.attach( node.wrapper );
			this.transformControls.setSnap( 1 );
			this.host3D.scene.add( this.transformControls );		
			this.showInfo("\"T\" translate | \"Y\",\"Z\" rotate | \"U\" scale | \"+\" increase size | \"-\" decrease size, \"I\" world/local space");
		}
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
						{title:'Resources',onselect:_bind(this, this.openResourcesManager)},
						{title:'Rendering',onselect:_bind(this, this.toggleRendering),id:"renderingButton"},
						{title:'Animation',onselect:_bind(this, this.toggleAnimation),id:"animationButton"},
						{title:'Physics',onselect:_bind(this, this.togglePhysics),id:"physicsButton"},
						{title:'Look',onselect:_bind(this, this.toggleLook),id:"lookButton"},
					],
			css:{top:0,left:0},
			element:this.menuContainer
		}
	);
	
	this.updateButton = function(button, highlighted, color ) {
		if (highlighted) {
			button.css({backgroundColor:color});
		} else {
			button.css({backgroundColor:"inherit"});
		}
	}
	
	this.updateMenuButtonsHost = function() {
		this.updateButton($("#renderingButton",this.menuContainer),!this.host3D.renderingPaused, "Orange");
		this.updateButton($("#animationButton",this.menuContainer),!this.host3D.animationPaused, "Green");
		this.updateButton($("#physicsButton",this.menuContainer),!this.host3D.physicsPaused, "Purple");
	}
	
	this.updateMenuButtonsControls = function() {
		this.updateButton($("#lookButton",this.menuContainer),this.controls.lookEnabled, "Blue");
	}
	
	/* NODE TREE */
	
	this.levelNodeTree = this.ui.addContainer();
	this.levelNodeTree.css({top:"70px",left:"0px",minWidth:"250px",maxWidth:"50%",width:"auto",display:"inline-block"/*,height:"100%"*/});
	
	/* INIT */
	this.ui.showLoading();
	this.loadResources();
}
