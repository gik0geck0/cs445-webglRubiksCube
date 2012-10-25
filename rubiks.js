function doStuff(){
	/*
	http://www.aerotwist.com/tutorials/getting-started-with-three-js/
	*/
	
	// Grab the container canvas
	var canvas = document.getElementById("drawingArea");
	var $container = $('#attach');
	
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
	camera.position.z = 300;
	
	// Go Go Gadget Renderer~!
	renderer.setSize(WIDTH, HEIGHT);
	
	// Attach renderer-supplied DOM element
	// wut?
	$container.append(renderer.domElement);
	
	// Set up sphere vars
	var height = 50,
		width = 50,
		depth = 50;
	    
	// Create sphere material
	var cubeMaterial = new THREE.MeshLambertMaterial(
		{color:0xCC00FF}
	);
	
	var rubiks = new Object();
	rubiks.cubes = [];
	rubiks.rotateX = function(rotation){for(var i = 0; i < 3; ++i){
										for(var j = 0; j < 3; ++j){
										for(var k = 0; k < 3; ++k){
											this.cubes[i][j][k].rotation.x = rotation;
										}
										}
										};
	rubiks.rotateY = function(rotation){for(var i = 0; i < 3; ++i){
										for(var j = 0; j < 3; ++j){
										for(var k = 0; k < 3; ++k){
											this.cubes[i][j][k].rotation.y = rotation;
										}
										}
										};
	rubiks.rotateZ = function(rotation){for(var i = 0; i < 3; ++i){
										for(var j = 0; j < 3; ++j){
										for(var k = 0; k < 3; ++k){
											this.cubes[i][j][k].rotation.z = rotation;
										}
										}
										};
	
	for(var i = 0; i < 3; ++i){
		rubiks.cubes[i] = [];
		for(var j = 0; j < 3; ++j){
			rubiks.cubes[i][j] = [];
			for(var k = 0; k < 3; ++k){
				// Create the cube material array
				var mats = [new THREE.MeshLambertMaterial({color:0xFF0000}),
							new THREE.MeshLambertMaterial({color:0xFFFF00}),
							new THREE.MeshLambertMaterial({color:0x00FF00}),
							new THREE.MeshLambertMaterial({color:0x0000FF}),
							new THREE.MeshLambertMaterial({color:0xFF7700}),
							new THREE.MeshLambertMaterial({color:0xFFFFFF})];
			
				// Create the mesh geometry
				var cube = new THREE.Mesh(
				
				  new THREE.CubeGeometry(
					height,
					width,
					depth,
					2,
					2,
					2,
					mats),
				
				  cubeMaterial);
				
				// Add cube to scene
				scene.add(cube);
				
				// Add cube to rubiks
				rubiks.cubes[i][j][k] = cube;
			}
		}
	}
	
	// create a point light
	var pointLight = new THREE.PointLight(0x00FF00);
	
	// set its position
	pointLight.position.x = 0;
	pointLight.position.y = 0;
	pointLight.position.z = 0;
	
	// add to the scene
	scene.add(pointLight);
	
	// Create an ambient light
	var ambient = new THREE.AmbientLight(0x111111);
	
	// Add to scene
	scene.add(ambient);
	
	// add directional light source
	var directionalLight = new THREE.DirectionalLight(0xffffff);
	directionalLight.position.set(1, 1, 1).normalize();
	scene.add(directionalLight);
	
	renderer.render(scene, camera);
	var frame = 0;
		(function animloop(){
		  requestAnimFrame(animloop);
			pointLight.position.x = 100 * Math.sin(frame/10.0);
			pointLight.position.y = 100 * Math.sin(frame/10.0);
			pointLight.position.z = 100 * Math.cos(frame/10.0);
			rubiks.rotationX(frame / 10.0);
			rubiks.rotationZ(frame / 10.0);
			frame += 1;
			renderer.render(scene, camera);
		})();
}

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