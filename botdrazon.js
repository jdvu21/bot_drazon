const Discord = require("discord.js");
const request = require('request');
const math = require('mathjs');
const bot = new Discord.Client();
const config = require('./config.json');
const prefix = '-';



// todo: wire up reddit calls to randomly pull in image from r/aww r/foodporn r/earthporn


// message event
bot.on("message", msg => {
  // prefix check
  if(!msg.content.startsWith(prefix)) 
    return;
  
  // we dont take commands from other bots
  if (msg.author.bot) 
    return;

  if (msg.content.startsWith(prefix + "ping")) {
    pong(msg);
  }

  if (msg.content.startsWith(prefix + "help")) {
    help(msg);
  }

  if (msg.content.startsWith(prefix + "weather")) {
    weather(msg);
  }

  if (msg.content.startsWith(prefix + "roll ")) {
    roll(msg);
  }

  if (msg.content.startsWith(prefix + "forecast")) {
    forecast(msg);
  }
  // else
    return;
});

var help = function(msg) {
  msg.channel.send("*Available Commands: \n 1. Help \n 2. Ping \n 3. Roll \n 4. Weather*");
  // key: 4f7d4945dc23abad
  // 10 calls per minute ; 500 calls epr day
  // msg.channel.send("4. Steam");
  // https://partner.steamgames.com/documentation/webapi
}

var pong = function(msg) {
  msg.channel.send("*pong!*");
}

var weather = function(msg) {

  let apiKey = config.weather;
  var passedCity = msg.content.slice(8).trim();
  var city;
  if (passedCity) {
    city = passedCity;
  }
  else {
    city = 'Cleveland';
  }
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
  let apiKey = 'eda072913ca03555c7c0d903bde7ef66';
  let url = `http://api.openweathermap.org/data/2.5/forecast?q=${city},us&APPID=${apiKey}&units=imperial`
  
  request(url, function (err, response, body) {
    if (err) {
      console.log('error:', err);
    }
    else {
      let weather = JSON.parse(body);
      msg.channel.send(weather);
      // console.log(body);
    }
  });
}

var roll = function(msg) {
  var max = parseInt(msg.content.slice(5).trim());
  var rand = 1 + Math.floor(Math.random() * max);
  msg.channel.send(`*You rolled ${rand}*`);
}

// ready event | greeting message
bot.on('ready', () => {
  console.log('ayy lmao');
});

// error logging
bot.on('error', e => { console.error(e); });

bot.on('disconnect', function(){
  console.log('Disconnecting!');
})


bot.login(config.discord);