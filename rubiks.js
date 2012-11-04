var mouseDown = false;
function Init(){
	/*
	http://www.aerotwist.com/tutorials/getting-started-with-three-js/
	*/
	
	var duration = 100;
	var Anim = null;
	var rubiks = null;
	var isRandomizing = false;
	var randomNum = 0;
	// Grab the container canvas with jQuery
	var $container = $('#attach');
	
	var $shuffleButton = $('#shuffle');
	$shuffleButton.click(function() {
		console.log("Shuffle was clicked");
		randomNum = 20;
	});
	// Set viewport size
	var WIDTH = 640;
	var HEIGHT = 480;
	
	// Set camera attributes
	var VIEW_ANGLE = 45; // Vertical FoV
	var ASPECT = WIDTH/HEIGHT; 
	var NEAR = 0.1; // Distance to near clipping plane from camera
	var FAR = 10000; // Distance to far clipping plane from camera
	// Since we have a very simple scene, the clipping distances aren't terribly important
	// If we had more stuff to render, we would want to minimize the clipping boundaries
	
	// Create a Renderer, Camera, and Scene
	// Note the calls into the THREE library for these objects
	var renderer = new THREE.WebGLRenderer({antialias: true});
	var camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
	var scene = new THREE.Scene();
	// A renderer is the interface to the OpenGL drivers; it handles the brunt of rendering
	// A camera defines where in space the viewport looks. It starts
		// at the origin, looking along the positive(?) z-axis, oriented with (0, 1, 0) as 'up'
	// A scene holds a set of meshes to be rendered, as well as any lighting elements
	
	// Add camera to scene
	scene.add(camera);	
	// Camera starts at origin, so move it back
	camera.position.z = 5;
	camera.position.x = 5;
	camera.position.y = 5;
	camera.lookAt(new THREE.Vector3(0,0,0)); // Assumes positive y-axis as 'up'
	
	// Go Go Gadget Renderer~!
	renderer.setSize(WIDTH, HEIGHT); // Tells the renderer what size of image buffer to allocate
	
	// Attach renderer-supplied DOM element
	$container.append(renderer.domElement);
	// Add a small black border so we can see where the canvas ends
	$canvas = renderer.domElement
	$canvas.style.border ='1px solid black';
	
	// Add canvas mouse event stubs
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
	var prevX = 100;
	var prevY = 100;
	$canvas.addEventListener(
	'mousemove',
	function(event) {
		if(mouseDown){
			
			var rotX = 0;
			var rotY = 0;
			// Find what 'direction' we are rotating in, if any
			if(event.layerX-prevX > 0) {
				rotX = -1;
			} else if(event.layerX-prevX < -0) {
				rotX = 1;
			}
			if(event.layerY-prevY > 0) {
				rotY = -1;
			} else if(event.layerY-prevY < -0) {
				rotY = 1;
			}
			var rot = new THREE.Matrix4();
			if(rotX != 0 || rotY != 0){
				// We can always safely rotate by X around the y axis
				if(rotX != 0){
					rot.rotateByAxis(new THREE.Vector3(0,rotX,0), 0.03);
				}
				// The y-rotation is actually relative to the camera's view, so we
				// have to do some validation
				if(rotY != 0 && camera.position.y ){
					// Calculate the camera's look direction
					var camLook = new THREE.Vector3(0,0,0);
					camLook.sub(new THREE.Vector3(0,0,0), camera.position);
					// Calculate the y-axis
					var yAxis = new THREE.Vector3(0,1,0);
					// Calculate the axis perpendicular to the look direction and y-axis,
					// which will be a 'left-right' axis relative to the viewport
					var rotYAxis = new THREE.Vector3(0,0,0);
					rotYAxis.cross(camLook, yAxis);
					// Assume we aren't allowed to rotate
					var rotAmount = 0;
					// Prevent rotation 'upwards' beyond a certain height
					// Prevent rotation 'downwards' beyond a negative height
					if( (rotY == -1 && camera.position.y < 4.99)  ||
					    (rotY == 1 && camera.position.y > -4.99) ){
						rotAmount = 0.03 * rotY;
					}
					// Might rotate by 0, which is safe
					rot.rotateByAxis(rotYAxis, rotAmount);
				}
				camera.applyMatrix(rot);
			}
			//var rotX = 0;
			//var rotY = 0;
			//if(event.layerX-prevX > 0) {
			//	rotX = 1;
			//} else if(event.layerX-prevX < -0) {
			//	rotX = -1;
			//}
			//if(event.layerY-prevY > 0) {
			//	rotY = 1;
			//} else if(event.layerY-prevY < -0) {
			//	rotY = -1;
			//}
			//var rot = new THREE.Matrix4();
			//rot.rotateByAxis(new THREE.Vector3(-rotY,-rotX,rotY), 0.03);
			//camera.applyMatrix(rot);
			//test comment
			console.log("Active motion at" + event.layerX + " " + event.layerY + 
				"\nprevX: " + prevX + " prevY: " + prevY +
				"\nrotX: " + rotX + " rotY: " + rotY);
			
			prevX = event.layerX;
			prevY = event.layerY;
		}
	},
	false);
	document.addEventListener(
		'keypress',
		function(evt) {
			var keyCode = evt.which;
			if (Anim == null) {
				Anim = handleKeyPress(rubiks, duration, evt.shiftKey, keyCode);
			}
		}
		, false);

	
	// Construct Rubiks object
	rubiks = new Rubiks(1, 1, 1); // x, y, z dimensions of the cube in world coords
	// Add all subcubes to the scene
	rubiks.addCubesToScene(scene);
	
	// THE LIGHTS DON'T ACTUALLY DO ANYTHING	
	// create a point light
	var pointLight = new THREE.PointLight(0xFFFFFF); // Pure white
	// set its position
	pointLight.position.x = 5;
	pointLight.position.y = 5;
	pointLight.position.z = 5;	
	// add to the scene
	scene.add(pointLight);
	// THE LIGHTS DON'T ACTUALLY DO ANYTHING
	// Create an ambient light
	var ambient = new THREE.AmbientLight(0x444444); // Soft gray	
	// Add to scene
	scene.add(ambient);
	// Because of the chosen material for the cubes, the renderer defaults to an ambient white light
	
	
	// THIS CAN BE REMOVED
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
	
	// get a random animation
	//var Anim = getNewRandomAnimation(rubiks, duration);
	renderer.render(scene, camera); // You need to make at least one render call before the animation loop
	
	/*
		This is where the meat of things happens. For each frame, a call is made to
		the browser's provided requestAnimFrame function. This function will cause the
		browser to pause our simulation until a frame is ready to be rendered (usually
		at a fairly constant 60fps). This call is made by recursively passing the animLoop function.
		After requesting the animation frame, the animLoop function is given the go-ahead
		by the browser to do its drama; here, we rotate the camera, update the animation
		under consideration (or generate a new one), and finally ask the renderer to update
		our view of the world. The renderer will automatically copy its render buffer
		to the canvas object is generated; the only limit to how fast it does this
		is the wait time enforced by requestAnimFrame!
	 */
	(function animloop(){
		requestAnimFrame(animloop);
		
	    // Camera flyaround
		// Note that we re-allocate every iteration -- that's bad!
		var rot = new THREE.Matrix4();
		rot.rotateByAxis(new THREE.Vector3(0,1,0), 0.01);
		//camera.applyMatrix(rot);
		
		// Update the animation, or make a new one if it's complete
		if(Anim == null || Anim.complete){
			Anim = null;
			//Anim = getNewRandomAnimation(rubiks, 1000);
			//Anim = rightFace(rubiks, duration, false);
			if (randomNum > 0) {
				Anim = getNewRandomAnimation(rubiks, duration);
				randomNum--;
			} else {
				//Anim = getNewAnimation(rubiks, duration, false, 0, -1);
			}
		}
		else{
			Anim.update();
		}
		
		// Render!
		renderer.render(scene, camera);
	  }
	)();
	// Note the syntax on the function here -- we create the function object,
	// then immediately call it from its own definition. Pretty slick!
}

