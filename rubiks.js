function glSetup() {

        var canvas = document.getElementById("drawingArea");

        var gl = initWebGL(canvas);

        if (gl) {
                gl.clearColor(0, 0, 69.0, 1.0);
                gl.enable(gl.DEPTH_TEST);
                gl.depthFunc(gl.LEQUAL);
                gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
        }
        
        //var v_source = document.getElementById("vs").textContent;
        //var f_source = document.getElementById("fs").textContent;
	var v_source = 'attribute vec2 pos;' +
		 'void main() { gl_Position = vec4(pos, 0, 1); }';
	var f_source = 'precision mediump float;' +
		'void main() { gl_FragColor = vec4(0,0.8,0,1); }';
        
        var v_shader = compileShader(gl, v_source, gl.VERTEX_SHADER);
        var f_shader = compileShader(gl, f_source, gl.FRAGMENT_SHADER);
        
        var program = createProgram(gl, v_shader, f_shader);
        
        gl.useProgram(program);
	
        program.vertexPosAttrib = gl.getAttribLocation(program, 'pos');
        
        var buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	
	//var modelArray = make2DVertexPositionArray();
	var modelArray = [0, 0, .1, 0, 0, .1];
	
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(modelArray), gl.STATIC_DRAW);
	
	gl.enableVertexAttribArray(program.vertexPosAttrib);
	gl.vertexAttribPointer(program.vertexPosAttrib, 2, gl.FLOAT, false, 0, 0);
	gl.drawArrays(gl.TRIANGLES, 0, 3);
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
                alert("UnabletoinitializeWebGL.Yourbrowsermaynotsupportit.");
        }
	return gl;
}

/**
 * Creates and compiles a shader.
 *
 * @param {!WebGLRenderingContext} gl The WebGL Context.
 * @param {string} shaderSource The GLSL source code for the shader.
 * @param {number} shaderType The type of shader, VERTEX_SHADER or
 *     FRAGMENT_SHADER.
 * @return {!WebGLShader} The shader.
 */
function compileShader(gl, shaderSource, shaderType) {
  // Create the shader object
  var shader = gl.createShader(shaderType);

  // Set the shader source code.
  gl.shaderSource(shader, shaderSource);

  // Compile the shader
  gl.compileShader(shader);

  // Check if it compiled
  var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (!success) {
    // Something went wrong during compilation; get the error
    throw "could not compile shader:" + gl.getShaderInfoLog(shader);
  }

  return shader;
}

/**
 * Creates a program from 2 shaders.
 *
 * @param {!WebGLRenderingContext) gl The WebGL context.
 * @param {!WebGLShader} vertexShader A vertex shader.
 * @param {!WebGLShader} fragmentShader A fragment shader.
 * @return {!WebGLProgram} A program.
 */
function createProgram(gl, vertexShader, fragmentShader) {
  // create a program.
  var program = gl.createProgram();

  // attach the shaders.
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);

  // link the program.
  gl.linkProgram(program);

  // Check if it linked.
  var success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (!success) {
      // something went wrong with the link
      throw ("program filed to link:" + gl.getProgramInfoLog (program));
  }

  return program;
};

function make3DVertexPositionArray(){
        var array = [];
        var m = new Float32Array([ [0, 0, 0]
                                   [1, 0, 0]
                                   [0, 1, 0]
                                   [0, 0, 1]
                                   [1, 1, 0]
                                   [1, 0, 1]
                                   [0, 1, 1]
                                   [1, 1, 1]] );
        array.concat(m[0], m[1], m[2]);
	return array;
}

function make2DVertexPositionArray(){
        var array = [];
        var m = new Float32Array([ [0, 0],
                                   [1, 0],
                                   [0, 1],
                                   [1, 1]] );
        array.concat(m[0], m[1], m[2]);
	return array;
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
