function weggeResourcesManager( params ) {
	this.ui = params.ui;
	this.resources = params.resources;
	this.container = false;
	this.onResourceSelected = params.onResourceSelected;
	this.onManagerExit = params.onManagerExit;
	this.overlay = false;
	
	this.show = function (resources) {
		this.resources = resources;
		this.overlay = this.ui.addOverlay();
		if (!this.container) {
			this.container = this.ui.addContainer()
				.css({left:"0px",right:"0px",height:"100%",top:"0px",bottom:"0px",opacity:1,position:"fixed",zIndex:"99999999999999"})
				.addClass("resources");
			this.innerContainer = this.ui.addContainer(this.container).addClass("border").css({height:"calc(100% - 60px)"});			
			this.resourcesList = this.ui.addContainer(this.innerContainer).addClass("column").css({overflow:"auto",height:"calc(100% - 44px)",width:"40%",minWidth:"250px"});
			this.resourceForm = this.ui.addContainer(this.innerContainer).addClass("column").css({paddingLeft:"10%",width:"40%"});
					
			this.ui.addCleaner(this.innerContainer);
					
			this.ui.addMenu( {
					links: [
								{title:'NEW',onselect:_bind(this, this.newResource)},								
								{title:'CANCEL',onselect:_bind(this, this.hide)},
							],
					css:{top:0,left:0},
					element:this.innerContainer 
				}
			);
			
			this.ui.addCleaner(this.innerContainer);
		}
		this.resourcesList.empty();
		this.resourcesInnerList = $("<table class=\"list\"></table>").appendTo(this.resourcesList);
		if (this.resources.children.length > 0) {			
			var fn = _bind(this, this.editResource);
			for (var i = 0, max = this.resources.children.length; i < max; i++) {
				this.ui.addNode( this.resources.children[i], fn, this.resourcesInnerList, ["json","name","type","path"] );
			}
		} else {
			this.resourcesList.append("No resources available in weGGe database.");
		}
		this.container.show();
	}
	
	this.resourceTypeSelected = function ( rtype ) {
		var resource = new window["wegge" + rtype]();
		this.resources.children.push( resource );
		this.ui.addNode(resource, _bind(this, this.editResource), this.resourcesInnerList, ["json","name","type","path"]);
		this.editResource(resource);		
	}
	
	this.resourceTypeCancel = function() {
		this.resourceForm.empty();
	}
	
	this.resourceFormCancel = function() {
		this.resourceForm.empty();
	}
	
	this.resourceDeleted = function(data) {
		console.log("Resource deleted:" + data);
	}
	
	this.deleteResource = function() {
		if (this.resourceBeingEdited) {
			if (confirm("Are you sure to delete this resource?")) {
				if (this.resourceBeingEdited.element) {
					this.resourceBeingEdited.element.remove();
				}
				$.post("php/deleteResource.php", { "resource_id":this.resourceBeingEdited.id }, 
					_bind(this, this.resourceDeleted)
				);
				this.resourceFormCancel();
			}
		}
	}
	
	this.newResource = function() {
		this.resourceForm.empty();
		weggeResource.prototype.availableTypes.sort();
		this.ui.addList( weggeResource.prototype.availableTypes, _bind(this, this.resourceTypeSelected), this.resourceForm );
		this.ui.addMenu( {
				links: [
							{title:'Cancel',onselect:_bind(this, this.resourceTypeCancel)},
						],
				css:{top:0,left:0},
				element:this.resourceForm
			}
		);		
	}
	
	this.cloneResource = function() {
		var resource = weggeNode.prototype.createNode(this.resourceBeingEdited.json);
		this.resources.children.push(resource);
		this.ui.addNode(resource, _bind(this, this.editResource), this.resourcesInnerList, ["json","name","type","path"]);
		this.editResource(resource);
	}
	
	/* RESOURCE PREVIEW */
	this.ui.addResourcePreview = function( element, resource ) {
		if (resource && resource.renderPreview) {
			element.append(resource.renderPreview());
		}
	}
	
	this.editResource = function( resource ) {		
		this.resourceForm.empty();
		this.resourceBeingEdited = resource;
		$(".selected", this.resourcesList).removeClass("selected");
		if (this.resourceBeingEdited && this.resourceBeingEdited.element) {
			$(this.resourceBeingEdited.element).addClass("selected");
		}
		this.ui.addFormItems( this.resourceForm, resource.json );
		this.ui.addCleaner( this.resourceForm );
		this.ui.addResourcePreview( this.resourceForm, resource );
		this.ui.addCleaner( this.resourceForm );
		this.ui.addMenu( {
				links: [
							{title:'SAVE',onselect: _bind(this, this.saveResource)},
							{title:'CLONE',onselect: _bind(this, this.cloneResource)},
							{title:'DELETE',onselect: _bind(this, this.deleteResource)},
							{title:'CANCEL',onselect: _bind(this, this.resourceFormCancel)},
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
		if (this.onManagerExit) {
			this.onManagerExit();
		}
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
			$.post("php/saveResource.php", 
				{ 	"resource_id":this.resourceBeingEdited.id,
					"resource_name":this.resourceBeingEdited.json.name,
					"resource_json":jsonString }, 
				_bind(this, this.resourceSaved)
			);
		} else {
			console.log("Cannot save - no resource selected.");
		}
	}
}