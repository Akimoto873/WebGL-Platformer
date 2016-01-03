/**
 * 
 */

var GatherItem = function(bonusType, bonusAmount, audio, spin, move){
	this.bonusType = bonusType;
	this.bonusAmount = bonusAmount;
	this.audio = audio;
	this.spin = spin || false;
	this.move = move || false;
	gatherableItems.push(this);
	if(bonusType == "health"){
		this.healing = true;
	}
	else{
		this.healing = false;
	}
}

GatherItem.prototype.gathered = false;

GatherItem.prototype.createBoxMesh = function(size, position, material, weight, friction, restitution){
	var material = material || Physijs.createMaterial(new THREE.MeshBasicMaterial({color: 0x112233, visible : false}), friction, restitution);
	this.mesh = new Physijs.BoxMesh(new THREE.BoxGeometry(size.x, size.y, size.z), material, weight);
	this.mesh.position.x = position.x;
	this.mesh.position.y = position.y;
	this.mesh.position.z = position.z;
	this.position = position;
	var _this = this;
	this.mesh.addEventListener('collision', function(other_object){
		if(other_object == player.mesh){
			scene.remove(_this.mesh);
			_this.playSound();
			if(!this.healing){
				bonusArray[_this.bonusType] += _this.bonusAmount;
				_this.gathered = true;
				if(_this.bonusType == "points"){
					updateScore();
				}
				if(_this.bonusType == "keys"){
					updateKeys();
				}
			}
			else{
				health += 50;
				if(health > 100){
					health = 100;
				}
				_this.gathered = true;
			}
		}
	});
	scene.add(this.mesh);
	if(this.spin){
		this.mesh.setAngularVelocity(new THREE.Vector3(0,1,0));
	}
	if(!this.move){
		this.mesh.setLinearFactor(new THREE.Vector3(0,0,0));
	}
}

GatherItem.prototype.reset = function(){
	if(!this.gathered){
		scene.remove(this.mesh);
	}
	this.mesh.position.x = this.position.x;
	this.mesh.position.y = this.position.y;
	this.mesh.position.z = this.position.z;
	this.mesh.__dirtyPosition = true;
	scene.add(this.mesh);
	if(this.spin){
		this.mesh.setAngularVelocity(new THREE.Vector3(0,1,0));
	}
	if(!this.move){
		this.mesh.setLinearFactor(new THREE.Vector3(0,0,0));
	}

}

GatherItem.prototype.playSound = function(){
	audioArray[this.audio].play();
}