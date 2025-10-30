/**
 * player.js - Player Character Module
 * Defines player geometry, movement, collision detection, and input handling
 * Creates the 3D sphere player model and manages left/right track movement
 */

function player(gl) {
  const radius = 0.2;
  const latitudeBands = 15;
  const longitudeBands = 15;
  
  const positions = [];
  const vertexNormals = [];
  const textureCoordinates = [];
  const indices = [];

  for (let lat = 0; lat <= latitudeBands; lat++) {
    const theta = lat * Math.PI / latitudeBands;
    const sinTheta = Math.sin(theta);
    const cosTheta = Math.cos(theta);

    for (let lon = 0; lon <= longitudeBands; lon++) {
      const phi = lon * 2 * Math.PI / longitudeBands;
      const sinPhi = Math.sin(phi);
      const cosPhi = Math.cos(phi);

      const x = cosPhi * sinTheta;
      const y = cosTheta;
      const z = sinPhi * sinTheta;
      const u = 1 - (lon / longitudeBands);
      const v = 1 - (lat / latitudeBands);

      vertexNormals.push(x, y, z);
      textureCoordinates.push(u, v);
      positions.push(radius * x, radius * y, radius * z);
    }
  }

  for (let lat = 0; lat < latitudeBands; lat++) {
    for (let lon = 0; lon < longitudeBands; lon++) {
      const first = (lat * (longitudeBands + 1)) + lon;
      const second = first + longitudeBands + 1;

      indices.push(first, second, first + 1);
      indices.push(second, second + 1, first + 1);
    }
  }

  const dummyTexture = createSolidColorTexture(gl, [100, 150, 255, 255]);
  
  return {
    'indices': indices,
    'vertexCount': indices.length,
    'positions': positions,
    'vertexNormals': vertexNormals,
    'textureCoordinates': textureCoordinates,
    'texture': dummyTexture,
    'rotation': 0,
    'translate': [0.0, -0.70, -3.15],
    'type': "mono",
    'jump': 0,
    'score': 0,
    'coins': 0,
    'distance': 0,
    'speed_y': 0.12,
    'flyboost': false,
    'jumpheight': -0.18,
    'targetLane': 0.0,
    'isTransitioning': false,
    'transitionSpeed': 0.20,
  }
}


function player_tick(object, obstacles) {

  if (game_start && !game_over && !finish) {
    object.distance += speed * 30;
  }

  let p_right = false;
  let p_left = false;
  if (statusKeys[37] || statusKeys[65]) {

    p_left = true;
    p_right = false;
    statusKeys[37] = false;
    statusKeys[65] = false;

  }
  if (statusKeys[39] || statusKeys[68]) {

    p_left = false;
    p_right = true;
    statusKeys[39] = false;
    statusKeys[68] = false;
  }

  if (p_left == true) {
    if (object.translate[0] == 0.0) {
      object.targetLane = -1.05;
      object.isTransitioning = true;
    } else if (object.translate[0] == 1.05) {
      object.targetLane = 0.0;
      object.isTransitioning = true;
    }
  } else if (p_right == true) {
    if (object.translate[0] == 0.0) {
      object.targetLane = 1.05;
      object.isTransitioning = true;
    } else if (object.translate[0] == -1.05) {
      object.targetLane = 0.0;
      object.isTransitioning = true;
    }
  }

  if (object.isTransitioning) {
    const diff = object.targetLane - object.translate[0];
    if (Math.abs(diff) < 0.05) {
      object.translate[0] = object.targetLane;
      object.isTransitioning = false;
    } else {
      object.translate[0] += diff * object.transitionSpeed;
    }
  }

  if ((statusKeys[32] || statusKeys[38]) && object.jump == 0) {
    object.jump = 1;
  }

  if (object.jump == 1) {

    object.speed_y -= 0.005;

    if (object.speed_y < 0) {
      object.speed_y = 0.001;
    }
    object.translate[1] += object.speed_y;

    if (object.translate[1] > object.jumpheight){
      object.translate[1] = object.jumpheight;
    }
  }

  for (let i = 0; i < obstacles.length; ++i) {

    if (obstacles[i].translate[0] == object.translate[0] && obstacles[i].translate[2] + 1.55 > -3.15 && obstacles[i].translate[2] - 1.55 < -3.15) {
      if (object.translate[1] < object.jumpheight && object.jump == 1) {
        object.jump = 1;
      } else {
        object.jump = 0;
      }
      break;
    } else if (object.translate[1] == object.jumpheight) {
      object.jump = -1;
    }
  }

  if(object.translate[1] == object.jumpheight && object.flyboost == true){
    object.jump = 0;
  }

  if (object.jump == -1) {
    object.speed_y += 0.008;
    object.translate[1] -= object.speed_y;

    if (object.translate[1] < -0.7) {
      object.translate[1] = -0.7;
      object.jump = 0;
      object.speed_y = 0.1;
    }
  }

}
