/**
 * 
 */

var SpecialTile = function(size, position){
	this.size = size;
	this.position = position;
	this.mesh = new Physijs.BoxMesh(new THREE.BoxGeometry(size.x, size.y, size.z), 
			Physijs.createMaterial(new THREE.MeshBasicMaterial({
				color: 0x6666DD, opacity: 1
			}),1, 0.1), 0);
	this.mesh.position.set(position.x, position.y, position.z);
	
	scene.add(this.mesh);
}

SpecialTile.prototype.velocity = new THREE.Vector3(0,0,0);
SpecialTile.prototype.velocityChecked = false;
SpecialTile.prototype.triggered = false;

SpecialTile.prototype.makeIce = function(){
	this.mesh.material = Physijs.createMaterial(new THREE.MeshBasicMaterial({map: textureArray['ice'], opacity: 0.7}), 0, 0.1);
	this.mesh.material.transparent = true;
	this.mesh.material.opacity = 0.98;
	this.mesh.material.friction = 0;
}

SpecialTile.prototype.checkIce = function(){
	if(this.mesh._physijs.touches.indexOf(player.mesh._physijs.id) === 0){
		player.disableMovement();
	}
}

SpecialTile.prototype.makeCheckpoint = function(){
	this.mesh.addEventListener('collision', function(other_object){
		if(other_object == player.mesh){
			if(charMeshPosition != this.position){
				charMeshPosition = this.position;
			}
		}
	});
}


