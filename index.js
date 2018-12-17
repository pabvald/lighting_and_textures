

/*_____________Global variables _______________*/
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

// Textures
var textureCoord = [1,0,
                    1,1,
                    0,1,
                    0,0,
                    0,1,
                    1,0,
                    ];
var  texture = null;
var texBuffer = null;
var uTexture = null;

// Light position 
var lightPositionUniformLocation  = null;
var viewerVectorUniformLocation = null;
var sliderXLightPosition = null;
var sliderYLightPosition = null;
var sliderZLightPosition = null;
var lightPosition = [1,1,-1];

//Ambient light
var boolAmbientUniformLocation = null;
var intAmbientUniformLocation  = null;
var sliderIntAmbient= null;
var ambientLight = 0; //Initially on
var intAmbient= 255;

//Diffuse light
var boolDiffuseUniformLocation = null;
var intDiffuseUniformLocation  = null;
var sliderIntDiffuse = null;
var diffuseLight = 0; // Initially off
var intDiffuse = 255;

//Specular light 
var boolSpecularUniformLocation = null;
var intSpecularUniformLocation = null;
var sliderIntSpecular = null;
var specularLight = 0; // Initially off
var intSpecular = 255;

//Material 
var kAmbientUniformLocation = null;
var kDiffuseUniformLocation = null;
var kSpecularUniformLocation = null;
var shineUniformLocation = null;
var materialAmbient = [0.9, 0.5, 0.3];
var materialDiffuse = [0.9, 0.5, 0.3];
var materialSpecular = [0.8, 0, 0];
var materialShine = 100.0;

// Vertexes coordinates
var   vertexes =[
    // Cara delantera
    -0.25, 0.25, 0.25,
    -0.25, -0.25, 0.25,
     0.25,-0.25, 0.25,

     0.25, 0.25, 0.25,
    -0.25, 0.25, 0.25,
     0.25,-0.25, 0.25,
/*
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
*/


];

// Vertexes colors
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

//Normals
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

/*________________________________________ WEB GL _______________________________________________*/

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
    
    sliderIntAmbient= document.getElementById("Ia");  
    sliderIntDiffuse = document.getElementById("Id"); 
    sliderIntSpecular = document.getElementById("Is");
    sliderXLightPosition = document.getElementById("xLightPosition");
    sliderYLightPosition = document.getElementById("yLightPosition");
    sliderZLightPosition = document.getElementById("zLightPosition");

    if(gl) {
        setUpCheckboxes();
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
        // Sets the background colot to white.
        gl.clearColor(1,1,1,1);

        //Creates a viewport with the canvas size.
        gl.viewport(0, 0, canvas.width, canvas.height);

        // Mode ON DEPTH
        gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT); 
        gl.enable(gl.DEPTH_TEST);        
  
        gl.enable(gl.BLEND);
       // gl.enable(gl.CULL_FACE);
        
      }

/********************* 3. INIT SHADER **************************************/ 
function initShaders()
    {
    
    //1.Obtains the shaders' references.
    var fs_source = document.getElementById('fragment-shader').innerHTML;
    var vs_source = document.getElementById('vertex-shader').innerHTML;

    //2.Compiles the shaders.
    vertexShader = makeShader(vs_source, gl.VERTEX_SHADER);
    fragmentShader = makeShader(fs_source, gl.FRAGMENT_SHADER);

    //3. Creates a program.
    glProgram = gl.createProgram();

    //4. Attaches each shader to the program.
        gl.attachShader(glProgram, vertexShader);
        gl.attachShader(glProgram, fragmentShader);
        gl.linkProgram(glProgram);

    if (!gl.getProgramParameter(glProgram, gl.LINK_STATUS)) {
        alert("No se puede inicializar el Programa .");
        }

    //5. Uses the program
    gl.useProgram(glProgram);

  
    }

/********************* 3.1. MAKE SHADER **************************************/ 
function makeShader(src, type)
{
    //Compiles each shader
    var shader = gl.createShader(type);
    gl.shaderSource(shader, src);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert("Error de compilación del shader: " + gl.getShaderInfoLog(shader));
    }
    return shader;
}

