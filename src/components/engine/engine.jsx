import {Bodies,Composite,Render,Runner,MouseConstraint,Events,Engine as MatterEngine,Mouse,Query,Body,Constraint,} from "matter-js";
import MatterBody from "../bodies/body";
import CircleBody from "../bodies/circleBody";
import ElipseBody from "../bodies/elipseBody";
var matterBody, usedBodies = [], selectedBody, selectedBodies = [];
const CATEGORY_BODY = 0x0001, CATEGORY_MOUSE = 0x0002;

export default class Engine{
  constructor() {
    // Criação do motor e renderizador
    this.dimensions = { width: window.innerWidth * 0.8, height: window.innerHeight };

    this.engine = MatterEngine.create();
    this.world = this.engine.world;
    this.walls = { ground: true, left: true, right: true, top: true };
    this.clicked = false;
    this.startItem = [];
    this.option = "addSquare";
    this.clickPos = undefined;
    this.started = false;

    this.render = Render.create({ element: document.getElementById("canva"), engine: this.engine, options: {width: this.dimensions.width,height: this.dimensions.height,wireframes: false,},});

    this.start();

    // Configuração do mouse constraint
    this.mouseConstraint = MouseConstraint.create(this.engine, {mouse: Mouse.create(this.render.canvas),constraint: {  render: { visible: false } },});
    Composite.add(this.world, this.mouseConstraint);

    // Inicia o renderizador e o runner
    Render.run(this.render);
    this.runner = Runner.create();
    Runner.run(this.runner, this.engine);


    //Creating event listeners
    document.getElementById("canva").addEventListener("mousedown", (event) => {event.preventDefault();this.handleMouseClick(event);});
    document.getElementById("canva").addEventListener("mousemove", (event) => {event.preventDefault();this.handleMouseMove(event);});
    document.getElementById("canva").addEventListener("mouseup", (event) => {event.preventDefault();this.handleMouseUp(event);});

    this.pause();

  }

  start() {
    this.startItem = [];

    //Adding walls
    this.walls.ground = Bodies.rectangle(this.dimensions.width / 2,this.dimensions.height + 50,this.dimensions.width,100,{ isStatic: true, label: "wall", collisionFilter:{ group: CATEGORY_BODY, mask: CATEGORY_MOUSE } });
    this.walls.left = Bodies.rectangle(-50,this.dimensions.height / 2,100,this.dimensions.height,{ isStatic: true, label: "wall", collisionFilter:{ group: CATEGORY_BODY, mask: CATEGORY_MOUSE }  });
    this.walls.right = Bodies.rectangle(this.dimensions.width + 50,this.dimensions.height / 2,100,this.dimensions.height,{ isStatic: true, label: "wall", collisionFilter:{ group: CATEGORY_BODY, mask: CATEGORY_MOUSE }  });
    this.walls.top = Bodies.rectangle(this.dimensions.width / 2,-50,this.dimensions.width,100,{ isStatic: true, label: "wall", collisionFilter:{ group: CATEGORY_BODY, mask: CATEGORY_MOUSE }  });
    
    Composite.add(this.world, [this.walls.ground,this.walls.left,this.walls.right,this.walls.top,]);

    this.startItem ? Composite.add(this.world, this.startItem) : null;
  }

  handleMouseClick(event) {
    this.clicked = true;

    // Use o this.mouseConstraint para obter as coordenadas ajustadas
    const mousePosition = this.mouseConstraint.mouse.absolute;

    if (this.option === "addSquare" || this.option === "addElipse") {
      this.clickPos = { x: mousePosition.x, y: mousePosition.y };
    } 
    else if (this.option == "moveItem") {
      selectedBody = Query.point(Composite.allBodies(this.world), mousePosition)[Query.point(Composite.allBodies(this.world), mousePosition).length-1];
      if(selectedBody){

        usedBodies.splice(usedBodies.findIndex((element)=>element.body.id === selectedBody.id), 1)

        usedBodies.push({
          body: selectedBody,
          initial: {
            position: { x: selectedBody.position.x, y: selectedBody.position.y},
            angle: selectedBody.angle,
            velocity: { x: selectedBody.velocity.x, y: selectedBody.velocity.y},
          }
        })

        this.selectBody(selectedBody)

        this.setAllBodiesCollisionFalse();

        Body.setStatic(selectedBody, false);

      }
    }
  }

  handleMouseMove(event) {
    if (this.clicked && this.option === "addSquare") {
      if (matterBody) {
        Composite.remove(this.world, matterBody);
      }
      const mousePosition = this.mouseConstraint.mouse.absolute;
      let dimensions = {
        width: mousePosition.x - this.clickPos.x,
        height: mousePosition.y - this.clickPos.y,
      };
      matterBody = new MatterBody(
        this.clickPos,
        dimensions.width,
        dimensions.height,
        true
      );
      this.addBody(matterBody);

    } else if (this.clicked && this.option === "addElipse") {
      if (matterBody) {
        Composite.remove(this.world, matterBody);
      }

      const mousePosition = this.mouseConstraint.mouse.absolute;

      matterBody = new ElipseBody(this.clickPos, mousePosition, true);

      this.addBody(matterBody);
    }
  }

