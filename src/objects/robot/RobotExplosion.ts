module Demo {

    export class RobotExplosion {

        game: GameState;

        explosion: Phaser.Sprite;

        constructor(game: GameState, x: number, y: number) {

            this.game = game;

            this.explosion = new Phaser.Sprite(game.game, x, y, 'robot_blow', 'explosion0001');
            this.explosion.anchor.set(0.5, 0.5);
            this.explosion.animations.add('explosion', Phaser.Animation.generateFrameNames('explosion00', 1, 22));
            this.game.gameWorld.add(this.explosion);
            this.explosion.animations.play('explosion', 60, false, true);

            var robot_antenna = new RobotPart(game.game, x, y, 'robot_antenna');
            this.game.gameWorld.add(robot_antenna);

            var robot_foot = new RobotPart(game.game, x, y, 'robot_foot');
            this.game.gameWorld.add(robot_foot);

            var robot_head = new RobotPart(game.game, x, y, 'robot_head');
            this.game.gameWorld.add(robot_head);

            var robot_leg = new RobotPart(game.game, x, y, 'robot_leg');
            this.game.gameWorld.add(robot_leg);

            var robot_legB = new RobotPart(game.game, x, y, 'robot_leg');
            this.game.gameWorld.add(robot_legB);

            var robot_legC = new RobotPart(game.game, x, y, 'robot_leg');
            this.game.gameWorld.add(robot_legC);
        }
    }

} 