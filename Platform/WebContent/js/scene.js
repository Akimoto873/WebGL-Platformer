if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var container, stats;

var camera, controls, scene, renderer, mesh;
var oceanTexture;
var light;
var group;
var keyboard;
var pivotHoz;
var pivot1;
var pivot2;
var pivot3;
var hourPivot;
var hourMesh;
var minutePivot;
var minuteMesh;
var secondPivot;
var currentAngle;
var wholeCrane;
var helpBox;
var meshBox;
var ropeLenght;
var numberOfBoxes;
var changeBoat;
var tickCount;
var secondTimer;
var minuteTimer;
var clock;
var dock;
var landscapeTexture;

function main(){

	init();
	tick();
}

//The animation loop -
function tick(){
	requestAnimationFrame(tick);
	controls.update();
	oceanTexture.offset.x += 0.0002;
	secondTimer  += 1;
	
	//Make the clock tick.
	if(secondTimer > 60){
		var delta = clock.getDelta();
		var angle = 2 * Math.PI * delta / 60;
		secondPivot.rotation.z -= angle;
		minuteTimer += delta;
		if (minuteTimer > 60){
			minutePivot.rotation.z -= 2*Math.PI / 60;
			minuteTimer = 0;
		}
		secondTimer = 0;
		
	}
	//Rotate crane horizontally
    if(keyboard.pressed("Q")){
    	pivotHoz.rotation.y -= 0.05;
    }
    if(keyboard.pressed("W")){
    	pivotHoz.rotation.y +=0.05;
    }
    
    //Rotate cranes first pivot
    if(keyboard.pressed("A")){
    	if(currentAngle > -1.2){
	    	pivot1.rotation.z -=0.05;
	    	currentAngle -= 0.05;
	    	pivot3.rotation.z +=0.05;
    	}
    }
    if(keyboard.pressed("S")){
    	var box = new THREE.Box3().setFromObject( meshMag );
    	if(currentAngle < 0 && box.min.y > 1){
    		pivot1.rotation.z +=0.05;
    		currentAngle += 0.05;
    		pivot3.rotation.z -= 0.05;
    	}
    }
    
    //Rotate cranes second pivot
    if(keyboard.pressed("Z")){
    	if(currentAngle2 > 0){
    		pivot2.rotation.z -= 0.05;
    		currentAngle2 -=0.05;
    		pivot3.rotation.z +=0.05;
    	}
    }
    if(keyboard.pressed("X")){
    	var box = new THREE.Box3().setFromObject( meshMag );
    	if(currentAngle2 < 1.5 && box.min.y > 1 ){
    		pivot2.rotation.z += 0.05;
    		currentAngle2 += 0.05;
    		pivot3.rotation.z -=0.05;
    	}
    }
    
    //Pick up box with crane.
    if(keyboard.pressed("H")){
    	var box = new THREE.Box3().setFromObject( meshMag );
    	var box2 = new THREE.Box3().setFromObject(meshBox);
    	if(box.min.x > box2.min.x && box.max.x < box2.max.x && box.min.z > box2.min.z && box.max.z < box2.max.z && (box.min.y - box2.max.y) < 2){
    		group.remove(meshBox);
    		meshBox.position.set(0,-1.4,0);
    		meshBox.translateY(-4);
    		pivot3.add(meshBox);
    	}
    }
    
    //Drop box on boat,  and initiate drive boat away if 3 boxes on it afterwards.
    if(keyboard.pressed("G")){
    	var box = new THREE.Box3().setFromObject( meshBox );
    	var box2 = new THREE.Box3().setFromObject(helpBox);
    	if(box.min.x > box2.min.x && box.max.x < box2.max.x && box.min.z > box2.min.z && box.max.z < box2.max.z && (box.min.y - box2.max.y) < 2){
    		numberOfBoxes +=1;
    		if (numberOfBoxes == 1){
    			meshBox.position.set(0,0,0);
    		}
    		if(numberOfBoxes == 2){
    			meshBox.position.set(-1, 0, 0);
    		}
    		if(numberOfBoxes == 3){
    			meshBox.position.set(-2,0,0);
    			changeBoat = true;
    			oldBoat = true;
    			
    		}
    		pivot3.remove(meshBox);
    		helpBox.add(meshBox);
    		loadNewBox();
    }	
    }
    
    //Move crane back and forth
    if(keyboard.pressed("K")){
    	var box = new THREE.Box3().setFromObject( meshFoundation );
    	var box2 = new THREE.Box3().setFromObject( dock);
    	if (box.min.x > box2.min.x){
    		wholeCrane.translateX(-0.1);
    	}
    }
    if(keyboard.pressed("L")){
    	var box = new THREE.Box3().setFromObject( meshFoundation );
    	var box2 = new THREE.Box3().setFromObject( dock);
    	if (box.max.x < box2.max.x){
    	wholeCrane.translateX(0.1);
    	}
    }
    
    //Drive boat away, and drive in a new empty boat.
    if(changeBoat){
    	helpBox.translateX(0.06);
    	tickCount+=1;
    	if(tickCount > 500 && oldBoat){
    		oldBoat = false;
    		tickCount = 0;
    		helpBox.translateX(-48);
    		for(i = helpBox.children.length - 1; i>=1 ; i--){
    			tmp = helpBox.children[i];
    			helpBox.remove(tmp);
    		}
    		
    		
    	}
    	if(!oldBoat && tickCount > 300){
    		changeBoat = false;
    		numberOfBoxes = 0;
    		tickCount = 0;
    	}
    }
    renderer.render(scene, camera);
    stats.update();
}


