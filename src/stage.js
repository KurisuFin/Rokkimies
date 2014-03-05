var AirBlock, Block, DoorBlock, Level, Stage, WallBlock,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Stage = (function() {
  function Stage() {
    this.levels = [];
    this.active = 0;
  }

  Stage.prototype.addLevel = function(level) {
    return this.levels.push(level);
  };

  Stage.prototype.nextLevel = function() {
    return this.active++;
  };

  Stage.prototype.getGrid = function() {
    return this.levels[this.active].getGrid();
  };

  Stage.prototype.getWidth = function() {
    return this.levels[this.active].getWidth();
  };

  Stage.prototype.getHeight = function() {
    return this.levels[this.active].getHeight();
  };

  Stage.prototype.getMonsters = function() {
    return this.levels[this.active].getMonsters();
  };

  Stage.prototype.addMonster = function(monster) {
    return this.levels[this.active].addMonster(monster);
  };

  Stage.prototype.removeMonster = function(monster) {
    return this.levels[this.active].removeMonster(monster);
  };

  Stage.prototype.removeDeadMonsters = function() {
    return this.levels[this.active].removeDeadMonsters();
  };

  Stage.prototype.removeAllMonsters = function() {
    var level, _i, _len, _ref, _results;
    _ref = this.levels;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      level = _ref[_i];
      _results.push(level.removeAllMonsters());
    }
    return _results;
  };

  Stage.prototype.getBullets = function() {
    return this.levels[this.active].getBullets();
  };

  Stage.prototype.removeHittedBullets = function() {
    return this.levels[this.active].removeHittedBullets();
  };

  Stage.prototype.removeAllBullets = function() {
    var level, _i, _len, _ref, _results;
    _ref = this.levels;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      level = _ref[_i];
      _results.push(level.removeAllBullets());
    }
    return _results;
  };

  Stage.prototype.shoot = function() {
    return this.levels[this.active].shoot();
  };

  Stage.prototype.changeLevel = function() {
    this.nextLevel();
    return game.player.setX(1);
  };

  return Stage;

})();

