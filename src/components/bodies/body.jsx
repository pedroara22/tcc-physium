import {Bodies, Body} from 'matter-js';

export default class MatterBody{
      constructor(pos, width, height, isStatic, angle, velocity, angularVelocity, speed, angularSpeed){
        this.body = Bodies.rectangle(pos.x+width/2, pos.y+height/2, width, height, {isStatic: isStatic, collisionFilter: { category: 0x0002, mask: 4294967295 },})
        
        this.pos = pos;
        this.width = width;
        this.height = height;
        this.isStatic = isStatic;

        this.angle? this.angle = angle : this.angle = 0;
        this.velocity? this.velocity = velocity : this.velocity = {x: 0, y: 0};
        this.angularVelocity? this.angularVelocity = angularVelocity : this.angularVelocity = 0;
        this.speed? this.speed = speed : this.speed = 0;
        this.angularSpeed? this.angularSpeed = angularSpeed : this.angularSpeed = 0;



        return this.body;
      }
    }