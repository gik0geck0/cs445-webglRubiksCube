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
	var radius = 50,
	    segments = 16,
	    rings = 16;
	    
	// Create sphere material
	var sphereMaterial = new THREE.MeshLambertMaterial(
		{color:0xCC0000}
	);
	
	// Create the mesh geometry
	var sphere = new THREE.Mesh(
	
	  new THREE.SphereGeometry(
	    radius,
	    segments,
	    rings),
	
	  sphereMaterial);
	
	// Add sphere to scene
	scene.add(sphere);
	
	// create a point light
	var pointLight = new THREE.PointLight(0xFFFFFF);
	
	// set its position
	pointLight.position.x = 10;
	pointLight.position.y = 50;
	pointLight.position.z = 130;
	
	// add to the scene
	scene.add(pointLight);
	
	renderer.render(scene, camera);
}

$(document).ready(doStuff);