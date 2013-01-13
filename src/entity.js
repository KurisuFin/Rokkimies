var BossMonster, Bullet, Entity, Monster, Player, checkCollision, checkCollisions, facing, moveEntities, removeEntities, state,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

facing = {
  left: "left",
  right: "right"
};

state = {
  stand: "stand",
  run: "run",
  jump: "jump",
  climb: "climb",
  damage: "damage",
  dead: "dead"
};

moveEntities = function() {
  var bullet, monster, _i, _j, _len, _len1, _ref, _ref1, _results;
  game.player.move();
  _ref = game.stage.getMonsters();
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    monster = _ref[_i];
    monster.move();
  }
  _ref1 = game.stage.getBullets();
  _results = [];
  for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
    bullet = _ref1[_j];
    _results.push(bullet.move());
  }
  return _results;
};

checkCollisions = function() {
  var bullet, monster, player, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2, _results;
  _ref = game.stage.getBullets();
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    bullet = _ref[_i];
    _ref1 = game.stage.getMonsters();
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      monster = _ref1[_j];
      if (checkCollision(bullet, monster)) {
        if (!monster.isUnharmable()) {
          monster.reduceHealth(bullet.getDamage());
        }
        bullet.setHitted(true);
      }
    }
  }
  player = game.player;
  if (!player.isUnharmable()) {
    _ref2 = game.stage.getMonsters();
    _results = [];
    for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
      monster = _ref2[_k];
      if (checkCollision(player, monster)) {
        _results.push(player.takeHit(monster));
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  }
};

checkCollision = function(entity1, entity2) {
  var height1, height2, width1, width2, x1, x2, y1, y2, _ref, _ref1, _ref2, _ref3;
  _ref = entity1.getPosition(), x1 = _ref[0], y1 = _ref[1];
  _ref1 = entity1.getSize(), width1 = _ref1[0], height1 = _ref1[1];
  _ref2 = entity2.getPosition(), x2 = _ref2[0], y2 = _ref2[1];
  _ref3 = entity2.getSize(), width2 = _ref3[0], height2 = _ref3[1];
  if ((x1 <= x2 && x2 <= x1 + width1) || (x2 <= x1 && x1 <= x2 + width2)) {
    if ((y1 <= y2 && y2 <= y1 + height1) || (y2 <= y1 && y1 <= y2 + height2)) {
      return true;
    }
  }
  return false;
};

removeEntities = function() {
  game.stage.removeHittedBullets();
  return game.stage.removeDeadMonsters();
};

