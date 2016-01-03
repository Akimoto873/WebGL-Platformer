/**
 * 
 */

var TrapTrigger = function(traps){
	this.traps = traps;
}

TrapTrigger.prototype.createBoxMesh = function(size, position, material, weight, friction, restitution){
	var material = material || Physijs.createMaterial(new THREE.MeshBasicMaterial({color: 0x112233, visible : false}), friction, restitution);
	this.mesh = new Physijs.BoxMesh(new THREE.BoxGeometry(size.x, size.y, size.z), material, weight);
	this.mesh.position.x = position.x;
	this.mesh.position.y = position.y;
	this.mesh.position.z = position.z;
	this.position = position;
	var _this = this;
	this.mesh.addEventListener('collision', function(other_object){
		
		for(var i = 0; i < moveableObjects.length; i++){
			if(other_object == moveableObjects[i].mesh){
				for(var j = 0; j < _this.traps.length; j++){
					_this.traps[j].trigger();
				}
			}
		}
	});
	scene.add(this.mesh);
}

TrapTrigger.prototype.createCylinderMesh = function(size, position, material, rotation, weight, friction, restitution){
	var material = material || Physijs.createMaterial(new THREE.MeshBasicMaterial({color: 0xff0000, visible : true}), friction, restitution);
	this.mesh = new Physijs.CylinderMesh(new THREE.CylinderGeometry(size.x, size.y, size.z, 8), material, weight);
	this.mesh.position.x = position.x;
	this.mesh.position.y = position.y;
	this.mesh.position.z = position.z;
	this.position = position;
	this.mesh.rotation.z = rotation;
	var _this = this;
	this.mesh._physijs.collision_flags = 4;
	this.mesh.addEventListener('collision', function(other_object){
		for(var i = 0; i < moveableObjects.length; i++){
			if(other_object == moveableObjects[i].mesh){
				for(var j = 0; j < _this.traps.length; j++){
					_this.traps[j].trigger();
				}
			}
		}
	});
	scene.add(this.mesh);
}

TrapTrigger.prototype.addTrap = function(trap){
	this.traps.push(trap);
}