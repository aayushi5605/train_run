/**
 * input-handler.js - Keyboard Input Handler
 * Manages keyboard input events for player controls
 * Prevents default browser behavior for game control keys (arrow keys, WASD, space)
 */

document.addEventListener('keydown', function(event){
	const charCode = event.keyCode;
	
	if ([37, 38, 39, 40, 32, 65, 68, 87, 83].indexOf(charCode) !== -1) {
		event.preventDefault();
	}
	
	statusKeys[charCode] = true;
  
  if (charCode === 27 && typeof isPaused !== 'undefined') {
    isPaused ? resumeGame() : pauseGame();
  }
});

document.addEventListener('keyup', function(event){
	statusKeys[event.keyCode] = false;
});