Entity = (function() {

  function Entity(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.health = 30;
    this.unharmable = false;
    this.damage = 0;
    this.clipping = true;
    this.flying = false;
    this.facing = facing.left;
    this.state = state.stand;
  }

  Entity.prototype.getPosition = function() {
    return [this.x, this.y];
  };

  Entity.prototype.getX = function() {
    return this.x;
  };

  Entity.prototype.setX = function(x) {
    this.x = x;
  };

  Entity.prototype.getY = function() {
    return this.y;
  };

  Entity.prototype.setY = function(y) {
    this.y = y;
  };

  Entity.prototype.getSize = function() {
    return [this.width, this.height];
  };

  Entity.prototype.getSpeed = function() {
    return [this.speedX, this.speedY];
  };

  Entity.prototype.getSpeedX = function() {
    return this.speedX;
  };

  Entity.prototype.getSpeedY = function() {
    return this.speedY;
  };

  Entity.prototype.setSpeedX = function(speedX) {
    this.speedX = speedX;
  };

  Entity.prototype.setSpeedY = function(speedY) {
    this.speedY = speedY;
  };

  Entity.prototype.getHealth = function() {
    return this.health;
  };

  Entity.prototype.setHealth = function(health) {
    this.health = health;
  };

  Entity.prototype.reduceHealth = function(amount) {
    return this.health -= amount;
  };

  Entity.prototype.isUnharmable = function() {
    return this.unharmable;
  };

  Entity.prototype.setUnharmable = function(unharmable) {
    this.unharmable = unharmable;
  };

  Entity.prototype.getDamage = function() {
    return this.damage;
  };

  Entity.prototype.setDamage = function(damage) {
    this.damage = damage;
  };

  Entity.prototype.getFacing = function() {
    return this.facing;
  };

  Entity.prototype.setFacing = function(facing) {
    this.facing = facing;
  };

  Entity.prototype.getState = function() {
    return this.state;
  };

  Entity.prototype.setState = function(state) {
    this.state = state;
  };

  Entity.prototype.move = function() {
    if (!this.clipping) {
      this.moveX();
      this.moveY();
      return;
    }
    if (this.speedX < 0) {
      this.moveLeft();
    } else if (this.speedX > 0) {
      this.moveRight();
    }
    if (this.getSpeedY() > 0) {
      return this.moveDown();
    } else if (this.getSpeedY() === 0) {
      if (!this.onGround()) {
        return this.moveY();
      }
    } else if (this.getSpeedY() < 0) {
      return this.moveUp();
    }
  };

  Entity.prototype.moveLeft = function() {
    var block, bottom, left, right, top;
    left = Math.floor(this.x);
    this.moveX();
    right = Math.floor(this.x);
    top = Math.floor(this.y);
    bottom = Math.ceil(this.y + this.height - 1);
    block = this.checkHittingToBlock(right, left, top, bottom);
    if (block !== null) {
      this.x = Math.floor(block.getX()) + this.width + (1 - this.width);
      this.speedX = 0;
      if (block instanceof DoorBlock) {
        return this.doorHitted(block);
      }
    }
  };

  Entity.prototype.moveRight = function() {
    var block, bottom, left, right, top;
    left = Math.floor(this.x + this.width);
    this.moveX();
    right = Math.floor(this.x + this.width);
    top = Math.floor(this.y);
    bottom = Math.ceil(this.y + this.height - 1);
    block = this.checkHittingToBlock(left, right, top, bottom);
    if (block !== null) {
      this.x = Math.floor(block.getX()) - this.width;
      this.speedX = 0;
      if (block instanceof DoorBlock) {
        return this.doorHitted(block);
      }
    }
  };

  Entity.prototype.moveUp = function() {
    var block, bottom, left, right, top;
    bottom = Math.floor(this.y);
    this.moveY();
    top = Math.floor(this.y);
    left = Math.floor(this.x);
    right = Math.ceil(this.x + this.width - 1);
    block = this.checkHittingToBlock(left, right, bottom, top);
    if (block !== null) {
      this.y = Math.floor(block.getY() + 1);
      this.speedY = 0;
      if (block instanceof DoorBlock) {
        return this.doorHitted(block);
      }
    }
  };

  Entity.prototype.moveDown = function() {
    var block, bottom, left, right, top;
    top = Math.floor(this.y + this.height);
    this.moveY();
    bottom = Math.floor(this.y + this.height);
    left = Math.floor(this.x);
    right = Math.ceil(this.x + this.width - 1);
    block = this.checkHittingToBlock(left, right, top, bottom);
    if (block !== null) {
      this.y = Math.floor(block.getY()) - this.height;
      this.speedY = 0;
      if (block instanceof DoorBlock) {
        return this.doorHitted(block);
      }
    }
  };

  Entity.prototype.onGround = function() {
    var grid, left, right, x, y, _i, _ref;
    grid = game.stage.getGrid();
    left = Math.floor(this.x);
    right = Math.ceil(this.x + this.width - 1);
    y = Math.floor(this.y + this.height);
    for (x = _i = left; left <= right ? _i <= right : _i >= right; x = left <= right ? ++_i : --_i) {
      if (this.validCoordinates(x, y)) {
        if ((_ref = grid[x][y]) != null ? _ref.isHittable() : void 0) {
          return true;
        }
      }
    }
    return false;
  };

  Entity.prototype.checkHittingToBlock = function(a, b, c, d) {
    var grid, x, y, _i, _j, _ref;
    grid = game.stage.getGrid();
    for (x = _i = a; a <= b ? _i <= b : _i >= b; x = a <= b ? ++_i : --_i) {
      for (y = _j = c; c <= d ? _j <= d : _j >= d; y = c <= d ? ++_j : --_j) {
        if (this.validCoordinates(x, y)) {
          if ((_ref = grid[x][y]) != null ? _ref.isHittable() : void 0) {
            return grid[x][y];
          }
        }
      }
    }
    return null;
  };

  Entity.prototype.moveX = function() {
    return this.x += this.speedX;
  };

  Entity.prototype.moveY = function() {
    if (!this.flying) {
      this.speedY += config.gravity;
    }
    return this.y += this.speedY;
  };

  Entity.prototype.validCoordinates = function(x, y) {
    if ((0 <= x && x < game.stage.getWidth())) {
      if ((0 <= y && y < game.stage.getHeight())) {
        return true;
      }
    }
    return false;
  };

  Entity.prototype.doorHitted = function(block) {
    if (!(this instanceof Player)) {
      return;
    }
    if (!block.isActive()) {
      return;
    }
    return game.stage.changeLevel();
  };

  return Entity;

})();

