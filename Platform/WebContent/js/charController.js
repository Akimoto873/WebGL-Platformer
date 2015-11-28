/**
 * 
 */

var runForward = false;
var walkForward = false;
var walkBackward = false;
var jump = false;
var counterClockwiseRotation = 0;
var clockwiseRotation = 0;
var strafeLeft = false;
var strafeRight = false;
var pickupThisFrame = false;
var force = 300;


//checks keyinputs on every loop turn.
function checkKeys() {
	if(timerNotRunning){
		
		timerNotRunning = false;
	}
	if (keyMap[87]) { //W
		if (keyMap[16] //Shift = run
				&& stamina > 0 && Math.sqrt(Math.pow(charMesh.getLinearVelocity().x, 2)
						+ Math.pow(charMesh.getLinearVelocity().z, 2)) < 8
				) {
			runForward = true;
		} else if (Math.sqrt(Math.pow(charMesh.getLinearVelocity().x, 2) //else walk
				+ Math.pow(charMesh.getLinearVelocity().z, 2)) < 4) {
			walkForward = true;
		}
	}
	if (!keyMap[16] && stamina < 200) { //if not running. Regen stamina.
		stamina += 1;
	}
	if (keyMap[83]) { // S - walk backwards
		if (Math.sqrt(Math.pow(charMesh.getLinearVelocity().x, 2)
				+ Math.pow(charMesh.getLinearVelocity().z, 2)) < 4) {
			walkBackward = true;
		}
	}
	if (keyMap[32]) { // Space
		if (!airborne) {
			jump = true;
		}
	}
	if (keyMap[65]) { // A
		counterClockwiseRotation = 2; // charMesh.setAngularVelocity(new
										// THREE.Vector3(0, 1.5, 0));

	}
	if (keyMap[68]) { // D
		clockwiseRotation = -2; // charMesh.setAngularVelocity(new
									// THREE.Vector3(0, -1.5, 0));
	}

	if (keyMap[69]) { // Q - strafe
		if (Math.sqrt(Math.pow(charMesh.getLinearVelocity().x, 2)
				+ Math.pow(charMesh.getLinearVelocity().z, 2)) < 4) {
			strafeLeft = true;
		}
	}

	if (keyMap[81]) { // E - strafe

		if (Math.sqrt(Math.pow(charMesh.getLinearVelocity().x, 2)
				+ Math.pow(charMesh.getLinearVelocity().z, 2)) < 4) {
			strafeRight = true;
		}
	}
	if (keyMap[82] && gameOverScreen) { //Restart level is dead and R is pressed.
		restartLevel();
	}

}


