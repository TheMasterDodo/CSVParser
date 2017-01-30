const Discord = require("discord.js");
const bot = new Discord.Client();
const config = require("/Users/Shared/config.json");
const setTable = require(config.DataFilePath + "/FWTSetData.json");
const aliasListSets = require(config.DataFilePath + "/FWTSetAliases.json");
const aliasListHeroes = require(config.DataFilePath + "/FWTHeroAliases.json");
const rainbowRotation = require(config.DataFilePath + "/FWTSetRotation.json");
const heroDataTable = require(config.DataFilePath + "/FWTHeroStats.json");

for (let i = 0, len = setTable.length; i < len; i++) {
    for (let j = 0, weeks = rainbowRotation.length; j < weeks; j++) {
        let grade = setTable[i]["Tier"].length.toString() + setTable[i]["Grade"];
        if (rainbowRotation[j][grade] == setTable[i]["Name"]) {
            setTable[i]["Last Time in the Rotation"] = rainbowRotation[j]["Week"];
        }
    }
}

function createOutput(list) {
    var dataString = "";
    for (var property in list) {
        if (list.hasOwnProperty(property)) {
            dataString = dataString + property + ": " + list[property] + "\n";
        }
    }
    return dataString;
}

function coocooPull(isLast) {
    var number = Math.random();
    var pull;
    if (isLast) {
        var junkrate = 0;
        var platrate = 0;
        var arate = 0.7;
        var srate = 0.27;
    } else {
        var junkrate = 0.55;
        var platrate = 0.28;
        var arate = 0.1;
        var srate = 0.045;
    }
    if (number < junkrate) pull = "junk";
    else if (junkrate <= number && number < junkrate + platrate) pull = "platinum";
    else if (junkrate + platrate <= number && number < junkrate + platrate + arate) pull = "A_set";
    else if (junkrate + platrate + arate <= number && number < junkrate + platrate + arate + srate) pull = "S_set";
    else pull = "SS_set";
    return pull;
}

function coocooPull10() {
    var pull10 = new Array(10);
    pull10.fill(null);
    return pull10.map((element, index, array) => coocooPull(index === array.length - 1));
}

function findEmojiFromGuildByName(guild, emoji_name) {
    const emoji = guild.emojis.find((emoji) => emoji.name === emoji_name);
    return emoji ? emoji.toString() : emoji_name;
}

function findNameByAlias(alias, isSet) {
    if (isSet) var aliasList = aliasListSets;
    else var aliasList = aliasListHeroes;
    for (var i = 0, setnum = aliasList.length; i < setnum; i++) {
        for (var j = 0, len = aliasList[i]["aliases"].length; j < len; j++) {
          	if (aliasList[i]["aliases"][j] == alias) return aliasList[i]["name"];
        }
    }
  	return "nosuchalias";
}

function findSet(setAlias) {
  	var name = findNameByAlias(setAlias, true);
  	if (name == "nosuchalias") return "nosuchset";
    var setData = setTable[0];
    for (var i = 1, len = setTable.length; i < len; i++) {
        if (setTable[i]["Name"] == name) setData = setTable[i];
    }

    return createOutput(setData);
}

function PullOrNot() {
    var number = Math.random();
    var YesNo;
    if (number <= 0.5) YesNo =  config.FilePath + "/Images/Pull.png";
    else YesNo = config.FilePath + "/Images/Don't Pull.png";
    return YesNo;
}

function SetsOfTheWeek(WeekRequested) {
    var rainbowData = rainbowRotation[rainbowRotation.length - 1 - WeekRequested];
    return createOutput(rainbowData);
}

function findHeroData(alias) {
    var name = findNameByAlias(alias, false);
    if (name == "nosuchalias") return "nosuchhero";
    var heroData = heroDataTable[0];

    for (var i = 1, len = heroDataTable.length; i < len; i++) {
        if (heroDataTable[i]["Name"] == name) heroData = heroDataTable[i];
    }
    return createOutput(heroData);
}

