/**
 * 
 */

var Pendulum = function(degrees, damage, speed, axis){
	this.degrees = degrees;
	this.damage = damage;
	this.speed = speed;
	this.axis = axis;
}

Pendulum.prototype.createCylinderMesh = function(size, position, material, weight, friction, restitution){
	var material = material || Physijs.createMaterial(new THREE.MeshBasicMaterial({color: 0xff0000, visible : false}), friction, restitution);
	this.mesh = new Physijs.CylinderMesh(new THREE.CylinderGeometry(size.x, size.y, size.z, 8), material, weight);
	this.mesh.position.x = position.x;
	this.mesh.position.y = position.y;
	this.mesh.position.z = position.z;
	this.position = position;
	var _this = this;
	scene.add(this.mesh);
	
	this.top = new THREE.Vector3(this.position.x, this.position.y + size.z / 2, this.position.z);
	
	this.constraint = new Physijs.HingeConstraint(this.mesh, null, this.top, this.axis);
	scene.addConstraint(this.constraint);
	this.constraint.setLimits( -this.degrees, this.degrees, 0.1, 0.2);
	this.constraint.enableAngularMotor(this.speed, 10);
	
	this.mesh.addEventListener('collision', function(other_object, relative_velocity, relative_rotation, contact_normal){
		if(other_object == player.mesh){
			takeDamage(_this.damage);
		}
		else if (contact_normal.x > 0.5 || contact_normal.z > 0.5){
			_this.constraint.enableAngularMotor(-_this.speed, 20);
		}
		else if(contact_normal.x < -0.5 || contact_normal.z < -0.5){
			_this.constraint.enableAngularMotor(_this.speed, 20);
		}
	});
}
