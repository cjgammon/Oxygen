

$(document).ready(onReady)

$(window).resize(resize)
window.onorientationchange = resize;

var width = 480;
var height = 320;

var wabbitTexture;
var pirateTexture;

var bunnys = [];
var gravity = 0.5//1.5 ;

var maxX = width;
var minX = 0;
var maxY = height;
var minY = 0;

var startBunnyCount = 2;
var isAdding = false;
var count = 0;
var container;
var pixiLogo;
var clickImage;

var amount = 100;

function onReady()
{

	stage = new O.Canvas(800, 600);
	document.body.appendChild(stage.el);

	stage.el.style.position = 'absolute';

	amount = 100;
	stats = new Stats();

	document.body.appendChild( stats.domElement );
	stats.domElement.style.position = "absolute";
	stats.domElement.style.top = "0px";

	//wabbitTexture = new PIXI.Texture.fromImage("bunnys.png")

	counter = document.createElement("div");
	counter.className = "counter";
	document.body.appendChild( counter);

	count = startBunnyCount;
	counter.innerHTML = count + " BUNNIES";

	currentTexture = new Image();
	currentTexture.src = "bunny.png";
	currentTexture.onload = go;

	function go() {
		for (var i = 0; i < startBunnyCount; i++)
		{
			var bunny = new O.Sprite(currentTexture);
			bunny.speedX = Math.random() * 10;
			bunny.speedY = (Math.random() * 10) - 5;

			bunny.ox = 0.5;
			bunny.oy = 1;

			bunnys.push(bunny);

			stage.addChild(bunny);
		}

		requestAnimationFrame(update);
	}

	stage.el.onmousedown = function(){
		isAdding = true;
	};

	stage.el.onmouseup = function(){
		isAdding = false;
	};

	document.addEventListener("touchstart", onTouchStart, true);
	document.addEventListener("touchend", onTouchEnd, true);


	resize();
}

function onTouchStart(event)
{
	isAdding = true;
}

function onTouchEnd(event)
{
	isAdding = false;
}

function resize()
{

	var width = $(window).width();
	var height = $(window).height();

	if(width > 800)width  = 800;
	if(height > 600)height = 600;

	maxX = width;
	minX = -width;
	maxY = height;
	minY = -height;

	var w = $(window).width() / 2 - width/2;
	var h = $(window).height() / 2 - height/2;

	stage.el.style.left = $(window).width() / 2 - width/2 + "px"
	stage.el.style.top = $(window).height() / 2 - height/2 + "px"

	stats.domElement.style.left = w + "px";
	stats.domElement.style.top = h + "px";

	counter.style.left = w + "px";
	counter.style.top = h + 49 + "px";

	//renderer.resize(width, height);
}

function update()
{
	stats.begin();
	if(isAdding)
	{
		// add 10 at a time :)

		if(count < 200000)
		{

			for (var i = 0; i < amount; i++)
			{
				var bunny = new O.Sprite(currentTexture);
				bunny.speedX = Math.random() * 10;
				bunny.speedY = (Math.random() * 10) - 5;
				bunny.oy = 1;
				//bunny.alpha = 0.3 + Math.random() * 0.7;
				bunnys.push(bunny);
				bunny.s = 0.5 + (Math.random()*0.5);

				bunny.r = (Math.random()-0.5)

				//bunny.rotation = Math.random() - 0.5;
				var random = Math2.randomInt(0, stage.children.length-2);
				stage.addChild(bunny)//, random);

				count++;
			}
		}


		counter.innerHTML = count + " BUNNIES";
	}

	for (var i = 0; i < bunnys.length; i++)
	{
		var bunny = bunnys[i];
		//bunny.rotation += 0.1

		bunny.x += bunny.speedX;
		bunny.y += bunny.speedY;
		bunny.speedY += gravity;

		if (bunny.x > maxX)
		{
			bunny.speedX *= -1;
			bunny.x = maxX;
		}
		else if (bunny.x < minX)
		{
			bunny.speedX *= -1;
			bunny.x = minX;
		}

		if (bunny.y > maxY)
		{
			bunny.speedY *= -0.85;
			bunny.y = maxY;
			bunny.spin = (Math.random()-0.5) * 0.2
			if (Math.random() > 0.5)
			{
				bunny.speedY -= Math.random() * 6;
			}
		}
		else if (bunny.y < minY)
		{
			bunny.speedY = 0;
			bunny.y = minY;
		}

	}

	stage.render();
	requestAnimationFrame(update);
	stats.end();
}
