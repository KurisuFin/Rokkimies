

createTestStage = ->
	level = new Level(30)
	
	for i in [2..level.getWidth()-1]
		level.setToWall(i, 10)
	
	level.setToWall(17, 11)
	level.setToWall(17, 12)
	level.setToWall(17, 13)
	
	level.setToWall(1, 8)
	level.setToWall(3, 4)
	level.setToWall(2, 5)
	level.setToWall(4, 9)
	level.setToWall(10, 7)
	level.setToWall(14, 6)
	
	level.setToWall(level.getWidth()-1, 6)
	
	for i in [7..9]
		level.setToDoor(level.getWidth()-1, i, true)
	
	
	monster1 = new Monster(5, 5, 1.2, 1.2)
	monster1.setSpeedX(0)
	monster1.setScore(60)
	
	monster2 = new Monster(7, 1, 0.9, 0.9)
	monster2.setSpeedX(0.07)
	monster2.setSpeedY(-0.3)
	monster2.setDamage(60)
	
	level.addMonster(monster1)
	level.addMonster(monster2)
	
	
	
	passage = new Level(20)
	
	for i in [0..passage.getWidth()-1]
		passage.setToWall(i, 6)
		passage.setToWall(i, 10)
	
	for i in [7..9]
		passage.setToDoor(0, i)
		passage.setToDoor(passage.getWidth()-1, i, true)
	
	
	
	bossLevel = new Level()
	
	for i in [0..bossLevel.getWidth()-1]
		bossLevel.setToWall(i, 0)
		bossLevel.setToWall(i, bossLevel.getHeight()-1)
	
	for i in [0..bossLevel.getHeight()-1]
		bossLevel.setToWall(0, i)
		bossLevel.setToWall(bossLevel.getWidth()-1, i)
	
	for i in [7..9]
		bossLevel.setToDoor(0, i)
	
	
	boss = new BossMonster(15, 11, 2, 2)
	bossLevel.addMonster(boss)
	
	
	stage = new Stage()
	stage.addLevel(level)
	stage.addLevel(passage)
	stage.addLevel(bossLevel)
	
	
	
	return stage