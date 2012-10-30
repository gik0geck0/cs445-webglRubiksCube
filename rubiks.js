var mouseDown = false;

function doStuff(){
	/*
	http://www.aerotwist.com/tutorials/getting-started-with-three-js/
	*/
	
	// Grab the container canvas
	var canvas = document.getElementById("drawingArea");
	var $container = $('#attach');
	
	// Add mouse events
	// $container.mousedown( function() {
		// mouseDown = true;
		// console.log("Mouse down");
	// });
	// $container.mouseup( function() {
		// if(mouseDown){
			// console.log("Valid click!");
			// mouseDown = false;
			// return;
		// }
		// console.log("Mouse up, no MD");
	// });
	// $container.mousemove( function(event) {
		// if(mouseDown){
			// console.log("Active motion at" + event.pageX + " " + event.pageY);
		// }
	// });
	
	// Set viewport size
	//var WIDTH = canvas.getAttribute("WIDTH");
	//var HEIGHT = canvas.getAttribute("HEIGHT");
	var WIDTH = 400;
	var HEIGHT = 300;
	
	// Set camera attributes
	var VIEW_ANGLE = 45;
	var ASPECT = WIDTH/HEIGHT;
	var NEAR = 0.1;
	var FAR = 10000;
	
	// Create a Renderer, Camera, and Scene
	var renderer = new THREE.WebGLRenderer();
	renderer.antialias = true;
	var camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
	var scene = new THREE.Scene();
	
	// Add camera to scene
	scene.add(camera);
	
	// Camera starts at origin, so move it back
	camera.position.z = 5;
	camera.position.x = 5;
	camera.position.y = 5;
	camera.lookAt(new THREE.Vector3(0,0,0));
	
	// Go Go Gadget Renderer~!
	renderer.setSize(WIDTH, HEIGHT);
	
	// Attach renderer-supplied DOM element
	// wut?
	$container.append(renderer.domElement);
	$canvas = renderer.domElement
	$canvas.style.border ='1px solid black';
	// Add canvas mouse events
	$canvas.addEventListener( 
	'mousedown',
	function() {
		mouseDown = true;
		console.log("Mouse down");
	},
	false);
	$canvas.addEventListener(
	'mouseup',
	function() {
		if(mouseDown){
			console.log("Valid click!");
			mouseDown = false;
			return;
		}
		console.log("Mouse up, no MD");
	},
	false);
	$canvas.addEventListener(
	'mousemove',
	function(event) {
		if(mouseDown){
			console.log("Active motion at" + event.layerX + " " + event.layerY);
		}
	},
	false);
	
	// Set up cube vars
	var height = 1,
		width = 1,
		depth = 1;
	
	// Construct Rubiks object
	var rubiks = new Rubiks(height, width, depth);
	// Add all subcubes to the scene
	rubiks.addCubesToScene(scene);
	
	// create a point light
	var pointLight = new THREE.PointLight(0xFFFFFF);
	
	// set its position
	pointLight.position.x = 5;
	pointLight.position.y = 5;
	pointLight.position.z = 5;
	
	// add to the scene
	scene.add(pointLight);
	
	// Create an ambient light
	var ambient = new THREE.AmbientLight(0x444444);
	
	// Add to scene
	scene.add(ambient);
	
	// Test with subset of cubes
	var subSet = rubiks.cubes[0];
	var fracMovement = 30; // Out of ... 30?
	// Randomly select a 9-set of cubes
	var dim = Math.floor(Math.random()*3);
	var val = Math.floor(Math.random()*3) - 1;
	var args = [null, null, null];
	args[dim] = val;
	var subset = rubiks.subSet(args[0], args[1], args[2]);
	// Subface rotation
	args = [0, 0, 0];
	args[dim] = 1;
	fracMovement = 0;
	var subset = [];
	
	renderer.render(scene, camera);
	(function animloop(){
	  requestAnimFrame(animloop);
	    // Camera flyaround
		var rot = new THREE.Matrix4();
		rot.rotateByAxis(new THREE.Vector3(0,1,0), 0.01);
		camera.applyMatrix(rot);
		if(fracMovement >= 30){
			// Snap cubes to square position
			for(var i = 0; i < subset.length; ++i){
			  subset[i].snapPos();
			}
			// Randomly select a 9-set of cubes
			dim = Math.floor(Math.random()*3);
			val = Math.floor(Math.random()*3) - 1;
			args = [null, null, null];
			args[dim] = val;
			subset = rubiks.subSet(args[0], args[1], args[2]);
			// Subface rotation
			args = [0, 0, 0];
			args[dim] = 1;
			fracMovement = 0;
		}
		var crot = new THREE.Matrix4();
		crot.rotateByAxis(new THREE.Vector3(args[0], args[1], args[2]), Math.PI / 60.0);
		//console.log("Received " + subset.length + " cubes");
		for(var i = 0; i < subset.length; ++i){
		  subset[i].applyMatrix(crot);
		}
		// Update fraction of movement variable
		fracMovement++;
		// Render!
		renderer.render(scene, camera);
	  }
	)();
}

