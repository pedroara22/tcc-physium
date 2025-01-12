import { Bodies } from "matter-js";

export default class ElipseBody {
  constructor(startPos, finalPos, isStatic) {
    const yv = (finalPos.y-startPos.y)/2;
    const xv = (finalPos.x-startPos.x)/2;

    let vertices = [];

    for (let i = 0; i < 360; i += 5) {
      const x = Math.cos(i) * xv + startPos.x + xv;
      const y = Math.sin(i) * yv + startPos.y + yv;
      vertices.push({ x: x, y: y });
    }
    return Bodies.fromVertices(startPos.x+xv, startPos.y+yv, vertices, { isStatic: isStatic });
  }
}