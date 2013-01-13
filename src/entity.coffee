facing =
	left: "left"
	right: "right"

state =
	stand: "stand"
	run: "run"
	jump: "jump"
	climb: "climb"
	damage: "damage"
	dead: "dead"


moveEntities = ->
	game.player.move()
	
	for monster in game.stage.getMonsters()
		monster.move()
	
	for bullet in game.stage.getBullets()
		bullet.move()



checkCollisions = ->
	for bullet in game.stage.getBullets()
		for monster in game.stage.getMonsters()
			if checkCollision(bullet, monster)
				monster.reduceHealth(bullet.getDamage()) unless monster.isUnharmable()
				bullet.setHitted(true)
	
	player = game.player
	
	if !player.isUnharmable()
		for monster in game.stage.getMonsters()
			if checkCollision(player, monster)
				player.takeHit(monster)
			
			
	
	

checkCollision = (entity1, entity2) ->
	[x1, y1] = entity1.getPosition()
	[width1, height1] = entity1.getSize()
	
	[x2, y2] = entity2.getPosition()
	[width2, height2] = entity2.getSize()
	
	if x1 <= x2 <= x1+width1 || x2 <= x1 <= x2+width2
		if y1 <= y2 <= y1+height1 || y2 <= y1 <= y2+height2
			return true
	
	return false


removeEntities = ->
	game.stage.removeHittedBullets()
	game.stage.removeDeadMonsters()
	

class Entity
	constructor: (@x, @y, @width, @height) ->
		@speedX = 0
		@speedY = 0
		@health = 30
		@unharmable = false
		@damage = 0
		@clipping = true
		@flying = false
		@facing = facing.left
		@state = state.stand
	
	
	getPosition: ->
		[@x, @y]
	
	getX: ->
		@x
	
	setX: (@x) ->
	
	getY: ->
		@y
	
	setY: (@y) ->
	
	
	getSize: ->
		[@width, @height]
	
	
	getSpeed: ->
		[@speedX, @speedY]
	
	getSpeedX: ->
		@speedX
	
	getSpeedY: ->
		@speedY
	
	setSpeedX: (@speedX) ->
	
	setSpeedY: (@speedY) ->
	
	
	getHealth: ->
		@health
	
	setHealth: (@health) ->
	
	reduceHealth: (amount) ->
		@health -= amount
	
	
	isUnharmable: ->
		@unharmable
	
	setUnharmable: (@unharmable) ->
	
	
	getDamage: ->
		@damage
	
	setDamage: (@damage) ->
	
	
	getFacing: ->
		@facing
	
	setFacing: (@facing) ->
	
	
	getState: ->
		@state
	
	setState: (@state) ->
	
		
	
	
	move: ->
		if !@clipping
			@moveX()
			@moveY()
			return
		
		if @speedX < 0
			@moveLeft()
		else if @speedX > 0
			@moveRight()
		
		if @getSpeedY() > 0
			@moveDown()
		else if @getSpeedY() == 0
			@moveY() unless @onGround()
		else if @getSpeedY() < 0
			@moveUp()
	
	
	
	moveLeft: ->
		left = Math.floor(@x)
		@moveX()
		right = Math.floor(@x)
		
		top = Math.floor(@y)
		bottom = Math.ceil(@y + @height - 1)
		
		block = @checkHittingToBlock(right, left, top, bottom)
		
		if block != null
			@x = Math.floor(block.getX()) + @width + (1 - @width)
			@speedX = 0
			if block instanceof DoorBlock
				@doorHitted(block)
	
	
	moveRight: ->
		left = Math.floor(@x + @width)
		@moveX()
		right = Math.floor(@x + @width)
		
		top = Math.floor(@y)
		bottom = Math.ceil(@y + @height - 1)
		
		block = @checkHittingToBlock(left, right, top, bottom)
		
		if block != null
			@x = Math.floor(block.getX()) - @width
			@speedX = 0
			if block instanceof DoorBlock
				@doorHitted(block)
				
	
	moveUp: ->
		bottom = Math.floor(@y)
		@moveY()
		top = Math.floor(@y)
		
		left = Math.floor(@x)
		right = Math.ceil(@x + @width - 1)
		
		block = @checkHittingToBlock(left, right, bottom, top)
		
		if block != null
			@y = Math.floor(block.getY() + 1)
			@speedY = 0
			if block instanceof DoorBlock
				@doorHitted(block)
	
	moveDown: ->
		top = Math.floor(@y + @height)
		@moveY()
		bottom = Math.floor(@y + @height)
		
		left = Math.floor(@x)
		right = Math.ceil(@x + @width - 1)
		
		block = @checkHittingToBlock(left, right, top, bottom)
		
		if block != null
			@y = Math.floor(block.getY()) - @height
			@speedY = 0
			if block instanceof DoorBlock
				@doorHitted(block)
		
	
	onGround: ->
		grid = game.stage.getGrid()
		left = Math.floor(@x)
		right = Math.ceil(@x + @width - 1)
		y = Math.floor(@y + @height)
		
		for x in [left..right]
			if @validCoordinates(x, y)
				if grid[x][y]?.isHittable()
					return true
		
		return false
	
	
	checkHittingToBlock: (a, b, c, d) ->
		grid = game.stage.getGrid()
		
		for x in [a..b]
			for y in [c..d]
				if @validCoordinates(x, y)
					if grid[x][y]?.isHittable()
						return grid[x][y]
		
		return null
	
	
	moveX: ->
		@x += @speedX
	
	moveY: ->
		@speedY += config.gravity unless @flying
		@y += @speedY
	
	
	validCoordinates: (x, y) ->
		if 0 <= x < game.stage.getWidth()
			if 0 <= y < game.stage.getHeight()
				return true
		
		return false
		
	
	doorHitted: (block) ->
		return unless this instanceof Player
		return unless block.isActive()
		
		game.stage.changeLevel()