//Initiate the scene.
function init() {

		tickCount = 0;
		numberOfBoxes = 0;
		secondTimer = 0;
		minuteTimer = 0;
		clock = new THREE.Clock(true);
		changeBoat = false;
        camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.01, 10000 );
        camera.position.y = 10;
        camera.position.z = 15;
        camera.lookAt(10,-10,-10);

        controls = new THREE.OrbitControls( camera );

        scene = new THREE.Scene();
        
        //keyboard
        //Imports a custom class to handle keyboard input.
        keyboard = new THREEx.KeyboardState();

        // lights

        light = new THREE.SpotLight( 0xffffff);
        light.position.set(100, 100, 50);
        light.shadowDarkness = 0.5;
        light.castShadow = true;
        
        scene.add( light );
        



        // texture 
        var texture1 = THREE.ImageUtils.loadTexture( 'images/hus1.jpg');
        var texture2 = THREE.ImageUtils.loadTexture( 'images/hus2.jpg');
        var texture3 = THREE.ImageUtils.loadTexture( 'images/hus3.jpg');
        var texture4 = THREE.ImageUtils.loadTexture( 'images/hus4.jpg');
        var texture5 = THREE.ImageUtils.loadTexture( 'images/hus5.jpg');
        var texture6 = THREE.ImageUtils.loadTexture( 'images/hus6.jpg');
        var texture7 = THREE.ImageUtils.loadTexture( 'images/hus7.jpg');
        var texture8 = THREE.ImageUtils.loadTexture( 'images/hus8.jpg');
        var containerTexture = THREE.ImageUtils.loadTexture( 'images/container1.jpg');
        oceanTexture = THREE.ImageUtils.loadTexture( 'images/ocean.jpg');
        oceanTexture.wrapS = THREE.RepeatWrapping;
        oceanTexture.wrapT = THREE.RepeatWrapping;
        oceanTexture.repeat.set(3,5);
        landscapeTexture = THREE.ImageUtils.loadTexture( 'images/landscape1.jpg' );
        var cityTexture = THREE.ImageUtils.loadTexture( 'images/landscape2.jpg' );
        var trackTexture = THREE.ImageUtils.loadTexture( 'images/railtrack2.jpg');
        trackTexture.wrapS = THREE.RepeatWrapping;
        trackTexture.repeat.set(8,1);
        var boatTexture = THREE.ImageUtils.loadTexture( 'images/boat.jpg');
        var groundTexture = THREE.ImageUtils.loadTexture( 'images/ground.jpg');
        var roofTexture = THREE.ImageUtils.loadTexture( 'images/roof.jpg');
        var craneTexture = THREE.ImageUtils.loadTexture( 'images/crane.jpg');
        var gateTexture = THREE.ImageUtils.loadTexture( 'images/gate.jpg');
        

        material2 = new THREE.MeshBasicMaterial({map: texture2});
        material3 = new THREE.MeshBasicMaterial({map: texture3});
        material4 = new THREE.MeshBasicMaterial({map: texture4});
        material1 = new THREE.MeshBasicMaterial({map: texture1});
        material5 = new THREE.MeshBasicMaterial({map: texture5});
        material6 = new THREE.MeshBasicMaterial({map: texture6});
        material7 = new THREE.MeshBasicMaterial({map: texture7});
        material8 = new THREE.MeshBasicMaterial({map: texture8});
        containerMaterial = new THREE.MeshBasicMaterial({map: containerTexture});
        boatMaterial = new THREE.MeshBasicMaterial({map: boatTexture});
        groundMaterial = new THREE.MeshBasicMaterial({map: groundTexture});
        roofMaterial = new THREE.MeshBasicMaterial({map: roofTexture});
        craneMaterial = new THREE.MeshBasicMaterial({map: craneTexture});
        gateMaterial = new THREE.MeshBasicMaterial({map: gateTexture});
        trackMaterial = new THREE.MeshBasicMaterial({map: trackTexture});
        clockMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
        hourMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff});
        minuteMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00});
        secondMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000});

        
        //Helper objects (pivots etc.)
        group = new THREE.Object3D();
        wholeCrane = new THREE.Object3D();
        pivotHoz = new THREE.Object3D();
        pivot1 = new THREE.Object3D();
        pivot2 = new THREE.Object3D();
        pivot3 = new THREE.Object3D();
        helpBox = new THREE.Object3D();
        hourPivot = new THREE.Object3D();
        minutePivot = new THREE.Object3D();
        secondPivot = new THREE.Object3D();
        craneObj = new THREE.Object3D();
         
        //load mesh 
        var loader = new THREE.JSONLoader();
        loader.load('models/mainDock.js', dockModelLoadedCallback);
        loader.load('models/craneRail.js', craneFoundationLoadedCallback);
        
