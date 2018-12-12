/************************************************************* WEB GL ***************************************************************+*/

// ****************** Variables Globales ********************* //
var gl = null,
    canvas = null,
    glProgram = null,
    fragmentShader = null,
    vertexShader = null;       

var  positionAttributeLocation = null, 
     normalAttributeLocation = null,
     colorLocation = null,    
     matrixRotationLocation = null,
     vertexBuffer = null,
     colorBuffer = null,
     normalBuffer = null;


// Vectors 
var lightVectorUniformLocation  = null;
var sliderXLightVector = null;
var sliderYLightVector = null;
var sliderZLightVector = null;
var lightVector = [1,1,-1];

//Ambient light
var boolAmbientUniformLocation = null;
var intAmbientUniformLocation  = null;
var sliderAmbient= null;
var ambientLight = 1; //Initially on
var intAmbient= 255;

//Diffuse light
var boolDiffuseUniformLocation = null;
var intDiffuseUniformLocation  = null;
var sliderIntDiffuse = null;
var diffuseLight = 0; // Initially off
var intDiffuse = 255;



// Coordenadas de los vértices
var   vertexes =[
    // Cara delantera
    -0.25, 0.25, 0.25,
    -0.25, -0.25, 0.25,
     0.25,-0.25, 0.25,

     0.25, 0.25, 0.25,
    -0.25, 0.25, 0.25,
     0.25,-0.25, 0.25,

    //Cara de arriba
    -0.25, 0.25, 0.25,
     0.25, 0.25, 0.25,
    -0.25, 0.25,-0.25,

     0.25, 0.25,-0.25,
    -0.25, 0.25,-0.25,
     0.25, 0.25, 0.25,

    // Cara de abajo
    -0.25, -0.25, 0.25,
     0.25, -0.25, 0.25,
    -0.25, -0.25,-0.25,

     0.25, -0.25,-0.25,
    -0.25, -0.25,-0.25,
     0.25, -0.25, 0.25,

    // Cara de atrás
    -0.25, 0.25, -0.25,
    -0.25, -0.25,-0.25,
     0.25,-0.25, -0.25,

     0.25, 0.25, -0.25,
    -0.25, 0.25, -0.25,
     0.25,-0.25, -0.25,

    //Cara derecha
    0.25, 0.25, 0.25,
    0.25, -0.25, 0.25,
    0.25, -0.25,-0.25,

    0.25, 0.25,-0.25,
    0.25, 0.25, 0.25,
    0.25, -0.25,-0.25,

   //Cara izquierda
   -0.25, 0.25, 0.25,
   -0.25, -0.25, 0.25,
   -0.25, -0.25,-0.25,

   -0.25, 0.25,-0.25,
   -0.25, 0.25, 0.25,
   -0.25, -0.25,-0.25,



];

// Colores de los vértices
var vertexesColors = [
   0,1,1,
   0,1,1,
   0,1,1,
   0,1,1,
   0,1,1,
   0,1,1,

   0,1,1,
   0,1,1,
   0,1,1,
   0,1,1,
   0,1,1,
   0,1,1,

   0,1,1,
   0,1,1,
   0,1,1,
   0,1,1,
   0,1,1,
   0,1,1,

   0,1,1,
   0,1,1,
   0,1,1,
   0,1,1,
   0,1,1,
   0,1,1,

   0,1,1,
   0,1,1,
   0,1,1,
   0,1,1,
   0,1,1,
   0,1,1,

   0,1,1,
   0,1,1,
   0,1,1,
   0,1,1,
   0,1,1,
   0,1,1,
   
];
//Normales
var normals = [
 //Cara delantera
    0,  0,  1,  0,  0,  1,   0,  0,  1,  0,  0,  1,  0,  0,  1,   0,  0,  1,

 // Cara de arriba
    0,  1,  0,  0,  1,  0,   0,  1,  0,  0,  1,  0,  0,  1,  0,   0,  1,  0,

 // Cara de abajo
    0,  -1,  0, 0,  -1,  0,  0,  -1,  0, 0,  -1,  0, 0,  -1,  0,  0,  -1,  0,

 //Cara de atrás
    0,  0,  -1, 0,  0,  -1,  0,  0,  -1, 0,  0,  -1, 0,  0,  -1,  0,  0,  -1, 

 // Cara derecha
    1,  0,  0,  1,  0,  0,   1,  0,  0,  1,  0,  0,  1,  0,  0,   1,  0,  0,

 // Cara izquierda
   -1,  0,  0, -1,  0,  0,  -1,  0,  0, -1,  0,  0, -1,  0,  0,   -1,  0,  0,

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
    
    sliderAmbient= document.getElementById("Ia");  
    sliderIntDiffuse = document.getElementById("Id"); 
    sliderXLightVector = document.getElementById("xLightVector");
    sliderYLightVector = document.getElementById("yLightVector");
    sliderZLightVector = document.getElementById("zLightVector");

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

    //Buffer de normales
    normalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);


    normalAttributeLocation = gl.getAttribLocation(glProgram,"a_normal");
    gl.enableVertexAttribArray(normalAttributeLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.vertexAttribPointer(normalAttributeLocation, 3, gl.FLOAT, false, 0, 0);
    
    //Localiza la matriz de perspectiva
    matrixRotationLocation = gl.getUniformLocation(glProgram,"rotation");   

    // Vectors
    lightVectorUniformLocation = gl.getUniformLocation(glProgram,"light_vector");

    //Ambient light
    boolAmbientUniformLocation = gl.getUniformLocation(glProgram, "ambient_light");
    intAmbientUniformLocation = gl.getUniformLocation(glProgram,"intensity_ambient");

    //Diffuse light
    boolDiffuseUniformLocation = gl.getUniformLocation(glProgram, "diffuse_light");
    intDiffuseUniformLocation = gl.getUniformLocation(glProgram, "intensity_diffuse");
  
    
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
    
    //Vectors
    gl.uniform3fv(lightVectorUniformLocation,lightVector);

    //Ambient light
    gl.uniform1i(boolAmbientUniformLocation, ambientLight);
    gl.uniform3fv(intAmbientUniformLocation,[intAmbient/255,intAmbient/255,intAmbient/255]);

    //Diffuse light
    gl.uniform1i(boolDiffuseUniformLocation, diffuseLight);
    gl.uniform3fv(intDiffuseUniformLocation, [intDiffuse/255,intDiffuse/255,intDiffuse/255]);

    //Dibujar los triángulos
    gl.drawArrays(gl.TRIANGLES, 0, (vertexes.length/3));

}

