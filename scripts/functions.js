function getMousePos(evtX, evtY) { 
    var x = evtX
    var y = evtY 
	
	x -= c.offsetLeft; //take the total pos of the mouse and subtract it by how offset the canvas is to the left side or top of the window
	y -= c.offsetTop;
	mousePos.x = x;
	mousePos.y = y;
	//console.log(mousePos.x + " " + mousePos.y);
}

function startGame(){
	game.start();
	window.requestAnimationFrame(canvasDraw);
}

function boolGrid(){
	if(debug.showGrid == false){ //because when the btn is pressed debug.showGrid will be in the opposite state of what we want it to be so true is false in this case
		debug.showGrid = true;
	}
	else{
		window.requestAnimationFrame(canvasDraw);
		debug.showGrid = false;
	}
}

function gridModeCheck(){
	if(debug.showGrid){
		ctx.strokeStyle = "black";
		ctx.lineWidth = 1;
	
		//drawing lines every 50 pixels on the canvas to make a grid I can compare the positions of other components and find out where to place them
		for(var i = 50; i < c.width; i += 50){
			ctx.moveTo(i, 0);
			ctx.lineTo(i, c.height);
			ctx.stroke();
		}
		
		for(var i = 50; i < c.height; i += 50){
			ctx.moveTo(0, i);
			ctx.lineTo(c.height, i);
			ctx.stroke();
		}
	}
}

function within(obj, evtX, evtY){
	objXEnd = obj.x + obj.w;
	objYEnd = obj.y + obj.h;
	
	if(evtX >= obj.x && evtX <= objXEnd &&
	   evtY >= obj.y && evtY <= objYEnd){
		return true;
	}else{ return false; }
}

function singleDraw(){	
	c = game.canvas;
	ctx = game.context;
	ctx.clearRect(0, 0, c.width, c.height); // clear the canvas so we can redraw the scene
	
	shapes.forEach(function(obj, index){
		ctx.drawImage(obj.canvas, obj.x, obj.y);
		if(obj.hasOwnProperty("text")){
			if(debug.curObj == obj){
				shapes[index].textDraw();
			}
		}
	});
}

function debugShapeMoving(){
   if(debug.moving){
		shapes.forEach(function(obj, index){
			if(obj.moving){
				//snapping all my shapes to align with my debug grid; each box is 50 by 50
				shapes[index].x = Math.floor(mousePos.x / 50) * 50; 
				shapes[index].y = Math.floor(mousePos.y / 50) * 50; 
				singleDraw();
			}
		});
	}
}

//Info functions I will be using to gather information about my objects and to print out screen data for each screen instead of manually typing it all in
function objInfo(){
	document.getElementById("infoBox").value = JSON.stringify(debug.curObj);  
}

function allObjInfo(){
	document.getElementById("infoBox").value = "";
	
	shapes.forEach(function(obj){
		document.getElementById("infoBox").value += JSON.stringify(obj) + "\n\n"; 
	});
}

function screenString(){
	document.getElementById("infoBox").value = "";
	
	shapes.forEach(function(obj){
		var props = Object.values(obj);

		props.splice(1, 1);
		props.splice(6, 1);
		props.splice(7, 6);
		//console.log(props); ["textBoxes", 1, 500, 50, 275, 62.5, 
		//"#AAAAAA", "#AAAAAA", "black", "3", false, false, canvas, CanvasRenderingContext2D, True, "Score: ", 1]
		
		if(props[0] == "shape"){
			props[0] = "sp";
		}else if(props[0] == "textBoxes"){
			props[0] = "txt";
		}
		
		document.getElementById("infoBox").value += "^" + props;
	});
}

function sameObj(obj, objTwo){
	if(obj.id == objTwo.id){
		return true;
	}
	else return false;
}

function unselect(){
	debug.mdlClickSel = false;
	$("#inputColor").prop("disabled", true);
	$("#inputBorderColor").prop("disabled", true);
	
	shapes.forEach(function(obj, index){
		if(sameObj(obj, debug.prevObj)){
			shapes[index].fill = shapes[index].objFill; //fill is current fill, objFill is the original fill before selected
			shapes[index].draw(obj.context, 0, 0);
			shapes[index].selected = false;
			
			if(obj.hasOwnProperty("text")){
				shapes[index].textDraw();
			}
		}
	});
}
 
function createScreen(screenInfo){
	var objs = [];
	
	for(var i = 0; !(i >= screenInfo.length - 1); i++){ //loop through all the characters in screenInfo string
		if(i >= screenInfo.length - 1){ break; }
		
		if(screenInfo.charAt(i) == "^"){
			var props = []; 
			
			for(var n = i + 1; screenInfo.charAt(n) != "^"; n++){ //loop between the set of "^"'s; these represent the separation between objects
				
				for(var j = n; screenInfo.charAt(j) != ","; j++){ //loop between the set of comma's; these represent the separation between properties
					
					if(screenInfo.charAt(j+1) == "," || screenInfo.charAt(j+1) == "^" || (j+1) >= screenInfo.length){
						props.push(screenInfo.substring(n, j+1));
						n = j; //so the n loop doesn't look at characters already examined
						break;
					}
				}
				
				if(screenInfo.charAt(n) == "^" || (n+1) >= screenInfo.length){
					i = n;//so the i loop doesn't look at characters already examined
					break;
				}
			}
			
			objs.push(props);
		}
		
		if((i+1) >= screenInfo.length - 1){ break; }
	}
	//console.log(objs);
	for(var i = 0; i <= objs.length - 1; i++){
		var arr = objs[i];
		console.log(arr);
		if(arr[0] == "sp"){
			newShape(parseInt(arr[1]), parseInt(arr[2]), parseInt(arr[3]), parseInt(arr[4]), arr[5], arr[6]);
		}else if(arr[0] == "txt"){
			newTextBox(parseInt(arr[1]), parseInt(arr[2]), parseInt(arr[3]), parseInt(arr[4]), arr[7], arr[5], arr[6]);
		}
	}
}

function nextScreen(wScreen){
	shapes = []; //erasing all shapes
	createScreen(screenData[wScreen]); //choosing which screen out of screen data to use
	preRender();
	flags.changeScreen = false;
	console.log("nextScreen");
}

function clearScreen(){
	nextScreen(screen.clear);
	singleDraw();
	gridModeCheck();
	shapes[0].moveable=false;
}

//you do not have to shapes.push into array, function does that automatically
function createObj(x, y, w=200, h=100, fill="black", bColor="black", moveable="true"){
	newShape(x, y, w, h, fill, bColor, moveable);
	//else if(type == "textbox") newTextBox(x, y, w, h, text, fill, bColor);

	preRender();
}

function txtBoxSide(){
	console.log(window.outerWidth);
}

/*let overlap = !(rect1.right < rect2.left || 
	rect1.left > rect2.right || 
	rect1.bottom < rect2.top || 
	rect1.top > rect2.bottom)*/