Rubiks = function(size) {
	// Protect against forgetting new
    if ( !(this instanceof Rubiks) ){
		console.log("Rubiks constructor called without new");
		return new Rubiks(1);
	}
		
	/* MEMBER INITIALIZATION */
		
	// Will become a 1-dimensional array of cubes
	this.cubes = [];
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
	
	/* FUNCTION DEFINITIONS */
	
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
	// Ex: [null, 1, null] returns all cubes with y-coordinate of value 1
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
};

SubCube = function(size, mats, sides){
	// Protect against forgetting new
    if ( !(this instanceof SubCube) ){
		console.log("SubCube constructor called without new; null returned!");
		return null;
	}
	
	/* MEMBER INITIALIZATION */
	
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
				  
				  
	/* FUNCTION DEFINITIONS */
	
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
	
	// Necessary to avoid rounding errors with repeated transformations
	this.snapPos = function(){
		this.pos.x = Math.round(this.pos.x);
		this.pos.y = Math.round(this.pos.y);
		this.pos.z = Math.round(this.pos.z);
	}
};

Animation = function(duration, interpolatorActor){
	this.startTime = new Date().getTime(); // Get the current millis time
	this.duration = duration; // Duration in milliseconds
	this.progress = 0; // Current millis elapsed
	this.interpolatorActor = interpolatorActor; // Interpolator function, see note at end of prototype
	this.complete = false;
	
	// Cause the interpolatorActor to update its logic to the current position of progress
	this.update = function(){
		// Return immediately if complete
		if(this.complete){
			return;
		}
		progress = (new Date().getTime() - this.startTime); // Update progress ticker
		interpolatorActor(progress/duration); // Call interpolator logic
		// Check for completeness
		if(progress >= duration){
			this.complete = true;
		}
	}
	
	/*
	 * The interpolator function signature should look like this:
	 
	  		void interp( progressFrac )
	 
	 * where progressFrac is bounded [0,1].
	 *
	 * The interpolator function should take advantage of the fact
	 * that javascript supports closures and fully encapsulate any
	 * logic and data necessary to perform its action(s).
	 *
	 * Should the interpolator ever receive progressFrac >= 1, it
	 * should finalize the animation into a stable position and
	 * call any other finalization logic (e.g., position snapping).
	 */
}

