// Constructor for Shape objects to hold data for all drawn objects.
//Parent to all shapes, the shape class
function shape(x, y, w, h, fill, bColor, moveable = true){
  // "x || 0" just means "if there is a value for x, use that. Otherwise use 0."
  this.family = "shape";
  this.id = null;
  this.x = x || 0;
  this.y = y || 0;
  this.w = w || 10;
  this.h = h || 10;
  this.left = this.x;
  this.right = this.x + this.w;
  this.top = this.y;
  this.bottom = this.y + this.h;
  this.fill = fill || "#AAAAAA";
  this.objFill = fill || "#AAAAAA";
  this.bColor = bColor || "black";
  this.borderWidth = "2.5";
  this.moving = false;
  this.selected = false;
  this.canvas = null;
  this.context = null;
  this.moveable = moveable || true;
  this.rotate = function(){
	let w = this.w;
	this.w =this.h;
	this.h = w;
	preRender();
  }
}

//textBoxes class
function textBox(x, y, w, h, text, fill, bColor){
	shape.call(this, x, y, w, h, fill, bColor);
	this.text = text || null;
	this.family = "textBoxes";
	this.txtBxID = null;
}
//giving each shape its own unique id so I can identify it no matter what
shape.prototype.giveID = function(){
	this.id = shapes.length;
}

textBox.prototype.giveID = function(){
	this.txtBxID = textBoxes.length;
	this.id = shapes.length + 1;
}

// Draws this shape to a given context
shape.prototype.draw = function(thisCtx, thisX, thisY){
	var bw = this.borderWidth;
	
	thisCtx.fillStyle = this.fill;
	thisCtx.fillRect(thisX, thisY, this.w, this.h);
	thisCtx.lineWidth = bw;
	thisCtx.strokeStyle = this.bColor;
	thisCtx.rect(thisX, thisY, this.w, this.h);
	thisCtx.stroke();
}

textBox.prototype.draw = function(thisCtx, thisX, thisY){
	var bw = this.borderWidth;
	
	thisCtx.fillStyle = this.fill;
	thisCtx.fillRect(thisX, thisY, this.w, this.h);
	thisCtx.lineWidth = bw;
	thisCtx.strokeStyle = this.bColor;
	thisCtx.rect(thisX, thisY, this.w, this.h);
	thisCtx.stroke();
}

textBox.prototype.textDraw = function(){
	this.context.fillStyle = "black";
	this.context.fillText(this.text, 10, this.h / 2 + 5);
}

//Functions to call constructors for each class to create new components
function newShape(x, y, w, h, fill, bColor, moveable){
	shapes.push(new shape(x, y, w, h, fill, bColor, moveable));
	shapes[shapes.length - 1].giveID();
}

function newTextBox(x, y, w, h, text, fill, bColor){
	textBoxes.push(new textBox(x, y, w, h, text, fill, bColor));
	textBoxes[textBoxes.length - 1].giveID();
	shapes.push(textBoxes[textBoxes.length - 1]);
}

//Drawing everything on its own canvas so we can draw their images instead of doing calculations every single frame
function preRender(){
	shapes.forEach(function(obj, index){
		shapes[index].canvas = document.createElement("canvas");
		shapes[index].canvas.width = obj.w;
		shapes[index].canvas.height = obj.h;
		shapes[index].context = shapes[index].canvas.getContext("2d");
		shapes[index].draw(shapes[index].context, 0, 0);
		
		if(shapes[index].family == "textBoxes"){
			shapes[index].context.fillStyle = "black";
			shapes[index].context.font = "22px Arial";
			shapes[index].context.fillText(obj.text, 10, shapes[index].h / 2 + 5);
		}
		console.log("yup");
	});
} 