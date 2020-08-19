# The Handler

The Handler is a bot used for the discord application to help you research monsters, locale, and set up hunts with others on your server for the game Monster Hunter World.

## Commands for The Handler

**\*monster [monsters name]**
Use this command to see all the detiails you want to know about a specific monster! `ex: *monster ruiner nergigante`
**\*locale [area]** Use this command to see all the monsters that live in that locale organized by species! For the area name use any word that is in the area name.`ex: *locale rotten => Rotten Vale, *locale forest => The Ancient Forest`
**\*hunt [objective]** Use this command to create a new hunt for friends to sign up using message reactions, just follow the prompts and type your answer`ex: *hunt Furious Rajang, [handler question: When? example: 7:35 pm 07/23/2020 OR 7:35 pm est if today]` Hunters can use the reactions under the message to join, leave, join as an alternate, or delete the hunt.

- _deleting a hunt can only be done by the creator of the hunt_
- _ensure proper hunt times by using correct daylight savings notations, ie: est or edt for your timezone_

**\*help** This command sends a Direct Message to the user with a list of commands and how to use them.

## Tech Stack and Libraries

- Node.js
- Express.js
- discord.js
- countdown.js
- moment.js
- ms.js
