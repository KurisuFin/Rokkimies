



class Stage
	constructor: ->
		@levels = []
		@active = 0
		
	
	addLevel: (level) ->
		@levels.push(level)
	
	nextLevel: ->
		@active++
	
	
	getGrid: ->
		@levels[@active].getGrid()
	
	
	getWidth: ->
		@levels[@active].getWidth()
	
	
	getHeight: ->
		@levels[@active].getHeight()
	
		
	getMonsters: ->
		@levels[@active].getMonsters()
	
	addMonster: (monster) ->
		@levels[@active].addMonster(monster)
	
	removeMonster: (monster) ->
		@levels[@active].removeMonster(monster)
	
	removeDeadMonsters: ->
		@levels[@active].removeDeadMonsters()
	
	removeAllMonsters: ->
		for level in @levels
			level.removeAllMonsters()

	
	
	getBullets: ->
		@levels[@active].getBullets()
	
	removeHittedBullets: ->
		@levels[@active].removeHittedBullets()
	
	removeAllBullets: ->
		for level in @levels
			level.removeAllBullets()
	
	
	shoot: ->
		@levels[@active].shoot()
	
	
	changeLevel: ->
		###
		level = @levels[@active]
		neighbor = @levels[@active+1]
		renderChangingLevel(level.getGrid(), neighbor.getGrid())
		###
		
		@nextLevel()
		game.player.setX(1)



class Level	
	constructor: (@width) ->
		@width ?= config.level.minWidth
		@width = config.level.minWidth if @width < config.level.minWidth
		@height = config.level.height
		@grid = []
		@monsters = []
		@bullets = []
		
		for i in [0..@width-1]
			@grid[i] = []
		
		for j in [0..@height-1]
			for i in [0..@width-1]
				@grid[i][j] = new AirBlock(i, j)
	
	
	addBlock: (block) ->
		[x, y] = block.getPosition()
		@grid[x][y] = block
	
	setToAir: (x, y) ->
		@addBlock(new AirBlock(x, y))
	
	setToWall: (x, y) ->
		@addBlock(new WallBlock(x, y))
	
	setToDoor: (x, y, active) ->
		@addBlock(new DoorBlock(x, y, active))
	

	getType: (x, y) ->
		@grid[x][y].getType()
	
	isHittable: (x, y) ->
		@grid[x][y].isHittable()
	
	
	getGrid: ->
		@grid
	
	getWidth: ->
		@width
	
	getHeight: ->
		@height
	
		
	getMonsters: ->
		@monsters
	
	addMonster: (monster) ->
		@monsters.push(monster)
	
	removeMonster: ->
		console.log("Not implemented")
	
	removeDeadMonsters: ->
		for i in [0..@monsters.length]
			if @monsters[i]?.getHealth() <= 0
				game.player.addScores(@monsters[i].getScore())
				@monsters.splice(i, 1)
	
	removeAllMonsters: ->
		@monsters = []
	
	
	getBullets: ->
		@bullets
	
	removeHittedBullets: ->
		for i in [0..@bullets.length]
			if @bullets[i]?.isHitted()
				@bullets.splice(i, 1)
	
	removeAllBullets: ->
		@bullets = []
	
	
	
	shoot: ->
		[playerX, playerY] = game.player.getPosition()
		[playerWidth, playerHeight] = game.player.getSize()
		side = game.player.getFacing()
		
		if (side == facing.left)
			x = playerX + config.bullet.x - config.bullet.size
			speed = -config.bullet.speed
		else
			x = playerX + playerWidth - config.bullet.x
			speed = config.bullet.speed
		
		y = playerY + (playerHeight / 2) + (playerHeight / 2 * config.bullet.y) - (config.bullet.size / 2)
		
		bullet = new Bullet(x, y, config.bullet.size, config.bullet.size)
		bullet.setSpeedX(speed)
		bullet.setSpeedY(0)
		
		@bullets.push(bullet)



class Block	
	getPosition: ->
		[@x, @y]
	
	getX: ->
		@x
	
	getY: ->
		@y
	
	isHittable: ->
		@hittable
	
	getColor: ->
		@color
	
	isTransparent: ->
		@transparent
	



class AirBlock extends Block
	constructor: (@x, @y) ->
		@hittable = false
		@color = color.block.air
		@transparent = true



class WallBlock extends Block
	constructor: (@x, @y) ->
		@hittable = true
		@color = color.block.wall
		@transparent = false



class DoorBlock extends Block
	constructor: (@x, @y, @active) ->
		@active ?= false
		@hittable = true
		@color = color.block.door
		@transparent = false
	
	isActive: ->
		@active
	
	setActive: (@active) ->