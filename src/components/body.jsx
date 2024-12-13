import {Bodies} from 'matter-js';

export default class MatterBody{
    constructor(pos, width, height, isStatic){
        this.body = Bodies.rectangle(pos.x+width/2, pos.y+height/2, width, height, {isStatic: isStatic});

        return this.body;
      }
}