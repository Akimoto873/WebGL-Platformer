/**
 * 
 */

/*TODO: NOT WORKING PERFECTLY */

var MovingPlatform = function(speed, direction, length){
	this.speed = speed;
	this.velocity = new THREE.Vector3(0,0,0);
	this.velocity.x = this.speed.x;
	this.velocity.y = this.speed.y;
	this.velocity.z = this.speed.z;
	this.direction = direction;
	this.length = length;
}

MovingPlatform.prototype.createBoxMesh = function(size, position, material, weight, friction, restitution){
	var material = material || Physijs.createMaterial(new THREE.MeshBasicMaterial({color: 0x112233, visible : true}), friction, restitution);
	this.mesh = new Physijs.BoxMesh(new THREE.BoxGeometry(size.x, size.y, size.z), material, weight);
	this.mesh.position.x = position.x;
	this.mesh.position.y = position.y;
	this.mesh.position.z = position.z;
	this.position = position;
	var _this = this;
	this.mesh.addEventListener('collision', function(other_object, relative_velocity, relative_rotation, contact_normal){
			if(Math.abs(contact_normal.x) > 0.8*_this.direction.x){
				_this.velocity.x = -_this.velocity.x;
			}
			if(Math.abs(contact_normal.z) > 0.8*_this.direction.z){
				_this.velocity.z = -_this.velocity.z;
			}
	});
	scene.add(this.mesh);
	this.mesh.setLinearFactor(this.direction);
	this.mesh.setAngularFactor(new THREE.Vector3(0,0,0));
	this.mesh.setLinearVelocity(this.speed);
}

MovingPlatform.prototype.move = function(){
	if(this.direction.x != 0){
		if(this.mesh.position.x < this.position.x){
			this.velocity.x = this.speed.x;
		}
		else if(this.mesh.position.x > this.position.x + this.length){
			this.velocity.x = -this.speed.x;
		}
	}
	if(this.direction.y != 0){
		if(this.mesh.position.y < this.position.y){
			this.velocity.y = this.speed.y;
		}
		else if(this.mesh.position.y > this.position.y + this.length){
			this.velocity.y = -this.speed.y;
		}
	}
	if(this.direction.z != 0){
		if(this.mesh.position.z < this.position.z){
			this.velocity.z = this.speed.z;
		}
		else if(this.mesh.position.z > this.position.z + this.length){
			this.velocity.z = -this.speed.z;
		}
	}
	this.mesh.setLinearVelocity(this.velocity);
	if(this.mesh._physijs.touches.indexOf(player.mesh._physijs.id) === 0){
		player.setSurfaceVelocity(this.velocity);
	}
}

MovingPlatform.prototype.setSpeed = function (newSpeed){
	this.speed = newSpeed;
}