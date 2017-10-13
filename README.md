# bot_drazon
Discord bot for practice and personal use; written in node.js

Current Implemented Commands:
    1. Help - prints this menu
    2. Ayy - replies Lmao, use to check if bot is alive
    3. Roll - input a number, rolls from 1 to that number
    4. Weather - input a city or zipcode, returns current conditions
    5. Lenny - pass a number, returns that many lennyFaces

Commands can be triggered using the correct prefix + the commands (i.e: -weather)

The config.json file was created to seperate out hardcoded values (such as the prefix, API keys, etc).

If you wish to duplicate this code, you will have to modify the values in config.json with your own API keys.
Additional reading can be found here: https://anidiotsguide.gitbooks.io/discord-js-bot-guide/getting-started/config-json-file.html

The Weather() commands uses the openWeatherMap API
You can subscribe to a free key here: https://openweathermap.org/api