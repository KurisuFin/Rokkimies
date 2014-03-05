var color, draw, drawBackground, drawBlocks, drawBullets, drawDebugInfo, drawDebugNotification, drawEndTexts, drawHelp, drawHighScores, drawMonsters, drawPlayer, drawScores, drawTitle, locationFix, render;

color = {
  background: {
    start: "rgb(50, 50, 50)",
    stageSelection: "rgb(180, 180, 255)",
    game: "rgb(255, 255, 255)",
    end: "rgb(0, 0, 0)"
  },
  block: {
    air: "rgb(255, 255, 255)",
    wall: "rgb(150, 150, 150)",
    door: "rgb(80, 80, 100)"
  },
  entity: {
    player: "rgb(150, 150, 255)",
    bullet: "rgb(50, 50, 240)",
    monster: "rgb(50, 50, 50)"
  },
  menu: {
    start: {
      title: "rgb(230, 230, 255)",
      highscores: "rgb(255, 255, 255)"
    },
    game: {
      text: "rgb(0, 0, 0)"
    },
    end: {
      text: "rgb(255, 0, 0)",
      scores: "rgb(255, 255, 255)"
    }
  }
};

render = function() {
  if (game.menu === menu.start) {
    drawBackground(color.background.start);
    drawTitle();
    drawHighScores();
    drawHelp();
    if (debug.active) {
      drawDebugNotification();
    }
  }
  if (game.menu === menu.game) {
    drawBackground(color.background.game);
    drawBlocks();
    drawMonsters();
    drawPlayer();
    drawBullets();
    drawScores();
    if (debug.active) {
      drawDebugInfo();
    }
  }
  if (game.menu === menu.end) {
    drawBackground(color.background.end);
    return drawEndTexts();
  }
};

drawBackground = function(color) {
  var height, width;
  width = screen.width;
  height = screen.height;
  screen.context.fillStyle = color;
  return screen.context.fillRect(0, 0, width, height);
};

drawTitle = function() {
  var ctx;
  ctx = screen.context;
  ctx.fillStyle = color.menu.start.title;
  ctx.font = "80px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  return ctx.fillText("Rokkimies", screen.width / 2, 10);
};

drawHighScores = function() {
  var center, ctx, i, rowHeight, scores, y, _i, _ref, _results;
  center = screen.width / 2;
  y = 165;
  rowHeight = 15;
  ctx = screen.context;
  ctx.fillStyle = color.menu.start.highscores;
  ctx.font = "20px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  ctx.fillText("High Scores", center, y);
  ctx.font = "15px Arial";
  ctx.textAlign = "center";
  y += 10;
  scores = highscores.scores;
  if (scores.length > 0) {
    _results = [];
    for (i = _i = 0, _ref = scores.length - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
      _results.push(ctx.fillText(i + 1 + ": " + scores[i], center, y += rowHeight));
    }
    return _results;
  }
};

drawHelp = function() {
  var center, ctx, textSize, y;
  center = screen.width / 2;
  y = 500;
  textSize = 20;
  ctx = screen.context;
  ctx.fillStyle = "rgb(230, 230, 230)";
  ctx.font = textSize + "px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  ctx.fillText("Z jump", center, y += textSize);
  ctx.fillText("X shoot", center, y += textSize);
  return ctx.fillText("ENTER start", center, y += textSize);
};

drawDebugNotification = function() {
  var ctx;
  ctx = screen.context;
  ctx.fillStyle = "rgb(255, 255, 255)";
  ctx.font = "10px Arial";
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  return ctx.fillText("Debug info activated", 0, 10);
};

drawEndTexts = function() {
  var centerX, centerY, ctx;
  centerX = screen.width / 2;
  centerY = screen.height / 2;
  ctx = screen.context;
  ctx.fillStyle = color.menu.end.text;
  ctx.font = "50px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  ctx.fillText("Game over", centerX, centerY - 40);
  ctx.fillStyle = color.menu.end.scores;
  ctx.font = "20px Arial";
  return ctx.fillText("Scores " + game.player.getScores(), centerX, centerY + 20);
};

