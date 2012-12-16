





$(document).ready ->
	canvas = $("#canvas")[0]
	context = canvas.getContext("2d")
	context.fillStyle = "rgb(255, 200, 200)"
	context.fillRect 0, 0, canvas.width, canvas.height