/**
 * 
 */

var Door = function(direction, position, size, keyReq){
	this.keyReq = keyReq;
	this.direction = direction;
	this.position = position;
	this.speed = new THREE.Vector3(direction.x * 2, direction.y * 2, direction.z * 2);
	this.mesh = new Physijs.BoxMesh(new THREE.BoxGeometry(size.x, size.y, size.z), Physijs.createMaterial(new THREE.MeshBasicMaterial({
		color: 0x0000FF, visible: false
	}), 1, 0.1), 200);
	this.mesh.position.set(position.x, position.y, position.z);
	scene.add(this.mesh);
	this.mesh.setLinearFactor(direction);
	this.mesh.setAngularFactor(new THREE.Vector3(0,0,0));
	
	
}

Door.prototype.opening = false;
Door.prototype.open = false;
Door.prototype.closing = false;
Door.prototype.skin;
Door.prototype.playingSound = false;

Door.prototype.openDoor = function(){
	if(this.skin.position.y < WALLHEIGHT/3){
		this.skin.position.x += 0.03*this.direction.x;
		this.skin.position.y += 0.03*this.direction.y;
		this.skin.position.z += 0.03*this.direction.z;
		
	}
	else{
		this.opening = false;
		this.open = true;
		scene.remove(this.mesh);
		audioArray['largeDoor'].pause();
		audioArray['largeDoor'].currentTime = 0;
		
	}
}


Door.prototype.closeDoor = function(){
	if(this.skin.position.y > -WALLHEIGHT/2){
		this.skin.position.x -= 0.03*this.direction.x;
		this.skin.position.y -= 0.03*this.direction.y;
		this.skin.position.z -= 0.03*this.direction.z;
	}
	else{
		this.closing = false;
		scene.add(this.mesh);
	}
}

Door.prototype.triggered = function(){
	if(!this.open){
		this.opening = true;
	}
	else{
		this.closing = true;
	}
}

Door.prototype.checkDoor = function(){
	if(!this.open && !this.opening){
		var distance = new THREE.Vector3();
		distance.subVectors(player.mesh.position, this.mesh.position);
		if(distance.length() < 5){
			if(bonusArray['keys'] >= this.keyReq){
				this.opening = true;
				audioArray['largeDoor'].play();
			}
		}
	}
}

Door.prototype.addSkin = function(skin){
	this.skin = skin;
	this.skin.position.set(0,-WALLHEIGHT/2, 0);
	this.mesh.add(this.skin);
}