//        loader.load('models/craneHorPivot.js', craneHorizontalPivotLoadedCallback);
//        loader.load('models/cranePivot01.js', craneFirstPivotLoadedCallback);
//        loader.load('models/cranePivot02.js', craneSecondPivotLoadedCallback);
//        loader.load('models/craneRope.js', craneRopeMagnetLoadedCallback);
//        loader.load('models/craneMagnet.js', craneMagnetLoadedCallback);
        
        buildCrane(); //Comment out this, and in the lines above, to use a crane imported from 3ds Max. Needs some changes
        //in code to work properly though, so not recommended to try. I just didn't notice that the crane had to be build from
        //THREE parts before I was pretty much done with the program. Didn't have the heart to remove all that code.
//        loader.load('models/boat1.js', boatLoadedCallback);
        loader.load('models/box2.js', boxLoadedCallback);
        loader.load('models/hus1.js', house1LoadedCallback);
        loader.load('models/hus2.js', house2LoadedCallback);
        loader.load('models/hus3.js', house3LoadedCallback);
        loader.load('models/hus4.js', house4LoadedCallback);
        loader.load('models/hus5.js', house5LoadedCallback);
        loader.load('models/hus6.js', house6LoadedCallback);
        loader.load('models/hus7.js', house7LoadedCallback);
        loader.load('models/hus8.js', house8LoadedCallback);
        loader.load('models/tak1.js', roofLoadedCallback);
        loader.load('models/tak2.js', roofLoadedCallback);
        loader.load('models/port1.js', gateLoadedCallback);
        
//        loader.load('models/klokkeBody.js', clockBodyLoadedCallback);
//        loader.load('models/klokkeMiddle.js', clockMiddleLoadedCallback);
//        loader.load('models/hour.js', hourLoadedCallback);
//        loader.load('models/minute.js', minuteLoadedCallback);
//        loader.load('models/second.js', secondLoadedCallback);
        loader.load('models/railtrack.js', railtrackLoadedCallback);
        
        ocean = new THREE.Mesh(new THREE.PlaneGeometry(200, 200, 1), new THREE.MeshBasicMaterial({map: oceanTexture}));
        ocean.translateZ(82);
        ocean.rotation.x = -Math.PI/2;
        scene.add(ocean);
        city = new THREE.Mesh(new THREE.PlaneGeometry(200, 100, 1), new THREE.MeshBasicMaterial({map: cityTexture}));
        city.translateZ(-18);
        city.translateY(50);
