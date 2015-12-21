/**
 * 
 */

var Trap = function(direction, damage, velocity, resetDelay){
	this.direction = direction;
	this.damage = damage;
	this.velocity = velocity;
	this.resetDelay = resetDelay || 0;
}

Trap.prototype.triggered = false;
Trap.prototype.reset = false;
Trap.prototype.waitTime = 0;

Trap.prototype.createBoxMesh = function(size, position, material, weight, friction, restitution){
	var material = material || Physijs.createMaterial(new THREE.MeshBasicMaterial({color: 0x112233, visible : false}), friction, restitution);
	this.mesh = new Physijs.BoxMesh(new THREE.BoxGeometry(size.x, size.y, size.z), material, weight);
	this.mesh.position.x = position.x;
	this.mesh.position.y = position.y;
	this.mesh.position.z = position.z;
	this.position = position;
	var _this = this;
	this.mesh.addEventListener('collision', function(other_object, relative_velocity, relative_rotation, contact_normal){
		for(var i = 0; i < moveableObjects.length; i++){
			if(other_object == moveableObjects[i].mesh){
				if(moveableObjects[i] == player){
					takeDamage(_this.damage);
				}
				else{
					moveableObjects[i].reset();
				}
				_this.triggered = false;
				_this.reset = true;
			}
			if(_this.triggered){
				_this.triggered = false;
				_this.reset = true;
				
			}
		}
	});
	scene.add(this.mesh);
	this.mesh.setLinearFactor(new THREE.Vector3(0,0,0));
	this.mesh.setAngularFactor(new THREE.Vector3(0,0,0));
}

Trap.prototype.trigger = function(){
	if(!this.reset){
		this.triggered = true;
		this.mesh.setLinearFactor(this.direction);
	}
}

Trap.prototype.active = function(){
	this.mesh.setLinearVelocity(this.velocity);
}

Trap.prototype.resetting = function(){
	var distance = new THREE.Vector3();
    distance.subVectors(this.mesh.position, this.position);
    if(distance.length() < 0.5){
    	this.waitTime += 1;
    	if(this.waitTime > this.resetDelay){
    		this.reset = false;
    		this.waitTime = 0;
    	}
    	this.mesh.setLinearVelocity(new THREE.Vector3(0,0,0));
    	this.mesh.setLinearFactor(new THREE.Vector3(0,0,0));
    	this.mesh.setAngularFactor(new THREE.Vector3(0,0,0));
    }
    else{
    	this.mesh.setLinearVelocity(new THREE.Vector3(-this.velocity.x, -this.velocity.y, -this.velocity.z));
    }
}