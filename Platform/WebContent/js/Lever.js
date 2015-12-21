/**
 * 
 */

var Lever = function(target, eventType, position){
	this.mesh = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 1, 8), new THREE.MeshBasicMaterial({color: 0x00ffff}));
	this.mesh.position.set(position.x, position.y, position.z);
	this.target = target;
	this.eventType = eventType;
	scene.add(this.mesh);
	
}

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
	
}

