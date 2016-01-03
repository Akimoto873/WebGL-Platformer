/**
 * 
 */

var PickUpItem = function(){
	pickUpItems.push(this);
}


PickUpItem.prototype.createBoxMesh = function(size, position, material, weight, friction, restitution){
	var material = material || Physijs.createMaterial(new THREE.MeshBasicMaterial({color: 0x112233, visible : false}), friction, restitution);
	this.mesh = new Physijs.BoxMesh(new THREE.BoxGeometry(size.x, size.y, size.z), material, weight);
	this.mesh.position.x = position.x;
	this.mesh.position.y = position.y;
	this.mesh.position.z = position.z;
	this.position = position;
	scene.add(this.mesh);
	
}

PickUpItem.prototype.reset = function(){
	scene.remove(this.mesh);
	this.mesh.position.x = this.position.x;
	this.mesh.position.y = this.position.y;
	this.mesh.position.z = this.position.z;
	this.mesh.__dirtyPosition = true;
	scene.add(this.mesh);

}

PickUpItem.prototype.pickUp = function(object){
	scene.remove(this.mesh);
	this.mesh.position.set(0,-1,-1.5);
	object.add(this.mesh);
	player.carriedItem = this.mesh;
}

PickUpItem.prototype.throwOut = function(){
	 var rotationMatrix = new THREE.Matrix4();
	 rotationMatrix.extractRotation(camera.matrix);
	camera.remove(this.mesh);
	var positionDiff = new THREE.Vector3(0, 0, -1.5);
  var finalPosition = positionDiff.applyMatrix4(rotationMatrix);
  var oldPosition = player.mesh.position
  this.mesh.position.x = oldPosition.x + finalPosition.x;
  this.mesh.position.y = oldPosition.y + finalPosition.y;
  this.mesh.position.z = oldPosition.z + finalPosition.z; 
  if(this.mesh.position.y < 1){
	  //Lessens the "super-jump" from placing the item below the character.
	  this.mesh.position.x -= 1.5*Math.sin(camera.rotation.y);
	  this.mesh.position.y = 0;
	  this.mesh.position.z -= 1.5*Math.cos(camera.rotation.y);
  }
	scene.add(this.mesh);
	player.carriedItem = null;
	
}