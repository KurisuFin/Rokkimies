color =
	background:
		start: "rgb(50, 50, 50)"
		stageSelection: "rgb(180, 180, 255)"
		game: "rgb(255, 255, 255)"
		end: "rgb(0, 0, 0)"
	block:
		air: "rgb(255, 255, 255)"
		wall: "rgb(150, 150, 150)"
		door: "rgb(80, 80, 100)"
	entity:
		player: "rgb(150, 150, 255)"
		bullet: "rgb(50, 50, 240)"
		monster: "rgb(50, 50, 50)"
	menu:
		start:
			title: "rgb(230, 230, 255)"
			highscores: "rgb(255, 255, 255)"
		game:
			text: "rgb(0, 0, 0)"
		end:
			text: "rgb(255, 0, 0)"
			scores: "rgb(255, 255, 255)"


render = ->
	if (game.menu == menu.start)
		drawBackground(color.background.start)
		drawTitle()
		drawHighScores()
		drawHelp()
		drawDebugNotification() if debug.active
	
	if (game.menu == menu.game)
		drawBackground(color.background.game)
		drawBlocks()
		drawMonsters()
		drawPlayer()
		drawBullets()
		drawScores()
		drawDebugInfo() if debug.active
	
	if (game.menu == menu.end)
		drawBackground(color.background.end)
		drawEndTexts()



drawBackground = (color) ->
	width = screen.width
	height = screen.height
	screen.context.fillStyle = color
	screen.context.fillRect(0, 0, width, height)


drawTitle = ->
	ctx = screen.context
	ctx.fillStyle = color.menu.start.title
	ctx.font = "80px Arial"
	ctx.textAlign = "center"
	ctx.textBaseline = "top"
	ctx.fillText("Rokkimies", screen.width/2, 10)
	

drawHighScores = ->
	center = screen.width / 2
	y = 165
	rowHeight = 15
	
	ctx = screen.context
	ctx.fillStyle = color.menu.start.highscores
	ctx.font = "20px Arial"
	ctx.textAlign = "center"
	ctx.textBaseline = "alphabetic"
	ctx.fillText("High Scores", center, y)
	
	ctx.font = "15px Arial"
	ctx.textAlign = "center"
	
	y += 10
	
	scores = highscores.scores
	
	if scores.length > 0
		for i in [0..scores.length-1]
			ctx.fillText(i+1+": "+scores[i], center, y += rowHeight)


drawHelp = ->
	center = screen.width / 2
	y = 500
	textSize = 20
	
	ctx = screen.context
	ctx.fillStyle = "rgb(230, 230, 230)"
	ctx.font = textSize + "px Arial"
	ctx.textAlign = "center"
	ctx.textBaseline = "alphabetic"
	
	ctx.fillText("Z jump", center, y += textSize)
	ctx.fillText("X shoot", center, y += textSize)
	ctx.fillText("ENTER start", center, y += textSize)
	
	

drawDebugNotification = ->
	ctx = screen.context
	ctx.fillStyle = "rgb(255, 255, 255)"
	ctx.font = "10px Arial"
	ctx.textAlign = "left"
	ctx.textBaseline = "alphabetic"
	ctx.fillText("Debug info activated", 0, 10)


drawEndTexts = ->
	centerX = screen.width / 2
	centerY = screen.height / 2
	
	ctx = screen.context
	ctx.fillStyle = color.menu.end.text
	ctx.font = "50px Arial"
	ctx.textAlign = "center"
	ctx.textBaseline = "alphabetic"
	ctx.fillText("Game over", centerX, centerY - 40)
	
	ctx.fillStyle = color.menu.end.scores
	ctx.font = "20px Arial"
	ctx.fillText("Scores "+game.player.getScores(), centerX, centerY + 20)


drawBlocks = ->
	grid = game.stage.getGrid()
	
	for row in grid
		for square in row
			if !square.isTransparent()
				screen.context.fillStyle = square.getColor()
				[x, y] = square.getPosition()
				draw(x, y, 1, 1)



drawMonsters = ->
	screen.context.fillStyle = color.entity.monster
	
	for monster in game.stage.getMonsters()
		[x, y] = monster.getPosition()
		[width, height] = monster.getSize()
		draw(x, y, width, height)
		
		if debug.active
			screen.context.fillStyle = debug.color
			fix = locationFix()
			screen.context.fillText("Health: " + monster.getHealth(), x*block.size+fix, y*block.size-4)


drawBullets = ->
	screen.context.fillStyle = color.entity.bullet
	
	for bullet in game.stage.getBullets()
		[x, y] = bullet.getPosition()
		[width, height] = bullet.getSize()
		draw(x, y, width, height)


drawPlayer = ->
	screen.context.fillStyle = color.entity.player
	[x, y] = game.player.getPosition()
	[width, height] = game.player.getSize()
	draw(x, y, width, height)


drawScores = ->
	ctx = screen.context
	screen.context.fillStyle = color.menu.game.text
	ctx.font = "25px Arial"
	ctx.textAlign = "center"
	ctx.textBaseline = "top"
	ctx.fillText("Scores "+game.player.getScores(), screen.width/2, 10)


drawDebugInfo = (context) ->
	posX = debug.x
	posY = debug.y
	rowHeight = 10
	
	[x, y] = game.player.getPosition()
	[speedX, speedY] = game.player.getSpeed()
	health = game.player.getHealth()
	facing = game.player.getFacing()
	state = game.player.getState()
	shooting = game.player.isShooting()
	
	x = Math.round(100 * x) / 100
	y = Math.round(100 * y) / 100
	speedY = Math.round(100 * speedY) / 100
	
	ctx = screen.context
	ctx.fillStyle = debug.color
	ctx.font = debug.font
	ctx.textAlign = debug.align
	ctx.textBaseline = debug.baseline
	ctx.fillText("x:      " + x, posX, posY += rowHeight)
	ctx.fillText("y:      " + y, posX, posY += rowHeight)
	ctx.fillText("sp x:   " + speedX, posX, posY += rowHeight)
	ctx.fillText("sp y:   " + speedY, posX, posY += rowHeight)
	ctx.fillText("health: " + health, posX, posY += rowHeight)
	ctx.fillText("face:   " + facing, posX, posY += rowHeight)
	ctx.fillText("tick:   " + game.tickCount, posX, posY += rowHeight)
	ctx.fillText("Press K to kill player", posX, posY += rowHeight)


draw = (x, y, width, height) ->
	b = block.size
	fix = locationFix()
	
	screen.context.fillRect(x*b+fix, y*b, width*b+1, height*b)


locationFix = ->
	b = block.size
	playerX = game.player.getX()
	
	if (playerX + config.player.width / 2) * b < screen.width / 2
		return 0
	else if (playerX + config.player.width / 2) * b > game.stage.getWidth() * b - screen.width / 2
		return screen.width - game.stage.getWidth() * b
	else
		return screen.width / 2 - config.player.width / 2 * b - playerX * b