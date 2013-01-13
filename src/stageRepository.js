var createTestStage;

createTestStage = function() {
  var boss, bossLevel, i, level, monster1, monster2, passage, stage, _i, _j, _k, _l, _m, _n, _o, _ref, _ref1, _ref2, _ref3;
  level = new Level(30);
  for (i = _i = 2, _ref = level.getWidth() - 1; 2 <= _ref ? _i <= _ref : _i >= _ref; i = 2 <= _ref ? ++_i : --_i) {
    level.setToWall(i, 10);
  }
  level.setToWall(17, 11);
  level.setToWall(17, 12);
  level.setToWall(17, 13);
  level.setToWall(1, 8);
  level.setToWall(3, 4);
  level.setToWall(2, 5);
  level.setToWall(4, 9);
  level.setToWall(10, 7);
  level.setToWall(14, 6);
  level.setToWall(level.getWidth() - 1, 6);
  for (i = _j = 7; _j <= 9; i = ++_j) {
    level.setToDoor(level.getWidth() - 1, i, true);
  }
  monster1 = new Monster(5, 5, 1.2, 1.2);
  monster1.setSpeedX(0);
  monster1.setScore(60);
  monster2 = new Monster(7, 1, 0.9, 0.9);
  monster2.setSpeedX(0.07);
  monster2.setSpeedY(-0.3);
  monster2.setDamage(60);
  level.addMonster(monster1);
  level.addMonster(monster2);
  passage = new Level(20);
  for (i = _k = 0, _ref1 = passage.getWidth() - 1; 0 <= _ref1 ? _k <= _ref1 : _k >= _ref1; i = 0 <= _ref1 ? ++_k : --_k) {
    passage.setToWall(i, 6);
    passage.setToWall(i, 10);
  }
  for (i = _l = 7; _l <= 9; i = ++_l) {
    passage.setToDoor(0, i);
    passage.setToDoor(passage.getWidth() - 1, i, true);
  }
  bossLevel = new Level();
  for (i = _m = 0, _ref2 = bossLevel.getWidth() - 1; 0 <= _ref2 ? _m <= _ref2 : _m >= _ref2; i = 0 <= _ref2 ? ++_m : --_m) {
    bossLevel.setToWall(i, 0);
    bossLevel.setToWall(i, bossLevel.getHeight() - 1);
  }
  for (i = _n = 0, _ref3 = bossLevel.getHeight() - 1; 0 <= _ref3 ? _n <= _ref3 : _n >= _ref3; i = 0 <= _ref3 ? ++_n : --_n) {
    bossLevel.setToWall(0, i);
    bossLevel.setToWall(bossLevel.getWidth() - 1, i);
  }
  for (i = _o = 7; _o <= 9; i = ++_o) {
    bossLevel.setToDoor(0, i);
  }
  boss = new BossMonster(15, 11, 2, 2);
  bossLevel.addMonster(boss);
  stage = new Stage();
  stage.addLevel(level);
  stage.addLevel(passage);
  stage.addLevel(bossLevel);
  return stage;
};
