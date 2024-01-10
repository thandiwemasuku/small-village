//Create color palette
var Colors = {
  cyan: 0x248079,
	brown: 0xA98F78,
	brownDark: 0x9A6169,
	green: 0x65BB61,
  greenLight: 0xABD66A,
  blue: 0x6BC6FF
  
};


var scene = new THREE.Scene();
var h = window.innerHeight,
    w = window.innerWidth;
var aspectRatio = w / h,
    fieldOfView = 20,//25
    nearPlane = .1,
    farPlane = 1000; //1000
var camera = new THREE.PerspectiveCamera(
    fieldOfView,
    aspectRatio,
    nearPlane,
    farPlane);
var renderer = new THREE.WebGLRenderer({canvas:canvas,alpha: true, antialias: true});

const dpi = window.devicePixelRatio;
renderer.setSize( w*dpi, h*dpi );
const theCanvas = document.getElementById('canvas');
theCanvas.style.width = `${w}px`;
theCanvas.style.height = `${h}px`;

renderer.shadowMapEnabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild( renderer.domElement );
camera.position.set(-5,6,8);
// camera.position.set(0,0,8); // front
// camera.position.set(-10,.2,0); //left
// camera.position.set(0,10,0); //top
// camera.position.y=4;
camera.lookAt(new THREE.Vector3(0,0,0));


//Ambient light
var light = new THREE.AmbientLight( 0xffffff ,.5);

var shadowLight = new THREE.DirectionalLight(0xffffff, .5);
shadowLight.position.set(200, 200, 200);
shadowLight.castShadow = true;

var backLight = new THREE.DirectionalLight(0xffffff, .2);
backLight.position.set(-100, 200, 50);
backLight.castShadow = true;
scene.add(backLight);
scene.add(light);
scene.add(shadowLight);

// Load Texture Images
var textureLoader = new THREE.TextureLoader();
var riverTexture = textureLoader.load('./image/water.jpeg');
var wallTexture = textureLoader.load('./image/rocks.jpg');
var grasslandTexture = textureLoader.load('./image/greengrass.jpg');
var treeTexture = textureLoader.load('./image/leaves.JPG');



//Material
var material_river = new THREE.MeshLambertMaterial({ map: riverTexture });
var material_wall = new THREE.MeshPhongMaterial({ map: wallTexture });
material_grass = new THREE.MeshLambertMaterial({ map: grasslandTexture });
var material_tree = new THREE.MeshLambertMaterial({ map: treeTexture });

// grassland left
var geometry_left = new THREE.BoxGeometry(2, .2, 4);

//var material_grass = new THREE.MeshLambertMaterial( { color: Colors.greenLight } );
//var ground_left = new THREE.Mesh( geometry_left, material_grass );
var ground_left = new THREE.Mesh(geometry_left, material_grass);
ground_left.position.set(-1,0.1,0);
scene.add( ground_left );
customizeShadow(ground_left,.25) // mess, opacity

//river
var geometry_river = new THREE.BoxGeometry(1, .1, 4);
var river = new THREE.Mesh(geometry_river, material_river);
//var material_river = new THREE.TextureLoader().load( "image/water.jpeg" );
//var material_river = new THREE.MeshLambertMaterial( { color: Colors.blue } );
//var river = new THREE.Mesh( geometry_river, material_river );
river.position.set(.5,.1,0);
scene.add( river );
customizeShadow(river,.08) // mess, opacity
//river bed
var geometry_bed = new THREE.BoxGeometry( 2, .05, 4 ); //var geometry_bed = new THREE.BoxGeometry( 1, .05, 2 );
var bed = new THREE.Mesh( geometry_bed , material_grass );
bed.position.set(.5,.025,0);
scene.add( bed );

//grassland right
var geometry_right = new THREE.BoxGeometry( 1, .2, 4 );
var ground_right = new THREE.Mesh( geometry_right, material_grass );
ground_right.position.set(1.5,0.1,0);
scene.add( ground_right );
customizeShadow(ground_right,.25) // mess, opacity


