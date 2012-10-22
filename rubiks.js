gl=null;
function glSetup() {

	var canvas = document.getElementById("glArea");
	console.log("Initing gl for canvas: " + canvas);
	//Initialize the global variable gl to null.
	gl=null;
	try{
		//Try to grab the standard context. If it fails,fallback to experimental.
		gl=canvas.getContext("webgl")||canvas.getContext("experimental-webgl");
	} catch(e) {}

	//If we don't have a GLcontext, give up now
	if(!gl) {
		alert("UnabletoinitializeWebGL.Yourbrowsermaynotsupportit.");
		return;
	}
	console.log("Done initing");

	if (gl) {
		gl.clearColor(0.0, 69.0, 0.0, 1.0);
		gl.enable(gl.DEPTH_TEST);
		gl.depthFunc(gl.LEQUAL);
		gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
	}
}
function loaded() {
	glSetup();
}
window.onload = function(){loaded()};
