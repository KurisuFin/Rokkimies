var block, config, debug, game, highscores, menu, screen, startStage;

debug = {
  active: true,
  x: 5,
  y: 0,
  color: "rgb(0, 0, 0)",
  font: "10px Arial",
  align: "left",
  baseline: "alphabetic"
};

block = {
  size: 40,
  type: {
    air: "air",
    wall: "wall",
    door: "door"
  }
};

screen = {
  width: $("#canvas")[0].width,
  height: $("#canvas")[0].height,
  context: $("#canvas")[0].getContext("2d")
};

menu = {
  start: "start",
  stageSelection: "stageSelection",
  game: "game",
  end: "end"
};

config = {
  player: {
    width: 1.5,
    height: 1.5,
    speed: 0.13,
    jump: 0.48,
    damageSpeedX: 0.1,
    damageSpeedY: -0.3,
    time: {
      nudge: 20,
      unharmable: 50
    }
  },
  level: {
    height: 15,
    minWidth: 20
  },
  gravity: 0.03,
  bullet: {
    x: 0.2,
    y: 0.0,
    size: 0.3,
    speed: 0.2,
    damage: 10
  }
};

window.requestAnimFrame = (function() {
  return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback) {
    return window.setTimeout(callback, 1000 / 60);
  };
})();

startStage = function() {
  game.player = new Player();
  game.stage = createTestStage();
  return game.menu = menu.game;
};

game = {
  player: {},
  menu: menu.start,
  stage: {},
  highscores: {},
  keyhandler: {},
  tickCount: 0,
  init: function() {
    return this.keyhandler = new Keyhandler();
  },
  logic: function() {
    if (this.menu === menu.start) {
      if (this.keyhandler.start()) {
        if (this.keyhandler.tryStart()) {
          startStage();
        }
      }
    }
    if (this.menu === menu.game) {
      moveEntities();
      checkCollisions();
      removeEntities();
      if (this.player.getY() > this.stage.getHeight() + 3) {
        this.player.setHealth(0);
      }
      if (this.keyhandler.kill()) {
        this.player.setHealth(0);
      }
      if (this.player.getHealth() <= 0) {
        this.menu = menu.end;
        highscores.add(this.player.getScores());
      }
      if (this.tickCount > this.player.getHitTime() + config.player.time.unharmable) {
        this.player.setUnharmable(false);
      }
    }
    if (this.menu === menu.end) {
      if (this.keyhandler.start()) {
        if (this.keyhandler.tryStart()) {
          return this.menu = menu.start;
        }
      }
    }
  },
  render: function() {
    return render();
  },
  tick: function() {
    ++game.tickCount;
    game.logic();
    game.render();
    return requestAnimFrame(game.tick);
  }
};

highscores = {
  scores: [],
  add: function(newScores) {
    var i, temp, _i, _ref, _results;
    this.scores.push(newScores);
    for (i = _i = _ref = this.scores.length - 2; _ref <= 0 ? _i <= 0 : _i >= 0; i = _ref <= 0 ? ++_i : --_i) {
      if (this.scores[i + 1] > this.scores[i]) {
        temp = this.scores[i];
        this.scores[i] = this.scores[i + 1];
        this.scores[i + 1] = temp;
      }
    }
    _results = [];
    while (!(this.scores.length <= 10)) {
      _results.push(this.scores.pop());
    }
    return _results;
  }
};

$(document).ready(function() {
  game.init();
  return game.tick();
});
