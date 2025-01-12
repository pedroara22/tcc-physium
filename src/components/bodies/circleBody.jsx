import { Bodies } from "matter-js";

export default class CircleBody {
    constructor(pos, radius, isStatic) {
        this.body = Bodies.circle(pos.x + radius, pos.y + radius, radius, { isStatic: isStatic });

        return this.body;
    }
}
