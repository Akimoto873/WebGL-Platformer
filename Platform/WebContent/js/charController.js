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


//checks keyinputs on every loop turn.
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

    // If not running. Regen stamina.
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
            counterClockwiseRotation = 2; // charMesh.setAngularVelocity(new
    }

    // D
    if (keyMap[68]) { 
            clockwiseRotation = -2; // charMesh.setAngularVelocity(new    // THREE.Vector3(0, -1.5, 0));
    }

    // Q - strafe
    if (keyMap[69]) {
            forceVector.x -= force;
            move = true;
    }

    // E - strafe
    if (keyMap[81]) {
            forceVector.x += force;
            move = true;
    }

    // Restart level is dead and R is pressed.
    if (keyMap[82] && gameOverScreen) { 
            restartLevel();
    }
}

var jumpableDoorOpen = false;
var jumpableDoorOpening = false;
// Handles all character movement.
function checkMovement() {
	
//	var oldVelocityVector = charMesh.getLinearVelocity();
//	var oldVelocity = Math.sqrt(Math.pow(oldVelocityVector.x, 2) + Math.pow(oldVelocityVector.z, 2));
//	var oldVelocityRun = oldVelocity;
//	if(oldVelocityRun > 8){
//		oldVelocityRun = 8;
//	}
//	if(oldVelocity > 4){
//		oldVelocity = 4;
//	}
//	var force = 10*(4 - oldVelocity)/deltaT; //Force needed this frame to simulate setlinearvelocity
//	var runForce = 10*(8 - oldVelocityRun)/deltaT;
   
	
	//Get rotation and velocity of character
	var rotationMatrix = new THREE.Matrix4();
    rotationMatrix.extractRotation(charMesh.matrix);
    var oldVelocityVector = charMesh.getLinearVelocity();
    var currentVelocity = Math.sqrt(Math.pow(charMesh.getLinearVelocity().x, 2) 
            + Math.pow(charMesh.getLinearVelocity().z, 2));
    var maxSpeed = 4;
    force = 4;
    if(runForward){
    	maxSpeed = 8;
    	force = 8;
    }
    if(move && currentVelocity < maxSpeed){
	    var finalForceVector = forceVector.applyMatrix4(rotationMatrix);
	    charMesh.setLinearVelocity(new THREE.Vector3(finalForceVector.x, oldVelocityVector.y,
	                   finalForceVector.z));
    }
    if(runForward){
    	walkSound.playbackRate = 2;
    }
    else{
    	walkSound.playbackRate = 1;
    }
    if(move && !playingSound && !airborne1){
    	walkSound.play();
    	playingSound = true;
    }
    else if((!move || airborne1) && playingSound){
    	walkSound.pause();
    	playingSound = false;
    }
    
    
    if (jump) { 
        if(airborne1 || airborne2){
        	if(airborne1){
        		waitForKeyUp = true;
        	}
        	jumpSound.play();
            airTime = new THREE.Clock();
            charMesh.applyCentralImpulse(new THREE.Vector3(0, 120, 0));
            stamina -= 20;
            // health -= 10;
            // damaged = true; //for testing purposes
        }
    }
    
    charMesh.setAngularVelocity(new THREE.Vector3(0, clockwiseRotation + counterClockwiseRotation, 0));


    if (pickup) {
        for (var i = 0; i < pickUpItems.length; i++){
            var distance = new THREE.Vector3();
            distance.subVectors(charMesh.position, pickUpItems[i].position);
            if (distance.length() < 2.5) {
            	
                
                for(var j = 0; j < crates.length; j++){
	                if(pickUpItems[i]== crates[j] && !carrying) {
	                	scene.remove(pickUpItems[i]);
	                        crates[j].position.x = 0;
	                        crates[j].position.y = -1;
	                        crates[j].position.z = 0;
	                        charMesh.add(crates[j]);
	                        crates[j].position.z += 1;
	                        carrying = true;
	                        carriedItem = j;
	                        pickupThisFrame = true;
	                        i = pickUpItems.length + 1;
	                        pickUpItems.splice(i, 1);
	                }
                }
            
	            if(pickUpItems[i] == cones){
	            	scene.remove(pickUpItems[i]);
	                        pickUpItems.splice(i, 1);
	                        carriedCones += 5;
	                        i = pickUpItems.length + 1;
	            }
	            else if(!carrying){
	            	scene.remove(pickUpItems[i]);
	                        pickUpItems.splice(i, 1);
	                        carriedCones += 1;
	                        i = pickUpItems.length + 1;
	                }
                
            }
        }
        if(level == 2){
	        distance.subVectors(charMesh.position, lever.position);
	        if(!jumpableDoorOpen && distance.length() < 2.5){
	        	jumpableDoorOpen = true;
	        	jumpableDoorOpening = true;
	        }
        }
        
        if (carrying && !pickupThisFrame) {
            charMesh.remove(crates[carriedItem]);
            var positionDiff = new THREE.Vector3(0, 0, 1);
            var finalPosition = positionDiff.applyMatrix4(rotationMatrix);
            var oldPosition = charMesh.position
            crates[carriedItem].position.x = oldPosition.x + finalPosition.x;
            crates[carriedItem].position.y = oldPosition.y - 1;
            crates[carriedItem].position.z = oldPosition.z + finalPosition.z;
            scene.add(crates[carriedItem]);
            pickUpItems.push(crates[carriedItem]);
            carrying = false;
        }
    }
    if(level == 2 && keysPickedUp == 3){
    	var distance = new THREE.Vector3();
        distance.subVectors(charMesh.position, doorway.position);
        if(distance.length() < 6){
        	if(doorway.children[0].position.y > -3){
        		doorway.children[0].position.y -= 0.02;
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
    if(jumpableDoorOpening){
    	if(jumpableDoor.position.y < 7){
    		jumpableDoor.setLinearVelocity(new THREE.Vector3(0,1,0));
    		lever.rotation.x += 0.005;
    	}
    	else{
    		jumpableDoor.setLinearFactor(new THREE.Vector3(0,0,0));
    		jumpableDoorOpening = false;
    	}
    }
}

//Checks if traps are triggered, and handles what happens then.
function checkTraps() {
	if(level == 1){
		for(var i = 0;  i < moveableObjects.length; i++){
		    if (moveableObjects[i]._physijs.touches.indexOf(tile._physijs.id) === 1) {
		        if (!triggered) {
		            scene.remove(trap);
		            scene.add(trap);
		            trap.setLinearFactor(new THREE.Vector3(0, 1, 0));
		            trap.setAngularFactor(new THREE.Vector3(0, 0, 0));
		            triggered = true;
		            trapTime = new THREE.Clock();
	
		        }
		    }
	    }
		for(var i = 0;  i < pickUpItems.length; i++){
		    if (pickUpItems[i]._physijs.touches.indexOf(tile._physijs.id) === 1) {
		        if (!triggered) {
		            scene.remove(trap);
		            scene.add(trap);
		            trap.setLinearFactor(new THREE.Vector3(0, 1, 0));
		            trap.setAngularFactor(new THREE.Vector3(0, 0, 0));
		            triggered = true;
		            trapTime = new THREE.Clock();
	
		        }
		    }
	    }
	    if (triggered) {
	
	        if (trap.position.y < 2) {
	                applyForce = true;
	        }
	        
	        if (applyForce) {
	                trap.applyCentralForce(new THREE.Vector3(0, 2500, 0));
	
	        }
	        
	        if (trap.position.y > 4 && trapTime.getElapsedTime() > 2) {
	                trap.setLinearVelocity(new THREE.Vector3(0, 0, 0));
	                trap.setLinearFactor(new THREE.Vector3(0, 0, 0));
	                applyForce = false;
	
	        }
	
	        if (trapTime.getElapsedTime() > 10) {
	                trapTime.stop();
	                triggered = false;
	        }
	    }
	
	    var intersects = trapCaster2.intersectObjects(moveableObjects);
	    if (intersects.length > 0) {
	        if (!triggered2) {
	
	            trap2.setLinearVelocity(new THREE.Vector3(0, 0, -7));
	            triggered2 = true;
	
	        }
	    }
	}
    if(level == 2){
	    if(level2Trap1Triggered){
	    	if(level2Trap1.position.y < 9){
	    		level2Trap1.applyCentralForce(new THREE.Vector3(0,500, 0));
	    	}
	    	else if(level2Trap1.position.y > 9){
	    		level2Trap1Triggered = false;
	    		level2Trap1.setLinearVelocity(new THREE.Vector3(0,0,0));
	    		level2Trap1.setLinearFactor(new THREE.Vector3(0,0,0));
	    	}
	    }
	    if(puzzleComplete){
	    	if(puzzle.material.opacity > 0){
	    		puzzle.material.opacity -= 0.01;
	    		for(var i = 0; i < puzzlePoints.length; i++){
	    			puzzlePoints[i].material.opacity -= 0.01;
	    		}
	    	}
	    	else{
	    		scene.remove(puzzle);
	    		for(var i = 0; i < puzzlePoints.length; i++){
	    			scene.remove(puzzlePoints[i]);
	    		}
	    		puzzleComplete = false;
	    	}
	    }
    }
}

// Checks if the character should take fall dmg.
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
        rotationMatrix.extractRotation(charMesh.matrix);
        var positionDiff = new THREE.Vector3(0, 0, 1);
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
		else{
			health = 0;
		}
	
		damaged = true;
		damageSound.play();
	}
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