Rubiks = function(size) {
	// Protect against forgetting new
    if ( !(this instanceof Rubiks) ){
		console.log("Rubiks constructor called without new");
		return new Rubiks(1);
	}
	// Will become a 3-dimensional array of cubes
	// TODO: Could be 1-dimensional?
	this.cubes = [];
	// Expects argument of type THREE.Matrix4
	this.transformByMatrix = function(tMatrix){
		for(var i = 0; i < 27; ++i){
			this.cubes[i].applyMatrix(tMatrix);
		}
	}
	// Expects argument of type THREE.Scene
	this.addCubesToScene = function(scene){
		for(var i = 0; i < 27; ++i){
			scene.add(this.cubes[i].mesh);
		}
	}
	// Return a 9-element array of cubes matching the dimension pattern
	// Value of null on a pattern dimension implies freedom
	this.subSet = function(x, y, z){
		var array = [];
		var a = 0;
		var currCube;
		for(var i = 0; i < 27; ++i){
			currCube = this.cubes[i];
			var test = (x === null) ? true : (currCube.pos.x == x);
			var foo = (y === null) ? true : (currCube.pos.y == y);
			var bar = (z === null) ? true : (currCube.pos.z == z);
			if( ( (x === null) ? true : (currCube.pos.x == x) ) &&
				( (y === null) ? true : (currCube.pos.y == y) ) &&
				( (z === null) ? true : (currCube.pos.z == z) ) ){
				array[a] = currCube;
				++a;
			}
		}
		return array;
	}
		
	// Initialize materials and add cubes to array
	for(var i = 0; i < 27; ++i){
		// Calculate iterated position coordinates
		var x = Math.floor((i / 9) - 1);
		var y = Math.floor(((i % 9) / 3) - 1);
		var z = Math.floor(((i % 9) % 3) - 1);
		
		// Create the cube material array
		// Blacks out "interior" faces
		var mats = [new THREE.MeshBasicMaterial((x>0?{color:0xFF0000}:{color:0x000000})),
					new THREE.MeshBasicMaterial((x<0?{color:0xFFFF00}:{color:0x000000})),
					new THREE.MeshBasicMaterial((y>0?{color:0x00FF00}:{color:0x000000})),
					new THREE.MeshBasicMaterial((y<0?{color:0x0000FF}:{color:0x000000})),
					new THREE.MeshBasicMaterial((z>0?{color:0xFF7F00}:{color:0x000000})),
					new THREE.MeshBasicMaterial((z<0?{color:0xFFFFFF}:{color:0x000000}))];
		// Draw all faces
		var sides = [true, true, true, true, true, true];
	
		// Create the mesh geometry
		var cube = new SubCube(1, mats, sides);
		
		// Move the cube appropriately
		cube.translate(x*1.1, y*1.1, z*1.1);
		
		// Prepare the cube's position tracking variable
		delete cube.pos;
		cube.pos = new THREE.Vector4(x, y, z, 1);
		
		// Add cube to rubiks
		this.cubes[i] = cube;
	}
};

SubCube = function(size, mats, sides){
	// Protect against forgetting new
    if ( !(this instanceof SubCube) ){
		console.log("SubCube constructor called without new; null returned!");
		return null;
	}
	// Track our position in the cube, accumulating rotations
	this.pos = new THREE.Vector4(0,0,0,1);
	
	// Populate our mesh
	this.mesh = new THREE.Mesh(				
				  new THREE.CubeGeometry(
					size,
					size,
					size,
					1,
					1,
					1,
					mats,
					sides),
				  new THREE.MeshFaceMaterial());
				  
	// Translate convenience function
	this.translate = function(dx, dy, dz){
		this.mesh.position.x += dx;
		this.mesh.position.y += dy;
		this.mesh.position.z += dz;
	}
	
	// Apply an arbitrary transformation matrix
	this.applyMatrix = function(matrix){
		this.mesh.applyMatrix(matrix);
		this.pos = matrix.multiplyVector4(this.pos);
		//this.snapPos();
	}
	
	this.snapPos = function(){
		this.pos.x = Math.round(this.pos.x);
		this.pos.y = Math.round(this.pos.y);
		this.pos.z = Math.round(this.pos.z);
	}
};

// shim layer with setTimeout fallback
    window.requestAnimFrame = (function(){
      return  window.requestAnimationFrame       || 
              window.webkitRequestAnimationFrame || 
              window.mozRequestAnimationFrame    || 
              window.oRequestAnimationFrame      || 
              window.msRequestAnimationFrame     || 
              function( callback ){
                window.setTimeout(callback, 1000 / 60);
              };
    })();

$(document).ready(doStuff);