var tree=function(x,z){
  this.x=x;
  this.z = z;
  
  
  //trunk
  var material_trunk = new THREE.MeshLambertMaterial({ color: Colors.brownDark  });
  var geometry_trunk = new THREE.BoxGeometry( .10, .15, .10 );
  var trunk = new THREE.Mesh( geometry_trunk, material_trunk );
  trunk.position.set(this.x,.275,this.z);
  trunk.castShadow = true;
  trunk.receiveShadow = true;
  scene.add( trunk );
  
  //leaves
  var geometry_leaves = new THREE.ConeGeometry( .15, .3, .15 );
  //var geometry_leaves = new THREE.BoxGeometry( .25, .4, .25 );
  //var material_leaves = new THREE.MeshLambertMaterial({ color: Colors.green});
  var leaves = new THREE.Mesh( geometry_leaves, material_tree);
  leaves.position.set(this.x,.2+.15+.4/2,this.z);
  leaves.castShadow = true;
  customizeShadow(leaves,.25) // mess, opacity
  scene.add( leaves );
}
var house = function (x, z) {
  this.x = x;
  this.z = z;

  //roof
  var roof_material = new THREE.MeshPhongMaterial({ color: Colors.blue });
  var roof_geo = new THREE.ConeGeometry(.4, .8, .8);
  var roof = new THREE.Mesh(roof_geo, roof_material);
  roof.position.set(this.x,.2+.15+.4/2,this.z);
  roof.castShadow = true;
  customizeShadow(roof,.25)
  scene.add(roof);

  //walls
  //var wall_material = new THREE.MeshPhongMaterial({ color: Colors.white });
  //var wall_material = new THREE.Mesh(roof_geo, material_house);
  var wall_geo = new THREE.BoxGeometry(.80, .60, .80);
  var wall = new THREE.Mesh(wall_geo, material_wall);
  wall.position.set(this.x,.275,this.z);
  wall.castShadow = true;
  wall.receiveShadow = true;
  scene.add(wall);
}
var waterTrunk = function (x, z) {
  this.x = x;
  this.z = z;

  //water Tunk
  var wTrunk_material = new THREE.MeshPhongMaterial({ color: Colors.blue });
  var wTrunk_geo = new THREE.RingGeometry(.3, .3, .3);
  var wTrunk = new THREE.Mesh(wTrunk_geo, wTrunk_material);
  wTrunk.position.set(this.x,.2+.15+.4/2,this.z);
  wTrunk.castShadow = true;
  customizeShadow(wTrunk,.25)
  scene.add(wTrunk);

  //walls
  var wTrunkB_material = new THREE.MeshPhongMaterial({ color: Colors.brown });
  var wTrunkB_geo = new THREE.CylinderGeometry(.50, .50, .70);
  var wTrunkB = new THREE.Mesh(wTrunkB_geo, wTrunkB_material);
  wTrunkB.position.set(this.x,.275,this.z);
  wTrunkB.castShadow = true;
  wTrunkB.receiveShadow = true;
  scene.add(wTrunkB);
}
//left
//tree(-1.75,-.85);
//tree(-1.75,-.15);
//tree(-1.5, -.5);
tree(-1.5,.4);
//tree(-1.25,-.85);
tree(-1.25, .75);
tree(-1.75, .70);
tree(-1.65, .95);
tree(-1.50, 1.90);
//tree(-.75,-.85);
tree(-.75, -.25);
tree(-.95,-.85);
//tree(-.25,-.85);
//right
tree(1.25,-.85);
tree(1.25,.75);
tree(1.5,-.5);
tree(1.75,-.85);
tree(1.75,.35);
//house
house(-1.5, -.5);
waterTrunk(-.25, -.85);

function customizeShadow(t,a){ //opacity, target mesh
  var material_shadow = new THREE.ShadowMaterial({opacity:a});
  var mesh_shadow = new THREE.Mesh( t.geometry, material_shadow );
  mesh_shadow.position.set(t.position.x,t.position.y,t.position.z);
  mesh_shadow.receiveShadow = true;
  scene.add( mesh_shadow );
}


var material_wood = new THREE.MeshLambertMaterial({ color: Colors.brown  });

//bridge - wood block
for (var i=0;i<6;i++){
  var geometry_block = new THREE.BoxGeometry( .15, .02, .4 );
  var block = new THREE.Mesh( geometry_block, material_wood );
  block.position.set(0+.2*i,.21,.2);
  block.castShadow = true;
  block.receiveShadow = true;
  scene.add( block );
}
//bridge - rail
var geometry_rail_v = new THREE.BoxGeometry( .04,.3,.04 );
var rail_1 = new THREE.Mesh( geometry_rail_v, material_wood );
rail_1.position.set(-.1,.35,.4);
rail_1.castShadow = true;
customizeShadow(rail_1,.2);
scene.add( rail_1 );