//        landscape.rotation.x = -Math.PI/2.5;
        scene.add(city);
        landscape1 = new THREE.Mesh(new THREE.PlaneGeometry(200, 100, 1), new THREE.MeshBasicMaterial({map:landscapeTexture}));
        landscape1.translateX(-100);
        landscape1.translateY(50);
        landscape1.translateZ(82);
        landscape1.rotation.y = Math.PI/2;
        scene.add(landscape1);
        landscape2 = new THREE.Mesh(new THREE.PlaneGeometry(200, 100, 1), new THREE.MeshBasicMaterial({map:landscapeTexture}));
        landscape2.translateX(100);
        landscape2.translateY(50);
        landscape2.translateZ(82);
        landscape2.rotation.y = -Math.PI/2;
        scene.add(landscape2);
        landscape3 = new THREE.Mesh(new THREE.PlaneGeometry(200, 100, 1), new THREE.MeshBasicMaterial({map:landscapeTexture}));
        landscape3.translateY(50);
        landscape3.translateZ(182);
        landscape3.rotation.y = Math.PI;
        scene.add(landscape3);
//        


        // renderer

        renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
        renderer.setSize( window.innerWidth, window.innerHeight );
        renderer.shadowMapEnabled = true;

        container = document.getElementById( 'container' );
        container.appendChild( renderer.domElement );

        stats = new Stats();
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.top = '0px';
        stats.domElement.style.zIndex = 100;
        container.appendChild( stats.domElement );

        //

        window.addEventListener( 'resize', onWindowResize, false );
        loader.load('models/character.js', characterLoadedCallback);

        

}

function loadNewBox(){
	var loader = new THREE.JSONLoader();
	loader.load('models/box2.js', boxLoadedCallback);
}

function characterLoadedCallback(geometry, materials){
	charMesh = new THREE.SkinnedMesh(geometry, new THREE.MeshFaceMaterial(materials));
	charMesh.position.y += 1.63;
	charMesh.scale.set(0.1, 0.1, 0.1);
	scene.add(charMesh);
}


//Create the hour hand of the clock, and rotate it correctly.
function hourLoadedCallback(geometry){
	hourMesh = new THREE.Mesh( geometry, hourMaterial );
	var box = new THREE.Box3().setFromObject( hourMesh );
	box.center( hourMesh.position ); // this re-sets the mesh position
	hourMesh.position.multiplyScalar( - 1 );
	hourMesh.translateY(0.3);
	hourPivot.translateX(-hourMesh.position.x);
	hourPivot.translateZ(-hourMesh.position.z);
	hourPivot.translateY(-hourMesh.position.y);
	var currentTime = new Date();
	var hours = currentTime.getHours();
	var angle = 2 * Math.PI * hours / 12;
	hourPivot.rotation.z = -angle;
	hourPivot.add(hourMesh);
    group.add(hourPivot);
    scene.add( group );
}

//Create the minutes hand of the clock and rotate it correctly.
function minuteLoadedCallback(geometry){
	minuteMesh = new THREE.Mesh( geometry, minuteMaterial );
	var box = new THREE.Box3().setFromObject( minuteMesh );
	box.center( minuteMesh.position ); // this re-sets the mesh position
	minuteMesh.position.multiplyScalar( - 1 );
	minuteMesh.translateY(0.4);
	minutePivot.translateX(-minuteMesh.position.x);
	minutePivot.translateZ(-minuteMesh.position.z);
	minutePivot.translateY(-minuteMesh.position.y);
	var currentTime = new Date();
	var minutes = currentTime.getMinutes();
	var angle = 2 * Math.PI * minutes / 60;
	minutePivot.rotation.z = -angle;
	minutePivot.add(minuteMesh);
    group.add(minutePivot);
    scene.add( group );
}

