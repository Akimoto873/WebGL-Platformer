/**
 * 
 */

var Character = function(){
	this.mesh = new Physijs.CapsuleMesh(new THREE.CylinderGeometry(0.8, 0.8, 3, 16),
			Physijs.createMaterial(new THREE.MeshBasicMaterial({
				color : 0xeeff33
			}), 0.5, 0.1), 10);
	this.mesh.position.set(charMeshPosition.x, charMeshPosition.y, charMeshPosition.z);
	var _this = this;
	this.mesh.addEventListener('collision', function(other_object, relative_velocity, relative_rotation, contact_normal){
		if(contact_normal.y < -0.5){
			_this.jump1 = false;
			_this.jump2 = false;
			airborne = false;
			if(relative_velocity.y < -16){
				var damage = Math.abs(relative_velocity.y + 16)*3;
				takeDamage(damage);
			}
		}
		if(_this.movementDisabled){
			if(Math.abs(contact_normal.x) > 0.8 || Math.abs(contact_normal.z) > 0.8){
				_this.surfaceVelocity.x = - _this.surfaceVelocity.x;
				_this.surfaceVelocity.z = - _this.surfaceVelocity.z;
			}
		}
	});
	scene.add(this.mesh);
	moveableObjects.push(this);

}

Character.prototype.velocity = new THREE.Vector3(0,0,0);
Character.prototype.maxSpeed = 4;
Character.prototype.surfaceVelocity = new THREE.Vector3(0,0,0);
Character.prototype.fallTimer = new THREE.Clock();
Character.prototype.groundCaster = new THREE.Raycaster();
Character.prototype.jump1 = false;
Character.prototype.jump2 = false;
Character.prototype.running = false;
Character.prototype.movementDisabled = false;
Character.prototype.surfaceSet = false;

Character.prototype.setCamera = function(camera){
	camera.position.z = 0;
	camera.rotation.order = "YXZ";
	camera.lookAt(new THREE.Vector3(0,0,this.mesh.position.z + 5));
	this.mesh.add(camera);
	this.mesh.material.visible = false;
	this.mesh.setAngularFactor(new THREE.Vector3(0,0,0));
}

Character.prototype.setAngularFactor = function(factor){
	this.mesh.setAngularFactor(factor);
}

Character.prototype.setLinearFactor = function(factor){
	this.mesh.setLinearFactor(factor);
}

Character.prototype.move = function(){
	var finalVelocity = new THREE.Vector3(0,0,0);
	finalVelocity.x = (-this.velocity.z)*Math.sin(camera.rotation.y) + (-this.velocity.x)*Math.cos(camera.rotation.y) + this.surfaceVelocity.x;
	finalVelocity.y = this.mesh.getLinearVelocity().y;
	finalVelocity.z = (-this.velocity.z)*Math.cos(camera.rotation.y) + (this.velocity.x)*Math.sin(camera.rotation.y) + this.surfaceVelocity.z;
	if(this.running && !this.movementDisabled){
		finalVelocity.x = finalVelocity.x * 2;
		finalVelocity.z = finalVelocity.z * 2;
	}
	if(this.movementDisabled){
		if(audioArray['slideSound'].paused){
			audioArray['slideSound'].play();
		}
	}
	else if(!this.movementDisabled){
		if(!audioArray['slideSound'].paused){
			audioArray['slideSound'].pause();
		}
	}
	this.mesh.setLinearVelocity(finalVelocity);
}

Character.prototype.setVelocity = function(velocity){
	this.velocity = velocity;
}

Character.prototype.addVelocity = function(addition){
	this.velocity.x = addition.x;
	this.velocity.y = addition.y;
	this.velocity.z = addition.z;
}

Character.prototype.jump = function(){
	if(!this.movementDisabled){
		if(!this.jump1){
			this.mesh.applyCentralImpulse(new THREE.Vector3(0,60,0));
			this.jump1 = true;
			audioArray['jump'].play();
			airborne = true;7
	    	stamina -= 20;
		}
		else if(!this.jump2){
			this.mesh.applyCentralImpulse(new THREE.Vector3(0,60,0));
			this.jump2 = true;
			audioArray['jump'].play();
	    	stamina -= 20;
		}
	}
}

Character.prototype.setSurfaceVelocity = function(velocity){
	this.surfaceVelocity = velocity;
	this.surfaceSet = false;
}
Character.prototype.setMaxSpeed = function(speed){
	this.maxSpeed = speed;
}


Character.prototype.resetJumps = function(){
	this.jump1 = false;
	this.jump2 = false;
}

Character.prototype.checkFall = function(){
	if (this.mesh.position.y < -5){
		takeDamage(100);
	}
}

Character.prototype.removeCharacter = function(){
	this.mesh.remove(camera);
	scene.remove(this.mesh);
}

Character.prototype.disableMovement = function(){
	this.movementDisabled = true;
	if(!this.surfaceSet){
		if(Math.sqrt(Math.pow(this.velocity.x, 2) + Math.pow(this.velocity.z, 2))> Math.sqrt(Math.pow(this.surfaceVelocity.x, 2) + Math.pow(this.surfaceVelocity.z, 2))){
			this.surfaceVelocity.x = (-this.velocity.z)*Math.sin(camera.rotation.y) + (-this.velocity.x)*Math.cos(camera.rotation.y);
			this.surfaceVelocity.z = (-this.velocity.z)*Math.cos(camera.rotation.y) + (this.velocity.x)*Math.sin(camera.rotation.y);
			if(Math.abs(this.surfaceVelocity.z) > Math.abs(this.surfaceVelocity.x)){
				this.surfaceVelocity.x = 0;
				this.surfaceVelocity.z = this.surfaceVelocity.z*2;
			}
			else{
				this.surfaceVelocity.z = 0;
				this.surfaceVelocity.x = this.surfaceVelocity.x*2;
			}
			this.velocity = new THREE.Vector3(0,0,0);
			this.surfaceSet = true;
		}
	}
}
