module Demo {
    export class Vector2D {

        x: number;
        y: number;

        constructor(x: number, y: number) {
            this.x = x;
            this.y = y;
        }

        normalize(): Vector2D{
            return new Vector2D(this.x / this.getNorm(), this.y / this.getNorm());
        }

        getNorm(): number{
            return Math.sqrt(this.x * this.x + this.y * this.y);
        }

        scal(vector: Vector2D): number{
            return vector.x * this.x + vector.y * this.y;
        }

        reflect(vector: Vector2D): Vector2D {
            var n: Vector2D = vector.normalize();
            var scal: number = this.scal(n);
            var repX = this.x - 2 * scal * n.x;
            var repY = this.y - 2 * scal * n.y;

            return new Vector2D(repX, repY);
        }
    }
} 