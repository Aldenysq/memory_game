require('dotenv').config()


const EU_FPL_hub_id = "74caad23-077b-4ef3-8b1d-c6a2254dfa75";
global.fetch = require("node-fetch");

const options = {
  headers: {
    Authorization: "Bearer " + process.env.bearerCode
  }
};


// const dosia_id = "16316c98-371d-4585-bc8c-a77b82d2ba95";
// given id of the player, return either he is not playing now or the teams in current match
async function last_match(id){

	// request to EU hub to get all ongoing matches
	const hub_ongoing_matches_url = `https://open.faceit.com/data/v4/hubs/${EU_FPL_hub_id}/matches?type=ongoing&offset=0&limit=100`;
	let data = await fetch(hub_ongoing_matches_url,  options);
	let json = await data.json();
	// iterate over matches
	for (let i = 0; i < json.items.length; i++){
		let teams = json.items[i].teams;
		// find teams
		// console.log(teams.faction1.roster);
		let team1 = teams.faction1.roster;
		let team2 = teams.faction2.roster;
		let roster1 = [];
		let in_this_game = false;
		for (let player of team1){
			roster1.push(player.nickname);
			if (player.player_id == id) in_this_game = true;
		}
		let roster2 = [];
		for (let player of team2){
			roster2.push(player.nickname);
			if (player.player_id == id) in_this_game = true;
		}
		// if found player in this game, we return rosters
		if (in_this_game){
			return [roster1, roster2];
		}
	}
	return 'Game not found';
}

// given nickname on faceit return id

async function nickname_to_id(nickname){
	const url = `https://open.faceit.com/data/v4/players?nickname=${nickname}`;
	let data = await fetch(url,  options);
	let json = await data.json();
	return json.player_id;
	
}


// nickname_to_id('s1mple').then(last_match).then(console.log);


module.exports = {
	nickname_to_id,
	last_match,
};