bot.on("message", msg => {
    if (!msg.content.startsWith(config.prefix)) return; // Checks for prefix
    if (msg.author.bot) return; // Checks if sender is a bot

    if ((msg.channel.id == config.ReservedGeneral) && (msg.content.startsWith(config.prefix + "set") !== true) && (msg.content.startsWith(config.prefix + "hero") !== true)) {
        msg.channel.sendMessage(msg.content + " command is not allowed here. Please use it in " + config.ReservedCode + " or " + config.ReservedCasino);
        return;
    }


    if (msg.content.startsWith(config.prefix + "ping")) { // Testing purposes
        msg.channel.sendMessage("pong!");

    } else if (msg.content.startsWith(config.prefix + "tadaima") && (msg.content.includes("maid"))) {
        msg.channel.sendMessage("おかえりなさいませ！ご主人様♥, \nDo you want dinner or a shower or \*blushes\* me?");

    } else if (msg.content.startsWith(config.prefix + "tadaima") && (msg.content.includes("spades"))) {
        msg.channel.sendMessage("おかえりなさいませ！ご主人様 :anger:, \nWell, I don't have much of a choice. I guess I'll end this here since I got ~~Shido~~ Spades-san to pat my head today.----right, all of me?");

    } else if (msg.content.startsWith(config.prefix + "tadaima")) {
        msg.channel.sendMessage("Okaeri dear, \nDo you want dinner or a shower or \*blushes\* me?");

    } else if (msg.content.startsWith(config.prefix + "tuturu")) { // Tuturu
        msg.channel.sendFile(config.FilePath + "/Images/Tuturu.png"); 
    
    } else if (msg.content.startsWith(config.prefix + "pull")) { // Single pull
        const ShouldIPull = PullOrNot();
        msg.channel.sendFile(ShouldIPull);

    } else if (msg.content.startsWith(config.prefix + "whale")) { // 10x pull
        const pulls = coocooPull10().map((emoji_name) => findEmojiFromGuildByName(msg.guild, emoji_name));
        msg.channel.sendMessage(pulls.join(" "));

    } else if (msg.content.startsWith(config.prefix + "set")) { // Searches database for set info
        var setName = msg.content.slice(msg.content.indexOf(" ", 0) + 1, msg.content.length);
        var setInfo = findSet(setName.toLowerCase());
        if (setInfo != "nosuchset") msg.channel.sendMessage(setInfo);
        else msg.channel.sendMessage("Unknown Set!");

    } else if (msg.content.startsWith(config.prefix + "moe")) {
        msg.channel.sendFile(config.FilePath + "/Images/moe.PNG");

    } else if (msg.content.startsWith(config.prefix + "nameset") && (msg.author.id == config.ownerID)) {
        const member = msg.guild.member(bot.user);
        member.setNickname("A Certain Magical Bot");
        msg.channel.sendMessage("My name has been set!");

    } else if (msg.content.startsWith(config.prefix + "rainbow")) {
        var message = msg.content;
        var messageLength = message.length;
        var weekLocation = message.indexOf(" ",0);
        if (weekLocation != -1) {
            var WeekRequested = message.slice(weekLocation + 1, messageLength);
        } else WeekRequested = 0;
        const currentSets = SetsOfTheWeek(WeekRequested);
        msg.channel.sendMessage(currentSets);

    } else if (msg.content.startsWith(config.prefix + "stats")) {
        var message = msg.content;
        var messageLength = message.length;
        var HeroLocation = message.indexOf(" ",0);
        var HeroRequested = message.slice(HeroLocation + 1, messageLength);
        var HeroStats = findHeroData(HeroRequested);
        msg.channel.sendMessage(HeroStats);
    } 
});
bot.on("ready", () => {
    console.log("I am ready!");
    bot.user.setGame("with TOD Hell Sets");
});
bot.on("error", e => { console.error(e); });
bot.login(config.token);
