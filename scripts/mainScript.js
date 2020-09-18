//VARIABLES
var game = {
	canvas : document.createElement("canvas"),
	start : function(){
		this.canvas.width = 800;
		this.canvas.height = 800;
		this.context = this.canvas.getContext("2d");
		document.body.insertBefore(this.canvas, document.body.childNodes[0]);
		
		c = this.canvas;
		ctx = this.context;
	}
};

var screen = {
	clear: 2,
	mainScreen: 1, 
	tetris: 0
}
var screenData =  [
	"^sp,0,0,800,800,#3894d1,#3894d1^txt,500,400,275,62,#AAAAAA,yellow,Lines: ,1^txt,500,500,275,62,#AAAAAA,black,Level: ,2^txt,500,600,275,62,#AAAAAA,black,Time: ,3^txt,500,300,275,62,#AAAAAA,black,High Score: ,4^sp,385,150,65,65,#930049,black^txt,10,10,160,50,#005900,black,UP NEXT,5^txt,500,100,275,62,#ff80c0,black,Score: ,6^txt,500,200,275,62,#b366ff,black,Mode: Tetris,7^sp,25,150,350,625,#5eff5e,black^sp,20,70,52,52,#000080,black^sp,85,90,52,52,#00aeae,black^sp,150,70,52,52,#ff0000,black^sp,215,90,52,52,#AAAAAA,black^sp,280,70,52,52,#AAAAAA,black",
	"^sp,0,0,800,800,#3894d1,#3894d1^txt,25,25,305,460,#AAAAAA,black,Solo Arcade^txt,375,50,400,285,#AAAAAA,black,Multiplayer Arcade^txt,445,375,295,360,#AAAAAA,black,Options & Data^txt,50,530,350,240,#AAAAAA,black,Online",
	"^sp,0,0,800,800,#3894d1,#3894d1"
]
var shapes = [];
var textBoxes = [];
var c = game.canvas;
var ctx = game.context;
var counter = 0;
var mousePos = {x: 0, y: 0}
var flags = {
	changeScreen: false,
	clearScreen: false
}
var debug = {
	showGrid : false,
	moving : false,
	curObj : null,
	prevObj : null,
	mdlClickSel : false,
	textBox: "left",
	paste: false,
	stretching : {bool: false, side : null}
};

/*newTextBox(500, 50, 275, 62.5, "Score: ");
newTextBox(500, 150, 275, 62.5, "Mode: Tetris");
newShape(50, 100, 350, 625); //tetris board

for(var i = 0; i <= 200; i += 50){
	newShape(i, i, 62.5, 62.5);
}*/

//I use my debug tools (which I have programmed to suit my needs) to create a level that I want and the have it come out as a compressed piece of data in a string that I can just store each level as instead of manually hard coding all of this info into the function
//createScreen("^sp,0,0,800,800,#3894d1,#3894d1^txt,10,10,160,50,#AAAAAA,UP NEXT,1^txt,500,50,275,62,#AAAAAA,Score: ,2^txt,500,150,275,62,#AAAAAA,Mode: Tetris,3^sp,25,150,350,625,#AAAAAA^sp,20,70,52,52,#AAAAAA^sp,85,90,52,52,#AAAAAA^sp,150,70,52,52,#AAAAAA^sp,215,90,52,52,#AAAAAA^sp,280,70,52,52,#AAAAAA");
createScreen("^sp,0,0,800,800,#3894d1,#3894d1^txt,500,400,275,62,#AAAAAA,yellow,Lines: ,1^txt,500,500,275,62,#AAAAAA,black,Level: ,2^txt,500,600,275,62,#AAAAAA,black,Time: ,3^txt,500,300,275,62,#AAAAAA,black,High Score: ,4^sp,385,150,65,65,#930049,black^txt,10,10,160,50,#005900,black,UP NEXT,5^txt,500,100,275,62,#ff80c0,black,Score: ,6^txt,500,200,275,62,#b366ff,black,Mode: Tetris,7^sp,25,150,350,625,#5eff5e,black^sp,20,70,52,52,#000080,black^sp,85,90,52,52,#00aeae,black^sp,150,70,52,52,#ff0000,black^sp,215,90,52,52,#AAAAAA,black^sp,280,70,52,52,#AAAAAA,black");
shapes[0].moveable=false;
//createScreen("^sp,0,0,800,800,#3894d1,#3894d1^txt,25,25,305,460,#AAAAAA,black,Solo Arcade^txt,375,50,400,285,#AAAAAA,black,Multiplayer Arcade^txt,445,375,295,360,#AAAAAA,black,Options & Data^txt,50,530,350,240,#AAAAAA,black,Online");
preRender();