/********************* 5.1 SETUP BUFFERS  **************************************/ 
function setupBuffers(){         

    // Vertexes buffers
    vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexes), gl.STATIC_DRAW);         
    
    positionAttributeLocation = gl.getAttribLocation(glProgram, "a_position");
    gl.enableVertexAttribArray(positionAttributeLocation);        

    //Binds the vertexes positions
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);
    

    //Color buffer
    colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexesColors), gl.STATIC_DRAW);    

    colorLocation = gl.getAttribLocation(glProgram, "u_color");
    gl.enableVertexAttribArray(colorLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer); //OJO! se lo recordamos
    gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, 0, 0);

    //Normals buffer
    normalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);

    normalAttributeLocation = gl.getAttribLocation(glProgram,"a_normal");
    gl.enableVertexAttribArray(normalAttributeLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.vertexAttribPointer(normalAttributeLocation, 3, gl.FLOAT, false, 0, 0);

    /*_____________________________TEXTURE ____________________________________*/
    texture = gl.createTexture();
    texture.image = new Image();
    texture.image.onload = function(){
             setTexture(texture);
        }//de la funcion onload

    texture.image.src="bricks.png"; 

    //Texture buffer 
    texBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,texBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoord), gl.STATIC_DRAW);  
    
    textureLocatAttrib = gl.getAttribLocation(glProgram, "aTexCoord");
    gl.enableVertexAttribArray(textureLocatAttrib);
    gl.bindBuffer(gl.ARRAY_BUFFER,texBuffer);
    gl.vertexAttribPointer(textureLocatAttrib,2,gl.FLOAT,false,0,0);

    
    //Locates the rotation matrix
    matrixRotationLocation = gl.getUniformLocation(glProgram,"rotation");   

    // Light position
    lightPositionUniformLocation = gl.getUniformLocation(glProgram,"light_position");
    
    //Ambient light
    boolAmbientUniformLocation = gl.getUniformLocation(glProgram, "bool_ambient");
    intAmbientUniformLocation = gl.getUniformLocation(glProgram,"Lambient");

    //Diffuse light
    boolDiffuseUniformLocation = gl.getUniformLocation(glProgram, "bool_diffuse");
    intDiffuseUniformLocation = gl.getUniformLocation(glProgram, "Ldiffuse");

    //Specular light 
    boolSpecularUniformLocation = gl.getUniformLocation(glProgram, "bool_specular");
    intSpecularUniformLocation = gl.getUniformLocation(glProgram, "Lspecular");
  
    //Material
    kAmbientUniformLocation = gl.getUniformLocation(glProgram, "Kambient");
    kDiffuseUniformLocation = gl.getUniformLocation(glProgram, "Kdiffuse");
    kSpecularUniformLocation = gl.getUniformLocation(glProgram, "Kspecular");
    shineUniformLocation = gl.getUniformLocation(glProgram, "shine");

    //Locates the texture attibute
    uTexture = gl.getUniformLocation(glProgram,'uTexture');
} 

/************************* 5.2 Set Texture *****************************/

function setTexture(texture){
    gl.bindTexture(gl.TEXTURE_2D,texture);
    gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA, gl.UNSIGNED_BYTE, texture.image );
    // Filtering parameters
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    // Repetition parameters
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.MIRRORED_REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);
    // Mipmap creation
    gl.generateMipmap(gl.TEXTURE_2D);
    
    //gl.bindTexture(gl.TEXTURE_2D, null);
}

/********************* 6 Draw Scene     *********************************** */
function drawScene(){   
    var rotationYMatrix = mat4.create();
    var rotationXMatrix = mat4.create();
    var rotationMatrix = mat4.create();
   
    mat4.rotateY(rotationYMatrix,rotationYMatrix,angleOfRotationY);
    mat4.rotateX(rotationXMatrix,rotationXMatrix,angleOfRotationX);
    mat4.multiply(rotationMatrix, rotationXMatrix, rotationYMatrix);

    gl.uniformMatrix4fv(matrixRotationLocation,false, rotationMatrix);
    
    //Vectors
    gl.uniform3fv(lightPositionUniformLocation,lightPosition);

    //Ambient light
    gl.uniform1i(boolAmbientUniformLocation, ambientLight);
    gl.uniform3fv(intAmbientUniformLocation,[intAmbient/255,intAmbient/255,intAmbient/255]);

    //Diffuse light
    gl.uniform1i(boolDiffuseUniformLocation, diffuseLight);
    gl.uniform3fv(intDiffuseUniformLocation, [intDiffuse/255,intDiffuse/255,intDiffuse/255]);

    //Specular light
    gl.uniform1i(boolSpecularUniformLocation, specularLight);
    gl.uniform3fv(intSpecularUniformLocation, [intSpecular/255,intSpecular/255,intSpecular/255]);

    //Material
    gl.uniform3fv(kAmbientUniformLocation, materialAmbient);
    gl.uniform3fv(kDiffuseUniformLocation, materialDiffuse);
    gl.uniform3fv(kSpecularUniformLocation, materialSpecular);
    gl.uniform1f(shineUniformLocation,  materialShine);

    //Dibujar los triángulos
    gl.drawArrays(gl.TRIANGLES, 0, (vertexes.length/3));

}
 

