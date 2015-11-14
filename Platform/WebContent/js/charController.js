/**
 * 
 */


function checkMovement(){
	if(controllingChar){
		if (keyMap[87]) { //W
			if(!airborne){
				var rotationMatrix = new THREE.Matrix4();
				rotationMatrix.extractRotation(charMesh.matrix);
				var forceVector = new THREE.Vector3(0, 0, 4);
				var finalForceVector = forceVector.applyMatrix4(rotationMatrix);
				var oldVelocity = charMesh.getLinearVelocity();
				charMesh.setLinearVelocity(new THREE.Vector3(finalForceVector.x, oldVelocity.y, finalForceVector.z ));
			}
		}
		if (keyMap[83]) { //S
			if(!airborne){
				var rotationMatrix = new THREE.Matrix4();
				rotationMatrix.extractRotation(charMesh.matrix);
				var forceVector = new THREE.Vector3(0, 0, -4);
				var finalForceVector = forceVector.applyMatrix4(rotationMatrix);
				var oldVelocity = charMesh.getLinearVelocity();
				charMesh.setLinearVelocity(new THREE.Vector3(finalForceVector.x, oldVelocity.y, finalForceVector.z ));
			}
	
		}
		if (keyMap[32]) { //Space
			if (!airborne) {
				airborne = true;
				airTime = new THREE.Clock();
				charMesh.applyCentralImpulse(new THREE.Vector3(0, 60, 0));
			}
		}
	
		if (keyMap[65]) { //A
			charMesh.setAngularVelocity(new THREE.Vector3(0, 1.5, 0));
	
		}
		if (keyMap[68]) { //D
			charMesh.setAngularVelocity(new THREE.Vector3(0, -1.5, 0));
	
		}
		if(!keyMap[65] && !keyMap[68]){
			charMesh.setAngularVelocity(new THREE.Vector3(0,0,0));
		}
		if(charMesh.position.y < -5){ //Checks if fallen off the edge.
			charMesh.__dirtyPosition = true;
			charMesh.position.x = 0;
			charMesh.position.y = 5;
			charMesh.position.z = 0;
			charMesh.setLinearVelocity(new THREE.Vector3(0,0,0));
			
		}
		if(keyMap[69]){ //E
//			var distance = new THREE.Vector3(); 
//			distance.subVectors(charMesh.position, meshFoundation.position);
//			if(distance.length() < 3){
//				controllingChar = false;
//				controllingCrane = true;
//				tempPos = camera.position.clone();		//		Crane
//				charMesh.remove(camera);
//				scene.add(camera);
//				camera.position.set(0, 15, 15);
//				camera.lookAt(meshFoundation.position);
//				
//			}
			if(!carrying){
				var distance = new THREE.Vector3();
				distance.subVectors(charMesh.position, crate.position);
				if(distance.length() < 3){
					scene.remove(crate);
					crate.position.x = 0;
					crate.position.y = 0;
					crate.position.z = 0;
					charMesh.add(crate);
					crate.position.z += 1;
					carrying = true;
				}
			}
			
			
		}
		if(keyMap[70]){
//			charMesh.remove(camera);
//			charMesh.visible = true;
//			camera.position.y += 10;   //CameraChange
//			camera.lookAt(charMesh.position);
//			scene.add(camera);
			if(carrying){
				charMesh.remove(crate);
				var rotationMatrix = new THREE.Matrix4();
				rotationMatrix.extractRotation(charMesh.matrix);
				var positionDiff = new THREE.Vector3(0, 0, 1);
				var finalPosition = positionDiff.applyMatrix4(rotationMatrix);
				var oldPosition = charMesh.position
				crate.position.x = oldPosition.x + finalPosition.x;
				crate.position.y = oldPosition.y;
				crate.position.z = oldPosition.z + finalPosition.z;
				scene.add(crate);
				carrying = false;
			}
		}
		if(airborne && airTime.getElapsedTime() > 1){ //check for landing
			charCaster.set(charMesh.position, new THREE.Vector3(0, -1, 0));
			var intersects = charCaster.intersectObjects(objects);
			for(var i = 0; i < intersects.length; i++){
				if (intersects[i].distance < 10){
						airborne = false;
						airTime.stop();
					
				}
			}
		}
		var intersects = trapCaster.intersectObjects(moveableObjects);
		
		if(intersects.length > 0){
			if(!triggered){
				log("test");
				trap.setLinearFactor(new THREE.Vector3(0,1,0));
				trap.setAngularFactor(new THREE.Vector3(0,0,0));
				scene.remove(trap);
				scene.add(trap);
				trap.setAngularFactor(new THREE.Vector3(0,0,0));
				triggered = true;
				trapTime = new THREE.Clock();
			}
		}
		if(triggered){
			var intersects = trapCaster.intersectObject(trap);
			
			if(intersects[0].distance < 1){
				trap.setLinearVelocity(new THREE.Vector3(0,10,0));
				
			}
			if(intersects[0].distance > 5 && trapTime.getElapsedTime() > 2){
				trap.setLinearVelocity(new THREE.Vector3(0,0,0));
				scene.remove(trap);
				scene.add(trap);
				trap.setLinearFactor(new THREE.Vector3(0,0,0));
				triggered = false;
				trapTime.stop();
			}
		}
		
	}
	if(controllingCrane){
		if(keyMap[65]){ //A
			meshFoundation.setLinearVelocity(new THREE.Vector3(1,0,0));
		}
		if(keyMap[68]){ //D
			meshFoundation.setLinearVelocity(new THREE.Vector3(-1,0,0));
		}
		if(keyMap[70]){ //F
			controllingChar = true;
			controllingCrane = false;
			scene.remove(camera);
			camera.position.x = tempPos.x;
			camera.position.y = tempPos.y;
			camera.position.z = tempPos.z;
			camera.lookAt(charMesh.position); //This doesnt turn out exactly how it should. Don't know why.
			
			charMesh.add(camera);
			
		}
	}
	if(health < 1){
		showGameOver();
		health = 100;
	}
}