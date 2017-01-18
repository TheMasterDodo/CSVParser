const Discord = require("discord.js");
const bot = new Discord.Client();
const config = require("/Users/Chang-Syuan/fwtproject/config.json");
const setTable = require("/Users/Chang-Syuan/fwtproject/FWTSetData.json");
const aliasList = require("/Users/Chang-Syuan/fwtproject/FWTSetAliases.json");

function coocooPull(isLast, isDodo) {
    var number = Math.random();
    var pull = "";
    if (isLast) {
        var junkrate = 0;
        var platrate = 0;
        var arate = 0.7;
        var srate = 0.27;
    } else if (isDodo) {
        var junkrate = 0;
        var platrate = 0;
        var arate = 0.0;
        var srate = 0.0;
    } else {
        var junkrate = 0.55;
        var platrate = 0.28;
        var arate = 0.1;
        var srate = 0.045;
    }
    if (number < junkrate) pull = "<:junk:269584481944338432>";
    else if (junkrate <= number && number < junkrate + platrate) pull = "<:platinum:269584501200519170>";
    else if (junkrate + platrate <= number && number < junkrate + platrate + arate) pull = "<:A_set:269588637597958144>";
    else if (junkrate + platrate + arate <= number && number < junkrate + platrate + arate + srate) pull = "<:S_set:269588682275553282>";
    else pull = "<:SS_set:269588698113245184>";
    return pull;
};

function coocooPull10(isDodo) {
    if (isDodo) {
        var pull10 = "";
        for (var i = 0; i < 9; i++) {
            pull = coocooPull(false, true);
            pull10 = pull10 + pull + " ";
        };
        pull = coocooPull(false, true);
        pull10 = pull10 + " " + pull;
    } else {
        var pull10 = "";
        for (var i = 0; i < 9; i++) {
            pull = coocooPull(false, false);
            pull10 = pull10 + pull + " ";
        };
        pull = coocooPull(true, false);
        pull10 = pull10 + pull;
    }
    return pull10;
};

function nameByAlias(alias) {
    for (var i = 0, setnum = aliasList.length; i < setnum; i++) {
      	for (var j = 0, len = aliasList[i]["aliases"].length; j < len; j++) {
          	if (aliasList[i]["aliases"][j] == alias) return aliasList[i]["name"];
        }
    }
  	return "nosuchalias";
}

function findSet(alias) {
  	var name = nameByAlias(alias);
  	if (name == "nosuchalias") return "nosuchset";
    var setData = setTable[0];

    for (var i = 1, len = setTable.length; i < len; i++) {
        if (setTable[i]["Name"] == name) setData = setTable[i];
    }

    var dataString = "";
    for (var property in setData) {
        if (setData.hasOwnProperty(property)) {
            dataString = dataString + property + ": " + setData[property] + "\n";
        }
    }

    return dataString;
};

bot.on("message", msg => {
    if (!msg.content.startsWith(config.prefix)) return; // Checks for prefix
    if (msg.author.bot) return; // Checks if sender is a bot

    if (msg.content.startsWith(config.prefix + "ping")) {
        msg.channel.sendMessage("pong!");

    } else if (msg.content.startsWith(config.prefix + "tadaima") && (msg.content.includes("maid"))) {
        msg.channel.sendMessage("おかえりなさいませ！ご主人様♥, \nDo you want dinner or a shower or \*blushes\* me?");

    } else if (msg.content.startsWith(config.prefix + "tadaima") && (msg.content.includes("spades"))) {
        msg.channel.sendMessage("おかえりなさいませ！ご主人様 :anger:, \nWell, I don't have much of a choice. I guess I'll end this here since I got ~~Shido~~ Spades-san to pat my head today.----right, all of me?");

    } else if (msg.content.startsWith(config.prefix + "tadaima")) {
        msg.channel.sendMessage("Okaeri dear, \nDo you want dinner or a shower or \*blushes\* me?");

    } else if (msg.content.startsWith("!pull")) { // Single pull
        pull = coocooPull(false);
        msg.channel.sendMessage(pull);

    } else if (msg.content.startsWith(config.prefix + "whale") && (msg.channel.id !== "188363158107324418")) { // 10x pull
        if (msg.author.id.startsWith(config.ownerID)) { // My hack
            pull10 = coocooPull10(false); // Changing this to true gives me SS pulls
            msg.channel.sendMessage(pull10);
        } else {
            pull10 = coocooPull10(false);
            msg.channel.sendMessage(pull10);
        }
    } else if (msg.content.startsWith(config.prefix + "set")) { // Searches database for set info
        var message = msg.content;
        var messageLength = message.length;
        var setLocation = message.indexOf(" ", 0);
        var setName = message.slice(setLocation + 1, messageLength);
        var setInfo = findSet(setName.toLowerCase());
        if (setInfo != "nosuchset") {
            msg.channel.sendMessage(setInfo);
        } else if (setInfo == "nosuchset") {
            msg.channel.sendMessage("Unknown Set!");
        }
    }
});
bot.on("ready", () => {
    console.log("I am ready!");
});
bot.on("error", e => { console.error(e); });
bot.login(config.token);