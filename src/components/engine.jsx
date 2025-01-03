import {
  Bodies,
  Composite,
  Render,
  Runner,
  MouseConstraint,
  Events,
  Engine as MatterEngine,
  Mouse,
} from "matter-js";
import MatterBody from "./body";
import CircleBody from "./circleBody";
import ElipseBody from "./elipseBody";
var matterBody;
export default class Engine {
  constructor() {
    // Criação do motor e renderizador
    this.dimensions = {
      width: window.innerWidth,
      height: window.innerHeight / 2,
    };
    this.engine = MatterEngine.create();
    this.world = this.engine.world;
    this.walls = { ground: true, left: true, right: true, top: true };
    this.clicked = false;
    this.startItem = [];
    this.option = "addSquare";
    this.clickPos = undefined;
    this.started = false;

    this.render = Render.create({
      element: document.getElementById("canva"),
      engine: this.engine,
      options: {
        width: this.dimensions.width * 0.8,
        height: this.dimensions.height,
        wireframes: false,
      },
    });

    this.start();

    // Configuração do mouse constraint
    this.mouseConstraint = MouseConstraint.create(this.engine, {
      mouse: Mouse.create(this.render.canvas),
      constraint: {
        render: { visible: false },
      },
    });

    Composite.add(this.world, this.mouseConstraint);

    // Evento para detecção de clique

    // Inicia o renderizador e o runner
    Render.run(this.render);

    this.runner = Runner.create();

    Runner.run(this.runner, this.engine);

    document.getElementById("canva").addEventListener("mousedown", (event) => {
      event.preventDefault();
      this.handleMouseClick(event);
    });
    document.getElementById("canva").addEventListener("mousemove", (event) => {
      event.preventDefault();
      this.handleMouseMove(event);
    });
    document.getElementById("canva").addEventListener("mouseup", (event) => {
      event.preventDefault();
      this.handleMouseUp(event);
    });
  }

  start() {
    this.startItem = [];

    this.walls.ground = Bodies.rectangle(
      this.dimensions.width / 2,
      this.dimensions.height + 50,
      this.dimensions.width,
      100,
      { isStatic: true }
    );
    this.walls.left = Bodies.rectangle(
      -50,
      this.dimensions.height / 2,
      100,
      this.dimensions.height,
      { isStatic: true }
    );
    this.walls.right = Bodies.rectangle(
      this.dimensions.width + 50,
      this.dimensions.height / 2,
      100,
      this.dimensions.height,
      { isStatic: true }
    );
    this.walls.top = Bodies.rectangle(
      this.dimensions.width / 2,
      -50,
      this.dimensions.width,
      100,
      { isStatic: true }
    );

    Composite.add(this.world, [
      this.walls.ground,
      this.walls.left,
      this.walls.right,
      this.walls.top,
    ]);

    this.startItem ? Composite.add(this.world, this.startItem) : null;
  }

  handleMouseClick(event) {
    this.clicked = true;

    // Use o this.mouseConstraint para obter as coordenadas ajustadas
    const mousePosition = this.mouseConstraint.mouse.absolute;

    if (this.option === "addSquare" || this.option === "addElipse") {
      this.clickPos = { x: mousePosition.x, y: mousePosition.y };
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
        width: mousePosition.x - this.clickPos.x,
        height: mousePosition.y - this.clickPos.y,
      };

      let matterBodyToAdd = new MatterBody(
        this.clickPos,
        dimensions.width,
        dimensions.height,
        false
      );
      this.addBody(matterBodyToAdd);
    } else if (this.option === "addElipse") {
      const mousePosition = this.mouseConstraint.mouse.absolute;

      let matterBodyToAdd = new ElipseBody(this.clickPos, mousePosition, false);
      this.addBody(matterBodyToAdd);
    }
  }

  addStartItem(item) {
    // Adiciona um novo corpo ao mundo na inicialização
    this.startItem.push(item);
    Composite.add(this.world, item);
  }

  addBody(bodyToBeAdded) {
    // Adiciona um novo corpo ao mundo
    Composite.add(this.world, bodyToBeAdded);
  }

  changeOption(option) {
    this.option = option;
  }
  pause() {
    const allBodies = Composite.allBodies(this.world);
    allBodies.forEach((body) => {
      body.collisionFilter.category = 0; // Sem categoria
      body.collisionFilter.mask = 0; // Não colide com nada
    });
    this.engine.world.gravity.y = 0;
  }
  play() {
    const allBodies = Composite.allBodies(this.world);

    allBodies.forEach((body) => {
      body.collisionFilter.category = 0x0001; // Categoria padrão
      body.collisionFilter.mask = 0xffffffff; // Detecta colisões com todas as categorias
      
    });
    this.engine.world.gravity.y = 1;
  }

  reset() {
    // Remove todos os corpos do mundo
    Composite.clear(this.world);

    // Adiciona os corpos iniciais
    this.start();
  }
  pinBodies(bodyA, bodyB) {
    var constraint = Matter.Constraint.create({
      bodyA: bodyA,
      bodyB: bodyB,
      stiffness: 0.1,
    });
    Composite.add(this.world, constraint);
  }
}
