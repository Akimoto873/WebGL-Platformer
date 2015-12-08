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


//checks key inputs on every loop turn.
function checkKeys() {

	forceVector = new THREE.Vector3(0,0,0);
    // W
    if (keyMap[87]) { 
        //Shift = run
        if (keyMap[16] && stamina > 0){
            runForward = true;
            stamina -= 2;
        }
        forceVector.z += force;
        move = true;
    }

    // If not running. Regenerate stamina.
    if (!keyMap[16] && stamina < 200) { 
            stamina += 1;
    }

    // S - walk backwards
    if (keyMap[83]) { 
    		forceVector.z -= force;
    		move = true;
            
    }

    // A
    if (keyMap[65]) { 
            // counterClockwiseRotation = 2/50; // 
            forceVector.x += force;
            move = true;
    }

    // D
    if (keyMap[68]) { 
            // clockwiseRotation = -2/50; // 
            forceVector.x -= force;
            move = true;
    }

    // Restart level if dead and R is pressed.
    if (keyMap[82] && gameOverScreen) { 
            restartLevel();
    }
}

var jumpableDoorOpen = false;
var jumpableDoorOpening = false;
var platformSpeedX = 0;
var platformSpeedZ = 0;
// Handles all character movement.
function checkMovement() {
   
	
    //Get rotation and velocity of character
    var rotationMatrix = new THREE.Matrix4();
    rotationMatrix.extractRotation(camera.matrix);
    var oldVelocityVector = charMesh.getLinearVelocity();
    var currentVelocity = Math.sqrt(Math.pow(charMesh.getLinearVelocity().x, 2) 
            + Math.pow(charMesh.getLinearVelocity().z, 2));
    
    //set the movement speed
    var maxSpeed = 4;
    force = -4;
    if(runForward){
    	//and change it if running.
    	maxSpeed = 8;
    	force = -8;
    }
    if(move && currentVelocity < maxSpeed){
    	//Give the character the intended velocity in the correct direction.
//	    var finalForceVector = forceVector.applyMatrix4(rotationMatrix); //this bugged out when looking up/down for some reason.
            
            
    	 charMesh.setLinearVelocity(new THREE.Vector3((forceVector.z)*Math.sin(camera.rotation.y) + (forceVector.x)*Math.cos(camera.rotation.y) + platformSpeedX, oldVelocityVector.y,
                 (forceVector.z)*Math.cos(camera.rotation.y) - (forceVector.x)*Math.sin(camera.rotation.y) + platformSpeedZ));
    	 if(level == 2){
    		 platformSpeedX = 0;
    		 platformSpeedZ = 0;
    	 }
    }
    if(!move && level == 2){
    	charMesh.setLinearVelocity(new THREE.Vector3(platformSpeedX, oldVelocityVector.y, platformSpeedZ));
    	
    	platformSpeedX = 0;
    	platformSpeedZ = 0;
    }
    if(runForward){
    	walkSound.playbackRate = 2; //If running, speed up the walking sound.
    }
    else{
    	walkSound.playbackRate = 1;
    }
    if(move && !playingSound && !airborne1){
    	//If walking, play the walking sound.
    	walkSound.play();
    	playingSound = true;
    }
    else if((!move || airborne1) && playingSound){
    	//If jumping, or not walking, stop the walking sound.
    	walkSound.pause();
    	playingSound = false;
    }
    
    
    if (jump) { 
        if(airborne1 || airborne2){ //If not both jumps are used, give the character an impulse upwards.
            if(airborne1){
                    waitForKeyUp = true; 
            }
            jumpSound.play();
            airTime = new THREE.Clock();
            charMesh.applyCentralImpulse(new THREE.Vector3(0, 60, 0));
            stamina -= 20;
        }
    }
    camera.rotation.y += (clockwiseRotation + counterClockwiseRotation); //For rotating the character with A and D.


    if (pickup) { //If F is pressed
        for (var i = 0; i < pickUpItems.length; i++){ 
            var distance = new THREE.Vector3();
            distance.subVectors(charMesh.position, pickUpItems[i].position); //Check distance to all items that can be picked up
            if (distance.length() < 2.5) { //If distance is less than a set limit.
            	
                for(var j = 0; j < crates.length; j++){ //Check the crates
	                if(pickUpItems[i]== crates[j] && !carrying) { //If that crate is the object within distance
	                	scene.remove(pickUpItems[i]); //remove it from the scene
	                        crates[j].position.x = 0;
	                        crates[j].position.y = -1;
	                        crates[j].position.z = 0;
	                        camera.add(crates[j]);  //and add it to the character
	                        crates[j].position.z -= 1;
	                        carrying = true;
	                        carriedItem = j;
	                        pickupThisFrame = true;
	                        pickUpItems.splice(i, 1); //remove it from the list of items that can be picked up.
	                        i = pickUpItems.length + 1; //Stop the loop.
	                }
                }
            
	            if(pickUpItems[i] == cones){ //If the item within range is the flarebox
	            	scene.remove(pickUpItems[i]); //remove it from the scene.
	                        pickUpItems.splice(i, 1); //remove it from the list of items that can be picked up.
	                        carriedCones += 1; //Give the player 1 reuseable flares.
	                        i = pickUpItems.length + 1; //Stop the loop
	            }
	            else if(!carrying){ //Else, the item has to be a single flare
	            	scene.remove(pickUpItems[i]); //So we remove the flare from the scene
	                        pickUpItems.splice(i, 1); //and from the list of items that can be picked up.
	                        carriedCones += 1; //And add it to the players available flares for use.
	                        i = pickUpItems.length + 1; //Stop the loop
	                }
                
            }
        }
        if(level == 2){ //If in level 2, there's more things to check.
	        distance.subVectors(charMesh.position, lever.position); //check the distance to the lever.
	        if(!jumpableDoorOpen && distance.length() < 2.5){ //if its less than a given limit.
	        	jumpableDoorOpen = true;  
	        	jumpableDoorOpening = true; //start opening the door.
	        }
        }
        
        if (carrying && !pickupThisFrame) { //If already carrying an item, picked up before this frame.
            camera.remove(crates[carriedItem]); //remove it from the character.
            var positionDiff = new THREE.Vector3(0, 0, -1);
            var finalPosition = positionDiff.applyMatrix4(rotationMatrix);
            var oldPosition = charMesh.position
            crates[carriedItem].position.x = oldPosition.x + finalPosition.x;
            crates[carriedItem].position.y = oldPosition.y - 1;
            crates[carriedItem].position.z = oldPosition.z + finalPosition.z; //Give it the correct position in front of the character.
            scene.add(crates[carriedItem]); //and add it to the scene.
            pickUpItems.push(crates[carriedItem]); //and back to the list of items to pick up.
            carrying = false;
        }
    }
    if(level == 2 && keysPickedUp == 3){ //If in level 2, and all keys are collected.
    	var distance = new THREE.Vector3();
        distance.subVectors(charMesh.position, doorway.position);
        if(distance.length() < 6){ //if the character is within a certain distance of the exit door.
        	if(doorway.children[0].position.y > -8){
        		doorway.children[0].position.y -= 0.02; //Open the exit door.
        	}
        	else{
        		scene.remove(doorway);
        		keysPickedUp = 0;
        	}
        }
    }
    checkTraps();
    checkFallDmg();

    // If we have lost all our health, set game over
    if (health < 1 && !gameOverScreen) {
            showGameOver();
    }
    
}



