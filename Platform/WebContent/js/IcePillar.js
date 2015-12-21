/**
 * 
 */

var IcePillar = function(size, position){
	this.mesh = new Physijs.BoxMesh(new THREE.BoxGeometry(size.x, size.y, size.z), 
			Physijs.createMaterial(new THREE.MeshBasicMaterial({
				color: 0x002277
			}), 0, 0.1), 1);
	this.mesh.position.set(position.x, position.y, position.z);
	var _this = this;
	this.position = position;
	this.mesh.addEventListener('collision', function(other_object){
		for(var i = 0; i < icePillars.length; i++){
			if(other_object == icePillars[i].mesh){
				this.setLinearVelocity(new THREE.Vector3(0,0,0));
				other_object.setLinearVelocity(new THREE.Vector3(0,0,0));
			}
		}
	});
	scene.add(this.mesh);
	this.mesh.setAngularFactor(new THREE.Vector3(0,0,0));
	this.mesh.setLinearFactor(new THREE.Vector3(1,0,1));
}

IcePillar.prototype.position;
IcePillar.prototype.speedSet = false;
IcePillar.prototype.speed = new THREE.Vector3(0,0,0);

IcePillar.prototype.move = function(){
	if(this.mesh.getLinearVelocity().length() < 1){
		 var rotationMatrix = new THREE.Matrix4();
		 rotationMatrix.extractRotation(camera.matrix);
		var positionDiff = new THREE.Vector3(0, 0, -3);
		var finalPosition = positionDiff.applyMatrix4(rotationMatrix);
		if(Math.abs(finalPosition.x) > Math.abs(finalPosition.z)){
			finalPosition.z = 0;
		}
		else{
			finalPosition.x = 0;
		}
		this.mesh.setLinearVelocity(new THREE.Vector3(finalPosition.x, 0, finalPosition.z));
	}
}

IcePillar.prototype.reset = function(){
	this.mesh.position.set(this.position.x, this.position.y, this.position.z);
	this.mesh.setLinearVelocity(new THREE.Vector3(0,0,0));
	this.mesh.__dirtyPosition = true;
}