Monster = (function(_super) {

  __extends(Monster, _super);

  function Monster(x, y, width, height) {
    Monster.__super__.constructor.call(this, x, y, width, height);
    this.score = 100;
    this.damage = 10;
  }

  Monster.prototype.getScore = function() {
    return this.score;
  };

  Monster.prototype.setScore = function(score) {
    this.score = score;
  };

  return Monster;

})(Entity);

BossMonster = (function(_super) {

  __extends(BossMonster, _super);

  function BossMonster(x, y, width, height) {
    BossMonster.__super__.constructor.call(this, x, y, width, height);
    this.score = 1000;
    this.damage = 30;
    this.health = 500;
    this.speedX = -0.1;
  }

  BossMonster.prototype.move = function() {
    if (this.speedX === 0) {
      if (this.facing === facing.left) {
        this.speedX = 0.1;
        this.facing = facing.right;
      } else {
        this.speedX = -0.1;
        this.facing = facing.left;
      }
    }
    return BossMonster.__super__.move.apply(this, arguments);
  };

  return BossMonster;

})(Monster);

Bullet = (function(_super) {

  __extends(Bullet, _super);

  function Bullet(x, y, width, height) {
    Bullet.__super__.constructor.call(this, x, y, width, height);
    this.unharmable = true;
    this.damage = config.bullet.damage;
    this.clipping = false;
    this.flying = true;
    this.hitted = false;
  }

  Bullet.prototype.getDamage = function() {
    return this.damage;
  };

  Bullet.prototype.setDamage = function(damage) {
    this.damage = damage;
  };

  Bullet.prototype.isHitted = function() {
    return this.hitted;
  };

  Bullet.prototype.setHitted = function(hitted) {
    this.hitted = hitted;
  };

  return Bullet;

})(Entity);

Player = (function(_super) {

  __extends(Player, _super);

  function Player() {
    var x, y;
    x = 2;
    y = 2;
    Player.__super__.constructor.call(this, x, y, config.player.width, config.player.height);
    this.health = 100;
    this.controllable = true;
    this.unharmable = false;
    this.hitTime = null;
    this.shooting = false;
    this.scores = 0;
  }

  Player.prototype.setControllable = function(controllable) {
    this.controllable = controllable;
  };

  Player.prototype.isShooting = function() {
    return this.shooting;
  };

  Player.prototype.setShooting = function(shooting) {
    this.shooting = shooting;
  };

  Player.prototype.getHitTime = function() {
    return this.hitTime;
  };

  Player.prototype.setHitTime = function(hitTime) {
    this.hitTime = hitTime;
  };

  Player.prototype.getScores = function() {
    return this.scores;
  };

  Player.prototype.setScores = function(scores) {
    this.scores = scores;
  };

  Player.prototype.addScores = function(score) {
    return this.scores += score;
  };

  Player.prototype.move = function() {
    if (this.controllable) {
      if (game.keyhandler.left() === game.keyhandler.right()) {
        this.speedX = 0;
      } else if (game.keyhandler.left()) {
        this.facing = facing.left;
        this.speedX = -config.player.speed;
      } else if (game.keyhandler.right()) {
        this.facing = facing.right;
        this.speedX = config.player.speed;
      }
      if (game.keyhandler.jump()) {
        if (this.onGround()) {
          if (game.keyhandler.tryJump()) {
            this.speedY = -config.player.jump;
          }
        }
      } else {
        if (this.speedY < 0) {
          this.speedY = 0;
        }
      }
      if (game.keyhandler.shoot()) {
        if (game.keyhandler.tryShoot()) {
          game.stage.shoot();
        }
      }
    }
    if (this.hitTime !== null) {
      if (game.tickCount < this.hitTime + config.player.time.nudge) {
        if (this.facing === facing.left) {
          this.speedX = config.player.damageSpeedX;
        } else {
          this.speedX = -config.player.damageSpeedX;
        }
      } else {
        this.controllable = true;
      }
    }
    return Player.__super__.move.apply(this, arguments);
  };

  Player.prototype.takeHit = function(monster) {
    this.hitTime = game.tickCount;
    this.speedY = config.player.damageSpeedY;
    this.controllable = false;
    this.unharmable = true;
    return this.health -= monster.getDamage();
  };

  return Player;

})(Entity);
