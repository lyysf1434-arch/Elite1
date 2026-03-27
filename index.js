require("dotenv").config();
const { Client, GatewayIntentBits, EmbedBuilder } = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildVoiceStates
  ]
});

// ====== اعدادات ======
const eventRoles = ["1398804818482561035", "1398804831140839514"];

const registerChannelID = "1486929573332648007";
const teamsLogChannelID = "1486929591648911441";

const voiceChannels = [
"VOICE1","VOICE2","VOICE3","VOICE4","VOICE5","VOICE6","VOICE7","VOICE8",
"VOICE9","VOICE10","VOICE11","VOICE12","VOICE13","VOICE14","VOICE15","VOICE16",
"VOICE17","VOICE18","VOICE19","VOICE20","VOICE21","VOICE22","VOICE23","VOICE24",
"VOICE25","VOICE26","VOICE27","VOICE28","VOICE29","VOICE30","VOICE31","VOICE32",
"VOICE33","VOICE34"
];

// ====== المابات ======
const maps = {
"1️⃣": { name: "Scrap", image: "https://i.imgur.com/1.jpg" },
"2️⃣": { name: "RunGan", image: "https://i.imgur.com/2.jpg" },
"3️⃣": { name: "Cinema", image: "https://i.imgur.com/3.jpg" },
"4️⃣": { name: "Map 4", image: "https://i.imgur.com/4.jpg" }
};

// ====== القيم ======
const games = {
"1️⃣": "Battle Royal",
"2️⃣": "Back to Back",
"3️⃣": "Gang War"
};

// ====== متغيرات ======
let teamsOpen = false;
let teamNumber = 1;
let registeredPlayers = new Set();
let soloPlayers = new Set();
let teamsStorage = [];

// ====== تحقق رتبة ======
function hasEventRole(member) {
  return eventRoles.some(r => member.roles.cache.has(r));
}

