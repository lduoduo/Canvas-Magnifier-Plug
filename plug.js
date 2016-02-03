Magnifier = function(){
	var isMouseDown = false;
	var R = 200;
	var scale = 3;
	var bgImg = new Image();
	var bgInfo = {};

	var canvas = null;
	var cxt = null;
	var slider = null;
	var mirrorC = null;

	this.init = function(canvasId,src,w,h,sliderId){
		canvas = getId(canvasId);
		canvas.width = (w?w:document.body.clientWidth);
		canvas.height = (h?h:document.body.clientHeight);
		cxt = canvas.getContext("2d");
		if(!src || src == ""){return;}
		cxt.m_drawBg(src,canvas.width,canvas.height);
		BindMouse();
		if(!sliderId){return;}
		slider = getId(sliderId);
		slider.onmousemove = function(){
			drawBgScale(slider.value);
		}
	}

	CanvasRenderingContext2D.prototype.m_drawBg = function(src){
		this.beginPath();
		var temp = this;
		bgImg.src = src;
		bgImg.onload = function(){
  	// temp.drawImage(bgImg,(bgImg.width-temp.canvas.width)*0.5,(bgImg.height-temp.canvas.height)*0.5,w,h,0,0,w,h);
  	scale = bgImg.height/cxt.canvas.height;
  	canvas.width = bgImg.width*canvas.height/bgImg.height;
  	drawBgScale((slider?slider.value:1.0));
  	drawBigPic();
  }
}
function createWaterMark(){
	var bCanvas = document.createElement('canvas');
	bCanvas.width = 600;
	bCanvas.height = 150;
	var bCxt = bCanvas.getContext('2d');
	bCxt.font = "bold italic 40px Arial";
	bCxt.fillStyle = "rgba( 255 , 255 , 255 , 0.8 )";
	bCxt.textBaseline = "middle";
	bCxt.fillText(" == duo duo ==",20,50,600);
	return bCanvas;
}
function drawBgScale(scale){
	cxt.clearRect(0,0,cxt.canvas.width,cxt.canvas.height);
	bgInfo.w = cxt.canvas.width*scale;
	bgInfo.h = cxt.canvas.height*scale;
	bgInfo.dx = (cxt.canvas.width-bgInfo.w)*0.5;
	bgInfo.dy = (cxt.canvas.height-bgInfo.h)*0.5;
	cxt.drawImage(bgImg,bgInfo.dx,bgInfo.dy,bgInfo.w,bgInfo.h);
	var waterMark = createWaterMark();
	cxt.drawImage(waterMark,cxt.canvas.width-waterMark.width,cxt.canvas.height-waterMark.height);			
}

function getId(id){
	return document.getElementById(id);
}

function BindMouse(){
	canvas.onmousedown = function(e){
		e.preventDefault();
		e.data = getPosition(e.clientX,e.clientY);
		if(e.data.x == -1 || e.data.y == -1){return;}
		isMouseDown = true;
		drawCanvasWithMagnifier(true,e.data);
	}

	canvas.onmousemove = function(e){
		e.preventDefault();
		e.data = getPosition(e.clientX,e.clientY);
		if(!isMouseDown || e.data.x == -1 || e.data.y == -1){return;}
		drawCanvasWithMagnifier(true,e.data);
		//console.log("x:"+e.data.x+",y:"+e.data.y);
	}
	canvas.onmouseup = function(e){
		e.preventDefault();
		isMouseDown = false;
		drawCanvasWithMagnifier(false);
	}
	canvas.onmouseout = function(e){
		e.preventDefault();
		drawCanvasWithMagnifier(false);
	}
}

function getPosition(x,y){
	var data = canvas.getBoundingClientRect();
	data.x = Math.floor(x-data.left);
	data.y = Math.floor(y-data.top);
	return ({x:(data.x < 0 || data.x > data.width?-1:data.x),y:(data.y < 0 || data.y > data.height?-1:data.y)});
}

function drawCanvasWithMagnifier(isShow, point){
	cxt.clearRect(0,0,cxt.canvas.width,cxt.canvas.height);
	drawBgScale(1);
	if(!isShow){return;}
	drawMagnifier(point);
}

function drawMagnifier(point){
	var imageLG_cx = point.x*scale;
	var imageLG_cy = point.y*scale;
	var sx = imageLG_cx - R;
	var sy = imageLG_cy - R;
	var dx = point.x - R;
	var dy = point.y - R;
	cxt.save();
	cxt.beginPath();
	cxt.lineWidth = 5;
	cxt.strokeStyle = "rgba(255,255,255,0.6)";
	cxt.arc(point.x,point.y,R,0,2*Math.PI);
	cxt.stroke();
	cxt.clip();
	cxt.drawImage(mirrorC.canvas,sx,sy,2*R,2*R,dx,dy,2*R,2*R);
	cxt.restore();
}

function drawBigPic(){
	var temp = document.createElement('canvas');
	temp.width = bgImg.width;temp.height = bgImg.height;
	mirrorC = temp.getContext("2d");
	mirrorC.drawImage(bgImg,0,0);
}
}