//Create the seconds hand of the clock, and rotate it correctly.
function secondLoadedCallback(geometry){
	secondMesh = new THREE.Mesh( geometry, secondMaterial );
	var box = new THREE.Box3().setFromObject( secondMesh );
	box.center( secondMesh.position ); // this re-sets the mesh position
	secondMesh.position.multiplyScalar( - 1 );
	secondMesh.translateY(0.4);
	secondPivot.translateX(-secondMesh.position.x);
	secondPivot.translateZ(-secondMesh.position.z);
	secondPivot.translateY(-secondMesh.position.y);
	var currentTime = new Date();
	var seconds = currentTime.getSeconds();
	var angle = 2 * Math.PI * seconds / 60;
	secondPivot.rotation.z = -angle;
	secondPivot.add(secondMesh);
    group.add(secondPivot);
    scene.add( group );
}

//Load all the houses and give them different textures (kinda sloppy, but whatever).
function house1LoadedCallback(geometry) {

    mesh = new THREE.Mesh( geometry, material1 );
    group.add(mesh);
    mesh.castShadow = true;
    scene.add( group );

}
function house2LoadedCallback(geometry) {

    mesh = new THREE.Mesh( geometry, material2 );
    mesh.castShadow = true;
    group.add(mesh);
    scene.add( group );

}
function house3LoadedCallback(geometry) {

    mesh = new THREE.Mesh( geometry, material3 );
    group.add(mesh);
    scene.add( group );

}
function house4LoadedCallback(geometry) {

    mesh = new THREE.Mesh( geometry, material4 );
    group.add(mesh);
    scene.add( group );

}
function house5LoadedCallback(geometry) {

    mesh = new THREE.Mesh( geometry, material5 );
    group.add(mesh);
    scene.add( group );

}
function house6LoadedCallback(geometry) {

    mesh = new THREE.Mesh( geometry, material6 );
    group.add(mesh);
    scene.add( group );

}
function house7LoadedCallback(geometry) {

    mesh = new THREE.Mesh( geometry, material7 );
    mesh.castShadow = true;
    group.add(mesh);
    scene.add( group );

}
function house8LoadedCallback(geometry) {

    mesh = new THREE.Mesh( geometry, material8 );
    group.add(mesh);
    scene.add( group );

}

//The ground part.
function dockModelLoadedCallback(geometry) {

    dock = new THREE.Mesh( geometry, groundMaterial );
    group.add(dock);
    dock.receiveShadow = true;
    dock.castShadow = false;
    scene.add( group );

}

//Crane foundation. Imported from 3ds Max.
function craneFoundationLoadedCallback(geometry) {

    meshFoundation = new THREE.Mesh( geometry, craneMaterial );
    wholeCrane.add(meshFoundation);
    group.add( wholeCrane);
    scene.add( group );

}

//Build the crane from THREE.geometries. Cylinders fit best for everything in my opinion.
function buildCrane(){
	horizontalPivotGeo = new THREE.CylinderGeometry(0.2, 0.2, 5);
	firstPivotGeo = new THREE.CylinderGeometry(0.2, 0.2, 3);
	secondPivotGeo = new THREE.CylinderGeometry(0.2, 0.2, 3);
	wheelGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.2);
	ropeGeo = new THREE.CylinderGeometry(0.05, 0.05, 4);
	magGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.4);
	meshHorizontalPivot = new THREE.Mesh(horizontalPivotGeo, craneMaterial);
	meshFirstPivot = new THREE.Mesh(firstPivotGeo, craneMaterial);
	meshFirstPivot.translateY(1.6);
	meshSecondPivot = new THREE.Mesh(secondPivotGeo, craneMaterial);
	meshSecondPivot.translateY(1.4);
	meshWheel1 = new THREE.Mesh(wheelGeo, craneMaterial);
	meshWheel2 = new THREE.Mesh(wheelGeo, craneMaterial);
	meshRope = new THREE.Mesh(ropeGeo, craneMaterial);
	meshRope.translateY(-2);
	meshMag = new THREE.Mesh(magGeo, craneMaterial);
	meshMag.translateY(-4);
	meshWheel1.rotation.x = Math.PI/2;
	meshWheel2.rotation.x = Math.PI/2;
	craneObj.add(pivotHoz);
	pivotHoz.add(meshHorizontalPivot);
	pivot1.add(meshFirstPivot);
	pivot2.add(meshSecondPivot);
	pivot1.add(meshWheel1);
	pivot2.add(meshWheel2);
	pivotHoz.add(pivot1);
	pivot1.add(pivot2);
	pivot3.add(meshRope);   //Adding all the parts together in the correct orders and places is a bit messy, but this works.
	pivot3.add(meshMag);
	pivot2.add(pivot3);
	pivotHoz.translateY(3);
	pivot1.translateY(2.5);
	pivot2.translateY(3.5);
	pivot3.translateY(3);
	pivot1.rotation.z = Math.PI/2;
	pivot3.rotation.z = -Math.PI/2;
	currentAngle = 0;
	currentAngle2 = 0;
	craneObj.translateX(-11.5);
	craneObj.translateZ(2.5);
	craneObj.translateY(1);
	wholeCrane.add(craneObj);
	scene.add(wholeCrane);
}

