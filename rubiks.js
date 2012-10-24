function glSetup() {

        var canvas = document.getElementById("drawingArea");

        var gl = initWebGL(canvas);

        if (gl) {
                gl.clearColor(0, 0, 69.0, 1.0);
                gl.enable(gl.DEPTH_TEST);
                gl.depthFunc(gl.LEQUAL);
                gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
        }
        
        var v_source = document.getElementById("vs").textContent;
        var f_source = document.getElementById("fs").textContent;
	//var v_source = 'attribute vec2 pos;' +
	//	 'void main() { gl_Position = vec4(pos, 0, 1); }';
	//var f_source = 'precision mediump float;' +
	//	'void main() { gl_FragColor = vec4(0,0.8,0,1); }';
        
        var v_shader = compileShader(gl, v_source, gl.VERTEX_SHADER);
        var f_shader = compileShader(gl, f_source, gl.FRAGMENT_SHADER);
        
        var program = createProgram(gl, v_shader, f_shader);
        
        gl.useProgram(program);
	
        program.vertexPosAttrib = gl.getAttribLocation(program, 'a_location');
	
        var pos_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, pos_buffer);	
	gl.enableVertexAttribArray(program.vertexPosAttrib);
	gl.vertexAttribPointer(program.vertexPosAttrib, 3, gl.FLOAT, false, 0, 0);	
	//var modelArray = make2DVertexPositionArray();
	var modelArray = make3DVertexPositionArray;	
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(modelArray), gl.STATIC_DRAW);
	
        program.vertexColAttrib = gl.getAttribLocation(program, 'Vcolor');
	
        var col_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, col_buffer);	
	gl.enableVertexAttribArray(program.vertexColAttrib);
	gl.vertexAttribPointer(program.vertexColAttrib, 3, gl.FLOAT, false, 0, 0);
	var colorArray = make3DVertexColorArray();
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorArray), gl.STATIC_DRAW);
	
	var transformMatrixLocation = gl.getUniformLocation(program, 'u_transform');
	var rotationInRadians = 0.01;
	var transformMatrix = makeZRotation(rotationInRadians);
	
	while(true){
		//gl.clear(gl.COLOR_BUFFER_BIT);
		//
		//gl.uniformMatrix4fv(transformMatrixLocation, false, transformMatrix);
		//transformMatrix = matrixMult(transformMatrix, makeZRotation(rotationInRadians), 4, 4, 4); // Composite the rotations
		//
		//gl.drawArrays(gl.TRIANGLES, 0, 3);

		function draw(){
			requestAnimationFrame(draw);
			gl.clear(gl.COLOR_BUFFER_BIT);
			
			gl.uniformMatrix4fv(transformMatrixLocation, false, transformMatrix);
			transformMatrix = matrixMult(transformMatrix, makeZRotation(rotationInRadians), 4, 4, 4); // Composite the rotations
			
			gl.drawArrays(gl.TRIANGLES, 0, 3);
			
		}
	}
}

function draw(){
	requestAnimationFrame(draw);
	gl.clear(gl.COLOR_BUFFER_BIT);
	
	gl.uniformMatrix4fv(transformMatrixLocation, false, transformMatrix);
	transformMatrix = matrixMult(transformMatrix, makeZRotation(rotationInRadians), 4, 4, 4); // Composite the rotations
	
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
                alert("Unable to initialize WebGL. Some combination of your browser/OS/hardware is not supported.");
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
        array.concat(// Face one
		     m[0], m[1], m[2],
		     m[1], m[4], m[2],
		     // Face two
		     m[0], m[2], m[3],
		     m[2], m[6], m[3],
		     // Face three
		     m[2], m[4], m[6],
		     m[4], m[7], m[6]);
	return array;
}

function make3DVertexColorArray(){
	// Red, Green, Blue faces
	var array = [1.0,   0,   0, 1.0,
		     1.0,   0,   0, 1.0,
		       0, 1.0,   0, 1.0,
		       0, 1.0,   0, 1.0,
		       0,   0, 1.0, 1.0,
		       0,   0, 1.0, 1.0];
	return array;
}

function makeZRotation(angleInRadians){
	var c = Math.cos(angleInRadians);
	var s = Math.sin(angleInRadians);
	var array = [
	   c, s, 0, 0,
	  -s, c, 0, 0,
	   0, 0, 1, 0,
	   0, 0, 0, 1,
	];
	return new Float32Array(array);
}

// Cribbed from https://gist.github.com/1871090
// matrix A, matrix B, columns of A, rowsA/colsB, rows of B
function matrixMult(A,B,m,l,n) {
    var C = new Array(m*n);
    var i = 0;
    var j = 0;
    var k = 0;
    
    for (i = 0; i < m; i++) {
        for (j = 0; j < n; j++) {
            var total = 0;
            
            for (k = 0; k < l; k++) {
                total += A[i*l+k]*B[k*n+j];
            }
            
            C[i*n+j] = total;
        }
    }
    
    return C;
}

function makeProjectionMatrix(width, height, depth){
  // Note: This matrix flips the Y axis so 0 is at the top.
  return [
     2 / width, 0, 0, 0,
     0, -2 / height, 0, 0,
     0, 0, 2 / depth, 0,
    -1, 1, 0, 1,
  ];
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


// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

// requestAnimationFrame polyfill by Erik Möller
// fixes from Paul Irish and Tino Zijdel

(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] 
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
 
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
 
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());
