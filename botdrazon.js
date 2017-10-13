const Discord = require("discord.js");
const request = require('request');
const math = require('mathjs');
const config = require('./config.json');
const reddit = require('./oauth_info.json')
const snoowrap = require('snoowrap');

const bot = new Discord.Client();

// todo: wire up reddit calls to randomly pull in image from r/aww r/foodporn r/earthporn
// todo: letMeGoogleThatForYou
// todo: pubg stats??
// todo: aesthetize(input) = i n p u t 
// todo: earn points per msg/time?
// todo: bank heist mini adventure
// todo: betting feature? 

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
        case "ayy" :
          ayy(msg);
          break;
        case "help" :
          help(msg);
          break;
        case "roll" :
          roll(msg, args);
          break;
        case "weather" :
          getWeather(msg, args);
          break;
        case "forecast" :
          forecast(msg);
          break; 
        case "lenny" :
          lenny(msg, args);
          break;
        case "earth" :
          earthPorn(msg);
          break;
      }
  } return;
});

var help = function(msg) {
  var menu = '**Available Commands:**\n' +  
    '1. Help - prints this menu\n' +
    '2. Ayy - replies Lmao, use to check if bot is alive\n' + 
    '3. Roll - input a number, rolls from 1 to that number\n' + 
    '4. Weather - input a city or zipcode, returns current conditions\n' +  
    '5. Lenny - pass a number, returns that many lennyFaces' +
    // Forecast - returns quick 5 day hi/low forecast for passed city
    // Earth - returns a top r/earthPorn page from today
    ''
  msg.channel.send({embed: {
    color: 3447003,
    description: menu
  }});
}

var ayy = function(msg) {
  // an owner-only check
  // if(msg.author.id !== config.ownerID) return;
  msg.channel.send("lmao");
}

var getWeather = function(msg, args) {
  let apiKey = config.weather;
  var input = args[0];
  var url = "http://api.openweathermap.org/data/2.5/weather?";
  var city = "";

  if (!args[0]) // nothing is passed, use default city
    city = config.homeTown;
  else if (!isNaN(input))  // a number is passed
    if (input.length != 5) {
      msg.channel.send('Invalid zip code entered');
      return;
    }
    else
      var zip = input;
  else // something was passed; take the first passed param
    city = input;

  if (args[1]) // a city with a space is passed, add the second param to the city 
    city += ' ' + args[1]; // TODO: add the 'rest' of the args[]

  if (zip) 
    url += `zip=${zip},us&APPID=${apiKey}&units=imperial`
  else
    url += `q=${city},us&APPID=${apiKey}&units=imperial`

  request(url, function (err, response, body) {
  if (err) {
    console.log('error:', error);
  } 
  else {
    let obj = JSON.parse(body);

    if (obj.cod == '400' || obj.cod == '404')
      msg.channel.send('Bad request; check inputs.');
    else {
      let message = `It is ${obj.main.temp} degrees in ${obj.name} with ${obj.weather[0].description}\n` +
      `High: ${obj.main.temp_max} Low: ${obj.main.temp_min}\n` +
      `Humidity: ${obj.main.humidity}% Wind: ${obj.wind.speed}mph Clouds: ${obj.clouds.all}%\n`

      msg.channel.send({embed: {
        color: 3447003,
        description: message
      }});
    }
  }});
}

var forecast = function(msg) {
  let apiKey = config.weather;
  //var input = args[0];
  var city = "";

  let url = `http://api.openweathermap.org/data/2.5/forecast?q=${config.homeTown},US&APPID=${config.weather}&units=imperial`
  request(url, function (err, response, body) {
    if (err) {
      console.log('error:', err);
    }
    else {
      let obj = JSON.parse(body);
      //console.log(obj);
      var message = `**Six Day Forecast for ${config.homeTown}**\n`;
      var dates = new Array(6);
      var highs = new Array(6);
      var lows = new Array(6);
      var index = 0;

      for (let i=0; i < obj.list.length; i++) {
        var parsedDate = obj.list[i].dt_txt.slice(5,10);

        if (!dates.includes(parsedDate)) {
          dates[index] = parsedDate;
          highs[index] = obj.list[i].main.temp_max;
          lows[index] = obj.list[i].main.temp_min;
          index++;
        }
      }

      // prints everything in the array
      for (let i=0; i < 6; i++) {
        message += `${dates[i]} High: ${highs[i]} Low: ${lows[i]}\n`;
      }
      
      msg.channel.send(message);
      /* 6 day forecast
      - get the date of each day
      - add up each high/low and divide by 
      */

      //console.log(message);
      //msg.channel.send(message);
    }
  });
}

var roll = function(msg, args) {
  var max = args[0];
  var rand = 1 + Math.floor(Math.random() * max);
  msg.channel.send(`*You rolled ${rand}*`);
}

// https://www.lennyfaces.net/
var lenny = function(msg, args) {
  var builder = `( ͡° ͜ʖ ͡°)`;
  if (args[0]) {
    var count = args[0];
    if (count > 150 || isNaN(count)) 
      return;

    for (i = count; i != 1; i--)
    {
      builder += ` ( ͡° ͜ʖ ͡°)`;
    }
  }
  msg.channel.send(builder);   
}

var earthPorn = function(msg) {
  const r = snoowrap.getAuthUrl({
    userAgent: 'bot_drazon',
    clientId: reddit.clientId,
    clientSecret: reddit.clientSecret,
    refreshToken: reddit.refreshToken
});

  msg.channel.send('pretty pictures!');
  //r.getTop({time: 'day', limit:1}).then(console.log);
  // r.getTop('earthPorn').then(console.log);
  // r.getHot().map(post => post.title).then(console.log);
}

// ready event: on boot access to bot
bot.on('ready', () => {
  bot.user.setGame(`A N I M E M E S`);
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