// ===== READY =====
client.on("ready", () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

// ===== SLASH =====
client.on("interactionCreate", async interaction => {

if (!interaction.isChatInputCommand()) return;

const cmd = interaction.commandName;

// ===== RULES =====
if (cmd === "rules") {
await interaction.reply("@everyone 📜 قوانين الايفنت");
}

// ===== MAPS =====
if (cmd === "maps") {

if (!hasEventRole(interaction.member)) return interaction.reply("❌ ليس لديك صلاحية");

const embed = new EmbedBuilder()
.setTitle("🗳️ تصويت المابات")
.setDescription("1️⃣ Scrap\n2️⃣ RunGan\n3️⃣ Cinema\n4️⃣ Map 4");

const msg = await interaction.reply({ embeds:[embed], fetchReply:true });

for (let e of Object.keys(maps)) await msg.react(e);

setTimeout(()=>{
msg.reactions.removeAll();

let res={};
msg.reactions.cache.forEach(r=> res[r.emoji.name]=r.count-1);

const win = Object.entries(res).sort((a,b)=>b[1]-a[1])[0][0];

interaction.followUp({
embeds:[ new EmbedBuilder()
.setTitle("🏆 الماب الفائز")
.setDescription(maps[win].name)
.setImage(maps[win].image)]
});

},300000);
}

// ===== GAMES =====
if (cmd === "games") {

if (!hasEventRole(interaction.member)) return interaction.reply("❌ ليس لديك صلاحية");

const embed = new EmbedBuilder()
.setTitle("🎮 تصويت القيم")
.setDescription("1️⃣ Battle Royal\n2️⃣ Back to Back\n3️⃣ Gang War");

const msg = await interaction.reply({ embeds:[embed], fetchReply:true });

for (let e of Object.keys(games)) await msg.react(e);

setTimeout(()=>{
msg.reactions.removeAll();

let res={};
msg.reactions.cache.forEach(r=> res[r.emoji.name]=r.count-1);

const win = Object.entries(res).sort((a,b)=>b[1]-a[1])[0][0];

interaction.followUp(`🏆 الفائز: ${games[win]}`);

},300000);
}

// ===== STARTVOTE =====
if (cmd === "startvote") {

if (!hasEventRole(interaction.member)) return;

const embed = new EmbedBuilder()
.setTitle("🎮 تصويت القيم")
.setDescription("1️⃣ Battle Royal\n2️⃣ Back to Back\n3️⃣ Gang War");

const msg = await interaction.reply({ embeds:[embed], fetchReply:true });

await msg.react("1️⃣");
await msg.react("2️⃣");
await msg.react("3️⃣");

setTimeout(async ()=>{

let res={};
msg.reactions.cache.forEach(r=> res[r.emoji.name]=r.count-1);

const win = Object.entries(res).sort((a,b)=>b[1]-a[1])[0][0];

interaction.followUp(`🏆 القيم الفائز: ${games[win]}`);

// ===== MAPS =====

const mapEmbed = new EmbedBuilder()
.setTitle("🗳️ تصويت المابات")
.setDescription("1️⃣ Scrap\n2️⃣ RunGan\n3️⃣ Cinema\n4️⃣ Map 4");

const mapMsg = await interaction.followUp({ embeds:[mapEmbed] });

await mapMsg.react("1️⃣");
await mapMsg.react("2️⃣");
await mapMsg.react("3️⃣");
await mapMsg.react("4️⃣");

setTimeout(()=>{

let res2={};
mapMsg.reactions.cache.forEach(r=> res2[r.emoji.name]=r.count-1);

const win2 = Object.entries(res2).sort((a,b)=>b[1]-a[1])[0][0];

interaction.followUp({
embeds:[ new EmbedBuilder()
.setTitle("🏆 الماب الفائز")
.setDescription(maps[win2].name)
.setImage(maps[win2].image)]
});

},300000);

},300000);
}

// ===== TEAMS =====
if (cmd === "teams-open") {
teamsOpen = true;
teamsStorage = [];
registeredPlayers.clear();
soloPlayers.clear();
teamNumber = 1;

await interaction.reply("✅ تم فتح التسجيل");
}

if (cmd === "teams-close") {
teamsOpen = false;
await interaction.reply("❌ تم قفل التسجيل");
}

// ===== DISTRIBUTE =====
if (cmd === "distribute") {

for (let i=0;i<teamsStorage.length;i++){
const voice = interaction.guild.channels.cache.get(voiceChannels[i]);

for (let id of teamsStorage[i]){
const m = await interaction.guild.members.fetch(id).catch(()=>null);
if (!m) continue;
if (m.voice.channel)
await m.voice.setChannel(voice).catch(()=>{});
}
}

await interaction.reply("🚀 تم توزيع التيمات");
}

// ===== WINNERS =====
if (cmd === "winners") {

const event = interaction.options.getString("event");
const host = interaction.options.getString("host");
const players = interaction.options.getString("players");

const embed = new EmbedBuilder()
.setTitle("🏆 الفائزين")
.setDescription(`🎮 ${event}\n👑 ${players}\n🎙️ ${host}`)
.setColor("Gold");

await interaction.reply({ embeds:[embed] });
}

});

// ===== REGISTER =====
client.on("messageCreate", async message => {

if (message.author.bot) return;
if (!teamsOpen) return;
if (message.channel.id !== registerChannelID) return;

const content = message.content.toLowerCase();

if (content.includes("solo") || content.includes("سولو")) {

if (registeredPlayers.has(message.author.id)) return;

soloPlayers.add(message.author.id);
registeredPlayers.add(message.author.id);

const log = message.guild.channels.cache.get(teamsLogChannelID);

let txt=" SOLO\n";
soloPlayers.forEach(id=> txt+=`<@${id}>\n`);

log.send(txt);
return;
}

const mentions = message.mentions.users;
if (mentions.size === 0) return;

for (let u of mentions.values()) {
if (registeredPlayers.has(u.id)) return;
}

mentions.forEach(u=> registeredPlayers.add(u.id));
teamsStorage.push([...mentions.keys()]);

const log = message.guild.channels.cache.get(teamsLogChannelID);

let txt=`🏆 Team-${teamNumber}\n`;
mentions.forEach(u=> txt+=`<@${u.id}>\n`);

teamNumber++;

log.send(txt);

});

client.login(process.env.TOKEN);