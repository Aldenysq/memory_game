
function rand_number(max){
	// max - number of buttons
	return Math.floor(Math.random()*max);
}
var sequence = []
var round = 0;
var user = [];
var current_level = 3;

var all = document.getElementsByClassName('square_btn');
	for (var i = 0; i < all.length; i++) {
		all[i].classList.add("disabled");
	}

function next_round(){
	//generate new button in sequence
	sequence.push(rand_number(current_level*current_level));
	round++;
	document.getElementById("round").innerHTML = "Round " + round.toString();
	user = [];
	setTimeout(function(){ show(0);}, 300);
	// show(0);
	

}	
function lose(){
	document.getElementById("round").innerHTML = "You lost :( but you made it to round #"+round.toString();
	user = []
	sequence = []
	round = 0;
	// alert("You lost!");
	disable();
	document.getElementById('start_game').classList.remove("disabled");
	var radios = document.getElementsByClassName("choice");
	for (var i =0; i< radios.length; i++){
		radios[i].removeAttribute("disabled");
	}
}
function show(i){

	if (i == sequence.length) {
		activate();
		return;}
	var b = document.getElementById('button'+sequence[i].toString());
	setTimeout(function(){b.style.background = "#668ad8";  
		setTimeout(function(){show(i+1);}
			, 300);},
		 500);
	b.style.background = "blue";
}



function pressed(i){
	user.push(i);
	if (user[user.length-1] != sequence[user.length-1]){
		var wrong_button = document.getElementById("button"+i.toString());
		var correct_button = document.getElementById("button"+sequence[user.length-1].toString());
		// show wrong button
		wrong_button.style.background = "red";
		//show correct button
		correct_button.style.background = "#66ff1a";
		 lose();
	}else if (user.length == sequence.length){
		disable();
		next_round();
	}
}

function choose_level(r){
	document.getElementById("round").innerHTML = "Game: remember the sequence";
	var main_div = document.getElementById('buttons_block');
	for (var b = 0; b < current_level*current_level; b++){
		var btn = document.getElementById('button'+b.toString());
		main_div.removeChild(btn);
	}
	 sequence = []
	 round = 0;
	 user = [];


	current_level = r;
	for (var b = 0; b < r*r; b++){
		var btn = document.createElement("a");
		btn.id = "button"+b.toString();	
		btn.href = "#";	
		btn.classList.add("square_btn");
		var argument = "pressed("+b.toString()+")";
		btn.setAttribute("onclick", argument);
		main_div.appendChild(btn);
	}
	// block buttons
	var all = document.getElementsByClassName('square_btn');
	for (var i = 0; i < all.length; i++) {
		all[i].classList.add("disabled");
	}

	set_margins();

	

	}

function set_margins(){
	var main_div = document.getElementById('buttons_block');
	var pad = "";
	if (current_level == 2){
		pad = "120px 120px";
	}else if (current_level == 3){
		pad = "80px 80px";
	}else if (current_level == 4){
		pad = "60px 60px";
	}else if (current_level == 5){
		pad = "48px 48px";
	}else if (current_level == 10){
		pad = "23px 23px";
	}else{
		//error
	}

	var all = document.getElementsByClassName('square_btn');
		for (var i = 0; i < all.length; i++) {
		all[i].style.marginLeft = '0px';
  		all[i].style.padding = pad;
	}
	main_div.style.marginLeft = "546px"
}

function disable(){
	var all = document.getElementsByClassName('square_btn');
	for (var i = 0; i < all.length; i++) {
		all[i].classList.add("disabled");
	}
	document.getElementById('start_game').classList.add("disabled");
	var radios = document.getElementsByClassName("choice");
	for (var i =0; i< radios.length; i++){
		radios[i].setAttribute("disabled", "disabled");
	}

}

function activate(){
	var all = document.getElementsByClassName('square_btn');
	for (var i = 0; i < all.length; i++) {
		all[i].classList.remove("disabled");
	}
	document.getElementById('start_game').classList.remove("disabled");
	var radios = document.getElementsByClassName("choice");
	for (var i =0; i< radios.length; i++){
		radios[i].removeAttribute("disabled");
	}

	
}

function start_game(){
	disable();
	// recolor buttons
	var all = document.getElementsByClassName('square_btn');
	for (var i = 0; i < all.length; i++) {
		all[i].style.background = "#668ad8";
	}

	 sequence = []
	 round = 0;
	 user = [];
	next_round();
}