drawBlocks = function() {
  var grid, row, square, x, y, _i, _len, _results;
  grid = game.stage.getGrid();
  _results = [];
  for (_i = 0, _len = grid.length; _i < _len; _i++) {
    row = grid[_i];
    _results.push((function() {
      var _j, _len1, _ref, _results1;
      _results1 = [];
      for (_j = 0, _len1 = row.length; _j < _len1; _j++) {
        square = row[_j];
        if (!square.isTransparent()) {
          screen.context.fillStyle = square.getColor();
          _ref = square.getPosition(), x = _ref[0], y = _ref[1];
          _results1.push(draw(x, y, 1, 1));
        } else {
          _results1.push(void 0);
        }
      }
      return _results1;
    })());
  }
  return _results;
};

drawMonsters = function() {
  var fix, height, monster, width, x, y, _i, _len, _ref, _ref1, _ref2, _results;
  screen.context.fillStyle = color.entity.monster;
  _ref = game.stage.getMonsters();
  _results = [];
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    monster = _ref[_i];
    _ref1 = monster.getPosition(), x = _ref1[0], y = _ref1[1];
    _ref2 = monster.getSize(), width = _ref2[0], height = _ref2[1];
    draw(x, y, width, height);
    if (debug.active) {
      screen.context.fillStyle = debug.color;
      fix = locationFix();
      _results.push(screen.context.fillText("Health: " + monster.getHealth(), x * block.size + fix, y * block.size - 4));
    } else {
      _results.push(void 0);
    }
  }
  return _results;
};

drawBullets = function() {
  var bullet, height, width, x, y, _i, _len, _ref, _ref1, _ref2, _results;
  screen.context.fillStyle = color.entity.bullet;
  _ref = game.stage.getBullets();
  _results = [];
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    bullet = _ref[_i];
    _ref1 = bullet.getPosition(), x = _ref1[0], y = _ref1[1];
    _ref2 = bullet.getSize(), width = _ref2[0], height = _ref2[1];
    _results.push(draw(x, y, width, height));
  }
  return _results;
};

drawPlayer = function() {
  var height, width, x, y, _ref, _ref1;
  screen.context.fillStyle = color.entity.player;
  _ref = game.player.getPosition(), x = _ref[0], y = _ref[1];
  _ref1 = game.player.getSize(), width = _ref1[0], height = _ref1[1];
  return draw(x, y, width, height);
};

drawScores = function() {
  var ctx;
  ctx = screen.context;
  screen.context.fillStyle = color.menu.game.text;
  ctx.font = "25px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  return ctx.fillText("Scores " + game.player.getScores(), screen.width / 2, 10);
};

drawDebugInfo = function(context) {
  var ctx, facing, health, posX, posY, rowHeight, shooting, speedX, speedY, state, x, y, _ref, _ref1;
  posX = debug.x;
  posY = debug.y;
  rowHeight = 10;
  _ref = game.player.getPosition(), x = _ref[0], y = _ref[1];
  _ref1 = game.player.getSpeed(), speedX = _ref1[0], speedY = _ref1[1];
  health = game.player.getHealth();
  facing = game.player.getFacing();
  state = game.player.getState();
  shooting = game.player.isShooting();
  x = Math.round(100 * x) / 100;
  y = Math.round(100 * y) / 100;
  speedY = Math.round(100 * speedY) / 100;
  ctx = screen.context;
  ctx.fillStyle = debug.color;
  ctx.font = debug.font;
  ctx.textAlign = debug.align;
  ctx.textBaseline = debug.baseline;
  ctx.fillText("x:      " + x, posX, posY += rowHeight);
  ctx.fillText("y:      " + y, posX, posY += rowHeight);
  ctx.fillText("sp x:   " + speedX, posX, posY += rowHeight);
  ctx.fillText("sp y:   " + speedY, posX, posY += rowHeight);
  ctx.fillText("health: " + health, posX, posY += rowHeight);
  ctx.fillText("face:   " + facing, posX, posY += rowHeight);
  ctx.fillText("tick:   " + game.tickCount, posX, posY += rowHeight);
  return ctx.fillText("Press K to kill player", posX, posY += rowHeight);
};

draw = function(x, y, width, height) {
  var b, fix;
  b = block.size;
  fix = locationFix();
  return screen.context.fillRect(x * b + fix, y * b, width * b + 1, height * b);
};

locationFix = function() {
  var b, playerX;
  b = block.size;
  playerX = game.player.getX();
  if ((playerX + config.player.width / 2) * b < screen.width / 2) {
    return 0;
  } else if ((playerX + config.player.width / 2) * b > game.stage.getWidth() * b - screen.width / 2) {
    return screen.width - game.stage.getWidth() * b;
  } else {
    return screen.width / 2 - config.player.width / 2 * b - playerX * b;
  }
};
