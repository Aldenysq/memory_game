require('dotenv').config()
const MongoClient = require('mongodb').MongoClient;
const fc = require('./faceit.js');
const uri = process.env.faceitURI;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });



async function insertUser(client, channel, faceit_nickname, faceit_id){
	const result = await client.db("fplbot").collection("users").insertOne(
	{
		channel: `${channel}`,
		faceit_nickname: `${faceit_nickname}`,
		faceit_id: `${faceit_id}`
	}
		);
	console.log(`New listing created with the following id: ${result.insertedId}`);
}

async function findOneListingByChannel(client, nameOfListing) {
    const result = await client.db("fplbot").collection("users")
                        .findOne({ channel: nameOfListing });
    return result;
}

async function add_to_database(channel, nickname, faceit_id){
	const find = await findOneListingByChannel(client, channel);
	if (find){
		console.log(`${channel} already connected to database`);
		throw new Error('already connected to this channel');
	}
	
		await insertUser(client, channel, nickname, faceit_id);
	
	}
async function get_lineup(twitch_user){
	const result = await client.db("fplbot").collection("users")
                        .findOne({ channel: twitch_user });
    const faceit_id = result.faceit_id;
    const lineup = await fc.last_match(faceit_id);
    if (lineup.length == 2){
    	const first_team = lineup[0].join(', ');
    	const second_team = lineup[1].join(', ');
    	return `TEAMS: ${first_team} VS ${second_team}`;
    }else{
    	return lineup;
    }

}

async function join_channels(twitch_client){

	await client.connect();

	console.log('connected to db');	

	const database = await client.db("fplbot").collection("users").find();
	database.forEach(async function (item){
		await twitch_client.join(item.channel);
	});

	}
async function delete_channel(twitch_client, twitch_user){
	const find = await findOneListingByChannel(client, twitch_user);
	if (find){
		console.log(`deleting ${twitch_user} from database`);
		await client.db("fplbot").collection("users")
            .deleteOne({ channel : twitch_user });
		
	}else{
		throw new Error('not connected to this channel');
	}
		
	
}



module.exports = {
	add_to_database,
	get_lineup,
	join_channels,
	delete_channel
};