var rail_2 = new THREE.Mesh( geometry_rail_v, material_wood );
rail_2.position.set(1.1,.35,.4);
rail_2.castShadow = true;
customizeShadow(rail_2,.2);
scene.add( rail_2 );

var rail_3 = new THREE.Mesh( geometry_rail_v, material_wood );
rail_3.position.set(-.1,.35,0);
rail_3.castShadow = true;
customizeShadow(rail_3,.2);
scene.add( rail_3 );

var rail_4 = new THREE.Mesh( geometry_rail_v, material_wood );
rail_4.position.set(1.1,.35,0);
rail_4.castShadow = true;
customizeShadow(rail_4,.2);
scene.add( rail_4 );

var geometry_rail_h = new THREE.BoxGeometry( 1.2,.04,.04 );
var rail_h1 = new THREE.Mesh( geometry_rail_h, material_wood );
rail_h1.position.set(0.5,.42,.4);
rail_h1.castShadow = true;
customizeShadow(rail_h1,.2);
scene.add( rail_h1 );

var rail_h2 = new THREE.Mesh( geometry_rail_h, material_wood );
rail_h2.position.set(0.5,.42,0);
rail_h2.castShadow = true;
customizeShadow(rail_h2,.2);
scene.add( rail_h2 );
/*
var Drop=function(){
  this.geometry = new THREE.BoxGeometry(.1, .1, .1 );
  this.drop= new THREE.Mesh( this.geometry, material_river );
  this.drop.position.set(Math.random(.1,.9),0.1,1+(Math.random()-.5)*.1);
  scene.add( this.drop );
  this.speed=0;
  this.lifespan=(Math.random()*50)+50;
  
  this.update=function(){
    this.speed+=.0007;
    this.lifespan--;
    this.drop.position.x+=(.5-this.drop.position.x)/70;
    this.drop.position.y-=this.speed;
  }
}
var drops=[];

var count=0;
var render = function() {
	requestAnimationFrame( render );
  if(count%3==0){
     for(var i=0;i<5;i++){
      drops.push(new Drop());
    }
  }
  count++;
  for(var i=0;i<drops.length;i++){
    drops[i].update();
    if(drops[i].lifespan<0){
      scene.remove(scene.getObjectById(drops[i].drop.id));
      drops.splice(i,1);
    }
  }
	renderer.render( scene, camera );
} */
//Rotation
// ... (Your existing code)

// Variables to track rotation state and direction
// ... (Your existing code)

// Variables to track rotation state and direction
var isRotating = false;
var rotationDirection = 1;

// Event listener for toggleRotation button
document.getElementById('toggleRotation').addEventListener('click', function() {
  isRotating = !isRotating;
});

// Event listener for toggleDirection button
document.getElementById('toggleDirection').addEventListener('click', function() {
  rotationDirection *= -1; // Change rotation direction
});

// Update Animation Loop
var render = function() {
  requestAnimationFrame(render);

  if (isRotating) {
    scene.rotation.y += 0.002 * rotationDirection;
  }

  renderer.render(scene, camera);
};

// Start the animation loop
render();

//Night mode
//Night Night


var isNightMode = false;


document.getElementById('toggleNightMode').addEventListener('click', function() {
  isNightMode = !isNightMode;
  var ambientLight = new THREE.AmbientLight(0x000000); // Set the color of the ambient light
  scene.add(ambientLight); // Add ambient light to the scene


  if (isNightMode) {
    scene.background = new THREE.Color(0x000000); // Set background to black
    ambientLight.intensity = 0.1; // Reduce ambient light intensity
    shadowLight.intensity = 0.1; // Reduce directional light intensity

    
  } else {
    scene.background = new THREE.Color(0x87CEEB); // Reset background color
    ambientLight.intensity = 0.5; // Reset ambient light intensity
    shadowLight.intensity = 0.5; // Reset directional light intensity
  }


//Night Mode
  // Reset rotation when toggling night mode
  resetRotation();
});

// Function to reset rotation
function resetRotation() {
 
  ground_left.rotation.y = 0;
  ground_right.rotation.y = 0;
}

// Update Animation Loop
var renderT = function() {
  requestAnimationFrame(renderT);

  // Only rotate if not in night mode
  if (!isNightMode) {
    resetRotation();
    ground_left.rotation.y += 0.005 * rotationDirection;
    ground_right.rotation.y += 0.005 * rotationDirection;
  }

  renderer.renderT(scene, camera);
};

// Start the animation loop
render();



