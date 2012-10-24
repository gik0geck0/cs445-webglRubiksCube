function glSetup() {

        var canvas = document.getElementById("drawingArea");

        var gl = initWebGL(canvas);

        if (gl) {
                gl.clearColor(0, 0, 69.0, 1.0);
                gl.enable(gl.DEPTH_TEST);
                gl.depthFunc(gl.LEQUAL);
                gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
        }
}

function initWebGL(canvas) {
        //Initializetheglobalvariablegltonull.
        var gl=null;
        try{
                //Trytograbthestandardcontext.Ifitfails,fallbacktoexperimental.
                gl=canvas.getContext("webgl")||canvas.getContext("experimental-webgl");
        }
        catch(e){}

        //If we don't have a GLcontext, give up now
        if(!gl) {
                alert("Unable to initialize WebGL. Some combination of your browser/OS/hardware is not supported.");
        }
	return gl;
}


// Attach glSetup as window load event

if(window.attachEvent) {
    window.attachEvent('onload', glSetup);
} else {
    if(window.onload) {
        var curronload = window.onload;
        var newonload = function() {
            curronload();
            glSetup();
        };
        window.onload = newonload;
    } else {
        window.onload = glSetup;
    }
}
