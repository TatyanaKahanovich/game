import Phaser from 'phaser';

// The first (boot) state of the game
export default class BootState extends Phaser.State {
  create() {
    this.game.state.start('preloader');
  }
}