//Comment in this if you want to load the crane imported from 3ds max. Some of the code should still be commented out,
//can't remember what though..

//function craneHorizontalPivotLoadedCallback(){
//	horizontalPivotGeo = new THREE.CylinderGeometry(0.2,0.2,10);
//	meshHorizontalPivot = new THREE.Mesh( horizontalPivotGeo, craneMaterial );
//	var box = new THREE.Box3().setFromObject( meshHorizontalPivot );
//	box.center( meshHorizontalPivot.position ); // this re-sets the mesh position
//	meshHorizontalPivot.position.multiplyScalar( - 1 );
//	pivotHoz.translateX(-meshHorizontalPivot.position.x);
//	pivotHoz.translateZ(-meshHorizontalPivot.position.z);
//	pivotHoz.translateY(-meshHorizontalPivot.position.y);
//	pivotHoz.translateX(-12);
//	pivotHoz.translateZ(2.8);
//	pivotHoz.castShadow = true;
//	meshHorizontalPivot.translateX(11.7);
//	meshHorizontalPivot.translateZ(-2.5);
//	pivotHoz.position.set(-11.7, 0, 2.5 );
////	meshHorizontalPivot.scale.set(1.5,1.5,1.5);
//	boxHozPiv = new THREE.Box3().setFromObject( meshHorizontalPivot );
//	var tempX = (boxHozPiv.max.x - boxHozPiv.min.x)/3;
//	var tempY = (box.max.y - box.min.y)/3;
//	meshHorizontalPivot.translateX(-tempX);
//	meshHorizontalPivot.translateY(-tempY);

//	pivotHoz.position.set(2,1,2);
//	pivotHoz.scale.set(0.5, 0.5, 0.5);
//	pivotHoz.rotation.x= 3*Math.PI / 2;
//	pivotHoz.rotation.z=Math.PI;
//    pivotHoz.add(meshHorizontalPivot);
//    wholeCrane.add(pivotHoz);
//    scene.add( group );   		
//}


