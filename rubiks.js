function glSetup() {

	var canvas = getElementById("drawingarea");

	initWebGl(canvas);

	if (gl) {
		gl.clearColor(0.0, 69.0, 0.0, 1.0);
		gl.enable(gl.DEPTH_TEST);
		gl.depthFunc(gl.LEQUAL);
		gl.clear(gl.COLOR_BUFFER_BIT|g.DEPTH_BUFFER_BIT);
	}
}

function initWebGL(canvas) {
	//Initializetheglobalvariablegltonull.
	gl=null;
	try{
		//Trytograbthestandardcontext.Ifitfails,fallbacktoexperimental.
		gl=canvas.getContext("webgl")||canvas.getContext("experimental-webgl");
	}
	catch(e){}

	//If we don't have a GLcontext, give up now
	if(!gl) {
		alert("UnabletoinitializeWebGL.Yourbrowsermaynotsupportit.");
	}
}

glSetup();
