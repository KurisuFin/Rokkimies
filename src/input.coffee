class Keyhandler
	button = {
		up: 38
		down: 40
		left: 37
		right: 39
		shoot: 88
		jump: 90
		start: 13
		kill: 75
	}
	
	
	constructor: ->
		@keys = new Array()
		@buttonReleased = new Array()
		
		@reset()
		
		$("#canvas").bind "click", (event) =>
			
		$(document).bind "keydown", (event) =>
			@keys[event.which] = true
			#console.log(event.which)
		
		$(document).bind "keyup", (event) =>
			@keys[event.which] = false
			@buttonReleased[event.which] = true
	
			
	
	reset: ->
		for i in [0..255]
			@keys[i] = false
			@buttonReleased[i] = true
	
	
	up: ->
		return @keys[button.up]
	
	
	down: ->
		return @keys[button.down]
	
	
	left: ->
		return @keys[button.left]
	
	
	right: ->
		return @keys[button.right]
	
	
	shoot: ->
		return @keys[button.shoot]
	
	
	jump: ->
		return @keys[button.jump]
	
	
	start: ->
		return @keys[button.start]
	
	
	kill: ->
		return @keys[button.kill]
	
	
	tryButton: (button) ->
		return false unless @buttonReleased[button]
		
		@buttonReleased[button] = false
		return true
		
	tryJump: ->
		@tryButton(button.jump)
	
	tryShoot: ->
		@tryButton(button.shoot)
	
	tryStart: ->
		@tryButton(button.start)