//Handles all character movement.
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
	if (runForward) {
		var rotationMatrix = new THREE.Matrix4();
		rotationMatrix.extractRotation(charMesh.matrix);
		var forceVector = new THREE.Vector3(0, 0, force );
		var finalForceVector = forceVector.applyMatrix4(rotationMatrix);
		var oldVelocityVector = charMesh.getLinearVelocity();
		charMesh.applyCentralForce(new THREE.Vector3(finalForceVector.x, 0,
				finalForceVector.z));
		stamina -= 2;
	} else if (walkForward) {
		var rotationMatrix = new THREE.Matrix4();
		rotationMatrix.extractRotation(charMesh.matrix);
		var forceVector = new THREE.Vector3(0, 0, force);
		var finalForceVector = forceVector.applyMatrix4(rotationMatrix);
		
		charMesh.applyCentralForce(new THREE.Vector3(finalForceVector.x, 0,
				finalForceVector.z));
		
	}

	if (walkBackward) { // S

		var rotationMatrix = new THREE.Matrix4();
		rotationMatrix.extractRotation(charMesh.matrix);
		var forceVector = new THREE.Vector3(0, 0, -force);
		var finalForceVector = forceVector.applyMatrix4(rotationMatrix);
		var oldVelocityVector = charMesh.getLinearVelocity();
		charMesh.applyCentralForce(new THREE.Vector3(finalForceVector.x, 0,
				finalForceVector.z));

	}
	if (jump) { // Space
		airborne = true;
		airTime = new THREE.Clock();
		charMesh.applyCentralImpulse(new THREE.Vector3(0, 60, 0));
		// health -= 10;
		// damaged = true; //for testing purposes

	}

	charMesh.setAngularVelocity(new THREE.Vector3(0, clockwiseRotation
			+ counterClockwiseRotation, 0));

	if (strafeLeft) { // Q

		var rotationMatrix = new THREE.Matrix4();
		rotationMatrix.extractRotation(charMesh.matrix);
		var forceVector = new THREE.Vector3(-force, 0, 0);
		var finalForceVector = forceVector.applyMatrix4(rotationMatrix);
		var oldVelocityVector = charMesh.getLinearVelocity();
		charMesh.applyCentralForce(new THREE.Vector3(finalForceVector.x, 0,
				finalForceVector.z));
	}

	if (strafeRight) { // E
		var rotationMatrix = new THREE.Matrix4();
		rotationMatrix.extractRotation(charMesh.matrix);
		var forceVector = new THREE.Vector3(force, 0, 0);
		var finalForceVector = forceVector.applyMatrix4(rotationMatrix);
		var oldVelocityVector = charMesh.getLinearVelocity();
		charMesh.applyCentralForce(new THREE.Vector3(finalForceVector.x, 0,
				finalForceVector.z));
	}

	if (pickup) {
		if (!carrying) {
			var distance = new THREE.Vector3();
			distance.subVectors(charMesh.position, crate.position);
			if (distance.length() < 3) {
				scene.remove(crate);
				crate.position.x = 0;
				crate.position.y = -1;
				crate.position.z = 0;
				charMesh.add(crate);
				crate.position.z += 1;
				carrying = true;
				pickupThisFrame = true;
			}
		}

		if (carrying && !pickupThisFrame) {
			charMesh.remove(crate);
			var rotationMatrix = new THREE.Matrix4();
			rotationMatrix.extractRotation(charMesh.matrix);
			var positionDiff = new THREE.Vector3(0, 0, 1);
			var finalPosition = positionDiff.applyMatrix4(rotationMatrix);
			var oldPosition = charMesh.position
			crate.position.x = oldPosition.x + finalPosition.x;
			crate.position.y = oldPosition.y - 1;
			crate.position.z = oldPosition.z + finalPosition.z;
			scene.add(crate);
			carrying = false;

		}

	}

	checkTraps();
	checkFallDmg();

	if (health < 1 && !gameOverScreen) {
		showGameOver();
	}
	
	

}

//Checks if traps are triggered, and handles what happens then.
function checkTraps() {
	

	if (charMesh._physijs.touches.indexOf(tile._physijs.id) === 1 || crate._physijs.touches.indexOf(tile._physijs.id) === 1) {
		if (!triggered) {
			scene.remove(trap);
			scene.add(trap);
			trap.setLinearFactor(new THREE.Vector3(0, 1, 0));
			trap.setAngularFactor(new THREE.Vector3(0, 0, 0));
			triggered = true;
			trapTime = new THREE.Clock();
			
		}
	}
	if (triggered) {
		log(applyForce);
		log(trap.position.y);

		if (trap.position.y < 2) {
			applyForce = true;
		}
		if (applyForce) {
			trap.applyCentralForce(new THREE.Vector3(0, 1100, 0));
			
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

//Checks if the character should take fall dmg.
function checkFallDmg() {
	charCaster.set(charMesh.position, new THREE.Vector3(0, -1, 0));
	var intersects = charCaster.intersectObjects(objects);
	if (airborne && airTime.getElapsedTime() > 1) { // check for landing

		for (var i = 0; i < intersects.length; i++) {
			if (intersects[i].distance < 10) {
				airborne = false;
				airTime.stop();

			}
		}
	}
	if (intersects[0]) {
		if (charMesh.getLinearVelocity().y < -14 && intersects[0].distance < 2) {
			if (fallClock.getElapsedTime() > 1) {
				var damage = Math.abs(charMesh.getLinearVelocity().y) * 1.5;
				health -= damage;
				damaged = true;
				fallClock = new THREE.Clock();
			}
		}
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
}