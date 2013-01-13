var Keyhandler;

Keyhandler = (function() {
  var button;

  button = {
    up: 38,
    down: 40,
    left: 37,
    right: 39,
    shoot: 88,
    jump: 90,
    start: 13,
    kill: 75
  };

  function Keyhandler() {
    var _this = this;
    this.keys = new Array();
    this.buttonReleased = new Array();
    this.reset();
    $("#canvas").bind("click", function(event) {});
    $(document).bind("keydown", function(event) {
      return _this.keys[event.which] = true;
    });
    $(document).bind("keyup", function(event) {
      _this.keys[event.which] = false;
      return _this.buttonReleased[event.which] = true;
    });
  }

  Keyhandler.prototype.reset = function() {
    var i, _i, _results;
    _results = [];
    for (i = _i = 0; _i <= 255; i = ++_i) {
      this.keys[i] = false;
      _results.push(this.buttonReleased[i] = true);
    }
    return _results;
  };

  Keyhandler.prototype.up = function() {
    return this.keys[button.up];
  };

  Keyhandler.prototype.down = function() {
    return this.keys[button.down];
  };

  Keyhandler.prototype.left = function() {
    return this.keys[button.left];
  };

  Keyhandler.prototype.right = function() {
    return this.keys[button.right];
  };

  Keyhandler.prototype.shoot = function() {
    return this.keys[button.shoot];
  };

  Keyhandler.prototype.jump = function() {
    return this.keys[button.jump];
  };

  Keyhandler.prototype.start = function() {
    return this.keys[button.start];
  };

  Keyhandler.prototype.kill = function() {
    return this.keys[button.kill];
  };

  Keyhandler.prototype.tryButton = function(button) {
    if (!this.buttonReleased[button]) {
      return false;
    }
    this.buttonReleased[button] = false;
    return true;
  };

  Keyhandler.prototype.tryJump = function() {
    return this.tryButton(button.jump);
  };

  Keyhandler.prototype.tryShoot = function() {
    return this.tryButton(button.shoot);
  };

  Keyhandler.prototype.tryStart = function() {
    return this.tryButton(button.start);
  };

  return Keyhandler;

})();
