function axis( params ) {
	this.minX = -100;
	this.maxX = 100;
	this.minY = -100;
	this.maxY = 0;
	this.minZ = -100;
	this.maxZ = 100;
	this.scale = 500;
	this.wrapper = new THREE.Object3D();
	if (params.scene) params.scene.add( this.wrapper );
	
	var geometry = new THREE.SphereGeometry();
	var material = new THREE.MeshBasicMaterial({color:0xffffff});
	
	var x, ball, text;
	
	for (var i = this.minX; i <= this.maxX; i++ ) {
			if ( i != 0 ) {
				x = i * this.scale;
				ball = new THREE.Mesh( geometry, material );
				ball.position.set( x, 0, 0 );
				this.wrapper.add(ball);
				text = makeTextSprite( "X: " + x , { fontsize: 80, fontface:"Arial", fontColor: {r:200, g:200, b:255, a:1},  borderColor: {r:200, g:200, b:255, a:1}, backgroundColor: {r:40, g:40, b:80, a:0.5} } );
				text.position.set( x, 150, 0 ); 
				this.wrapper.add( text );
			}
	}	

	for (var i = this.minY; i <= this.maxY; i++ ) {
		if ( i != 0 ) {
			x = i * this.scale;
			ball = new THREE.Mesh( geometry, material );
			ball.position.set( 0, x, 0 );
			this.wrapper.add(ball);
			text = makeTextSprite( "Y: " + x , { fontsize: 80, fontface:"Arial", fontColor: {r:200, g:200, b:255, a:1},  borderColor: {r:200, g:200, b:255, a:1}, backgroundColor: {r:40, g:40, b:80, a:0.5} } );
			text.position.set( 150, x, 0 ); 
			this.wrapper.add( text );
		}
	}		
	
	for (var i = this.minZ; i <= this.maxZ; i++ ) {
		if ( i != 0 ) {
			x = i * this.scale;
			ball = new THREE.Mesh( geometry, material );
			ball.position.set( 0, 0, x );
			this.wrapper.add(ball);
			text = makeTextSprite( "Z: " + x , { fontsize: 80, fontface:"Arial", fontColor: {r:200, g:200, b:255, a:1},  borderColor: {r:200, g:200, b:255, a:1}, backgroundColor: {r:40, g:40, b:80, a:0.5} } );
			text.position.set( 0, 150, x ); 
			this.wrapper.add( text );
		}
	}	
	
}