//Used when importing crane from 3ds Max.
function craneFirstPivotLoadedCallback(geometry) {
    meshPivot1 = new THREE.Mesh( geometry, craneMaterial );
    var box = new THREE.Box3().setFromObject( meshPivot1 );
	box.center( meshPivot1.position ); // this re-sets the mesh position
	meshPivot1.position.multiplyScalar( - 1 );
	var offsetZ = box.max.z - box.min.z;
	meshPivot1.translateZ(offsetZ/2- 0.3);
	pivot1.translateX(-meshPivot1.position.x);
	pivot1.translateZ(-meshPivot1.position.z);
	pivot1.translateY(-meshPivot1.position.y);
    pivot1.add(meshPivot1);
    meshHorizontalPivot.add(pivot1);
    currentAngle = 0;
    scene.add( group );

}
//Used when importing crane from 3ds Max.
function craneSecondPivotLoadedCallback(geometry) {

    meshPivot2 = new THREE.Mesh( geometry, craneMaterial );
    var box = new THREE.Box3().setFromObject( meshPivot2 );
	box.center( meshPivot2.position ); // this re-sets the mesh position
	meshPivot2.position.multiplyScalar( - 1 );
	var offsetZ = box.max.z - box.min.z;
	meshPivot2.translateZ(offsetZ/2- 0.3);
	pivot2.translateX(meshPivot1.position.x);
	pivot2.translateZ(meshPivot1.position.z);
	pivot2.translateY(meshPivot1.position.y);
	pivot2.translateX(-meshPivot2.position.x);
	pivot2.translateZ(-meshPivot2.position.z);
	pivot2.translateY(-meshPivot2.position.y);
    pivot2.add(meshPivot2);
    pivot1.add(pivot2);
    scene.add(group);
    currentAngle2 = 0;

}
//Used when importing crane from 3ds Max.
function craneRopeMagnetLoadedCallback(geometry){
	meshRopeMag = new THREE.Mesh( geometry, material);
	var box = new THREE.Box3().setFromObject( meshRopeMag );
	box.center( meshRopeMag.position ); // this re-sets the mesh position
	meshRopeMag.position.multiplyScalar( - 1 );
	ropeLenght = box.max.y - box.min.y;
	meshRopeMag.translateY(-ropeLenght/2);
	pivot3.translateX(meshPivot2.position.x);
	pivot3.translateZ(meshPivot2.position.z);
	pivot3.translateY(meshPivot2.position.y);
	pivot3.translateX(-meshRopeMag.position.x);
	pivot3.translateZ(-meshRopeMag.position.z);
	pivot3.translateY(-meshRopeMag.position.y);
	pivot3.add(meshRopeMag);
	pivot2.add(pivot3);
	scene.add(group);
}
//Used when importing crane from 3ds Max.
function craneMagnetLoadedCallback(geometry){
	meshMag = new THREE.Mesh( geometry, craneMaterial);
	meshMag.translateX(meshRopeMag.position.x);
	meshMag.translateZ(meshRopeMag.position.z);
	meshMag.translateY(meshRopeMag.position.y);
	pivot3.add(meshMag);
	pivot2.add(pivot3);
	scene.add(group);
}
//Load the boat from 3ds Max.
function boatLoadedCallback(geometry){
	meshBoat = new THREE.Mesh(geometry, boatMaterial);
	var box = new THREE.Box3().setFromObject( meshBoat );
	box.center( meshBoat.position ); // this re-sets the mesh position
	meshBoat.position.multiplyScalar( - 1 );
	helpBox.translateX(-meshBoat.position.x);
	helpBox.translateZ(-meshBoat.position.z);
	helpBox.translateY(-meshBoat.position.y);
	helpBox.add(meshBoat);
	group.add(helpBox);
	scene.add(group);
}

//Load the box from 3ds max (yeah it's so hard to make a box from THREE parts.. dunno what I was thinking.
function boxLoadedCallback(geometry){
	meshBox = new THREE.Mesh(geometry, containerMaterial);
	meshBox.translateY(0.5);
	meshBox.translateX(-2);
	meshBox.translateZ(-1);
	group.add(meshBox);
	scene.add(group);
}

//load the railroad.
function railtrackLoadedCallback(geometry){
	mesh = new THREE.Mesh( geometry, trackMaterial );
    group.add(mesh);
    scene.add( group );
}

//load the roofs for the few housed with actual roofs.
function roofLoadedCallback(geometry) {

    mesh = new THREE.Mesh( geometry, roofMaterial );
    group.add(mesh);
    scene.add( group );

}

//load the cool gate for the house in the middle front.
function gateLoadedCallback(geometry) {

    mesh = new THREE.Mesh( geometry, gateMaterial );
    group.add(mesh);
    scene.add( group );
    scene.traverse( function (object){
    	if(object instanceof THREE.Mesh){
    		object.castShadow = true;
    	}
    });

}

//Loads the body of the clock. Didnt know what texture to give it..
function clockBodyLoadedCallback(geometry) {

    mesh = new THREE.Mesh( geometry, clockMaterial );
    group.add(mesh);
    scene.add( group );

}

//The little dot in the middle of the clock. Helpful to have, and looks better.
function clockMiddleLoadedCallback(geometry) {

    mesh = new THREE.Mesh( geometry, craneMaterial );
    group.add(mesh);
    scene.add( group );

}

function onWindowResize() {

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize( window.innerWidth, window.innerHeight );


}