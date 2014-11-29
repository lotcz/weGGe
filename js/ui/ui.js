function weggeUI( element ) {
	this.element = $("<div id=\"ui\"></div>").appendTo(_coalesce(element, document.body));
	
	this.addContainer = function( element ) {
		return $("<div class=\"container\"></div>").appendTo(_coalesce(element, this.element));	
	}
	
	this.addFormItems = function( parent, data, props) {
		var form = $("<ul class=\"form\"></ul>").appendTo(parent);
		for (var property in data) {
			if ((!props)||($.inArray(property, props)>=0)) {
				var item = $("<li class=\"form-item\"></li>");
				item.append("<label for=\"" + property + "\">" + property + "</label>");
				
				(function(_this, _data, _property) {
					if (_property != "children") {
						if (_isObject(_data[_property])) {
							_this.addFormItems( item, _data[_property]);
						} else {
							var input = $("<input type=\"text\" value=\"" + _data[_property] + "\"></input>")
								.change( function() { 
									_data[_property] = $( this ).val();
								});
							item.append(input);
						}
					}
				})(this, data, property);
				
				form.append(item);
			}
		}
	}

	this.addMenu = function ( params ) {
		var menu = $("<ul class=\"menu\"></ul>").css(params.css).appendTo(_coalesce(params.element,this.element));
		var item;
		for (var i = 0, max = params.links.length; i < max; i++) {
			item = $("<li></li>").appendTo(menu);
			item.append(params.links[i].title);
			if (params.links[i].onselect) {
				item.on( "click", params.links[i].onselect );
			}
		}
			
		return menu;
	}
	
	this.addOverlay = function () {
		if (!this.overlay) {
			this.overlay = $("<div class=\"overlay\"></div>").appendTo(this.element);
		}
		return this.overlay;
	}

	this.removeOverlay = function() {
		if (this.overlay) {
			this.overlay.remove();
			this.overlay = false;
		}
	}
	
	this.addNode = function( node, onselect, element ) {
		var row;
		row = $("<tr></tr>").appendTo(element);
		var fnc = function () {
			onselect(node);
		}
		row.click(fnc);				
		if (_isObject(node)) {
			for (var property in node) {
				$("<td></td>").append(node[property]).appendTo(row);				
			}
		} else {
			$("<td></td>").append(node).appendTo(row);				
		}
	}
	
	this.addNodeList = function( nodes, onselect, element ) {
		var list = $("<table class=\"list\"></table>").appendTo(_coalesce(element, this.element));
		
		for (var i = 0, max = nodes.length; i < max; i++) {
			this.addNode( nodes[i], onselect, list );
		}			
		return list;
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