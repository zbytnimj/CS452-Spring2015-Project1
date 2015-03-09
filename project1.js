
var canvas;
var gl;
var n = 6;
var xPOS = -2.00;
var yPOS = 0.00;
var u_ModelMatrix;
var modelMatrix, projection;

var near = -100;
var far = 100;
var left = -3;
var right = 3;
var ytop = 3;
var bottom = -3;

var points = [];
var vertices;
var otherShapes = [
				vec2(0.75,0.75),
				vec2(0.75,0.9),
				vec2(0.9,0.9),
				vec2(0.9,0.75)
				];
var timer = 0.00;

var colors = [
  vec4( 1.0, 0.0, 0.0, 1.0 ),  // red
  vec4( 1.0, 1.0, 0.0, 1.0 ),  // yellow
  vec4( 0.0, 1.0, 0.0, 1.0 ),  // green
  vec4( 0.0, 0.0, 1.0, 1.0 ),  // blue
  vec4( 1.0, 0.0, 1.0, 1.0 ),  // magenta
  vec4( 0.0, 1.0, 1.0, 1.0)   // cyan
];

function drawshapes(timer){
	if (timer == 1) {
		// Add a shape to the screen
	}
	if (timer == 1.6){
		// Add another shape to the screen
	}
}

function makeshape(a,b,c,d) {
	  vertices = [ /* vec2(-0.5, -0.5), 
				   vec2(-0.5, 0.5), 
				   vec2(0.5, 0.5), 
				   vec2(0.5, -0.5),
				    
				   vec2(1, 1), 
				   vec2(1, 0.75), 
				   vec2(0.75, 0.75), 
				   vec2(0.75, 1)  */
				   
				   vec2(-0.5, -0.5), 
				   vec2(-0.5, 0.5), 
				   vec2(0.5, 0.5), 
				   vec2(0.5, -0.5),

		/* 		   vec2(1.5, -0.5), 
				   vec2(1.5, 0.5), 
				   vec2(2.5, 0.5), 
		 */		   vec2(0, -0.6)
				   
		/* 		   vec4(1, 1,0,1),
				   vec4(1, 0.75,0,1),
				   vec4(0.75, 0.75,0,1), 
				   vec4(0.75, 1,0,1) 
		 */		   
/* 				   vec2(-0.5, -0.5), 
				   vec2(-0.5, 0.5), 
				   vec2(0.5, 0.5), 
				   vec2(0.5, -0.5)  */
				 ];
	var indices = [a,b,c,a,c,d];
	for ( var i = 0; i < indices.length; i++) {
		points.push( vertices[indices[i]]);
	}
}

window.onload = function init(){
  // Retrieve <canvas> element
  canvas = document.getElementById('gl-canvas');

  // Get the rendering context for WebGL
  gl = WebGLUtils.setupWebGL( canvas );
  if ( !gl ) { alert( "WebGL isn't available" ); }

  //  Configure WebGL
  gl.viewport( 0, 0, canvas.width, canvas.height );

  gl.clearColor(0, 0, 0, 1);

  // Initialize shaders
  var program = initShaders( gl, "vertex-shader", "fragment-shader" );
  gl.useProgram( program );


  //n = 6;   // The number of vertices

  makeshape(0,1,2,3);
  makeshape(1,2,3,4);
  // Create a buffer object
  var vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);

  // Assign the buffer object to a_Position variable
  var a_Position = gl.getAttribLocation(program, 'a_Position');
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_Position);

  var cBuffer = gl.createBuffer();
  gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
  gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);

  var vColor = gl.getAttribLocation( program, "vColor" );
  gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
  gl.enableVertexAttribArray( vColor );
  
  projection = ortho(left, right, bottom, ytop, near, far);
  
  gl.uniformMatrix4fv( gl.getUniformLocation(program, "projectionMatrix"),
  false, flatten(projection));

  // Get storage location of u_ModelMatrix
  u_ModelMatrix = gl.getUniformLocation(program, 'u_ModelMatrix');
  if (!u_ModelMatrix) {
    console.log('Failed to get the storage location of u_ModelMatrix');
    return;
  }

  // Model matrix
  modelMatrix =  mat4();

  document.onkeydown = function(ev){ keydown(ev);};

  render();
};

function keydown(ev) {
    if(ev.keyCode == 49) {
      xPOS = 0;
      yPOS = 0;
    } else
    if(ev.keyCode == 83) { // The down arrow key was pressed
      yPOS -= 0.1;
    } else
    if(ev.keyCode == 68) { // The right arrow key was pressed
      xPOS += 0.1;
    } else
    if(ev.keyCode == 87) { // The up arrow key was pressed
      yPOS += 0.1;
    } else
    if (ev.keyCode == 65) { // The left arrow key was pressed
      xPOS -= 0.1;
    } else { return; }
}

function render() {
  timer = timer + 0.02;
  drawshapes(timer);
  modelMatrix = translate(xPOS, yPOS, 0);
  gl.uniformMatrix4fv(u_ModelMatrix, false, flatten(modelMatrix));

  gl.clear( gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLES, 0, n);
  window.requestAnimFrame(render);
}
