var board = [
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
]

function tBlock(){
	this.color = "purple";
	
	this.rotos = [
		[
			[0, 1, 0],
			[1, 1, 1],
			[0, 0, 0]
		],
		[
			[0, 1, 0],
			[0, 1, 1],
			[0, 1, 0]
		],
		[
			[0, 0, 0],
			[1, 1, 1],
			[0, 1, 0]
		],
		[
			[0, 1, 0],
			[1, 1, 0],
			[0, 1, 0]
		]
	];
	
	this.curRoto = this.rotos[0];
}

function iBlock(){
	this.color = "lightblue";
	
	this.rotos = [
		[
			[0, 0, 0, 0],
			[1, 1, 1, 1],
			[0, 0, 0, 0],
			[0, 0, 0, 0]
		],
		[
			[0, 0, 1, 0],
			[0, 0, 1, 0],
			[0, 0, 1, 0],
			[0, 0, 1, 0]
		],
		[
			[0, 0, 0, 0],
			[0, 0, 0, 0],
			[1, 1, 1, 1],
			[0, 0, 0, 0]
		],
		[
			[0, 1, 0, 0],
			[0, 1, 0, 0],
			[0, 1, 0, 0],
			[0, 1, 0, 0]
		]
	];
	
	this.curRoto = this.rotos[0];
}

function jBlock(){
	this.color = "blue";
	
	this.rotos = [
		[
			[1, 0, 0],
			[1, 1, 1],
			[0, 0, 0]
		],
		[
			[0, 1, 1],
			[0, 1, 0],
			[0, 1, 0]
		],
		[
			[0, 0, 0],
			[1, 1, 1],
			[0, 0, 1]
		],
		[
			[0, 1, 0],
			[0, 1, 0],
			[1, 1, 0]
		]
	];
	
	this.curRoto = this.rotos[0];
}

function lBlock(){
	this.color = "orange";
	
	this.rotos = [
		[
			[0, 0, 1],
			[1, 1, 1],
			[0, 0, 0]
		],
		[
			[0, 1, 0],
			[0, 1, 0],
			[0, 1, 1]
		],
		[
			[0, 0, 0],
			[1, 1, 1],
			[1, 0, 1]
		],
		[
			[0, 1, 0],
			[0, 1, 0],
			[1, 1, 0]
		]
	];
	
	this.curRoto = this.rotos[0];
}

function sBlock(){
	this.color = "lawngreen";
	
	this.rotos = [
		[
			[0, 1, 1],
			[1, 1, 0],
			[0, 0, 0]
		],
		[
			[0, 1, 0],
			[0, 1, 1],
			[0, 0, 1]
		],
		[
			[0, 0, 0],
			[0, 1, 1],
			[1, 1, 0]
		],
		[
			[1, 0, 0],
			[1, 1, 0],
			[0, 1, 0]
		]
	];
	
	this.curRoto = this.rotos[0];
}

function zBlock(){
	this.color = "red";
	
	this.rotos = [
		[
			[1, 1, 0],
			[0, 1, 1],
			[0, 0, 0]
		],
		[
			[0, 0, 1],
			[0, 1, 1],
			[0, 1, 0]
		],
		[
			[0, 0, 0],
			[1, 1, 0],
			[0, 1, 1]
		],
		[
			[0, 1, 0],
			[1, 1, 0],
			[1, 0, 0]
		]
	];
	
	this.curRoto = this.rotos[0];
}

function oBlock(){
	this.color = "yellow";
	
	this.rotos = [
		[0, 1, 1, 0],
		[0, 1, 1, 0],
		[0, 0, 0, 0]
	];
	
	this.curRoto = this.rotoOne;
}
