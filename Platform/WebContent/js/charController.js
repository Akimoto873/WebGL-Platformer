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
            stamina -= 2;
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


// Handles character movement (and then some)
function checkMovement() {
    
    // Get rotation and velocity of character
    var rotationMatrix = new THREE.Matrix4();
    rotationMatrix.extractRotation(camera.matrix);
    var oldVelocityVector = charMesh.getLinearVelocity();
    var currentVelocity = Math.sqrt(Math.pow(charMesh.getLinearVelocity().x, 2) + Math.pow(charMesh.getLinearVelocity().z, 2));
    
    // set the movement speed
    var maxSpeed = 4;
    force = -4;
    
    // Increase movement speed if we are running
    if(runForward){
    	maxSpeed = 8;
    	force = -8;
    }
    
    // Give the character the intended velocity in the correct direction.
    if(move && currentVelocity < maxSpeed){
        charMesh.setLinearVelocity(new THREE.Vector3((forceVector.z)*Math.sin(camera.rotation.y) + (forceVector.x)*Math.cos(camera.rotation.y) + platformSpeedX, oldVelocityVector.y,
            (forceVector.z)*Math.cos(camera.rotation.y) - (forceVector.x)*Math.sin(camera.rotation.y) + platformSpeedZ));
        if(level == 2){
                platformSpeedX = 0;
                platformSpeedZ = 0;
        }
    }
    
    // Make sure the player sticks to moving platform
    if(!move && level == 2){
    	charMesh.setLinearVelocity(new THREE.Vector3(platformSpeedX, oldVelocityVector.y, platformSpeedZ));
    	
    	platformSpeedX = 0;
    	platformSpeedZ = 0;
    }
    
    // Adjust walking sound playrate if we are running / walking
    if(runForward){
    	walkSound.playbackRate = 2;
    }
    else{
    	walkSound.playbackRate = 1.2;
    }
    
    // Play walking sound
    if(move && !playingSound && !airborne1){
    	walkSound.play();
    	playingSound = true;
    }
    
    // If player is jumping or simply not walking; stop the walking sound.
    else if((!move || airborne1) && playingSound){
        walkSound.pause();
        playingSound = false;
    }
    
    // Jump in the air & handle double jump mechanic
    if(jump && (airborne1 || airborne2)){ 
        if(airborne1){
                waitForKeyUp = true; 
        }
        jumpSound.play();
        airTime = new THREE.Clock();
        charMesh.applyCentralImpulse(new THREE.Vector3(0, 60, 0));
        stamina -= 20;
    }
    
    // Handle when F is pressed (pick up)
    if (pickup) { 
        for (var i = 0; i < pickUpItems.length; i++){ 
            
            // Check distance to all items that can be picked up
            var distance = new THREE.Vector3();
            distance.subVectors(charMesh.position, pickUpItems[i].position); 
            
            // If distance is less than a set limit.
            if (distance.length() < 2.5) { 
            	
                // Check the crates
                for(var j = 0; j < crates.length; j++){ 
                    if(pickUpItems[i]== crates[j] && !carrying) {   // If that crate is the object within distance
                        scene.remove(pickUpItems[i]);               // Remove it from the scene
                        crates[j].position.x = 0;
                        crates[j].position.y = -1;
                        crates[j].position.z = 0;
                        camera.add(crates[j]);                      // Add it to the character
                        crates[j].position.z -= 1;
                        carrying = true;
                        carriedItem = j;
                        pickupThisFrame = true;
                        pickUpItems.splice(i, 1);                   // Remove it from the list of items that can be picked up.
                        i = pickUpItems.length + 1;                 // Stop the loop.
                    }
                }

                // TODO: Comment
                if(pickUpItems[i] == cones){                // If the item within range is the flarebox
                    scene.remove(pickUpItems[i]);           // Remove it from the scene.
                            pickUpItems.splice(i, 1);       // Remove it from the list of items that can be picked up.
                            carriedCones += 1;              // Give the player 1 reuseable flares.
                            i = pickUpItems.length + 1;     // Stop the loop
                }
                else if(!carrying){                         // Else, the item has to be a single flare
                    scene.remove(pickUpItems[i]);           // So we remove the flare from the scene
                            pickUpItems.splice(i, 1);       // And from the list of items that can be picked up.
                            carriedCones += 1;              // And add it to the players available flares for use.
                            i = pickUpItems.length + 1;     // Stop the loop
                }  
            }
        }
        
        // If player is in level 2, there's more things to check
        if(level == 2){ 
            distance.subVectors(charMesh.position, lever.position);     // Check the distance to the lever.
            if(!jumpableDoorOpen && distance.length() < 2.5){           // If its less than a given limit.
                jumpableDoorOpen = true;  
                jumpableDoorOpening = true;                             // Start opening the door.
            }
        }
        
        // TODO: Comment
        if (carrying && !pickupThisFrame) {                                     // If already carrying an item, picked up before this frame.
            camera.remove(crates[carriedItem]);                                 // Remove it from the character.
            var positionDiff = new THREE.Vector3(0, 0, -1);
            var finalPosition = positionDiff.applyMatrix4(rotationMatrix);
            var oldPosition = charMesh.position
            crates[carriedItem].position.x = oldPosition.x + finalPosition.x;
            crates[carriedItem].position.y = oldPosition.y - 1;
            crates[carriedItem].position.z = oldPosition.z + finalPosition.z;   // Give it the correct position in front of the character.
            scene.add(crates[carriedItem]);                                     // And add it to the scene.
            pickUpItems.push(crates[carriedItem]);                              // And back to the list of items to pick up.
            carrying = false;
        }
    }
    
    // Check if all keys are picked up in level 2
    if(level == 2 && keysPickedUp == 3){
    	var distance = new THREE.Vector3();
        distance.subVectors(charMesh.position, doorway.position);
        
        // If the character is within a certain distance of the exit door, open the door
        if(distance.length() < 6){                                  
            if(doorway.children[0].position.y > -8){
                doorway.children[0].position.y -= 0.02;         
            } else{
                scene.remove(doorway);
                keysPickedUp = 0;
            }
        }
    }
    
    // Check for traps and fall damage
    checkTraps();
    checkFallDmg();

    // If we have lost all our health, set game over
    if (health < 1 && !gameOverScreen) {
        showGameOver();
    }
}


// Checks if the character should take fall dmg. 
// Using a raycaster downwards, checking the velocity right before impact.
function checkFallDmg() {
    charCaster.set(charMesh.position, new THREE.Vector3(0, -1, 0));
    var intersects = charCaster.intersectObjects(objects);
    
    // Check for landing
    if ((airborne1 || airborne2) && airTime.getElapsedTime() > 0.5) { 
        for (var i = 0; i < intersects.length; i++) {
            if (intersects[i].distance < 1.6) {
                airborne1 = false;
                airborne2 = false;
                airTime.stop();
            }
        }
    }
    
    //  TODO: Comment
    if (intersects[0]) {
        if (charMesh.getLinearVelocity().y < -14 && intersects[0].distance < 2) {
            if (fallClock.getElapsedTime() > 1) {
                var damage = Math.abs(charMesh.getLinearVelocity().y) * 1.5;
                takeDamage(damage);
                fallClock = new THREE.Clock();
            }
        }
    }
    
    // TODO: Comment
    if(charMesh.position.y < -5){
    	takeDamage(100);
    }
}


// Drops a flare on the ground (if you have it)
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