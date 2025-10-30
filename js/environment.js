/**
 * environment.js - Game Environment Module
 * Creates and manages the ground, track, and environmental elements
 * Handles rendering of the game world background and surfaces
 */

function ground(gl)
{
  const positions = [
    // Front
    -2.0, 0.05, 2.0,
    -2.0, -0.05, 2.0,
    2.0, -0.05, 2.0,
    2.0, 0.05, 2.0,

    //Right
    2.0, -0.05, 2.0,
    2.0, 0.05, 2.0,
    2.0, 0.05, -2.0,
    2.0, -0.05, -2.0,

    //Back
    2.0, 0.05, -2.0,
    2.0, -0.05, -2.0,
    -2.0, -0.05, -2.0,
    -2.0, 0.05, -2.0,

    //Left
    -2.0, -0.05, -2.0,
    -2.0, 0.05, -2.0,
    -2.0, 0.05, 2.0,
    -2.0, -0.05, 2.0,

    //Top
    -2.0, 0.05, 2.0,
    2.0, 0.05, 2.0,
    2.0, 0.05, -2.0,
    -2.0, 0.05, -2.0,

    //Bottom
    -2.0, -0.05, 2.0,
    2.0, -0.05, 2.0,
    2.0, -0.05, -2.0,
    -2.0, -0.05, -2.0,
  ];


  // This array defines each face as two triangles, using the
  // indices into the vertex array to specify each triangle's
  // position.

  const indices = [
    0, 1, 2, 0, 2, 3, // front
    4, 5, 6, 4, 6, 7,
    8, 9, 10, 8, 10, 11,
    12, 13, 14, 12, 14, 15,
    16, 17, 18, 16, 18, 19,
    20, 21, 22, 20, 22, 23,
    24, 25, 26, 24, 26, 27,
    28, 29, 30, 28, 30, 31,
    32, 33, 34, 32, 34, 35,
  ];

  const vertexNormals = [
    // Front
    1.0, 0.0, 0.0,
    1.0, 0.0, 0.0,
    1.0, 0.0, 0.0,
    1.0, 0.0, 0.0,

    // Right
    -1.0, 0.0, 0.0,
    -1.0, 0.0, 0.0,
    -1.0, 0.0, 0.0,
    -1.0, 0.0, 0.0,

    // Back
    0.0, 1.0, 0.0,
    0.0, 1.0, 0.0,
    0.0, 1.0, 0.0,
    0.0, 1.0, 0.0,

    // Left
    0.0, -1.0, 0.0,
    0.0, -1.0, 0.0,
    0.0, -1.0, 0.0,
    0.0, -1.0, 0.0,

    // Top
    0.0, 0.0, 1.0,
    0.0, 0.0, 1.0,
    0.0, 0.0, 1.0,
    0.0, 0.0, 1.0,

    // Bottom
    0.0, 0.0, -1.0,
    0.0, 0.0, -1.0,
    0.0, 0.0, -1.0,
    0.0, 0.0, -1.0,
  ];

  const textureCoordinates = [
    // Front
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,

    // Right
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,

    // Back
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,

    // Left
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,

    // Top
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,

    // Bottom
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
  ];

  const texture = loadTexture(gl, 'assets/ground.png');

  return {
		'indices' : indices,
		'vertexCount' : 36,
		'positions' : positions,
    'vertexNormals' : vertexNormals,
    'textureCoordinates' : textureCoordinates,
    'texture' : texture,
		'rotation'  : 0.00,
		'translate' : [0.0, -1.0, 0],
    'type' : "mono",
	}
}

function ground_delete(gl, index) {

  let dist = 0;

  dist = objects[objects.length - 1].translate[2] - 4.0;
  objects.splice(index, 1);
  buffer_objects.splice(index, 1);

  x = ground(gl);
  x.translate[2] = dist;

  objects.push(x);
  buffer_objects.push(initBuffers(gl, x));
}

function ground_tick(gl, objects){

  for (let i = 2; i < objects.length; ++i) {

    objects[i].translate[2] += speed;

    if (objects[i].translate[2] > 0) {
      ground_delete(gl, i);
      i--;
    }
  }
}