class Monster extends Entity
	constructor: (x, y, width, height) ->
		super(x, y, width, height)
		@score = 100
		@damage = 10
	
	getScore: ->
		@score
	
	setScore: (@score) ->
	



class BossMonster extends Monster
	constructor: (x, y, width, height) ->
		super(x, y, width, height)
		@score = 1000
		@damage = 30
		@health = 500
		@speedX = -0.1
	
	move: ->
		if @speedX == 0
			if @facing == facing.left
				@speedX = 0.1
				@facing = facing.right
			else
				@speedX = -0.1
				@facing = facing.left
		
		super



class Bullet extends Entity
	constructor: (x, y, width, height) ->
		super(x, y, width, height)
		@unharmable = true
		@damage = config.bullet.damage
		@clipping = false
		@flying = true
		@hitted = false
	
	
	getDamage: ->
		@damage
	
	setDamage: (@damage) ->
	
	isHitted: ->
		@hitted
	
	setHitted: (@hitted) ->

	



class Player extends Entity
	constructor: ->
		x = 2
		y = 2
		
		super(x, y, config.player.width, config.player.height)
		@health = 100
		@controllable = true
		@unharmable = false
		@hitTime = null
		@shooting = false
		@scores = 0
	
	
	setControllable: (@controllable) ->
	
	
	isShooting: ->
		@shooting
	
	setShooting: (@shooting) ->
	
	
	getHitTime: ->
		@hitTime
	
	setHitTime: (@hitTime) ->
	
	
	getScores: ->
		@scores
	
	setScores: (@scores) ->
	
	addScores: (score) ->
		@scores += score
	
	
	move: ->
		if @controllable
			if game.keyhandler.left() == game.keyhandler.right()	# XNOR
				@speedX = 0
			else if game.keyhandler.left()
				@facing = facing.left
				@speedX = -config.player.speed
			else if game.keyhandler.right()
				@facing = facing.right
				@speedX = config.player.speed

			if game.keyhandler.jump()
					if @onGround()
						if game.keyhandler.tryJump()
							@speedY = -config.player.jump
			else
					if @speedY < 0
						@speedY = 0
			
			if game.keyhandler.shoot()
				if game.keyhandler.tryShoot()
					game.stage.shoot()
		
		
		if @hitTime != null
			if game.tickCount < @hitTime + config.player.time.nudge
				if @facing == facing.left
					@speedX = config.player.damageSpeedX
				else
					@speedX = -config.player.damageSpeedX
			else
				@controllable = true
			
			
		super
	
	
	
	takeHit: (monster) ->
		@hitTime = game.tickCount
		@speedY = config.player.damageSpeedY
		@controllable = false
		@unharmable = true
		@health -= monster.getDamage()

