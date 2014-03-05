debug =
	active: true
	x: 5
	y: 0
	color: "rgb(0, 0, 0)"
	font: "10px Arial"
	align: "left"
	baseline: "alphabetic"

block =
	size: 40
	type:
		air: "air"
		wall: "wall"
		door: "door"

screen =
	width: $("#canvas")[0].width
	height: $("#canvas")[0].height
	context: $("#canvas")[0].getContext("2d")

menu =
	start: "start"
	stageSelection: "stageSelection"
	game: "game"
	end: "end"

config =
	player:
		width: 1.5
		height: 1.5
		speed: 0.13
		jump: 0.48
		damageSpeedX: 0.1
		damageSpeedY: -0.3
		time:
			nudge: 20
			unharmable: 50
	level:
		height: 15
		minWidth: 20
	gravity: 0.03
	bullet:
		x: 0.2
		y: 0.0			# -1 top of player, 0 middle, 1 bottom
		size: 0.3
		speed: 0.2
		damage: 10
		


window.requestAnimFrame = (->
	return	window.requestAnimationFrame				|| 
					window.webkitRequestAnimationFrame	|| 
					window.mozRequestAnimationFrame			|| 
					window.oRequestAnimationFrame				|| 
					window.msRequestAnimationFrame			||
					(callback) ->
						window.setTimeout(callback, 1000/60)
)()



startStage = ->
	game.player = new Player()
	game.stage = createTestStage()
	game.menu = menu.game



game =
	player: {}
	menu: menu.start
	stage: {}
	highscores: {}
	keyhandler: {}
	tickCount: 0
	
	init: ->
		@keyhandler = new Keyhandler()
		
	logic: ->
		if @menu == menu.start
			if @keyhandler.start()
				if @keyhandler.tryStart()
					startStage()
		
		if @menu == menu.game
			moveEntities()
			checkCollisions()
			removeEntities()
			
			if @player.getY() > @stage.getHeight() + 3
				@player.setHealth(0)
			
			if @keyhandler.kill()
				@player.setHealth(0)
			
			if @player.getHealth() <= 0
				@menu = menu.end
				highscores.add(@player.getScores())
			
			if @tickCount > @player.getHitTime() + config.player.time.unharmable
				@player.setUnharmable(false)
		
		
		if @menu == menu.end
			if @keyhandler.start()
				if @keyhandler.tryStart()
					@menu = menu.start
		
	render: ->
		render()
	
	tick: ->
		++game.tickCount
		game.logic() 
		game.render()
		requestAnimFrame(game.tick)



highscores =
	scores: []
	
	add: (newScores) ->
		@scores.push(newScores)
		
		for i in [@scores.length-2..0]
			if @scores[i+1] > @scores[i]
				temp = @scores[i]
				@scores[i] = @scores[i+1]
				@scores[i+1] = temp
		
		@scores.pop() until @scores.length <= 10



$(document).ready ->
	game.init()
	game.tick()


