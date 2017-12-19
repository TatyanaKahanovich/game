import Phaser from 'phaser';
// The main state of the game
export default class MainState extends Phaser.State {
  constructor(game) {
		super(game);
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.lastBullet = 0;
    this.lastEnemy = 0;
    this.lastTick = 0;
    this.speed = 120;
    this.bg1Speed = 30;
    this.bg2Speed =40;
    this.bg3Speed =50;
    this.enemySpeed = 150;
    this.holeSpeed = 150;
    this.barrelSpeed = 200;
    this.bulletSpeed = 300;
    this.lives = 3;
    this.score = 0;
	}

create() {


    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    this.bg = this.game.add.tileSprite(0,0,1920,1080,'bgSpace');
    this.bg.autoScroll(-this.bg1Speed,0);

    this.bg1 = this.game.add.tileSprite(0,0,1600,800,'bgSpace1');
    this.bg1.autoScroll(-this.bg2Speed,0);

    this.bg2 = this.game.add.tileSprite(0,0,1600,701,'bgSpace1');
    this.bg2.autoScroll(-this.bg3Speed,0);

    this.ship = this.game.add.sprite(0,this.game.width/2,'ship');
    this.ship.animations.add('move');
    this.ship.animations.play('move',20,true);
    this.game.physics.arcade.enable(this.ship, Phaser.Physics.ARCADE);

    this.bullets = this.game.add.group();
    this.bullets.enableBody = true;
    this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
    this.bullets.createMultiple(10,'bullet');
    this.bullets.setAll('outOfBoundsKill', true);
    this.bullets.setAll('checkWorldBounds', true);

    this.enemies = this.game.add.group();
    this.enemies.enableBody = true;
    this.enemies.physicsBodyType = Phaser.Physics.ARCADE;

    this.holes = this.game.add.group();
    this.holes.enableBody = true;
    this.holes.physicsBodyType = Phaser.Physics.ARCADE;

    this.barrels = this.game.add.group();
    this.barrels.enableBody = true;
    this.barrels.physicsBodyType = Phaser.Physics.ARCADE;

    this.explosions = this.game.add.group();
    this.explosions.enableBody = true;
    this.explosions.physicsBodyType = Phaser.Physics.ARCADE;
    this.explosions.createMultiple(30,'explosion');
    this.explosions.setAll('anchor.x', 0.5);
    this.explosions.setAll('anchor.y', 0.5);
    this.explosions.forEach( function(explosion) {
      explosion.animations.add('explosion');
    });

    const style = { font: '28px "Comic Sans MS Regular"', fill: '#b735b2', align: 'left'};
    this.scoreText = this.game.add.text(15, 15, 'Score : ' + this.score,style);
    this.livesText = this.game.add.text(this.width - 130, (15), 'Lives : ' + this.lives,style);

    this.music = this.game.add.audio('spaceMusic');
    this.music.play('', 0, 1, true);;

    this.blasterMusic = this.game.add.audio('blasterMusic');
    this.explosionMusic = this.game.add.audio('explosionMusic');
    this.barrelMusic = this.game.add.audio('barrelMusic');
    this.jumpMusic = this.game.add.audio('jumpMusic');
  }
  update() {
    this.ship.body.velocity.setTo(0, 0);
    if(this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT) && this.ship.x > 0){
      this.ship.body.velocity.x = -2 * this.speed;
    }
    else if(this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT) && this.ship.x < (this.width-this.ship.width)){
      this.ship.body.velocity.x = this.speed;
    }
    else if(this.game.input.keyboard.isDown(Phaser.Keyboard.UP) && this.ship.y > 0){
      this.ship.body.velocity.y = -this.speed;
    }
    else if(this.game.input.keyboard.isDown(Phaser.Keyboard.DOWN) && this.ship.y < (this.height-this.ship.height)){
      this.ship.body.velocity.y = +this.speed;
    }

    const currentTime = this.game.time.now;

    if(this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){
      if(currentTime - this.lastBullet > 300){
        this.fireBullet();
        this.lastBullet = currentTime;
      }
    }

    if(currentTime - this.lastEnemy > 1000){
      this.generateEnemy();
      this.lastEnemy = currentTime;
    }

    if(this.speed > 150 && currentTime - this.lastEnemy > 500){
      this.generateEnemy();
      this.lastEnemy = currentTime;
    } else if (this.speed > 250 && currentTime - this.lastEnemy > 500){
      this.generateEnemy();
      this.lastEnemy = currentTime;
    }

    if(currentTime - this.lastTick > 10000 && this.score > 100){
      if(this.speed < 500){
        this.speed *= 1.1;
        this.enemySpeed *= 1.1;
        this.holeSpeed *= 1.1;
        this.bulletSpeed *= 1.1;
        this.barrelSpeed *= 1.2;
        this.bg.autoScroll(-this.bg1Speed, 0);
        this.bg1.autoScroll(-this.bg2Speed, 0);
        this.bg2.autoScroll(-this.bg3Speed, 0);
        this.lastTick = currentTime;
      }
    }

    this.game.physics.arcade.overlap(this.enemies, this.ship, this.enemyHitPlayer, null, this);
    this.game.physics.arcade.overlap(this.ship, this.bullets, this.bulletHitPlayer, null, this);
    this.game.physics.arcade.overlap(this.holes, this.ship, this.playerHitHole,null, this);
    this.game.physics.arcade.overlap(this.enemies, this.bullets, this.enemyHitBullet, null, this);
    this.game.physics.arcade.overlap(this.ship, this.barrels, this.playerHitBarrel, null, this);
    this.game.physics.arcade.overlap(this.bullets, this.barrels, this.bulletHitBarrel, null, this);
  }

  fireBullet(currentTime) {
    let bullet = this.bullets.getFirstExists(false);
    if(bullet){
      bullet.reset(this.ship.x+this.ship.width,this.ship.y+this.ship.height/2);
      bullet.body.velocity.x = this.bulletSpeed;
    }
    this.blasterMusic.play();
  }

  generateEnemy() {
    let enemy = this.enemies.getFirstExists(false);
    let hole = this.holes.getFirstExists(false);
    let barrel = this.barrels.getFirstExists(false);
    if(enemy){
      enemy.reset(this.width,Math.floor(Math.random()*(this.height-30)), 'enemyship'+(1+Math.floor(Math.random()*5)));
    }
    else {
      enemy = this.enemies.create(this.width,Math.floor(Math.random()*(this.height-30)), 'enemyship'+(1+Math.floor(Math.random()*5)));
    }

    if(hole){
      hole.reset(this.width,Math.floor(Math.random()*(this.height-30)),'hole');
    }
    else {
      hole =  this.holes.create(this.width,Math.floor(Math.random()*(this.height-30)),'hole');
    }

    if(barrel){
      barrel.reset(this.width,Math.floor(Math.random()*(this.height-40)),'barrel');
    }
    else {
      barrel = this.barrels.create(this.width,Math.floor(Math.random()*(this.height-40)), 'barrel');
    }

    enemy.body.velocity.x = -this.enemySpeed;
    enemy.outOfBoundsKill = true;
    enemy.checkWorldBounds = true;
    enemy.animations.add('move');
    enemy.animations.play('move', 20, true);

    hole.body.velocity.x = -this.holeSpeed;
    hole.outOfBoundsKill = true;
    hole.checkWorldBounds = true;
    hole.animations.add('move');
    hole.animations.play('move', 20, true);

    barrel.body.velocity.x = -this.barrelSpeed;
    barrel.outOfBoundsKill = true;
    barrel.checkWorldBounds = true;
    barrel.animations.add('move');
    barrel.animations.play('move', 6, true);
  }

  hitExplosion(enemy) {
    let explosion = this.explosions.getFirstExists(false);
    explosion.reset(enemy.body.x + enemy.body.halfWidth, enemy.body.y + enemy.body.halfHeight);
    explosion.body.velocity.y = enemy.body.velocity.y;
    explosion.alpha = 0.7;
    explosion.play('explosion', 30, false, true);
    this.explosionMusic.play();
  }

  enemyHitPlayer(player, enemy) {
    this.hitExplosion(enemy);
    enemy.kill();
    this.subLife();
  }

  bulletHitPlayer(player, bullet) {
    this.hitExplosion(bullet);
    this.subLife();
  }

  enemyHitBullet(bullet, enemy) {
    this.hitExplosion(enemy);
    enemy.kill();
    bullet.kill();
    this.addScore();
  }

  playerHitBarrel(ship, barrel) {
    barrel.kill();
    this.addScore();
    this.barrelMusic.play();
  }

  playerHitHole(player, hole) {
    let rand = 1 + Math.floor(Math.random()*(this.holes.children.length-1));
    let newPosition = this.holes.children[rand].position;
    this.ship.position.x = newPosition.x + 40;
    this.ship.position.y = newPosition.y;
    this.jumpMusic.play();
  }

  bulletHitBarrel(bullet, barrel) {
    this.hitExplosion(barrel);
    barrel.kill();
    bullet.kill();
  }

  checkIsAlive() {
    if(this.lives < 0){
      this.game.state.start('menu');
    }
  }

  addScore() {
    this.score += 10;
    this.game.lastScore = this.score;
    this.scoreText.setText('Score : '+ this.score);
  }

  subLife() {
    this.lives -= 1;
    this.game.lastLives  = this.lives;
    this.livesText.setText('Lives : '+ this.lives);
    this.checkIsAlive();
  }
}
