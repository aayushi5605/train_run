/**
 * game-objects.js - Game Obstacles Module
 * Creates and manages various obstacle types (cubes, pyramids, etc.) that appear in the game
 * Handles obstacle geometry, positioning, and collision detection
 */

function obstacle(gl, track, z_dist) {

  const positions = [
    // Front - OBSTACLES (Smaller size)
    -0.20, 0.45, 0.60,
    -0.20, -0.45, 0.60,
    0.20, -0.45, 0.60,
    0.20, 0.45, 0.60,

    //Right
    0.20, -0.45, 0.60,
    0.20, 0.45, 0.60,
    0.20, 0.45, -0.60,
    0.20, -0.45, -0.60,

    //Back
    0.20, 0.45, -0.60,
    0.20, -0.45, -0.60,
    -0.20, -0.45, -0.60,
    -0.20, 0.45, -0.60,

    //Left
    -0.20, -0.45, -0.60,
    -0.20, 0.45, -0.60,
    -0.20, 0.45, 0.60,
    -0.20, -0.45, 0.60,

    //Top
    -0.20, 0.45, 0.60,
    0.20, 0.45, 0.60,
    0.20, 0.45, -0.60,
    -0.20, 0.45, -0.60,

    //Bottom
    -0.20, -0.45, 0.60,
    0.20, -0.45, 0.60,
    0.20, -0.45, -0.60,
    -0.20, -0.45, -0.60,
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

    // Front
    0.0, 0.0, 1.0,
    0.0, 0.0, 1.0,
    0.0, 0.0, 1.0,
    0.0, 0.0, 1.0,

    // Right
    1.0, 0.0, 0.0,
    1.0, 0.0, 0.0,
    1.0, 0.0, 0.0,
    1.0, 0.0, 0.0,

    // Back
    0.0, 0.0, -1.0,
    0.0, 0.0, -1.0,
    0.0, 0.0, -1.0,
    0.0, 0.0, -1.0,

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

  const r = getRandomInt(0, 1);

  let texture = 0;
  if (r == 0) {
    texture = loadTexture(gl, 'assets/train.jpg');
  } else {
    texture = loadTexture(gl, 'assets/container.jpg');
  }
  return {
    'indices': indices,
    'vertexCount': 36,
    'positions': positions,
    'vertexNormals': vertexNormals,
    'textureCoordinates': textureCoordinates,
    'texture': texture,
    'rotation': 0.00,
    'translate': [track, -0.60, z_dist],
    'initial_z': z_dist,
    'type': "obstacle",
  }

}

function obstacle_delete(gl, object) {

  const dist = obstacles[obstacles.length - 1].translate[2] - 50;
  const r = getRandomInt(0, 2);

  let track = 0.0;
  if (r == 0) {
    track = -1.05;
  } else if (r == 1) {
    track = 0.0;
  } else if (r == 2) {
    track = 1.05;
  }

  obstacles.shift();
  buffer_obstacles.shift();
  obstacles.push(obstacle(gl, track, dist));
  buffer_obstacles.push(initBuffers(gl, obstacles[obstacles.length - 1]));
}

function obstacle_tick(gl, obstacles, player) {

  for (let i = 0; i < obstacles.length; ++i) {
    obstacles[i].translate[2] += speed;
    
    if (player.translate[0] == obstacles[i].translate[0] && !(player.translate[2] - 0.15 >= obstacles[i].translate[2] + 0.75 || player.translate[2] + 0.15 <= obstacles[i].translate[2] - 0.75) && player.translate[1] < obstacles[i].translate[1] + 0.5) {
      game_over = true;
    }

    if (obstacles[i].translate[2] > 2) {
      obstacle_delete(gl, obstacles[i]);
    }

  }

}

function barrier(gl, track, z_dist) {

  const positions = [
    // Front
    -0.14, 0.07, 0.035,
    -0.14, -0.07, 0.035,
    0.14, -0.07, 0.035,
    0.14, 0.07, 0.035,

    //Right
    0.14, -0.07, 0.035,
    0.14, 0.07, 0.035,
    0.14, 0.07, -0.035,
    0.14, -0.07, -0.035,

    //Back
    0.14, 0.07, -0.035,
    0.14, -0.07, -0.035,
    -0.14, -0.07, -0.035,
    -0.14, 0.07, -0.035,

    //Left
    -0.14, -0.07, -0.035,
    -0.14, 0.07, -0.035,
    -0.14, 0.07, 0.035,
    -0.14, -0.07, 0.035,

    //Top
    -0.14, 0.07, 0.035,
    0.14, 0.07, 0.035,
    0.14, 0.07, -0.035,
    -0.14, 0.07, -0.035,

    //Bottom
    -0.14, -0.35, 0.035,
    0.14, -0.35, 0.035,
    0.14, -0.35, -0.035,
    -0.14, -0.35, -0.035,
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

    // Front
    0.0, 0.0, 1.0,
    0.0, 0.0, 1.0,
    0.0, 0.0, 1.0,
    0.0, 0.0, 1.0,

    // Right
    1.0, 0.0, 0.0,
    1.0, 0.0, 0.0,
    1.0, 0.0, 0.0,
    1.0, 0.0, 0.0,

    // Back
    0.0, 0.0, -1.0,
    0.0, 0.0, -1.0,
    0.0, 0.0, -1.0,
    0.0, 0.0, -1.0,

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
  ];

  const textureCoordinates = [
    // Front
    0.0,  1.0,
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,

    // Back
    0.0,  1.0,
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,

    // Top
    0.0,  1.0,
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,

    // Bottom
    0.0,  1.0,
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,

    // Right
    0.0,  1.0,
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,

    // Left
    0.0,  1.0,
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,

  ];

  const texture = loadTexture(gl, './assets/barrier.jpg');

  return {
    'indices': indices,
    'vertexCount': 36,
    'positions': positions,
    'vertexNormals' : vertexNormals,
    'textureCoordinates' : textureCoordinates,
    'texture' : texture,
    'rotation': 0.00,
    'translate': [track , -0.78, z_dist],
    'initial_z': z_dist,
    'type': "barricade",
  }

}

function barrier_delete(gl, object) {

  const index = barriers.indexOf(object);
  const r = getRandomInt(0, 2);

  let track = 0.0;
  if (r == 0)
  {
    track = -1.05;
  }
  else if(r == 1){
    track = 0.0;
  }
  else if(r == 2){
    track = 1.05;
  }

  barriers[index] = barrier(gl, track, -50);
  buffer_barriers[index] = initBuffers(gl, barriers[index]);
}

function barrier_tick(gl, barriers, player){

  for(let i = 0; i < barriers.length; ++i){
    barriers[i].translate[2] += speed;

    if (player.translate[0] == barriers[i].translate[0] && !(player.translate[2] - 0.15 >= barriers[i].translate[2] + 0.05 || player.translate[2] + 0.15 <= barriers[i].translate[2] - 0.05) && player.translate[1] == -0.70) {
      // Hit barrier - GAME OVER
      game_over = true;
    }

    if (barriers[i].translate[2] > 2) {
      barrier_delete(gl, barriers[i]);
    }

  }
}
function coin(gl, initial_x, initial_z) {


  const positions = [
    // Front - COINS (Smaller size)
    -0.10, 0.10, 0.015,
    -0.10, -0.10, 0.015,
    0.10, -0.10, 0.015,
    0.10, 0.10, 0.015,

    //Right
    0.10, -0.10, 0.015,
    0.10, 0.10, 0.015,
    0.10, 0.10, -0.015,
    0.10, -0.10, -0.015,

    //Back
    0.10, 0.10, -0.015,
    0.10, -0.10, -0.015,
    -0.10, -0.10, -0.015,
    -0.10, 0.10, -0.015,

    //Left
    -0.10, -0.10, -0.015,
    -0.10, 0.10, -0.015,
    -0.10, 0.10, 0.015,
    -0.10, -0.10, 0.015,

    //Top
    -0.10, 0.10, 0.015,
    0.10, 0.10, 0.015,
    0.10, 0.10, -0.015,
    -0.10, 0.10, -0.015,

    //Bottom
    -0.10, -0.10, 0.015,
    0.10, -0.10, 0.015,
    0.10, -0.10, -0.015,
    -0.10, -0.10, -0.015,
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

    1.0, 0.0,
    1.0, 1.0,
    0.0, 1.0,
    0.0, 0.0,

    // Right
    0.0, 0.0,
    1.0, 0.0,
    1.0, 1.0,
    0.0, 1.0,

    // Back
    0.0, 0.0,
    1.0, 0.0,
    1.0, 1.0,
    0.0, 1.0,

    // Left
    0.0, 0.0,
    1.0, 0.0,
    1.0, 1.0,
    0.0, 1.0,

    // Top
    0.0, 0.0,
    1.0, 0.0,
    1.0, 1.0,
    0.0, 1.0,

    // Bottom
    0.0, 0.0,
    1.0, 0.0,
    1.0, 1.0,
    0.0, 1.0,

  ];

  const texture = loadTexture(gl, 'assets/coin.png');

  return {
    'indices': indices,
    'vertexCount': 36,
    'positions': positions,
    'vertexNormals': vertexNormals,
    'textureCoordinates': textureCoordinates,
    'texture': texture,
    'rotation': 0,
    'translate': [initial_x, -0.75, initial_z],
    'type': "coins",
  }


}

function coin_delete(gl, object) {

  const index = coins.indexOf(object);
  
  // Remove the coin from both arrays
  coins.splice(index, 1);
  buffer_coins.splice(index, 1);

}


function coin_tick(gl, coins, player) {

  // console.log(coins.length);
  for (let i = 0; i < coins.length; ++i) {

    coins[i].translate[2] += speed;
    coins[i].rotation -= 0.025;
    
    coins[i].translate[1] = -0.75 + Math.sin(Date.now() * 0.003 + i) * 0.08;

    if (player.translate[0] == coins[i].translate[0] && 
        player.translate[2] - 0.15 <= coins[i].translate[2] && 
        player.translate[2] + 0.15 >= coins[i].translate[2] && 
        player.translate[1] == -0.70) {
      player.score += 1;
      player.coins += 1;
      coin_delete(gl, coins[i]);
      i--; // Adjust index after deletion
    }
    // Remove coin if it goes past the player
    else if (coins[i].translate[2] > 2) {
      coin_delete(gl, coins[i]);
      i--; // Adjust index after deletion
    }

  }

}
function boost(gl, track, z_dist) {
  // Now create an array of positions for the cube.

  const positions = [
    // Front
    -0.1, 0.1, 0.1,
    -0.1, -0.1, 0.1,
    0.1, -0.1, 0.1,
    0.1, 0.1, 0.1,

    //Right
    0.1, -0.1, 0.1,
    0.1, 0.1, 0.1,
    0.1, 0.1, -0.1,
    0.1, -0.1, -0.1,

    //Back
    0.1, 0.1, -0.1,
    0.1, -0.1, -0.1,
    -0.1, -0.1, -0.1,
    -0.1, 0.1, -0.1,

    //Left
    -0.1, -0.1, -0.1,
    -0.1, 0.1, -0.1,
    -0.1, 0.1, 0.1,
    -0.1, -0.1, 0.1,

    //Top
    -0.1, 0.1, 0.1,
    0.1, 0.1, 0.1,
    0.1, 0.1, -0.1,
    -0.1, 0.1, -0.1,

    //Bottom
    -0.1, -0.1, 0.1,
    0.1, -0.1, 0.1,
    0.1, -0.1, -0.1,
    -0.1, -0.1, -0.1,
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

    1.0, 0.0,
    1.0, 1.0,
    0.0, 1.0,
    0.0, 0.0,
    // Back
    0.0, 0.0,
    1.0, 0.0,
    1.0, 1.0,
    0.0, 1.0,
    // Top
    0.0, 0.0,
    1.0, 0.0,
    1.0, 1.0,
    0.0, 1.0,
    // Bottom
    0.0, 0.0,
    1.0, 0.0,
    1.0, 1.0,
    0.0, 1.0,
    // Right
    0.0, 0.0,
    1.0, 0.0,
    1.0, 1.0,
    0.0, 1.0,
    // Left
    0.0, 0.0,
    1.0, 0.0,
    1.0, 1.0,
    0.0, 1.0,
  ];

  let texture = loadTexture(gl, './assets/flyboost.jpg');
  let type = "fly";


  return {
    'indices': indices,
    'vertexCount': 36,
    'positions': positions,
    'vertexNormals': vertexNormals,
    'textureCoordinates': textureCoordinates,
    'texture': texture,
    'rotation': 0,
    'translate': [track, -0.60, z_dist],
    'type': type,
    'speed_y': 0.1,
  }
}

function boost_delete(gl, object) {

  let dist = -35.0;
  let r = getRandomInt(0, 2);

  let track = 0.0;
  if (r == 0) {
    track = -1.05;
  } else if (r == 1) {
    track = 0.0;
  } else if (r == 2) {
    track = 1.05;
  }

  boosts.shift();
  buffer_boosts.shift();
  boosts.push(boost(gl, track, dist));
  buffer_boosts.push(initBuffers(gl, boosts[boosts.length - 1]));
}


function boost_tick(gl, boosts, player) {

  // console.log(boosts.length);
  for (let i = 0; i < boosts.length; ++i) {

    boosts[i].translate[2] += speed;
    boosts[i].rotation += 0.1;

    if (player.translate[0] == boosts[i].translate[0] && player.translate[2] - 0.15 <= boosts[i].translate[2] && player.translate[2] + 0.15 >= boosts[i].translate[2] && player.translate[1] == -0.70) {

      if(boosts[i].type == "fly"){

        player.jump = 1;
        player.jumpheight = 0.05;
        player.flyboost = true;

        setTimeout(function() {
          player.jump = -1;
          player.flyboost = false;
        }, 10000);
      }

      boost_delete(gl, boosts[i]);
      i--;
    } else if (boosts[i].translate[2] > 2) {
      boost_delete(gl, boosts[i]);
      i--;
    }

  }

}
