/************************************************************* WEB GL ***************************************************************+*/

// ****************** Variables Globales ********************* //
var gl = null,
    canvas = null,
    glProgram = null,
    fragmentShader = null,
    vertexShader = null;       

var  positionAttributeLocation =null, 
     colorLocation = null,
     matrixRotationLocation = null,
     vertexBuffer = null,
     colorBuffer = null;

// Coordenadas de los vértices
var   vertexes =[
    1, -0.7,1,
    1, -0.7,-1,
    -1,-0.7,1,
    -1,-0.7,1,
    1, -0.7,-1,
    -1,-0.7,-1,
];

// Colores de los vértices
var vertexesColors = [
    0.8,0.8,0,
    0.8,0.8,0,
    0.8,0.8,0,
    0.8,0.8,0,
    0.8,0.8,0,
    0.8,0.8,0,  
];

/********************* 1. INIT WEBGL **************************************/ 
function initWebGL()
{
    canvas = document.getElementById("canvas");
    body = document.getElementById("body");
    gl = canvas.getContext("webgl");
    rect = canvas.getBoundingClientRect();
  
    canvas.onmousedown = onMousedown;
    canvas.onmousemove = onMousemove;    
    document.onmouseup = onMouseup;
  

    if(gl) {
        setupWebGL();
        initShaders();
        setupBuffers();
        drawScene();          
    } 
    else {  
        alert(  "El navegador no soporta WEBGL.");
    }   
}

/********************* 2.setupWEBGL **************************************/ 
function setupWebGL()
      {
        //Pone el color de fondo a blanco
        //gl.clearColor(161/255, 224/255, 228/255, 1.0);  
        gl.clearColor(1,1,1,1);

        //Crea un viewport del tamaño del canvas
        gl.viewport(0, 0, canvas.width, canvas.height);

        // Modo ON DEPTH
        gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT); 
        gl.enable(gl.DEPTH_TEST);        
  
        //gl.enable ACTIVA una serie de caracteristicas tan variadas como:
        // a) Mezcla de colores (pordefecto está activado)
        gl.enable(gl.BLEND);
        // b) CullFace (me desaparecen tres triangulos o no, jugar con el CCW y EL CW)
        //gl.enable(gl.CULL_FACE);
      }
/********************* 3. INIT SHADER **************************************/ 
function initShaders()
    {
    // Esta función inicializa los shaders

    //1.Obtengo la referencia de los shaders 
    var fs_source = document.getElementById('fragment-shader').innerHTML;
    var vs_source = document.getElementById('vertex-shader').innerHTML;

    //2. Compila los shaders  
    vertexShader = makeShader(vs_source, gl.VERTEX_SHADER);
    fragmentShader = makeShader(fs_source, gl.FRAGMENT_SHADER);

    //3. Crea un programa
    glProgram = gl.createProgram();

    //4. Adjunta al programa cada shader
        gl.attachShader(glProgram, vertexShader);
        gl.attachShader(glProgram, fragmentShader);
        gl.linkProgram(glProgram);

    if (!gl.getProgramParameter(glProgram, gl.LINK_STATUS)) {
        alert("No se puede inicializar el Programa .");
        }

    //5. Usa el programa
    gl.useProgram(glProgram);

  
    }

/********************* 3.1. MAKE SHADER **************************************/ 
function makeShader(src, type)
{
    //Compila cada  shader
    var shader = gl.createShader(type);
    gl.shaderSource(shader, src);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert("Error de compilación del shader: " + gl.getShaderInfoLog(shader));
    }
    return shader;
}


/********************* 5 SETUP BUFFERS  **************************************/ 
function setupBuffers(){         

    // BUffer vértices
    vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexes), gl.STATIC_DRAW);         
    
    positionAttributeLocation = gl.getAttribLocation(glProgram, "a_position");
    gl.enableVertexAttribArray(positionAttributeLocation);        

    //Enlazo con las posiciones de los vértices
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);
    
    //BUFFER de color
    colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexesColors), gl.STATIC_DRAW);  

  

    colorLocation = gl.getAttribLocation(glProgram, "u_color");
    gl.enableVertexAttribArray(colorLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer); //OJO! se lo recordamos
    gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, 0, 0);

   
    //Localiza la matriz de perspectiva
    matrixRotationLocation = gl.getUniformLocation(glProgram,"rotation");
    
} 

/*********************      Draw Scene     *********************************** */
function drawScene(){   
    var rotationYMatrix = mat4.create();
    var rotationXMatrix = mat4.create();
    var rotationMatrix = mat4.create();

    mat4.rotateY(rotationYMatrix,rotationYMatrix,angleOfRotationY);
    mat4.rotateX(rotationXMatrix,rotationXMatrix,angleOfRotationX);
    mat4.multiply(rotationMatrix, rotationXMatrix, rotationYMatrix);

    gl.uniformMatrix4fv(matrixRotationLocation,false, rotationMatrix);
    
    //Dibujar los triángulos
    gl.drawArrays(gl.TRIANGLES, 0, (vertexes.length/3));

}

/************************************************************ ROTACIÓN *******************************************************/

var angleOfRotationY = 0.0;
var angleOfRotationX = 0.0;

var angleYInit = null;
var angleXInit = null;

var down = false;

var rect = null;
var x0 = null,
    x1 = null,
    y0 = null,
    y1 = null;


/**
 * Convierte los grados a radianes.
 * @param {*} angle angulo en grados
 */
function toRads(angle) {
    return angle*Math.PI/360;
}

/**
 * Obtiene el ángulo de giro en radianes a partir de la distancia recorrida por el ratón
 * horizontalmente.
 * @param {*} x0 coordenada inicial de x del ratón
 * @param {*} x1 coordenada final de x del ratón
 */
function  getTheta(x0,x1) {
    var alfa;

    alfa = (x1-x0) *Math.PI / 180;

    return alfa;
}

/**
 * Maneja el evento de inicio de pulsación del ratón.
 * @param {*} event evento de inicio de pulsación.
 */
function onMousedown(event) {
    x0 = event.clientX - rect.left - canvas.width;
    y0 = event.clientY - rect.left - canvas.height;
    down = true;

    angleYInit = angleOfRotationY;
    angleXInit = angleOfRotationX;
}

/**
 * Maneja el evento de movimiento del ratón.
 * @param {*} event evento de movimiento del ratón.
 */
function onMousemove(event) {
    if(down) {
        x1 = event.clientX - rect.left - canvas.width;
        y1 = event.clientY - rect.left - canvas.height;

        angleOfRotationY = angleYInit - getTheta(x0,x1);
        angleOfRotationX = angleXInit - getTheta(y0,y1);
        drawScene();
    }
}

/**
 * Maneja el evento de fin de pulsación del ratón.
 * @param {*} event evento de fin de pulsación del ratón.
 */
function onMouseup(event) {
    down = false;
}