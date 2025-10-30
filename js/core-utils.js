/**
 * core-utils.js - Core Utility Functions
 * Provides helper functions for WebGL operations, texture loading, and shader compilation
 * Contains reusable utilities used throughout the game engine
 */

function isPowerOf2(value) {
  return (value & (value - 1)) == 0;
}

function getRandomFloat(min, max) {

    let r = ( (Math.random() * max) + min).toFixed(2);
    // console.log(r);
    return r;
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function radToDeg(r) {
	return r * 180 / Math.PI;
}

function degToRad(d) {
	return d * Math.PI / 180;
}

function updateCameraAngleHorizPlus() {
  cameraAngleDegHoriz++;
}

function updateCameraAngleHorizMinus() {
  cameraAngleDegHoriz--;
}

function updateCameraAngleVertPlus() {
  cameraAngleDegVert++;
}

function updateCameraAngleVertMinus() {
  cameraAngleDegVert--;
}
function create_camera(translate){

	const radius = 1;
	const target = [0, 0, -1000];

	// Use matrix math to compute a position on a circle where
	// the camera is

	const cameraMatrix = mat4.create();

	mat4.rotate(cameraMatrix,  // destination matrix
			cameraMatrix,  // matrix to rotate
			degToRad(0),     // amount to rotate in radians
			[0, 0, 1]);
	mat4.translate(cameraMatrix, cameraMatrix, [0, 1, 0]);

	// Get the camera's postion from the matrix we computed
	const cameraPosition = [
		cameraMatrix[12],
		cameraMatrix[13],
		cameraMatrix[14]
	];

	const up = [0, 1, 0];

		// Compute the camera's matrix using look at.
		cameraMatrix = lookAt(cameraPosition, target, up);

		// Make a view matrix from the camera matrix.
		mat4.invert(cameraMatrix, cameraMatrix);
		return cameraMatrix;
}

function lookAt(cameraPosition, target, up) {
	const zAxis = normalize(
			subtractVectors(cameraPosition, target));
	const xAxis = cross(up, zAxis);
	const yAxis = cross(zAxis, xAxis);

	return [
		xAxis[0], xAxis[1], xAxis[2], 0,
		yAxis[0], yAxis[1], yAxis[2], 0,
		zAxis[0], zAxis[1], zAxis[2], 0,
		cameraPosition[0],
		cameraPosition[1],
		cameraPosition[2],
		1,
	];
};

function subtractVectors(a, b) {
	return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

function normalize(v) {
	const length = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
	// make sure we don't divide by 0.
	if (length > 0.00001) {
		return [v[0] / length, v[1] / length, v[2] / length];
	} else {
		return [0, 0, 0];
	}
}

function cross(a, b) {
	return [a[1] * b[2] - a[2] * b[1],
	a[2] * b[0] - a[0] * b[2],
	a[0] * b[1] - a[1] * b[0]];
}
//
// Initialize a texture and load an image.
// When the image finished loading copy it into the texture.
//
function loadTexture(gl, url, makeWhiteTransparent = false) {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Because images have to be download over the internet
  // they might take a moment until they are ready.
  // Until then put a single pixel in the texture so we can
  // use it immediately. When the image has finished downloading
  // we'll update the texture with the contents of the image.
  const level = 0;
  const internalFormat = gl.RGBA;
  const width = 1;
  const height = 1;
  const border = 0;
  const srcFormat = gl.RGBA;
  const srcType = gl.UNSIGNED_BYTE;
  const pixel = new Uint8Array([0, 0, 255, 255]); // opaque blue
  gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
    width, height, border, srcFormat, srcType,
    pixel);

  const image = new Image();
  image.onload = function() {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    
    if (makeWhiteTransparent) {
      // Create a canvas to manipulate the image
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = image.width;
      canvas.height = image.height;
      
      // Draw the image
      ctx.drawImage(image, 0, 0);
      
      // Get image data
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      // Make white pixels transparent (threshold for near-white colors)
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        
        // If pixel is close to white, make it transparent
        if (r > 200 && g > 200 && b > 200) {
          data[i + 3] = 0; // Set alpha to 0
        }
      }
      
      // Put the modified data back
      ctx.putImageData(imageData, 0, 0);
      
      // Upload the modified canvas to WebGL
      gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
        srcFormat, srcType, canvas);
    } else {
      gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
        srcFormat, srcType, image);
    }

    // WebGL1 has different requirements for power of 2 images
    // vs non power of 2 images so check if the image is a
    // power of 2 in both dimensions.

    if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
      // Yes, it's a power of 2. Generate mips.
      gl.generateMipmap(gl.TEXTURE_2D);
    } else {
      // No, it's not a power of 2. Turn of mips and set
      // wrapping to clamp to edge

      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    }
  };
  image.src = url;

  return texture;
}

// Create a solid color texture (for sphere player)
function createSolidColorTexture(gl, color) {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  
  const level = 0;
  const internalFormat = gl.RGBA;
  const width = 1;
  const height = 1;
  const border = 0;
  const srcFormat = gl.RGBA;
  const srcType = gl.UNSIGNED_BYTE;
  const pixel = new Uint8Array(color); // color array [r, g, b, a]
  
  gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
    width, height, border, srcFormat, srcType, pixel);
    
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  
  return texture;
}
