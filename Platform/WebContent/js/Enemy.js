/**
 * 
 */

var Enemy = function(x,y,z){
	this.mesh = new Physijs.CapsuleMesh(new THREE.CylinderGeometry(UNITSIZE/4, UNITSIZE/4, 3, 8),
			Physijs.createMaterial(new THREE.MeshBasicMaterial({
				color: 0x0000ff, visible: false
			})), 10);
	var _this = this;
	this.mesh.addEventListener('collision', function(other_object, relative_velocity, relative_rotation, contact_normal){
		
		if(other_object == player.mesh){
			takeDamage(30);
		}
		else if (contact_normal.y == 0){
			var temp = new THREE.Vector3(contact_normal.x, 0, contact_normal.z);
			zombieVelocityNormal.sub(temp);
			zombieVelocityNormal.normalize();
			
		}
	});
	this.mesh.position.set(UNITSIZE*x, WALLHEIGHT*y + 2, UNITSIZE*z);
	scene.add(this.mesh);
	this.mesh.setAngularFactor(new THREE.Vector3(0,1,0));
	this.sound = new Audio('audio/163439__under7dude__zombie-2.mp3');
	this.sound.addEventListener('ended', function(){
		this.currentTime = 0;
	});
	this.sound.volume = 0.15;
	this.alive = true;
}

