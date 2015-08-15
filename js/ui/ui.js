function weggeUI( element ) {
	this.element = $("<div id=\"ui\"></div>").appendTo(_coalesce(element, document.body));
			
	this.addContainer = function( element ) {
		return $("<div class=\"container\"></div>").appendTo(_coalesce(element, this.element));	
	}
	
	this.addOverlay = function (element) {
		if (!this.overlay) {
			this.overlay = $("<div class=\"overlay\"></div>").appendTo(_coalesce(element,this.element));
			this.loadingDialog = this.addContainer(this.overlay);
			var topMargin = (window.innerHeight/3);
			this.loadingDialog.css({width:"250px",marginTop:topMargin+"px",marginLeft:"auto",marginRight:"auto",border:"solid 1px White",padding:"5px",textAlign:"center"});
			this.loadingDialog.hide();
		}
		return this.overlay;
	}

	this.removeOverlay = function() {
		this.overlay = false;		
		$(".overlay").remove();
	}
		
	this.addFormItems = function( parent, data, props) {
		var form = $("<ul class=\"form\"></ul>").appendTo(parent);
		for (var property in data) {
			if ((!props)||($.inArray(property, props)>=0)) {
				if (property != "children") {
					var item;				
					(function(_this, _data, _property) {
							item = $("<li class=\"form-item\"></li>");
							item.append("<label for=\"" + property + "\">" + property + "</label>");
							if (_isObject(_data[_property])) {
								_this.addFormItems( item, _data[_property]);
							} else {
								var input = $("<input type=\"text\" value=\"" + _data[_property] + "\"></input>")
									.change( function() { 
										_data[_property] = $( this ).val();
									});
								item.append(input);
							}
						
					})(this, data, property);
				}
				form.append(item);
			}
		}		
	}

	this.addMenu = function ( params ) {
		var menu = $("<ul class=\"menu\"></ul>").css(params.css).appendTo(_coalesce(params.element,this.element));
		var item;
		for (var i = 0, max = params.links.length; i < max; i++) {
			item = $("<li></li>").appendTo(menu);
			if (params.links[i].id) {
				$(item).attr("id", params.links[i].id);
			}
			item.append(params.links[i].title);
			if (params.links[i].onselect) {
				item.on( "click", params.links[i].onselect );
			}
		}
			
		return menu;
	}
	
	this.addCleaner = function(element) {
		var cleaner = $("<div class=\"cleaner\"></div>");
		if (element) {
			cleaner.appendTo(element);
		}
		return cleaner;
	}
		
	this.addNodeProperties = function(element, node, props) {
		if (_isObject(node)) {
			for (var property in node) {	
				if ((!props)||($.inArray(property, props)>=0)) {
					this.addNodeProperties(element, node[property], props);
				}
			}			
		} else {
			$("<td></td>").append(node).appendTo(element);				
		}
	}
	
	this.addNode = function( node, onselect, element, props ) {
		var row;
		row = $("<tr></tr>").appendTo(element);
		var fnc = function () {
			onselect(node);
		}
		row.click(fnc);				
		this.addNodeProperties(row, node, props);
		node.element = row;
	}
	
	this.addTable = function( nodes, onselect, element ) {
		var table = $("<table class=\"list\"></table>").appendTo(_coalesce(element, this.element));
		
		for (var i = 0, max = nodes.length; i < max; i++) {
			this.addNode( nodes[i], onselect, table );
		}			
		return table;
	}
	
	this.addValueToList = function( value, onselect, element, props ) {
		var n;
		n = $("<div></div>").addClass("tile").appendTo(element).append(value);
		var fnc = function () {
			onselect(value);
		}
		n.click(fnc);		
	}
	
	this.addList = function( values, onselect, element ) {
		element = _coalesce(element, this.element);
		var list = $("<div class=\"list\"></div>").appendTo(element);
		for (var i = 0, max = values.length; i < max; i++) {
			this.addValueToList( values[i], onselect, list );			
		}			
		return list;
	}
	
	this.showLoading = function(text) {		
		this.addOverlay();
		this.loadingDialog.show();		
		this.updateLoading(_coalesce(text,"Loading..."));
	}
	
	this.updateLoading = function(message) {
		this.loadingDialog.text(message);
	}
	
	this.hideLoading = function() {
		this.loadingDialog.hide();
		this.removeOverlay();		
	}
	
	/*
	this.onWindowResize = function () {
		this.width = $(this.element).width();
		this.height = $(this.element).height();		
		this.element.css( {top:"0px", left:"0px", width: this.width + "px", height: this.height + "px"} );
		
		//TODO resize all containers
	}	
	window.addEventListener( 'resize', _bind( this, this.onWindowResize) , false );	
	this.onWindowResize();
	*/
}