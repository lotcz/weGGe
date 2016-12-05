WEGGE_CREATOR_MODE = true;
var WEGGE_CREATOR_HELPERS = [];

function weggeCreator() {
	this.base = weggeViewer;
	this.base();
	
	this.mouseEnabled = false;
	this.controlsEnabled = true;
	
	this.start = function() {
		if (this.resources && this.resources.initialized) {
			if (this.level) {
				this.resetUI();
				this.ui.showLoading("Starting...");
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
			
				// stats
				this.host3D.initStats();
				
				//controls
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
			} 
			this.ui.hideLoading();
		}		
	}
	
	this.animationFrame = function(delta) {
		this.controls.animationFrame(delta);
		this.level.animationFrame(delta);
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
		//console.log("level loaded:");
		//console.log(data);
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
		this.levelList = this.ui.addContainer().addClass("noselect")
			.css({left:"50px",right:"50px",top:"70px",bottom:"20px",opacity:1,position:"fixed",zIndex:"99999999999999"});
		
		if (levels_json.length > 0) {
			this.ui.addTable( levels_json, _bind(this, this.selectLevel), this.levelList ).css({margin:"auto"});
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
	
	this.reloadAfterSave = false;
	
	this.saveAndReload = function() {
		this.reloadAfterSave = true;
		this.saveLevel();
	}
		
	this.levelSaved = function (data) { 		
		if (!isNaN(data)) {
			this.level.id = parseInt(data);
			console.log("Level saved. ID=" + this.level.id);
			if (this.reloadAfterSave) {
				this.reloadAfterSave = false;
				this.reloadLevel();
			}
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
			$.post("php/saveLevel.php", { "level_id":this.level.id,"level_name":this.level.json.name,"level_json":jsonString }, 
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
	
	this.managerExit = function() {
		if (this.restartAnimation) {
			this.restartAnimation = true;
			this.host3D.startAnimation();
			this.restartAnimation = false;
		}
	}
	
	this.resourcesManager = new weggeResourcesManager( { 
			ui:this.ui,
			resources:this.resources,
			onResourceSelected: _bind(this, this.resourceSelected),
			onManagerExit: _bind(this, this.managerExit)
		}
	);
		
	this.openResourcesManager = function() {
		if (this.resources) {
			if (this.host3D) {
				if (!this.host3D.animationPaused) {
					this.restartAnimation = true;
					this.host3D.stopAnimation();
				}
			}
			this.resourcesManager.show(this.resources);
		} else {
			console.log("Resources are not initialized. Cannot open resource manager.");
		}
	}
		
	/* NODES */
	
	this.nodeTypeSelected = function ( ntype ) {
		var node = new window["wegge" + ntype]();
		this.nodeBeingEdited.addChild( node );		
		if (this.nodeBeingEdited.addChildWrapper) {
			this.nodeBeingEdited.addChildWrapper(node.initialize(this.resources));
		}
		this.nodeTypeCancel();
		this.fillLevelTree();
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
			this.hideTransformControls();
			this.nodeBeingEdited.removeFromScene();			
			this.nodeCancel();
			this.nodeBeingEdited = false;
		}
	}
	
	this.newNode = function() {
		this.nodeCancel();
		this.nodeTypeCancel();
		this.nodeTypeForm = this.ui.addContainer();
		this.nodeTypeForm.css({top:"70px",display:"inline-block",position:"absolute",paddingRight:"15px",paddingBottom:"10px",paddingLeft:"15px"});
		weggeNode.prototype.availableTypes.sort();
		this.ui.addList( weggeNode.prototype.availableTypes, _bind(this, this.nodeTypeSelected), this.nodeTypeForm );
		
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
		//this.showTransformControls();
	}
	
	this.nodeSave = function() {
		this.nodeBeingEdited.applyJSON();
		this.nodeBeingEdited.treeContainer.link.html(this.getNodeLabel(this.nodeBeingEdited));
		this.nodeCancel();
	}
	
	this.updateNodeTreeLinks = function() {
		$(".selected", this.levelNodeTree).removeClass("selected");
		if (this.nodeBeingEdited) {
			$("a:first",this.nodeBeingEdited.treeContainer).addClass("selected");
			$("ul",this.nodeBeingEdited.treeContainer).addClass("selected");
		}
	}
	
	this.updateNodeFormCollapse = function() {
		if (_b(this.level.json.creator.formCollapsed)) {
			this.nodeFormCollapsible.css({height:"0"});
		} else {
			this.nodeFormCollapsible.css({height:"auto"});
		}
	}
	
	this.collapseNodeForm = function() {
		if (this.level && this.level.json) {
			this.level.json.creator.formCollapsed = !_b(this.level.json.creator.formCollapsed);
			this.updateNodeFormCollapse();
		}		
	}
	
	this.renderNodeForm = function(node, onsave) {
		this.nodeBeingEdited  = node;
		this.nodeCancel();
		this.nodeTypeCancel();		
		this.updateNodeTreeLinks();
		this.nodeForm = this.ui.addContainer();
		this.nodeForm.mouseenter( _bind(this,this.hideTransformControls) );
		this.nodeForm.mouseleave( _bind(this,this.showTransformControls) );	
		this.nodeForm.css({top:"70px",display:"inline-block",width:"450px",position:"absolute",paddingRight:"15px",paddingBottom:"10px",maxHeight:"85%",overflow:"auto"});
		
		this.nodeFormCollapsible = this.ui.addContainer(this.nodeForm).css({overflow:"hidden"});
		this.ui.addFormItems( this.nodeFormCollapsible, node.json );		
		this.updateNodeFormCollapse();
		
		this.ui.addMenu( {
				links: [
							{title:'Save',onselect: _coalesce(onsave, _bind(this, this.nodeSave))},
							{title:'Look at',onselect: _bind(this, this.lookAt)},
							{title:'Cancel',onselect:_bind(this, this.nodeCancel)},
							{title:'Collapse/Uncollapse',onselect:_bind(this, this.collapseNodeForm)},
						],
				css:{top:0,left:0},
				element:this.nodeForm
			}
		);		
	}
	
	this.lookAt = function() {
		this.host3D.lookAt(this.nodeBeingEdited.wrapper.position);
		this.controls.lookAt(this.nodeBeingEdited.wrapper.position);		
	}
	
	this.cloneNode = function() {	
		if (this.nodeBeingEdited && this.nodeBeingEdited.parent) {
			this.nodeSave();
			var clone = this.nodeBeingEdited.clone();
			this.host3D.scene.add(clone.initialize(this.resources));			
			this.nodeBeingEdited.parent.addChild( clone );
			this.fillLevelTree();
			this.editNode(clone);
		}
	}
	
	this.editNode = function( node, onsave ) {	
		this.nodeBeingEdited = node;	
		this.renderNodeForm( this.nodeBeingEdited, onsave  )
		this.showTransformControls(this.nodeBeingEdited);				
	}
	
	this.getNodeLabel = function(node) {
		var label = "";
		if (node.json.name) {
			label += node.json.name + "&nbsp;" ;
		}
		if (node.json.type) {
			label +=  "<i> (" + node.json.type + ")</i>";
		}
		return label;
	}

	this.addTreeNode = function( node ) {
		var el = $("<li></li>");
		var fnc = function () {
			this.editNode(node);
		}
		el.link = $("<a></a>").appendTo(el).click( _bind(this,fnc) );
		el.link.append(this.getNodeLabel(node));
		
		node.treeContainer = el;
				
		if (node.children && node.children.length > 0) {		
			node.subTree = $("<ul class=\"node-tree\"></ul>").appendTo(el);			
			var expand = function() {
				this.subTree.slideToggle(); // this is binded to node :-)
				this.collapse();
			}
			el.append("&nbsp; ");
			var expander = $("<a>[+-]</a>").appendTo(el).click( _bind(node,expand) );
						
			for (var i = 0, max = node.children.length; i < max ; i++) {
				node.subTree.append( this.addTreeNode(node.children[i]) );
			}
			
			if (node.json.creator && _b(node.json.creator.collapsed)) {
				node.subTree.hide();
			}
		}
		return el;
	}
	
	this.moveNodeUp = function() {
		if (this.nodeBeingEdited && this.nodeBeingEdited.moveNodeUp) {
			if (this.nodeBeingEdited.moveNodeUp()) {
				this.fillLevelTree();
			}
		}
	}
	
	this.moveNodeDown = function() {
		if (this.nodeBeingEdited && this.nodeBeingEdited.moveNodeDown) {
			if (this.nodeBeingEdited.moveNodeDown()) {
				this.fillLevelTree();
			}
		}
	}
	
	this.moveNodeLeft = function() {
		if (this.nodeBeingEdited && this.nodeBeingEdited.moveNodeLeft) {
			if (this.nodeBeingEdited.moveNodeLeft()) {
				this.fillLevelTree();
			}
		}
	}
	
	this.moveNodeRight = function() {
		if (this.nodeBeingEdited && this.nodeBeingEdited.moveNodeRight) {
			if (this.nodeBeingEdited.moveNodeRight()) {
				this.fillLevelTree();
			}
		}
	}
	
	this.levelTreeNode = false;
	
	this.fillLevelTree = function () {	
		if (this.levelTreeNode) {
			this.levelNodeTree.empty();
			this.levelTreeNode = false;
		}
		if (this.level) {			
			/* node menu */
			this.ui.addMenu( {
					links: [
						{title:'ADD',onselect:_bind(this, this.newNode)},
						{title:'REM',onselect:_bind(this, this.removeNode)},
						{title:'CLO',onselect:_bind(this, this.cloneNode)},
						{title:'&nbsp;↑&nbsp;',onselect:_bind(this, this.moveNodeUp)},
						{title:'&nbsp;↓&nbsp;',onselect:_bind(this, this.moveNodeDown)},
						{title:'◄',onselect:_bind(this, this.moveNodeLeft)},
						{title:'►',onselect:_bind(this, this.moveNodeRight)},						
					],
					css:{fontSize:"4mm",marginTop:"0px",marginBottom:"10px",height:"25px"},
					element:this.levelNodeTree
				}
			);
			
			var treeWrapper = $("<div></div>").css({height:"calc(100% - 55px)",overflow:"auto"}).appendTo(this.levelNodeTree);
			var el = $("<ul class=\"node-tree\"></ul>").appendTo(treeWrapper);
			this.levelTreeNode = this.addTreeNode(this.level);
			el.append( this.levelTreeNode );
			
			this.updateNodeTreeLinks();
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
			this.transformControls.detach();			
			this.transformControls.dispose();			
			this.transformControls = false;
		}		
	}
	
	this.showTransformControls = function( node ) {
		this.hideTransformControls();
		if (node === null || !(node && node.wrapper)) {
			node = this.nodeBeingEdited;
		}
		if (node && node.wrapper && this.host3D && this.host3D.initialized) {			
			this.transformControls = new THREE.TransformControls( this.host3D.camera, this.ui.element[0] /*this.host3D.renderer.domElement*/ );
			this.transformControls.addEventListener( 'change', this.onTransformControlsChangeCallback);
			this.transformControls.attach( node.wrapper );
			//this.transformControls.setSnap( 1 );
			this.host3D.scene.add( this.transformControls );		
			this.showInfo("\"T\" translate | \"Y\",\"Z\" rotate | \"U\" scale | \"+\" increase size | \"-\" decrease size, \"I\" world/local space");
		}
	}
		
	/* MENU */
		
	this.menuContainer = this.ui.addContainer();
	this.menuContainer.css({height:"55px",paddingLeft:"150px",paddingTop:"15px"}).addClass("main-menu").addClass("noselect");
	this.ui.addMenu( {
			links: [
						{title:'New',onselect:_bind(this, this.newLevel)},
						{title:'Load',onselect:_bind(this, this.loadLevelList)},
						{title:'Save & Reload',onselect:_bind(this, this.saveAndReload)},
						{title:'Delete',onselect:_bind(this, this.deleteLevel)},
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
	
	this.levelNodeTree = this.ui.addContainer().addClass("noselect");
	this.levelNodeTree.css({minWidth:"250px",maxWidth:"50%",height:"calc(100% - 55px)",width:"auto",display:"inline-block"});
	
	/* INIT */
	
	this.ui.showLoading();
	this.loadResources();
}
