const { REST, Routes } = require('discord.js');
require("dotenv").config();

const CLIENT_ID = "1486105293455888506";
const GUILD_ID = "1486105549786316943";

const commands = [

{ name: "rules", description: "ارسال القوانين" },
{ name: "maps", description: "تصويت المابات" },
{ name: "games", description: "تصويت القيم" },
{ name: "startvote", description: "تصويت كامل " },
{ name: "teams-open", description: "فتح تسجيل التيمات" },
{ name: "teams-close", description: "قفل تسجيل التيمات" },
{ name: "distribute", description: "توزيع التيمات" },

{
name: "winners",
description: "اعلان الفائزين",
options: [
{ name: "event", description: "اسم الفعالية", type: 3, required: true },
{ name: "players", description: "الفائزين", type: 3, required: true },
{ name: "host", description: "host", type: 3, required: true }
]
}

];

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
await rest.put(
Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
{ body: commands }
);
console.log("✅  ");
})();