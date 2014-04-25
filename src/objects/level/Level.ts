module Demo {
    export class Level {

        planets: Array<Planet>;
        asteroids: Array<Asteroid>;
        lvlName: string;
        startPos: Vector2D;
        gravity: Vector2D;
        jumpStrength: number;
        mustCheckAll: boolean;

    }
} 