//UPDATE FUNCTION
function canvasDraw(cursor){	
	c = game.canvas;
	ctx = game.context;
	ctx.clearRect(0, 0, c.width, c.height); //clear the canvas so we can redraw the scene
	
	if(flags.changeScreen){
		nextScreen(screen.mainScreen);
		shapes[0].moveable=false;
	}

	if(flags.clearScreen){
		clearScreen();
		shapes[0].moveable=false;
	}

	counter += 1;
	if(counter > 60){
		counter = 1
		//console.log("yup");
	}
	
	shapes.forEach(function(obj){
		ctx.drawImage(obj.canvas, obj.x, obj.y);
	});
	
	if(debug.showGrid){ 
		gridModeCheck(); 
		return;
	}
	window.requestAnimationFrame(canvasDraw);
}
//All EVENT LISTENERS go below here
//fixes a problem where double clicking causes text to get selected on the canvas
c.addEventListener("selectstart", function(e){ e.preventDefault(); return false; }, false);
c.addEventListener("contextmenu", function(e){ e.preventDefault(); return false; }, false);
window.addEventListener("keydown", function(e) {
    // space and arrow keys
    if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
}, false);

//JQuery Below here (including most of the EVENT LISTENERS; needed for detection of certain keys)
$(document).ready(function(){
	$('body').mousedown(function(e){if(e.button==1)return false});
	//$("#form").submit(function(e){e.preventDefault;});

	$(c).mousedown(function(e){	
		if(debug.showGrid){
			if(e.which == 1){//left click
				if(document.body.cursor.style == "n-resize"){
					$(c).mousemove(function(e){
						getMousePos(e.pageX, e.pageY);
						let obj = debug.curObj;

						
					});
				}

				var found = false;
				
				shapes.forEach(function(obj, index){
					if(obj.moveable && within(obj, mousePos.x, mousePos.y) && found == false){
						console.log(obj.id)
						if(debug.mdlClickSel){
							debug.prevObj = debug.curObj;
							unselect();
						}
						
						shapes[index].moving = true;
						debug.moving = true;
						debug.curObj = shapes[index];
						found = true;
					}
					
				});


			}else if(e.which == 2){ //middle click
				var found = false;
				
				shapes.forEach(function(obj, index){//determining which object you middle clicked and select it or unselect it
					if(obj.moveable && within(obj, mousePos.x, mousePos.y) && found == false){
						if(!obj.selected){
							if(debug.curObj){
								debug.prevObj = debug.curObj;
								unselect();
							}
							debug.curObj = obj;
							debug.mdlClickSel = true;
							shapes[index].fill = "#FFA500";
							shapes[index].draw(obj.context, 0, 0);
							shapes[index].selected = true;
							debug.mdlClickSel = true;
							$("#inputColor").prop("disabled", false);
							$("#inputBorderColor").prop("disabled", false);
						}else if(obj.selected){
							debug.prevObj = debug.curObj;
							debug.curObj = null;
							unselect();
						}
						
						found = true;
					}
				});	
			}else if(e.which == 3){
				debug.prevObj = debug.curObj;
				debug.curObj = null;
				
				if(debug.mdlClickSel){
					unselect();
				}
			}
		}
	});

	$(c).mousemove(function(e){
		getMousePos(e.pageX, e.pageY);
		debugShapeMoving();

		if(debug.curObj){
			let obj = debug.curObj;
			let grabArea = 8; //how far on each side of the selected shape the cursor style will be changed
			
			//for detecting which side the mouse is on of the selected object so we can change the cursor style to resizable
			if(mousePos.x >= obj.left - grabArea && mousePos.x <= obj.left + grabArea && mousePos.y <= obj.bottom && mousePos.y >= obj.top){//mouse from the left
				document.body.style.cursor = "e-resize";
				debug.stretching.bool = true;
				debug.stretching.side = "left";
			}else if(mousePos.x >= obj.right - grabArea && mousePos.x <= obj.right + grabArea && mousePos.y <= obj.bottom && mousePos.y >= obj.top){//mouse from the right
				document.body.style.cursor = "e-resize";
				debug.stretching.bool = true;
				debug.stretching.side = "right";
			}else if(mousePos.x >= obj.left && mousePos.x <= obj.right && mousePos.y <= obj.top + grabArea && mousePos.y >= obj.top - grabArea){//mouse from the top
				document.body.style.cursor = "n-resize";
				debug.stretching.bool = true;
				debug.stretching.side = "top";
			}else if(mousePos.x >= obj.left && mousePos.x <= obj.right && mousePos.y <= obj.bottom + grabArea && mousePos.y >= obj.bottom - grabArea){//mouse from the bottom
				document.body.style.cursor = "n-resize";
				debug.stretching.bool = true;
				debug.stretching.side = "bottom";
			}else{
				document.body.style.cursor = "default";
				debug.stretching.bool = false;
				debug.stretching.side = null;
			}
		}
	});

	$(c).mouseup(function(){
		debug.moving = false;
		singleDraw();
		gridModeCheck();
		
		if(!debug.mdlClickSel){
			debug.prevObj = debug.curObj;
			debug.curObj = null;
		
			shapes.forEach(function(obj, index){
				shapes[index].moving = false;
			});	
		
			gridModeCheck();
		}
	});

	//detect keypresses
	$(window).keydown(function(e){
		if(e.keyCode == 88) flags.changeScreen = true;

		//Allow for editing of a specific object if selected
		if(debug.mdlClickSel){
			//table of keys for human readability
			var keys = {
				left : 37,
				up : 38,
				right : 39,
				down : 40,
				copy : 67,
				paste : 86,
				delete : 46,

			};

			//For moving shapes to specific positions or change them to specific sizes (just general editing of an object)
			shapes.forEach(function(obj, index){
				if(sameObj(obj, debug.curObj)){ //finds the actual shape in the array that needs to be edited
					switch(e.keyCode){
						case keys.left:
							if(e.ctrlKey){ //ctrl while selected whill expand or shrink an object
								shapes[index].w -= 5;
								shapes[index].canvas.width -= 5;
								shapes[index].draw(obj.context, 0, 0);
								 
							}else if(e.altKey){
								shapes[index].rotate();
							}
							else{
								document.body.style.cursor = "ne-resize";
							}
							
							singleDraw();
							gridModeCheck();
							break;
						case keys.right:
							if(e.ctrlKey){
								shapes[index].w += 5;
								shapes[index].canvas.width += 5;
								shapes[index].draw(obj.context, 0, 0);
							}else if(e.altKey){
								shapes[index].rotate();
							}else{
								shapes[index].x += 5;
							}
							
							singleDraw();
							gridModeCheck(); 
							break;
						case keys.up:
							if(e.ctrlKey){
								shapes[index].h -= 5;
								shapes[index].canvas.height -= 5;
								shapes[index].draw(obj.context, 0, 0);
							}else if(e.altKey){
								shapes[index].rotate();
							}else{
								shapes[index].y -= 5;
							}
							
							singleDraw();
							gridModeCheck();
							break;
						case keys.down:
							if(e.ctrlKey){
								shapes[index].h += 5;
								shapes[index].canvas.height += 5;
								shapes[index].draw(obj.context, 0, 0);
							}else if(e.altKey){
								shapes[index].rotate();
							}else{
								shapes[index].y += 5;
							}
							
							singleDraw();
							gridModeCheck();
							break;
						case keys.paste:
							if(e.ctrlKey){
								createObj(mousePos.x, mousePos.y, shapes[index].w, shapes[index].h, shapes[index].objFill, shapes[index].bColor);
							}
							
							singleDraw();
							gridModeCheck();
							break
						default: 
							break;
					}
				}
			});
			
		}
	});
	
	//this way the objs colors will only be changed if the input value has been changed first
	$("#inputColor").change(function(){
		shapes.forEach(function(obj, index){
			if(sameObj(obj, debug.curObj)){
				shapes[index].fill = $("#inputColor").val();
				shapes[index].objFill = $("#inputColor").val();
				shapes[index].draw(obj.context, 0, 0);
				singleDraw();
			}
		});
	});
	
	$("#inputBorderColor").change(function(){
		shapes.forEach(function(obj, index){
			if(sameObj(obj, debug.curObj)){
				//console.log("wtf");
				shapes[index].bColor = $("#inputBorderColor").val();
				shapes[index].draw(obj.context, 0, 0);
				singleDraw();
			}
		});
	});

	//keeps the textbox from touching the canvas
	$("#infoBox").mousedown(function(){
			let canvasPos = $("canvas").position();
			let cLeft = canvasPos.left;
			console.log(cLeft);
			$(this).css("max-width", (cLeft - 45) + "px");
	});

	//Button style effects
	/*$("button").mouseenter(function(){
		let w = $(this).width();
		let h = $(this).height();
		console.log(this);

		$(this).width((w / 100) * 90).height((h / 100) * 90);

		$("button").mouseleave(function(){
			$(this).width(w).height(h);
		});
	});*/

	

	//Modal stuff
	$("#createObj").mousedown(function(){
		 inputs = {
			x: $("#xPos").val(),
			y: $("#yPos").val(),
			w: ($("#width").val() > 0) ? $("#width").val() : undefined,
			h: ($("#height").val() > 0) ? $("#height").val() : undefined
		};
		console.log(inputs.h, inputs.w);
		
		$(this).mouseup(function(){
			if(inputs.x && inputs.y){
				$("#objMod").hide();
				$(".blocker").hide();
				console.log("nope");
				createObj(inputs.x, inputs.y, inputs.w, inputs.h);
				if(debug.showGrid) singleDraw(); gridModeCheck();
		 	}
		});
		
	});

	
});
