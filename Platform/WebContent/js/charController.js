// Here be variables
var runForward = false;
var walkForward = false;
var walkBackward = false;
var jump = false;
var counterClockwiseRotation = 0;
var clockwiseRotation = 0;
var strafeLeft = false;
var strafeRight = false;
var pickupThisFrame = false;
var force = 4;
var forwardForce;
var sideForce;
var walkSpeed = 4;
var runSpeed = 8;
var forceVector;
var move = false;
var carriedItem = 0;
var jumpableDoorOpen = false;
var jumpableDoorOpening = false;
var platformSpeedX = 0;
var platformSpeedZ = 0;


// Checks key inputs on every loop turn
function checkKeys() {
    
    // Set back to 0 at every iteration to prevent accumulative forces
    forceVector = new THREE.Vector3(0,0,0);
    
    // W - walk forward
    if (keyMap[87]) { 
        // Hold Shift to run
        if (keyMap[16] && stamina > 0){
            runForward = true;
            stamina -= 0;
        }
        
        // Add force
        forceVector.z += force;
        move = true;
    }

    // Regenerate stamina, if the player is not running
    if (!keyMap[16] && stamina < 200) { 
        stamina += 1;
    }

    // S - walk backwards
    if (keyMap[83]) { 
        forceVector.z -= force;
        move = true;
    }

    // A - strife left
    if (keyMap[65]) { 
        forceVector.x += force;
        move = true;
    }

    // D - strife right
    if (keyMap[68]) { 
            forceVector.x -= force;
            move = true;
    }

    // R - Restart level if dead
    if (keyMap[82] && gameOverScreen) { 
        restartLevel();
    }
}

var carriedItem;
// Handles character movement (and then some)
function checkMovement() {
    
    // Get rotation and velocity of character
   
    // set the movement speed
    player.running = false;
    
    // Increase movement speed if we are running
    if(runForward){
    	player.running = true;
    }
    player.movementDisabled = false;
    for(var i = 0; i < iceTiles.length; i++){
    	iceTiles[i].checkIce();
    }
    if(!player.movementDisabled){
    	player.setVelocity(forceVector);
    	
    }
    player.move();
    if(!player.movementDisabled){
    	player.setSurfaceVelocity(new THREE.Vector3(0,0,0));
    }
    
    // Adjust walking sound playrate if we are running / walking
    if(runForward){
    	audioArray['walk'].playbackRate = 2;
    }
    else{
    	audioArray['walk'].playbackRate = 1.2;
    }
    
    // Play walking sound
    if(move && !playingSound && !airborne && !player.movementDisabled){
    	audioArray['walk'].play();
    	playingSound = true;
    }
    
    // If player is jumping or simply not walking; stop the walking sound.
    else if((!move || airborne || player.movementDisabled) && playingSound){
        audioArray['walk'].pause();
        playingSound = false;
    }
    if(jump){
    	player.jump();
    }
    
    // Handle when F is pressed (pick up)
    if (pickup) { 
    	if(!carrying){
	        for (var i = 0; i < pickUpItems.length; i++){ 
	            
	            // Check distance to all items that can be picked up
	            var distance = new THREE.Vector3();
	            distance.subVectors(player.mesh.position, pickUpItems[i].mesh.position); 
	            
	            // If distance is less than a set limit.
	            if (distance.length() < 2.5) { 
	            	
            		pickUpItems[i].pickUp(camera);
            		carriedItem = pickUpItems[i];
            		carrying = true;
            		i = pickUpItems.length;
            		pickupThisFrame = true;
            	}
	        }
    	}
        
        // Throw out the carried crate
        if (carrying && !pickupThisFrame) {  // If already carrying an item, picked up before this frame.
        	carriedItem.throwOut();
        	carriedItem = null;
        	carrying = false;
        }
        if(level == 2){
//        	var distance = new THREE.Vector3();
//        	distance.subVectors(player.mesh.position, lever.position);
//        	if(distance.length() < 2.5){
//        		jumpableDoorOpening = true;
//        	}
        }
        if(level == 3){
        	var distance = new THREE.Vector3();
        	distance.subVectors(player.mesh.position, lever.mesh.position);
        	if(distance.length() < 2.5){
        		lever.pulled();
        	}
        }
    }
    	
    
    
    // Check if all keys are picked up in level 2
//    if(level == 2 && bonusArray['keys'] == 3){
//    	var distance = new THREE.Vector3();
//        distance.subVectors(player.mesh.position, doorway.position);
//        
//        // If the character is within a certain distance of the exit door, open the door
//        if(distance.length() < 6){                                  
//            if(doorway.children[0].position.y > -8){
//                doorway.children[0].position.y -= 0.02;         
//            } else{
//                scene.remove(doorway);
//                keysPickedUp = 0;
//            }
//        }
//    }

	// Check for fall damage

	player.checkFall();
	player.checkFloor();

	// If we have lost all our health, set game over
	if (health < 1 && !gameOverScreen) {
		if(bonusArray['lives'] > 1){
			bonusArray['lives'] -= 1;
			updateLives();
			showGameOver();
			/*TODO: Make a you died screen*/
//			showYouDied();
		}
		else{
			bonusArray['lives'] -= 1;
			updateLives();
			showGameOver();
		}
		
	}
}
    

// Drops a flare on the ground (if you have it)
/*TODO: This does not work */
function dropCone(){
    if (bonusArray["torches"] > 0){
        bonusArray["torches"] -= 1;
        var rotationMatrix = new THREE.Matrix4();
        rotationMatrix.extractRotation(camera.matrix);
        var positionDiff = new THREE.Vector3(0, 0, -1);
        var finalPosition = positionDiff.applyMatrix4(rotationMatrix);
        var oldPosition = player.mesh.position

        var cone = coneGeometry.clone();
        cone.position.x = oldPosition.x + finalPosition.x;
        cone.position.y = oldPosition.y - 1;
        cone.position.z = oldPosition.z + finalPosition.z;
        
        // Adding some randomness to the placement of flares
        var randomAngle = Math.floor((Math.random() * Math.PI*2) + 0); // Get an random angle between 0 and 2PI
        cone.rotation.set(randomAngle * Math.random(), randomAngle, 0);
        
        // Add light from the flare
        var flareLight = createLight(cone.position.x, cone.position.y, cone.position.z);
        flareLight.position.z += 0.5;
        cone.add(flareLight);
        
        // Add flare to scene and list of items we can pick up
        scene.add(cone);
        
        // Update level with lights
        levelObject.traverse(function (node) {
            if(node.material){
                node.material.needsUpdate = true;
            }
        });

        pickUpItems.push(cone);
    }
}


// Player Take Damage
function takeDamage(amount){
    if(health > 0){
        if(health - amount > 0){
            health -= amount;
        }
        else{ //health can not be negative.
            health = 0;
        }

        damaged = true;
        audioArray['damage'].play(); //Play a sound when taking damage.
        damageSprite.visible = true; //And flash the red bloodstains on the screen edges.
        damageFrames = 0;
        damageWarning = true;
    }
}
var points = 0;


// Resets all values before next run
function resetValues() {
    runForward = false;
    walkForward = false;
    walkBackward = false;
    counterClockwiseRotation = 0;
    clockwiseRotation = 0;
    strafeLeft = false;
    strafeRight = false;
    jump = false;
    pickupThisFrame = false;
    pickup = false;
    move = false;
}