function track(gl, side_x)
{
  const positions = [
    // Front
    -0.30, 0.001, 1.0,
    -0.30, -0.001, 1.0,
    0.30, -0.001, 1.0,
    0.30, 0.001, 1.0,

    //Right
    0.30, -0.001, 1.0,
    0.30, 0.001, 1.0,
    0.30, 0.001, -1.0,
    0.30, -0.001, -1.0,

    //Back
    0.30, 0.001, -1.0,
    0.30, -0.001, -1.0,
    -0.30, -0.001, -1.0,
    -0.30, 0.001, -1.0,

    //Left
    -0.30, -0.001, -1.0,
    -0.30, 0.01, -1.0,
    -0.30, 0.001, 1.0,
    -0.30, -0.001, 1.0,

    //Top
    -0.30, 0.001, 1.0,
    0.30, 0.001, 1.0,
    0.30, 0.001, -1.0,
    -0.30, 0.001, -1.0,

    //Bottom
    -0.30, -0.001, 1.0,
    0.30, -0.001, 1.0,
    0.30, -0.001, -1.0,
    -0.30, -0.001, -1.0,
  ];


  // This array defines each face as two triangles, using the
  // indices into the vertex array to specify each triangle's
  // position.

  const indices = [
    0, 1, 2, 0, 2, 3, // front
    4, 5, 6, 4, 6, 7,
    8, 9, 10, 8, 10, 11,
    12, 13, 14, 12, 14, 15,
    16, 17, 18, 16, 18, 19,
    20, 21, 22, 20, 22, 23,
    24, 25, 26, 24, 26, 27,
    28, 29, 30, 28, 30, 31,
    32, 33, 34, 32, 34, 35,
  ];

  const vertexNormals = [
    // Front
    1.0, 0.0, 0.0,
    1.0, 0.0, 0.0,
    1.0, 0.0, 0.0,
    1.0, 0.0, 0.0,

    // Right
    -1.0, 0.0, 0.0,
    -1.0, 0.0, 0.0,
    -1.0, 0.0, 0.0,
    -1.0, 0.0, 0.0,

    // Back
    0.0, 1.0, 0.0,
    0.0, 1.0, 0.0,
    0.0, 1.0, 0.0,
    0.0, 1.0, 0.0,

    // Left
    0.0, -1.0, 0.0,
    0.0, -1.0, 0.0,
    0.0, -1.0, 0.0,
    0.0, -1.0, 0.0,

    // Top
    0.0, 0.0, 1.0,
    0.0, 0.0, 1.0,
    0.0, 0.0, 1.0,
    0.0, 0.0, 1.0,

    // Bottom
    0.0, 0.0, -1.0,
    0.0, 0.0, -1.0,
    0.0, 0.0, -1.0,
    0.0, 0.0, -1.0,
  ];

  const textureCoordinates = [
    // Front
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,

    // Right
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,

    // Back
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,

    // Left
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,

    // Top
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,

    // Bottom
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
  ];

  const texture = loadTexture(gl, 'assets/track.jpeg');

  return {
		'indices' : indices,
		'vertexCount' : 36,
		'positions' : positions,
    'vertexNormals' : vertexNormals,
    'textureCoordinates' : textureCoordinates,
    'texture' : texture,
		'rotation'  : 0.00,
		'translate' : [side_x, -0.9, -3.15],
    'type' : "mono",
	}
}

function track_delete(gl, index) {

  let dist = 0;

  dist = tracks[tracks.length - 1].translate[2] - 2.0;
  tracks.shift();
  tracks.shift();
  tracks.shift();
  buffer_tracks.shift();
  buffer_tracks.shift();
  buffer_tracks.shift();

  x = track(gl, -1.05);
  x.translate[2] = dist;
  tracks.push(x);
  buffer_tracks.push(initBuffers(gl, x));

  x = track(gl, 0.0);
  x.translate[2] = dist;
  tracks.push(x);
  buffer_tracks.push(initBuffers(gl, x));

  x = track(gl, 1.05);
  x.translate[2] = dist;
  tracks.push(x);
  buffer_tracks.push(initBuffers(gl, x));
}

