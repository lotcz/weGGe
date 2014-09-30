function weggeHUD( element ) {
	this.element = element;
	this.containers = [];
}

weggeHUD.prototype.onWindowResize = function ( width, height ) {
	this.width = width;
	this.height = height;		
	this.element.css( {top:"0px", left:"0px", width: this.width + "px", height: this.height + "px"} );
	
	//TODO resize all containers

}

weggeHUD.prototype.newDialog = function ( title ) {
	return $("<div></div>").dialog({
	  title:title,
	  buttons: [
		{
		  text: "OK",
		  click: function() {
			$( this ).dialog( "close" );
		  }
		}
	  ]
	});
}

weggeHUD.prototype.newForm = function ( title, data ) {
	var form = $("<div></div>");
	for (var property in data) {
		var item = $("<div class=\"form-item\"></div>");
		item.append("<label for=\"" + property + "\">" + property + "</label>");
		
		(function( _data, _property) {
			var input = $("<input type=\"text\" value=\"" + _data[_property] + "\"></input>")
				.change( function() { 
					//this.data[prop] = 
					_data[_property] = $( this ).val();
					//alert(_data[_property]);
					//str += $( this ).text() + " ";
				});
			item.append(input);
			}
		)(data, property);
		
		form.append(item);
	}
	
	return $("<div></div>")
	.append(form)	
	.dialog({
	  title:title,
	  buttons: [
		{
		  text: "OK",
		  click: function() {
			$( this ).dialog( "close" );
		  }
		},
		{
		  text: "Close",
		  click: function() {
			$( this ).dialog( "close" );
		  }
		}
	  ]
	})
	.css({width:"500px"});
}