  handleMouseUp(event) {
    this.clicked = false;

    if (matterBody) {
      Composite.remove(this.world, matterBody);
    }
    if (this.option === "addSquare") {
      const mousePosition = this.mouseConstraint.mouse.absolute;
      let dimensions = {
        width: mousePosition.x > this.clickPos.x ? mousePosition.x - this.clickPos.x : this.clickPos.x - mousePosition.x,
        height: mousePosition.y > this.clickPos.y ? mousePosition.y - this.clickPos.y : this.clickPos.y - mousePosition.y,
      };
      let matterBodyToAdd = new MatterBody(
        {
          x : mousePosition.x > this.clickPos.x ? this.clickPos.x : mousePosition.x,
          y : mousePosition.y > this.clickPos.y ? this.clickPos.y : mousePosition.y,
        },
        dimensions.width,
        dimensions.height,
        false
      );
      this.saveBody(matterBodyToAdd)
      this.addBody(matterBodyToAdd);
      this.pause();
    } 
    else if (this.option === "addElipse") {
      const mousePosition = this.mouseConstraint.mouse.absolute;

      let matterBodyToAdd = new ElipseBody(this.clickPos, mousePosition, false);

      this.saveBody(matterBodyToAdd)

      this.addBody(matterBodyToAdd);

      this.pause();
    }
    else if(this.option === "moveItem"){
      selectedBody ? Body.setStatic(selectedBody, true) : null;
      selectedBody.collisionFilter = { category: 0x0002, mask: 0x0001 }
      usedBodies[usedBodies.findIndex((element)=>element.body.id === selectedBody.id )].initial.position = {x: selectedBody.position.x, y: selectedBody.position.y}
      usedBodies[usedBodies.findIndex((element)=>element.body.id === selectedBody.id )].initial.angle = selectedBody.angle
    }

    this.reset();
    
  }

  saveBody(body){
    usedBodies.push({
      body: body,
      initial: {
        position: { x: body.position.x, y: body.position.y},
        angle: body.angle,
        velocity: { x: body.velocity.x, y: body.velocity.y}
      }
    })
  }

  addBody(bodyToBeAdded) {
    // Adiciona um novo corpo ao mundo
    Composite.add(this.world, bodyToBeAdded);
  }

  setAllBodiesCollisionFalse(){
    var allBodies = Composite.allBodies(this.world);
    allBodies.map((body)=>{
      if(body.label!="wall"){
        body.collisionFilter = {
          category: CATEGORY_BODY,
          mask: 0x0001
        };
      }
    })

  }

  addUsedBodies(){
    usedBodies.map(({body, initial})=>{
      Body.setPosition(body, initial.position)
      Body.setAngle(body, initial.angle)
      Body.setVelocity(body, initial.velocity)
      this.addBody(body);
    })
  }

  cleanMap(){
    Composite
  }

  changeOption(option) {
    this.option = option;
  }
  pause() {

    const allBodies = Composite.allBodies(this.world);

    allBodies.forEach((body) => {
      Body.setStatic(body, true);
    });

    this.engine.world.gravity.y = 0;
  }

  play() {
    const allBodies = Composite.allBodies(this.world);
    allBodies.forEach((body) => {

      if(body.label!="wall"){
        body.collisionFilter = { category: 0x0002, mask: 4294967295, group: 0 }
        Body.setStatic(body,false);
      }
    });

    this.engine.world.gravity.y = 1;
  }

  reset() {
    var allBodies = Composite.allBodies(this.world);

    allBodies.forEach((body)=>{
      if(body.label!="wall"){
        Composite.remove(this.world, body);
      }
    })
    
    this.addUsedBodies()

    this.pause()
  }
  selectBody(selectedBody) {
    //border white in selected body


    if(selectedBody){
      if(selectedBody.render.strokeStyle === "#ffffff"){
        selectedBody.render.strokeStyle = "#000000";
        selectedBody.render.lineWidth = 0;
        selectedBodies = selectedBodies.filter((body)=>body.id !== selectedBody.id)
      }
      else{
        selectedBody.render.strokeStyle = "#ffffff";
        selectedBody.render.lineWidth = 20;
        if(selectedBodies.length <2){
        selectedBodies.push(selectedBody)
        }
        else{
          selectedBodies[0].render.strokeStyle = "#000000";
          selectedBodies[0].render.lineWidth = 0;
          selectedBodies.shift();
          selectedBodies.push(selectedBody)
        }
      }
    }

    //border black in other bodies
  }
  pinBodies() {
    var bodyA = selectedBodies[0];
    var bodyB = selectedBodies[1];

    var constraint = Constraint.create({
      bodyA: bodyA,
      bodyB: bodyB,
      stiffness: 1
    });
    Composite.add(this.world, constraint);
  }
  setBodyStatic() {
    let body = selectedBody.length > 0 ? selectedBody[0] : selectedBody;
    if (body){
      
    }
  }
}
