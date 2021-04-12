require('dotenv').config()
const tmi = require("tmi.js");
const mongo = require("./mongodb");
const fc = require("./faceit");

const env = {
	BOT_USERNAME: "lqfplbot",
	CHANNEL_NAME: "lqfplbot",
	OAUTH_TOKEN: process.env.TwitchOAUTH_TOKEN 
};

const cooldown = 30; // time period between calls in sec
let channels_on_cooldown = new Set();

// Define configuration options
const opts = {
  identity: {
    username: env.BOT_USERNAME,
    password: env.OAUTH_TOKEN
  },
  channels: [env.CHANNEL_NAME]
};

// Create a client with our options
const client = new tmi.client(opts);

// Register our event handlers (defined below)
client.on("message", onMessageHandler);
client.on("connected", onConnectedHandler);


start();
async function start(){
	// Connect to Twitch:
	await client.connect();

	// join to all channels in database
	await mongo.join_channels(client);

}
// Called every time a message comes in
async function onMessageHandler(target, context, msg, self) {
	
  if (self) {
    return;
  } // Ignore messages from the bot
  if (channels_on_cooldown.has(target)){
  	console.log(`channel ${target} on cooldown, cannot execute`);
  	return;
  }

  // check if the command from bot channel
  const parts_of_msg = msg.split(" ");
  if (target === "#lqfplbot" && parts_of_msg[0] == '!connect') {
  	console.log('got new request from user');
    const username = context.username;
    	try{
    		if (parts_of_msg.length != 2){
    			throw new Error('wrong faceit nickname');
    		}
    		const id = await fc.nickname_to_id(parts_of_msg[1]);
    		if (id == undefined){
    			throw new Error('wrong faceit nickname');
    		}
    		await client.join(username);
    		await mongo.add_to_database(username, parts_of_msg[1], id);
    		console.log(`successful command from ${username}`);
    		await client.say(target, `@${username} successfully connected`);
    	}catch (e){
    		await client.say(target, `@${username} something went wrong :( (${e})`);
    		console.log(e);
    		return;
    	}
    	
  } else if (parts_of_msg[0] == '!lineup' && parts_of_msg.length == 1 && target != "#lqfplbot"){
  	const result = await mongo.get_lineup(target.substr(1));
  	await client.say(target, result);
  }else if (target === "#lqfplbot" && parts_of_msg[0] == '!leave'){
  	const username = context.username;
    	try{
    		if (parts_of_msg.length != 1){
    			throw new Error('wrong command');
    		}
    		await mongo.delete_channel(client, username);
    		await client.part(username);

    		
    		await client.say(target, `@${username} I successfully left your channel`);
    		console.log(`deleted ${username} from me`);
    	}catch (e){
    		await client.say(target, `@${username} something went wrong :( (${e})`);
    		console.log(e);
    		return;
    	}
  }
  channels_on_cooldown.add(target);
  console.log(`setting cooldown for channel ${target}`);
  setTimeout(function(){
  	channels_on_cooldown.delete(target);
  }, cooldown * 1000);
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler(addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}




