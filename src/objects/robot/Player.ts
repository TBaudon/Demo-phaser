module Demo {

    export enum PlayerState {
        FLYING,
        LANDED,
        DEAD
    }

    export class Player extends Phaser.Sprite {

        gravity: Vector2D;
        jumpStrength: number;

        vitX: number;
        vitY: number;

        landed: boolean;
        opened: boolean;
        landingAngle: number;
        planets: Array<Planet>;
        canJump: boolean;

        gameState: GameState;

        previousPlanet: Planet;
        currentPlanet: Planet;

        state: PlayerState;

        nbJump: number;

        constructor(game: GameState,
            planets: Array<Planet>,
            gravity: Vector2D,
            jumpStrength: number) {
            super(game.game, 0, 0, 'robot_wait');

            this.gameState = game;

            this.jumpStrength = jumpStrength;
            this.gravity = gravity;

            this.anchor.setTo(0.5, 0.5);

            this.animations.add('idle');
            this.animations.play('idle', 60, true);

            //game.game.input.onDown.add(this.jump, this);

            this.planets = planets;
            this.vitX = 0;
            this.vitY = 0;
            this.landed = false;
            this.opened = false;
            this.currentPlanet = null;
            this.previousPlanet = null;
            this.state = PlayerState.FLYING;
            this.canJump = true;
            this.nbJump = 0;
        }

        spawn() {
            this.x = this.currentPlanet.x;
            this.y = this.currentPlanet.y;
            this.land(this.gameState.lastCheckpoint);
            this.visible = true;
            this.alpha = 0;
            this.game.add.tween(this).to({ alpha: 1 }, 1000, null, true).onComplete.add(this.allowJump, this);
            this.canJump = false;
        }

        allowJump() {
            this.canJump = true;
        }

        jump() {
            if (this.state == PlayerState.LANDED && this.canJump) {
                this.state = PlayerState.FLYING;
                this.opened = false;
                this.loadTexture('robot_jump', 0);
                this.animations.add('jump');
                this.animations.play('jump', 60);

                this.nbJump++;

                var rot : number = this.rotation - Math.PI / 2;

                this.vitX = Math.cos(rot) * this.jumpStrength;
                this.vitY = Math.sin(rot) * this.jumpStrength;

                this.previousPlanet = this.currentPlanet;
            }
        }

        openLegs() {
            if (!this.opened && this.state == PlayerState.FLYING) {
                this.opened = true;
                this.loadTexture('robot_land', 0);
                this.animations.add('open', Phaser.Animation.generateFrameNames('robot_anim_finale00', 60, 72));
                this.animations.play('open', 60);
            }
        }

        land(planet: Planet) {
            if (this.state != PlayerState.LANDED) {
                this.currentPlanet = planet;
                this.rotation = Math.atan2(this.y - planet.y, this.x - planet.x) + Math.PI/2;
                this.state = PlayerState.LANDED;
                this.loadTexture('robot_land', 0);
                this.animations.add('land', Phaser.Animation.generateFrameNames('robot_anim_finale00', 73, 88));
                this.animations.play('land', 60);
                this.events.onAnimationComplete.add(this.onAnimationLandedEnd, this);
            }
        }

        onAnimationLandedEnd() {
            this.events.onAnimationComplete.remove(this.onAnimationLandedEnd, this);
            this.animations.play('idle', 30);
        }

        fly() {
            this.vitX += this.gravity.x;
            this.vitY += this.gravity.y;

            this.x += this.vitX;
            this.y += this.vitY;

            var nextX = this.x + this.vitX;
            var nextY = this.y + this.vitY;

            if (this.vitY >= 0)
                this.openLegs();

            this.rotation = Math.atan2(this.vitY, this.vitX) + Math.PI / 2;

            // Check collsion with planets
            for (var i = 0; i < this.planets.length; ++i) {
                var planet: Planet = this.planets[i];
                var diffX: number = nextX - planet.x;
                var diffY: number = nextY - planet.y;
                var diff: number = Math.sqrt(diffX * diffX + diffY * diffY);

                if (diff <= planet.radius + this.height / 4) {
                    if (!planet.bounce) 
                        this.land(planet);
                    else if(diff <= planet.radius - 30 + this.height / 4) 
                        this.bounce(planet); 
                }
            }
        }

        explode() {
            if (this.state != PlayerState.DEAD) {
                this.visible = false;
                new RobotExplosion(this.gameState, this.x, this.y);
                this.game.time.events.add(Phaser.Timer.SECOND * 1, this.spawn, this);
                this.state = PlayerState.DEAD;
            }
        }

        updateOnPlanet() {
            this.rotation += this.currentPlanet.rotSpeed;  
            var radius: number = this.currentPlanet.radius + (this.height/2);
            this.x = this.currentPlanet.x + Math.cos(this.rotation - Math.PI/2) * radius;
            this.y = this.currentPlanet.y + Math.sin(this.rotation - Math.PI / 2) * radius;
        }

        update() {
            switch (this.state) {
                case PlayerState.FLYING:
                    this.fly();
                    break;
                case PlayerState.LANDED:
                    this.updateOnPlanet();
                    break;
                case PlayerState.DEAD:
                    break;
            }
        }

        bounce(planet: Planet) {
            // get the axe for reflexion
            var axe: Vector2D = new Vector2D(this.x - planet.x, this.y - planet.y);
            var vit: Vector2D = new Vector2D(this.vitX, this.vitY);
            var bounceVec: Vector2D = vit.reflect(axe);
            this.vitX = bounceVec.x;
            this.vitY = bounceVec.y;

            for (var i = 0; i < 10; i++) {
                var dust = new Dust(this.game, this.x, this.y);
                this.gameState.gameWorld.add(dust);
            }
        }
    }
} 