// Checks if the character should take fall dmg. Using a raycaster downwards, checking the velocity right before impact.
function checkFallDmg() {
    charCaster.set(charMesh.position, new THREE.Vector3(0, -1, 0));
    var intersects = charCaster.intersectObjects(objects);
    if ((airborne1 || airborne2) && airTime.getElapsedTime() > 0.5) { // check for landing

            for (var i = 0; i < intersects.length; i++) {
                    if (intersects[i].distance < 1.6) {
                            airborne1 = false;
                            airborne2 = false;
                            airTime.stop();

                    }
            }
    }
    if (intersects[0]) {
            if (charMesh.getLinearVelocity().y < -14 && intersects[0].distance < 2) {
                    if (fallClock.getElapsedTime() > 1) {
                            var damage = Math.abs(charMesh.getLinearVelocity().y) * 1.5;
                            takeDamage(damage);
                            fallClock = new THREE.Clock();
                    }
            }
    }
    if(charMesh.position.y < -5){
    	takeDamage(100);
    }
}


// Drops a flare on the ground (if you have flares)
function dropCone(){
    if (carriedCones > 0){
        carriedCones -= 1;
        var rotationMatrix = new THREE.Matrix4();
        rotationMatrix.extractRotation(camera.matrix);
        var positionDiff = new THREE.Vector3(0, 0, -1);
        var finalPosition = positionDiff.applyMatrix4(rotationMatrix);
        var oldPosition = charMesh.position

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

function takeDamage(amount){
	if(health > 0){
		if(health - amount > 0){
			health -= amount;
		}
		else{ //health can not be negative.
			health = 0;
		}
	
		damaged = true;
		damageSound.play(); //Play a sound when taking damage.
		damageSprite.visible = true; //And flash the red bloodstains on the screen edges.
    	damageFrames = 0;
    	damageWarning = true;
	}
}
var points = 0;
function dungCollected(){
	points += 50;
	dungSound.play();
}

//resets all values before next run through.
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