function weggeResourcesManager( params ) {
	this.ui = params.ui;
	this.resources = params.resources;
	this.container = false;
	this.onResourceSelected = params.onResourceSelected;
	this.overlay = false;
	
	this.show = function (resources) {
		this.resources = resources;
		this.overlay = this.ui.addOverlay();
		if (!this.container) {
			this.container = this.ui.addContainer().css({left:"0px",right:"0px",top:"70px",bottom:"0px",opacity:1,position:"fixed",zIndex:"99999999999999"});
			this.innerContainer = this.ui.addContainer(this.container).addClass("border");			
			this.resourcesList = this.ui.addContainer(this.innerContainer).addClass("column half");
			this.resourceForm = this.ui.addContainer(this.innerContainer).addClass("column half");			
			this.ui.addMenu( {
					links: [
								{title:'New resource',onselect:_bind(this, this.newResource)},
								{title:'Cancel',onselect:_bind(this, this.hide)},
							],
					css:{top:0,left:0},
					element:this.innerContainer 
				}
			);
		}
		this.resourcesList.empty();
		if (this.resources.children.length > 0) {
			var list = $("<table class=\"list\"></table>").appendTo(this.resourcesList);		
			var fn = _bind(this, this.editResource);
			for (var i = 0, max = this.resources.children.length; i < max; i++) {
				this.ui.addNode( this.resources.children[i].json, fn, list, this.resources.children[i].id + " " + this.resources.children[i].json.name + " " + this.resources.children[i].json.type );
			}
		} else {
			this.resourcesList.append("No resources available in weGGe database.");
		}
		this.container.show();
	}
	
	this.resourceTypeSelected = function ( rtype ) {
		var resource = new window["wegge" + rtype]();
		this.resources.children.push( resource );
		this.ui.addNode(resource.json, _bind(this, this.editResource), this.resourcesList);
		this.editResource(resource);		
	}
	
	this.resourceTypeCancel = function() {
		this.resourceForm.empty();
	}
	
	this.removeResource = function() {
		if (this.resourceBeingEdited && (this.resourceBeingEdited !== this.level)) {
			this.resourceBeingEdited.treeContainer.remove();
			this.level.removeNode(this.resourceBeingEdited);
			this.nodeCancel();
		}
	}
	
	this.newResource = function() {
		this.resourceForm.empty();
		weggeResource.prototype.availableTypes.sort();
		this.ui.addNodeList( weggeResource.prototype.availableTypes, _bind(this, this.resourceTypeSelected), this.resourceForm );
		this.ui.addMenu( {
				links: [
							{title:'Cancel',onselect:_bind(this, this.resourceTypeCancel)},
						],
				css:{top:0,left:0},
				element:this.resourceForm
			}
		);		
	}
	
	this.editResource = function( resource ) {		
		this.resourceForm.empty();
		this.resourceBeingEdited = resource;
		$(".selected", this.resourcesList).removeClass("selected");
		//$("a:first",this.resourceBeingEdited.listContainer).addClass("selected");
		this.ui.addFormItems( this.resourceForm, resource.json );
		this.ui.addCleaner( this.resourceForm );
		this.ui.addMenu( {
				links: [
							{title:'Save',onselect: _bind(this, this.saveResource)},
						],
				css:{top:0,left:0},
				element:this.resourceForm
			}
		);
		//render preview here
	}
	
	this.hide = function () {
		if (this.container) {
			this.container.hide();
		}
		if (this.overlay) {
			this.overlay.remove();
		}
	}
	
	this.selectResource = function ( resource_type ) {
	
	}
	
	this.resourceSaved = function (data) { 		
		if (!isNaN(data)) {
			this.resourceBeingEdited.id = parseInt(data);
			console.log("Resource " + this.resourceBeingEdited.id + " saved.");
		} else {
			console.log("Resource not saved successfully:" + data); 
		}
	}
	
	this.saveResource = function() {
		if (this.resourceBeingEdited) {
			this.resourceBeingEdited.applyJSON();
			var json = this.resourceBeingEdited.getJSON();
			var jsonString = JSON.stringify(json);
			$.post("php/saveResource.php", { "resource_id":this.resourceBeingEdited.id,"resource_json":jsonString }, 
				_bind(this, this.resourceSaved)
			);
		} else {
			console.log("Cannot save - no resource selected.");
		}
	}
}