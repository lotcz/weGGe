function weggeUI( element ) {
	this.element = $("<div id=\"ui\"></div>").appendTo(_coalesce(element, document.body));
	
	this.addContainer = function( element ) {
		return $("<div class=\"container\"></div>").appendTo(_coalesce(element, this.element));	
	}
	
	this.addFormItems = function( parent, data, props) {
		var form = $("<ul></ul>").appendTo(parent);
		for (var property in data) {
			if ((!props)||($.inArray(property, props)>=0)) {
				var item = $("<li class=\"form-item\"></li>");
				item.append("<label for=\"" + property + "\">" + property + "</label>");
				
				(function(_this, _data, _property) {
					if (_property!="children" && _isObject(_data[_property])) {
						_this.addFormItems( item, _data[_property]);
					} else {
						var input = $("<input type=\"text\" value=\"" + _data[_property] + "\"></input>")
							.change( function() { 
								_data[_property] = $( this ).val();
							});
						item.append(input);
					}
				})(this, data, property);
				
				form.append(item);
			}
		}
	}

	this.addForm = function ( title, data, onsave ) {
		var dialog = $("<div></div>");
		renderFormItems( dialog, data, ['id','name','json']);
		return dialog;
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