function rightFace(rubiks, duration, prime) {
	return getNewAnimation(rubiks, duration, prime, 0, 1);
}

function backFace(rubiks, duration, prime) {
	return getNewAnimation(rubiks, duration, !prime, 2, -1);
}

function handleKeyPress(rubiks, duration, shift, keyCode) {
	if (!shift) {
		keyCode = keyCode -32;
	}
	console.log("Shift? " + shift + " key? " + keyCode);
	switch(keyCode) {
		case 87:
			// w
			// Camera UP
			break;
		case 65:
			// a
			// Camera LEFT
			break;
		case 83:
			// s
			// Camera DOWN
			break;
		case 68:
			// d
			// Camera RIGHT
			break;
		case 81:
			// q
			break;
		case 69:
			// e
			break;
		case 82:
			// r
			break;
		case 84:
			// t
			break;
		case 89:
			// y
			// TopFace rot0
			return getNewAnimation(rubiks, duration, shift, 1, 1);
			break;
		case 85:
			// u
			// TopFace rot1
			return getNewAnimation(rubiks, duration, shift, 1, 0);
			break;
		case 73:
			// i
			// TopFace rot2
			return getNewAnimation(rubiks, duration, shift, 1, -1);
			break;
		case 79:
			// o
			break;
		case 70:
			// f
			break;
		case 71:
			// g
			break;
		case 72:
			// h
			// LeftFace rot0
			return getNewAnimation(rubiks, duration, shift, 0, -1);
			break;
		case 74:
			// j
			// LeftFace rot1
			return getNewAnimation(rubiks, duration, shift, 0, 0);
			break;
		case 75:
			// k
			// Rotate rightFace
			return getNewAnimation(rubiks, duration, shift, 0, 1);
			break;
		case 76:
			// l
			break;
		case 86:
			// v
			break;
		case 66:
			// b
			break;
		case 78:
			// n
			//
			return getNewAnimation(rubiks, duration, shift, 2, -1);
			break;
		case 77:
			// m
			return getNewAnimation(rubiks, duration, shift, 2, 0);
			break;
		case 60:
		case 12:
			// ,
			return getNewAnimation(rubiks, duration, shift, 2, 1);
			break;
	}
}

function getNewRandomAnimation(rubiks, duration) {
	dim = Math.floor(Math.random()*3); // Choose a dimension to lock
	val = Math.floor(Math.random()*3) - 1; // Choose a value to lock it to from (-1, 0, 1)
	cw = Math.random() > .5;
	return getNewAnimation(rubiks, duration, cw, dim, val);
}

function getNewAnimation(rubiks, duration, cw, dim, val){
	// Randomly select a 9-set of cubes
	args = [null, null, null]; // Assume all dimensions are free
	args[dim] = val; // Lock one dimension to the chosen value
	subset = rubiks.subSet(args[0], args[1], args[2]); // Request the subset
	// Subface rotation
	args = [0, 0, 0]; // Start with 0-vector
	args[dim] = 1; // Set the locked dimension to 1, forming the vector normal the subset (this is our axis of rotation)
	var transformState = new THREE.Matrix4(); // Allocate a variable to track the total animation state
	// Generate a closure to act as the interpolator.
	// This is kinda weird to get your head around (Matt should understand from Principles), so feel
	// free to ask me what's going if you don't understand.
	var stepper = function(prog){
		prog = (prog > 1 ? 1 : prog); // Lock progress to [0, 1]
		// Get the inverse of the transformation matrix to undo the transform accumulated so far
		var transformUndo = new THREE.Matrix4();
		transformUndo.getInverse(transformState);
		// Undo all transforms in the set
		for(var i = 0; i < subset.length; ++i){
			subset[i].applyMatrix(transformUndo); 
		}
		// allocate a new temporary matrix
		var crot = new THREE.Matrix4(); 
		// We want to scale a rotation of 90 degrees (pi/2 rads) around an arbitrary axis over the duration
		var progScale = (prog >= 1 ? 1 : prog);
		if (!cw)
			progScale = -progScale;
		//var progScale = (prog >= 1 ? 1 : Math.pow(prog, 6));
		crot.rotateByAxis(new THREE.Vector3(args[0], args[1], args[2]), progScale * (Math.PI / 2));
		// Apply transform to all in set
		for(var i = 0; i < subset.length; ++i){
			subset[i].applyMatrix(crot); 
		}
		// Animation is done, so we need a bit of cleanup
		if(prog >= 1){
			// Lock all subcubes to unitary locations
			for(var i = 0; i < subset.length; ++i){
				subset[i].snapPos(); 
			}
		}
		// Save the latest transform
		transformState = crot; 
	}
	var Anim = new Animation(duration, stepper);
	return Anim;
}

// requestAnimFrame shim in case users use a
// not-quite-up-to-date modern browser
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

$(document).ready(Init); // Use jQuery to call our init function after the page is done loading so we have a valid DOM Tree
