const Discord = require("discord.js");
const request = require('request');
const math = require('mathjs');
const config = require('./config.json');
const snoowrap = require('snoowrap');
const bot = new Discord.Client();

// todo: wire up reddit calls to randomly pull in image from r/aww r/foodporn r/earthporn
// todo: letMeGoogleThatForYou


// message event
bot.on("message", msg => {
  if(!msg.content.startsWith(config.prefix)) 
    return;
  
  // we dont take commands from other bots
  if (msg.author.bot) 
    return;

  if (msg.content.startsWith(config.prefix)) {
      const args = msg.content.slice(config.prefix.length).trim().split(/ +/g);
      const command = args.shift().toLowerCase();

      switch (command) {
        case "ping" :
          pong(msg);
          break;
        case "help" :
          help(msg);
          break;
        case "roll" :
          roll(msg, args);
          break;
        case "weather" :
          weather(msg, args);
          break;
        /*case "forecast" :
          forecast(msg);
          break; */
      }
  } return;
});

var help = function(msg) {
  msg.channel.send("*Available Commands: \n 1. Help \n 2. Ping \n 3. Roll \n 4. Weather*");
}

var pong = function(msg) {
  msg.channel.send("*pong!*");
}

var weather = function(msg, args) {

  let apiKey = config.weather;
  var city = args[0];
  if (args[1])
    city += ' ' + args[1];
  if (!city) 
    city = config.homeTown;
  var url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${apiKey}&units=imperial`

  request(url, function (err, response, body) {
  if (err) {
    console.log('error:', error);
  } else {
    let weather = JSON.parse(body);
    let message = `*It is ${weather.main.temp} degrees in ${weather.name}*`;
    msg.channel.send(message);
    }
  });
}

var forecast = function(msg) {
  let city = msg.content.slice(8).trim();
  let apiKey = config.weather;
  let url = `http://api.openweathermap.org/data/2.5/forecast?q=${city},us&APPID=${apiKey}&units=imperial`
  
  request(url, function (err, response, body) {
    if (err) {
      console.log('error:', err);
    }
    else {
      let weather = JSON.parse(body);
      msg.channel.send(weather);
    }
  });
}

var roll = function(msg, args) {
  // var max = parseInt(msg.content.slice(5).trim());
  var max = args[0];
  var rand = 1 + Math.floor(Math.random() * max);
  msg.channel.send(`*You rolled ${rand}*`);
}

// ready event: on boot access to bot
bot.on('ready', () => {
  bot.user.setGame(`A N I M E M E S`);
  // console.log('Connected.');
  console.log(`Ready to serve on ${bot.guilds.size} servers, for ${bot.users.size} users.`);
});

// error logging
bot.on('error', (e) => { console.error(e); });
bot.on('warn', (e) => {console.warn(e); });
bot.on('debug', (e) => {console.info(e); });

bot.on('disconnect', function(){
  console.log('Disconnecting!');
})


bot.login(config.discord);