import Phaser from 'phaser';

// The first (boot) state of the game
export default class MenuState extends Phaser.State {
  constructor() {
		super();
    this.speed = 10;
    this.bg1Speed = 30;
    this.bg;
    this.bg1;
	}

  preload() {
    this.game.load.image('bgSpace','./assets/images/farback.jpg')
    this.game.load.image('bgSpace1','./assets/images/starfield.png')
  }
  create() {


    this.bg = this.game.add.tileSprite(0,0,1920,1080,'bgSpace');
    this.bg1 = this.game.add.tileSprite(0,0,1920,1024,'bgSpace1');
    this.bg.autoScroll(-this.speed,0);

    this.bg1.autoScroll(-this.bg1Speed,0);

    let centerX = this.game.world.centerX;
    let centerY = this.game.world.centerY;

    if(this.game.lastLives < 0){
      const style = { font: '44px "Comic Sans MS Regular"', fill: '#fff', align: 'center'};
      this.scoreText = this.game.add.text((centerX - 270), centerY - 100, 'Game Over. Yor Score Is: ' + this.game.lastScore,style);
    }

    const style = { font: '74px "Comic Sans MS Regular"', fill: '#b735b2', align: 'center' };
    this.title = this.game.add.text((centerX - 250), centerY - 50,'Are you ready?',style);

    const style2 = { font: '32px "Comic Sans MS Regular"', fill: '#b735b2', align: 'center' };
    this.help = this.game.add.text((centerX - 170), centerY + 50,'Press `Enter` to start',style2);
  }
  update() {
    if(this.game.input.keyboard.isDown(Phaser.Keyboard.ENTER)){
      this.game.state.start('main');
    }
  }
}
