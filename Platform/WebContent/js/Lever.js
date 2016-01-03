/**
 * 
 */

var Lever = function(target, eventType, position){
	
	this.target = target;
	this.eventType = eventType;
	this.mesh = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.3, 8), new THREE.MeshBasicMaterial({map: textureArray['steel']}));
	this.mesh.position.set(position.x, position.y - 1, position.z);
	this.mesh.rotation.x += Math.PI/2;
	scene.add(this.mesh);
	this.meshRod = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 1, 8), new THREE.MeshBasicMaterial({map:textureArray['lightWood']}));
	this.meshRod.rotation.x -= Math.PI/2;
	this.meshRod.position.z -= 1;
	this.mesh.add(this.meshRod);
	
	
	this.mesh.add(this.meshRod);
	
}

Lever.prototype.rotated = false;

Lever.prototype.pulled= function(){
	if(this.eventType == "verticalDoor"){
		this.rotate();
		this.target.open();
	}
	if(this.eventType == "reset"){
		this.rotate();
		for(var i = 0; i < this.target.length; i++){
			this.target[i].reset();
		}
	}
}

Lever.prototype.rotate = function(){
	if(!this.rotated){
		this.mesh.rotation.y += Math.PI/5;
		this.rotated = true;
		
		}
	else{
		this.mesh.rotation.y -= Math.PI/5;
		this.rotated = false;
	}
}

