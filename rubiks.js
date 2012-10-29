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
	
	// Set up sphere vars
	var height = 1,
		width = 1,
		depth = 1;
	
	var rubiks = new Object();
	rubiks.cubes = [];
	rubiks.rotateX = function(rotation){for(var i = 0; i < 3; ++i){
										for(var j = 0; j < 3; ++j){
										for(var k = 0; k < 3; ++k){
											var rot = new THREE.Matrix4();
											rot.rotateByAxis(new THREE.Vector3(1,0,0), rotation);
											this.cubes[i][j][k].applyMatrix(rot);
										}
										}
										};};
	rubiks.rotateY = function(rotation){for(var i = 0; i < 3; ++i){
										for(var j = 0; j < 3; ++j){
										for(var k = 0; k < 3; ++k){
											var rot = new THREE.Matrix4();
											rot.rotateByAxis(new THREE.Vector3(0,1,0), rotation);
											this.cubes[i][j][k].applyMatrix(rot);
										}
										}
										};};
	rubiks.rotateZ = function(rotation){for(var i = 0; i < 3; ++i){
										for(var j = 0; j < 3; ++j){
										for(var k = 0; k < 3; ++k){
											var rot = new THREE.Matrix4();
											rot.rotateByAxis(new THREE.Vector3(0,0,1), rotation);
											this.cubes[i][j][k].applyMatrix(rot);
										}
										}
										};};
	
	for(var i = 0; i < 3; ++i){
		rubiks.cubes[i] = [];
		for(var j = 0; j < 3; ++j){
			rubiks.cubes[i][j] = [];
			for(var k = 0; k < 3; ++k){
				// Create the cube material array
				var mats = [new THREE.MeshBasicMaterial((i>1?{color:0xFF0000}:{color:0x000000})),
							new THREE.MeshBasicMaterial((i<1?{color:0xFFFF00}:{color:0x000000})),
							new THREE.MeshBasicMaterial((j>1?{color:0x00FF00}:{color:0x000000})),
							new THREE.MeshBasicMaterial((j<1?{color:0x0000FF}:{color:0x000000})),
							new THREE.MeshBasicMaterial((k>1?{color:0xFF7F00}:{color:0x000000})),
							new THREE.MeshBasicMaterial((k<1?{color:0xFFFFFF}:{color:0x000000}))];
				var sides = [true, true, true, true, true, true];
			
				// Create the mesh geometry
				var cube = new THREE.Mesh(				
				  new THREE.CubeGeometry(
					height,
					width,
					depth,
					1,
					1,
					1,
					mats,
					sides),
				  new THREE.MeshFaceMaterial());
				
				// Move the cube appropriately
				cube.position.x = (i-1)*1.1;
				cube.position.y = (j-1)*1.1;
				cube.position.z = (k-1)*1.1;
				
				// Add cube to scene
				scene.add(cube);
				
				// Add cube to rubiks
				rubiks.cubes[i][j][k] = cube;
			}
		}
	}
	
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
	
	renderer.render(scene, camera);
	var frame = 0;
		(function animloop(){
		  requestAnimFrame(animloop);
			//pointLight.position.x = 100 * Math.sin(frame/10.0);
			//pointLight.position.y = 100 * Math.sin(frame/10.0);
			//pointLight.position.z = 100 * Math.cos(frame/10.0);
			//rubiks.rotateX(.1 * Math.cos(frame/10.0));
			//rubiks.rotateY(0.03);
			//rubiks.rotateZ(0.05);
			var rot = new THREE.Matrix4();
			rot.rotateByAxis(new THREE.Vector3(0,1,0), 0.01);
			camera.applyMatrix(rot);
			rot = new THREE.Matrix4();
			rot.rotateByAxis(new THREE.Vector3(1,0,0), 0.01);
			for(var j=0; j < 3; ++j){
				for(var k=0; k < 3; ++k){
					subSet[j][k].applyMatrix(rot);
				}
			}
			frame += 1;
			renderer.render(scene, camera);
		})();
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
		for(var i = 0; i < 3; ++i){
			for(var j = 0; j < 3; ++j){
				for(var k = 0; k < 3; ++k){
					this.cubes[i][j][k].applyMatrix(tMatrix);
				}
			}
		}
	}
	// Expects argument of type THREE.Scene
	this.addCubesToScene(scene){
		for(var i = 0; i < 3; ++i){
			for(var j = 0; j < 3; ++j){
				for(var k = 0; k < 3; ++k){
					scene.add(this.cubes[i][j][k]);
				}
			}
		}
	}
	// Return a 9-element array of cubes matching the dimension pattern
	// Value of null on a pattern dimension implies freedom
	this.subSet(x, y, z){
		var array = [];
		var i = 0;
		var currCube;
		for(var i = 0; i < 3; ++i){
			for(var j = 0; j < 3; ++j){
				for(var k = 0; k < 3; ++k){
					currCube = this.cubes[i][j][k]
					if(currCube
				}
			}
		}
	}
		
	// Initialize materials and add cubes to array
	for(var i = 0; i < 3; ++i){
		rubiks.cubes[i] = [];
		for(var j = 0; j < 3; ++j){
			rubiks.cubes[i][j] = [];
			for(var k = 0; k < 3; ++k){
				// Create the cube material array
				// Blacks out "interior" faces
				var mats = [new THREE.MeshBasicMaterial((i>1?{color:0xFF0000}:{color:0x000000})),
							new THREE.MeshBasicMaterial((i<1?{color:0xFFFF00}:{color:0x000000})),
							new THREE.MeshBasicMaterial((j>1?{color:0x00FF00}:{color:0x000000})),
							new THREE.MeshBasicMaterial((j<1?{color:0x0000FF}:{color:0x000000})),
							new THREE.MeshBasicMaterial((k>1?{color:0xFF7F00}:{color:0x000000})),
							new THREE.MeshBasicMaterial((k<1?{color:0xFFFFFF}:{color:0x000000}))];
				// Draw all faces
				var sides = [true, true, true, true, true, true];
			
				// Create the mesh geometry
				var cube = new SubCube(1, mats, sides);
				
				// Move the cube appropriately
				cube.translate((i-1)*1.1, (j-1)*1.1, (k-1)*1.1);
				
				// Prepare the cube's position tracking variable
				delete cube.position;
				cube.position = new THREE.Vector3(i-1, j-1, k-1);
				
				// Add cube to rubiks
				rubiks.cubes[i][j][k] = cube;
			}
		}
	}
};

SubCube = function(size, mats, sides){
	// Protect against forgetting new
    if ( !(this instanceof SubCube) ){
		console.log("SubCube constructor called without new; null returned!");
		return null;
	}
	// Track our position in the cube, accumulating rotations
	this.pos = new THREE.Vector3(0,0,0);
	
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
		this.pos = matrix * this.pos;
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