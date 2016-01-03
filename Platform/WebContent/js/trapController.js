//Checks if traps are triggered, and handles what happens then.
function checkTraps() {
//    if(level == 1){
//        for(var i = 0;  i < moveableObjects.length; i++){
//            if (moveableObjects[i]._physijs.touches.indexOf(tile._physijs.id) === 1) { //If any moveable object touches the trigger tile
//                if (!triggered) { //Trigger the trap
//                    scene.remove(trap);
//                    scene.add(trap); //remove and add the trap to refresh it in the scene. Objects being still for too long are overlooked.
//                    trap.setLinearFactor(new THREE.Vector3(0, 1, 0)); //Let the trap be pulled down by gravity.
//                    trap.setAngularFactor(new THREE.Vector3(0, 0, 0));
//                    triggered = true;
//                    trapTime = new THREE.Clock(); //Start the clock, to give the player time to pass the trap while its recharging.
//                }
//            }
//        }
//        
//        for(var i = 0;  i < pickUpItems.length; i++){
//            if (pickUpItems[i]._physijs.touches.indexOf(tile._physijs.id) === 1) { //the trap can also be triggered by flares.
//                if (!triggered) {
//                    scene.remove(trap);
//                    scene.add(trap);
//                    trap.setLinearFactor(new THREE.Vector3(0, 1, 0));
//                    trap.setAngularFactor(new THREE.Vector3(0, 0, 0));
//                    triggered = true;
//                    trapTime = new THREE.Clock();
//
//                }
//            }
//        }
//        
//        if (triggered) { //If the trap is triggered
//            
//            if (trap.position.y < 2) { //When its below a certain point
//                    applyForce = true; //start applying an upwards force on it to lift it back up.
//            }
//
//            if (applyForce) {
//                    trap.applyCentralForce(new THREE.Vector3(0, 2500, 0));
//
//            }
//
//            if (trap.position.y > 4 && trapTime.getElapsedTime() > 2) { //if the trap is high enough up, and enough time has passed.
//                    trap.setLinearVelocity(new THREE.Vector3(0, 0, 0)); //Stop gravity from effecting it.
//                    trap.setLinearFactor(new THREE.Vector3(0, 0, 0));
//                    applyForce = false; //And stop lifting it upwards.
//
//            }
//
//            if (trapTime.getElapsedTime() > 10) { //after 10 seconds, let the trap be triggerable again.
//                    trapTime.stop();
//                    triggered = false;
//            }
//        }
//
//        var intersects = trapCaster2.intersectObjects(moveableObjects); //When a moveable object passes a certain point
//        if (intersects.length > 0) {
//            if (!triggered2) { //trigger the horizontally moving trap
//
//                trap2.setLinearVelocity(new THREE.Vector3(0, 0, -7)); //Give it a speed towards the triggerpoint.
//                triggered2 = true;
//
//            }
//        }
//    }
    
//    if(level == 2){
        
	//Reset crates if they are removed
    	if(cratesRemoved){ 
            for(var i = 0; i < crates.length; i++){
                    scene.add(crates[i]);
            }
            scene.add(hintCrate);
            cratesRemoved = false;
    	}
    	
    	//Check falling/sliding traps.
    	for(var i = 0; i < traps.length; i++){
    		if(traps[i].triggered == true){
    			traps[i].active();
    		}
    		else if(traps[i].reset == true){
    			traps[i].resetting();
    		}
    	}

        if(puzzleComplete){ //If the "lights on!" puzzle is complete.
            if(puzzle.material.opacity > 0){
                puzzle.material.opacity -= 0.01; //Fade it out
                for(var i = 0; i < puzzlePoints.length; i++){
                        puzzlePoints[i].material.opacity -= 0.01;
                }
            } else{
                scene.remove(puzzle); //and remove it from the scene so the player can get past it.
                for(var i = 0; i < puzzlePoints.length; i++){
                        scene.remove(puzzlePoints[i]);
                }
                puzzleComplete = false;
                reAddPuzzle = true; //lets the restart function know that it has to add the puzzle to the scene again.
            }
        }
        
//       Move platforms
        for(var i = 0; i < platforms.length; i++){
        	platforms[i].move();
        }
        
        if(level == 3){ //Need to check for level 3? Does it help at all? 
        	//Checks if the icepillar puzzle is complete.
        	if(!targetTile.triggered && targetTile.mesh._physijs.touches.length > 0){
        		for(var i = 0; i < icePillars.length; i++){
        			if(icePillars[i].mesh._physijs.id === targetTile.mesh._physijs.touches[0]){
        				if(icePillars[i].mesh.getLinearVelocity().length() < 0.2){
        					targetTile.triggered = true;
        					audioArray['objective'].play();
        				}
        			}
        		}
        	
        	}
        	//Moves the platform if the icepillar puzzle is complete.
        	if(targetTile.triggered){
        		for(var i = 0; i < specialPlatforms.length; i++){
        			specialPlatforms[i].setSpeed(new THREE.Vector3(0,2,0));
        		}
        	}
        	else{
        		for(var i = 0; i < specialPlatforms.length; i++){
        			specialPlatforms[i].setSpeed(new THREE.Vector3(0, 0, 0));
        		}
        	}
        	//Checks if the character is touching ice.
        	if(player.floor == 2){
	        	for(var i = 0; i < iceTiles.length; i++){
	        		iceTiles[i].checkIce();
	        	}
        	}
        }
        
        //Open and close doors
        for(var i = 0; i < doors.length; i++){
        	doors[i].checkDoor();
        	if(doors[i].opening){
        		doors[i].openDoor();
        	}
        	else if(doors[i].closing){
        		doors[i].closeDoor();
        	}
        }
	      

        for(var i = 0; i < enemies.length; i++){
	        if(enemies[i].alive){ //if the zombie is alive
	            var distance = new THREE.Vector3();
	            distance.subVectors(player.mesh.position, enemies[i].mesh.position);
	            distance.y = 0;
	
	            if(distance.length() < 20){ //if the distance to the player is less than 20
	                if(zombieSoundPlayFrames == 0){
	                        enemies[i].sound.play(); //start playing the zombie sound
	
	                }
	                zombieSoundPlayFrames += 1;
	                if(zombieSoundPlayFrames > (800 + Math.random()*400)){ //And replay it at random intervals.
	                        zombieSoundPlayFrames = 0; 
	                }
	
	                if(distance.length() < 15){ 
	
	                        if(distance.length() < 10){ //Adjust the sound volume of the zombie by distance
	                                if(distance.length() < 5){
	                                        enemies[i].sound.volume = 0.45;
	                                }
	                                else{
	                                        enemies[i].sound.volume = 0.3;
	                                }
	                        }
	                        else{
	                                enemies[i].sound.volume = 0.15;
	                        }
	
	                        if(!zombieMoving){ //If the zombie is not moving
	                        distance.normalize(); //normalize the distance
	
	                        zombieVelocityNormal = distance; //and set the zombies normalized velocity vector equal to that.
	                        zombieMoving = true;
	                        zombieMovingFrames = 0;
	                        }
	
	
	
	                }
	                else{
	                        enemies[i].sound.volume = 0.05;
	                }
	            }
	
	            if(zombieMoving){ //If the zombie is moving.
	                var oldVelocity = enemies[i].mesh.getLinearVelocity();
	                //Set the zombies velocity in x and z direction equal to the calculated direction towards the player, times two.
	                enemies[i].mesh.setLinearVelocity(new THREE.Vector3(zombieVelocityNormal.x * 2, oldVelocity.y, zombieVelocityNormal.z * 2 ));
	                zombieMovingFrames += 1;
	                enemies[i].mesh.lookAt(new THREE.Vector3(player.mesh.position.x, 1, player.mesh.position.z)); //Keep the zombie facing the player
	                if(zombieMovingFrames > 100){
	                        zombieMoving = false;
	                }
	            }
	
	            if(enemies[i].mesh.position.y < -5){
	                    scene.remove(enemies[i].mesh); //If the zombie falls down in a hole. Remove it from the scene. It is dead.
	                    enemies[i].alive = false;
	            }
	        }
	        if(jumpableDoorOpening){ //Moves the jumpable door in level 2 upwards after the lever is pulled.
	            if(jumpableDoor.position.y < 7){
	                jumpableDoor.setLinearVelocity(new THREE.Vector3(0,1,0));
	                if(lever.rotation.x < Math.PI/6){
	                        lever.rotation.x += 0.005;
	                }
	            } else{
	                jumpableDoor.setLinearFactor(new THREE.Vector3(0,0,0)); //Stops the movement when it reaches the top.
	                jumpableDoorOpening = false;
	            }
	        }
        }
        
    
}

var zombie;
var zombieVelocityNormal;
var zombieMoving = false;
var zombieMovingFrames = 0;
var zombieAlive = false;
var zombieSoundPlayFrames = 0;