/*_________________________________ LIGHT COMPONENTS ____________________________________________*/

/**
 *
 */
function setUpCheckboxes() {
    
    d3.select("#checkbox-ambient").property("checked", (ambientLight == 1));
    d3.select("#checkbox-diffuse").property("checked", (diffuseLight == 1));
    d3.select("#checkbox-specular").property("checked", (specularLight == 1));
}

/**
 * Handles the 'change' event on one of the checkboxes.
 * @param {*} n number of checkbox
 */
function onChangeLighting(n) {
    switch(n) {
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
            if(specularLight == 0) {
                specularLight = 1;
                d3.select("#Is").property("disabled", false).style("opacity",1);
            } else {
                specularLight = 0;
                d3.select("#Is").property("disabled", true).style("opacity",0.5);
            }
        break;

        default:
    }
    drawScene();
}

/**
 * Handles the 'input' event on the ambient-light slider.
 */
function onInputSliderIa(){
    intAmbient = sliderIntAmbient.value;    
    drawScene();
}


/**
 * Handles the 'input' event on the diffuse-light slider.
 */
function onInputSliderId(){
    intDiffuse = sliderIntDiffuse.value; 
    drawScene();
}

/**
 * Handles the 'input' event on the specular-light slider.
 */
function onInputSliderIs(){
    intSpecular = sliderIntSpecular.value; 
    drawScene();
}


/*____________________________________ LIGHT POSITION ______________________________________*/

/**
 * Handles the 'input' event on the x coordinate slider.
 */
function onInputSliderXLightPosition() {
    lightPosition[0] = sliderXLightPosition.value;
    drawScene();
}

/**
 * Handles the 'input' event on the y coordinate slider.
 */
function onInputSliderYLightPosition() {
    lightPosition[1] = sliderYLightPosition.value;
    drawScene();
}

/**
 * Handles the 'input' event on the z coordinate slider.
 */
function onInputSliderZLightPosition() {
    lightPosition[2] = sliderZLightPosition.value;
    drawScene();
}


/*__________________________________ ROTATION __________________________________________*/

var rect = null;

var x0 = null,
    y0 = null,
    x1 = null,
    y1 = null;

var move = false;

var angleOfRotationY = 0.2; // Rads
var angleOfRotationX = 0.2; // Rads

var angleXInit = 0.0,
    angleYInit = 0.0;


/**
 * Converts from degrees to rads.
 * @param {*} angle in degrees.
 */
function toRads(angle) {
    return angle*Math.PI/360;
}

/*
 * Obtains the angle of rotation from the mouse movement length.
 * @param {*} a initial x or y.
 * @param {*} b final x or y.
 */
function  getTheta(a,b) {
    var alfa;

    alfa = (b-a)/2 * Math.PI / 180;

    return alfa;
}

/**
 * Handles the event 'down' on the mouse.
 * @param {*} event mousedown.
 */
function onMousedown(event) {
    x0 = event.clientX - rect.left - canvas.width;
    y0 = event.clientY - rect.left - canvas.height;
    move = true;

    angleXInit = angleOfRotationX;
    angleYInit = angleOfRotationY;
}

/**
 * Handles the event 'move' on the mouse.
 * @param {*} event mousemove.
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
 * Handles the event 'up' on the mouse.
 * @param {*} event mouseup.
 */
function onMouseup(event) {
    move = false;
}