function track_tick(gl, tracks){

  for (let i = 0; i < 20; ++i) {

    tracks[3*i].translate[2] += speed;
    tracks[3*i + 1].translate[2] += speed;
    tracks[3*i + 2].translate[2] += speed;

    if (tracks[3*i].translate[2] > 0) {
      track_delete(gl, i);
      i--;
    }
  }
}
function wall(gl, z_dist, scale, side) {
  // Now create an array of positions for the cube.

  const positions = [
    // Front
    -5.0, 10.0 * scale, 6.0,
    -5.0, -10.0, 6.0,
    5.0, -10.0, 6.0,
    5.0, 10.0 * scale, 6.0,

    //Right
    5.0, -10.0, 6.0,
    5.0, 10.0 * scale, 6.0,
    5.0, 10.0 * scale, -6.0,
    5.0, -10.0, -6.0,

    //Back
    5.0, 10.0 * scale, -6.0,
    5.0, -10.0, -6.0,
    -5.0, -10.0, -6.0,
    -5.0, 10.0 * scale, -6.0,

    //Left
    -5.0, -10.0, -6.0,
    -5.0, 10.0 * scale, -6.0,
    -5.0, 10.0 * scale, 6.0,
    -5.0, -10.0, 6.0,

    //Top
    -5.0, 10.0 * scale, 6.0,
    5.0, 10.0 * scale, 6.0,
    5.0, 10.0 * scale, -6.0,
    -5.0, 10.0 * scale, -6.0,

    //Bottom
    -5.0, -10.0, 6.0,
    5.0, -10.0, 6.0,
    5.0, -10.0, -6.0,
    -5.0, -10.0, -6.0,
  ];


  // This array defines each face as two triangles, using the
  // indices into the vertex array to specify each triangle's
  // position.

  const indices = [
    0, 1, 2, 0, 2, 3,
    4, 5, 6, 4, 6, 7,
    8, 9, 10, 8, 10, 11,
    12, 13, 14, 12, 14, 15,
    16, 17, 18, 16, 18, 19,
    20, 21, 22, 20, 22, 23,
    24, 25, 26, 24, 26, 27,
    28, 29, 30, 28, 30, 31,
    32, 33, 34, 32, 34, 35,
  ];

  const vertexNormals = [
    // Right
    1.0, 0.0, 0.0,
    1.0, 0.0, 0.0,
    1.0, 0.0, 0.0,
    1.0, 0.0, 0.0,

    // Left
    -1.0, 0.0, 0.0,
    -1.0, 0.0, 0.0,
    -1.0, 0.0, 0.0,
    -1.0, 0.0, 0.0,
    // Top
    0.0, 1.0, 0.0,
    0.0, 1.0, 0.0,
    0.0, 1.0, 0.0,
    0.0, 1.0, 0.0,

    // Bottom
    0.0, -1.0, 0.0,
    0.0, -1.0, 0.0,
    0.0, -1.0, 0.0,
    0.0, -1.0, 0.0,
    // Front
    0.0, 0.0, 1.0,
    0.0, 0.0, 1.0,
    0.0, 0.0, 1.0,
    0.0, 0.0, 1.0,

    // Back
    0.0, 0.0, -1.0,
    0.0, 0.0, -1.0,
    0.0, 0.0, -1.0,
    0.0, 0.0, -1.0,
  ];

  const textureCoordinates = [
    // Front
    0.0, 1.0,
    0.0, 0.0,
    1.0, 0.0,
    1.0, 1.0,

    // Back
    0.0, 1.0,
    0.0, 0.0,
    1.0, 0.0,
    1.0, 1.0,

    // Top
    0.0, 1.0,
    0.0, 0.0,
    1.0, 0.0,
    1.0, 1.0,

    // Bottom
    0.0, 1.0,
    0.0, 0.0,
    1.0, 0.0,
    1.0, 1.0,

    // Right
    0.0, 1.0,
    0.0, 0.0,
    1.0, 0.0,
    1.0, 1.0,

    // Left
    0.0, 1.0,
    0.0, 0.0,
    1.0, 0.0,
    1.0, 1.0,
  ];

  const texture = loadTexture(gl, './assets/wall.jpg');

  return {
    'indices': indices,
    'vertexCount': 36,
    'positions': positions,
    'vertexNormals': vertexNormals,
    'textureCoordinates': textureCoordinates,
    'texture': texture,
    'rotation': 0.00,
    'translate': [13 * side, 0, z_dist],
    'initial_z': z_dist,
    'type': "wall",
    'side': side,
  }
}

function wall_delete(gl, object) {

  let dist = 0;
  const r = getRandomFloat(0.2, 0.8);

  if (object.side == -1) {
    dist = walls_left[walls_left.length - 1].translate[2] - 14;
    walls_left.shift();
    walls_left.push(wall(gl, dist, r, object.side));
    buffer_walls_left.shift();
    buffer_walls_left.push(initBuffers(gl, walls_left[walls_left.length - 1]));
  } else {
    dist = walls_right[walls_right.length - 1].translate[2] - 14;
    walls_right.shift();
    walls_right.push(wall(gl, dist, r, object.side));
    buffer_walls_right.shift();
    buffer_walls_right.push(initBuffers(gl, walls_right[walls_right.length - 1]));
  }
}

function wall_tick(gl, walls_left, walls_right) {

  for (let i = 0; i < walls_left.length; ++i) {

    walls_left[i].translate[2] += speed_wall;

    if (walls_left[i].translate[2] > -4) {
      wall_delete(gl, walls_left[i]);
      i--;
    }
  }

  for (let i = 0; i < walls_right.length; ++i) {

    walls_right[i].translate[2] += speed_wall;

    if (walls_right[i].translate[2] > -4) {
      wall_delete(gl, walls_right[i]);
      i--;
    }
  }
}