/*_________________________________LIGHTING_____________________________________________*/

/**
 * 
 * @param {*} type 
 */
function onChangeLighting(type) {
    switch(type) {
        case 1:
            if(ambientLight == 0) { 
                ambientLight = 1;
                d3.select("#Ia").property("disabled", false).style("opacity",1);
            } else {
                ambientLight = 0; 
                d3.select("#Ia").property("disabled", true).style("opacity",0.5);
            }
        break;

        case 2:
            if(diffuseLight == 0) {
                diffuseLight = 1;
                d3.select("#Id").property("disabled", false).style("opacity",1);
            } else {
                diffuseLight = 0;
                d3.select("#Id").property("disabled", true).style("opacity",0.5);
            }
        break;

        case 3:

        break;

        default:
    }
    drawScene();
}

function onInputSliderXLightVector() {
    lightVector[0] = sliderXLightVector.value;
    drawScene();
}

function onInputSliderYLightVector() {
    lightVector[1] = sliderYLightVector.value;
    drawScene();
}

function onInputSliderZLightVector() {
    lightVector[2] = sliderZLightVector.value;
    drawScene();
}


/**
 * Handles the 'input' event on the ambient-light slider.
 */
function onInputSliderIa(){
    intAmbient = sliderAmbient.value;    
    drawScene();
}


/**
 * Handles the 'input' event on the diffuse-light slider.
 */
function onInputSliderId(){
    intDiffuse = sliderIntDiffuse.value; 
    drawScene();
}



/*__________________________________ ROTACIÓN __________________________________________*/

var rect = null;

var x0 = null,
    y0 = null,
    x1 = null,
    y1 = null;

var move = false;

var angleOfRotationY = 0.2; // En radianes
var angleOfRotationX = 0.2; 

var angleXInit = 0.0,
    angleYInit = 0.0;


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
 * @param {*} a coordenada inicial x o y del ratón
 * @param {*} a coordenada final x o y del ratón
 */
function  getTheta(a,b) {
    var alfa;

    alfa = (b-a)/2 * Math.PI / 180;

    return alfa;
}

/**
 * Maneja el evento de inicio de pulsación del ratón.
 * @param {*} event evento de inicio de pulsación.
 */
function onMousedown(event) {
    x0 = event.clientX - rect.left - canvas.width;
    y0 = event.clientY - rect.left - canvas.height;
    move = true;

    angleXInit = angleOfRotationX;
    angleYInit = angleOfRotationY;
}

/**
 * Maneja el evento de movimiento del ratón.
 * @param {*} event evento de movimiento del ratón.
 */
function onMousemove(event) {
    if(move) {
        x1 = event.clientX - rect.left - canvas.width;
        y1 = event.clientY - rect.left - canvas.height;

        angleOfRotationX = angleXInit + getTheta(y0,y1);
        angleOfRotationY = angleYInit - getTheta(x0,x1);
        drawScene();
    }
}

/**
 * Maneja el evento de fin de pulsación del ratón.
 * @param {*} event evento de fin de pulsación del ratón.
 */
function onMouseup(event) {
    move = false;
}