Level = (function() {
  function Level(width) {
    var i, j, _i, _j, _k, _ref, _ref1, _ref2;
    this.width = width;
    if (this.width == null) {
      this.width = config.level.minWidth;
    }
    if (this.width < config.level.minWidth) {
      this.width = config.level.minWidth;
    }
    this.height = config.level.height;
    this.grid = [];
    this.monsters = [];
    this.bullets = [];
    for (i = _i = 0, _ref = this.width - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
      this.grid[i] = [];
    }
    for (j = _j = 0, _ref1 = this.height - 1; 0 <= _ref1 ? _j <= _ref1 : _j >= _ref1; j = 0 <= _ref1 ? ++_j : --_j) {
      for (i = _k = 0, _ref2 = this.width - 1; 0 <= _ref2 ? _k <= _ref2 : _k >= _ref2; i = 0 <= _ref2 ? ++_k : --_k) {
        this.grid[i][j] = new AirBlock(i, j);
      }
    }
  }

  Level.prototype.addBlock = function(block) {
    var x, y, _ref;
    _ref = block.getPosition(), x = _ref[0], y = _ref[1];
    return this.grid[x][y] = block;
  };

  Level.prototype.setToAir = function(x, y) {
    return this.addBlock(new AirBlock(x, y));
  };

  Level.prototype.setToWall = function(x, y) {
    return this.addBlock(new WallBlock(x, y));
  };

  Level.prototype.setToDoor = function(x, y, active) {
    return this.addBlock(new DoorBlock(x, y, active));
  };

  Level.prototype.getType = function(x, y) {
    return this.grid[x][y].getType();
  };

  Level.prototype.isHittable = function(x, y) {
    return this.grid[x][y].isHittable();
  };

  Level.prototype.getGrid = function() {
    return this.grid;
  };

  Level.prototype.getWidth = function() {
    return this.width;
  };

  Level.prototype.getHeight = function() {
    return this.height;
  };

  Level.prototype.getMonsters = function() {
    return this.monsters;
  };

  Level.prototype.addMonster = function(monster) {
    return this.monsters.push(monster);
  };

  Level.prototype.removeMonster = function() {
    return console.log("Not implemented");
  };

  Level.prototype.removeDeadMonsters = function() {
    var i, _i, _ref, _ref1, _results;
    _results = [];
    for (i = _i = 0, _ref = this.monsters.length; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
      if (((_ref1 = this.monsters[i]) != null ? _ref1.getHealth() : void 0) <= 0) {
        game.player.addScores(this.monsters[i].getScore());
        _results.push(this.monsters.splice(i, 1));
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };

  Level.prototype.removeAllMonsters = function() {
    return this.monsters = [];
  };

  Level.prototype.getBullets = function() {
    return this.bullets;
  };

  Level.prototype.removeHittedBullets = function() {
    var i, _i, _ref, _ref1, _results;
    _results = [];
    for (i = _i = 0, _ref = this.bullets.length; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
      if ((_ref1 = this.bullets[i]) != null ? _ref1.isHitted() : void 0) {
        _results.push(this.bullets.splice(i, 1));
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };

  Level.prototype.removeAllBullets = function() {
    return this.bullets = [];
  };

  Level.prototype.shoot = function() {
    var bullet, playerHeight, playerWidth, playerX, playerY, side, speed, x, y, _ref, _ref1;
    _ref = game.player.getPosition(), playerX = _ref[0], playerY = _ref[1];
    _ref1 = game.player.getSize(), playerWidth = _ref1[0], playerHeight = _ref1[1];
    side = game.player.getFacing();
    if (side === facing.left) {
      x = playerX + config.bullet.x - config.bullet.size;
      speed = -config.bullet.speed;
    } else {
      x = playerX + playerWidth - config.bullet.x;
      speed = config.bullet.speed;
    }
    y = playerY + (playerHeight / 2) + (playerHeight / 2 * config.bullet.y) - (config.bullet.size / 2);
    bullet = new Bullet(x, y, config.bullet.size, config.bullet.size);
    bullet.setSpeedX(speed);
    bullet.setSpeedY(0);
    return this.bullets.push(bullet);
  };

  return Level;

})();

Block = (function() {
  function Block() {}

  Block.prototype.getPosition = function() {
    return [this.x, this.y];
  };

  Block.prototype.getX = function() {
    return this.x;
  };

  Block.prototype.getY = function() {
    return this.y;
  };

  Block.prototype.isHittable = function() {
    return this.hittable;
  };

  Block.prototype.getColor = function() {
    return this.color;
  };

  Block.prototype.isTransparent = function() {
    return this.transparent;
  };

  return Block;

})();

AirBlock = (function(_super) {
  __extends(AirBlock, _super);

  function AirBlock(x, y) {
    this.x = x;
    this.y = y;
    this.hittable = false;
    this.color = color.block.air;
    this.transparent = true;
  }

  return AirBlock;

})(Block);

WallBlock = (function(_super) {
  __extends(WallBlock, _super);

  function WallBlock(x, y) {
    this.x = x;
    this.y = y;
    this.hittable = true;
    this.color = color.block.wall;
    this.transparent = false;
  }

  return WallBlock;

})(Block);

DoorBlock = (function(_super) {
  __extends(DoorBlock, _super);

  function DoorBlock(x, y, active) {
    this.x = x;
    this.y = y;
    this.active = active;
    if (this.active == null) {
      this.active = false;
    }
    this.hittable = true;
    this.color = color.block.door;
    this.transparent = false;
  }

  DoorBlock.prototype.isActive = function() {
    return this.active;
  };

  DoorBlock.prototype.setActive = function(active) {
    this.active = active;
  };

  return DoorBlock;

})(Block);
