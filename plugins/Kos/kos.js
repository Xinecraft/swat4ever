exports.commands = [
	"whois",
	"server",
	"joke",
	"insult",
	"hint",
	"boobs",
	"ass",
	"clans",
	"download",
	"botinfo",
	"rules",
	"dick",
	"tournaments",
	"swat4",
	"swat"
]

function _calculateAge(birthday) { // birthday is a date
	var ageDifMs = Date.now() - birthday.getTime();
	var ageDate = new Date(ageDifMs); // miliseconds from epoch
	return Math.abs(ageDate.getUTCFullYear() - 1970);
}

exports.whois = {
	usage: "user/player <querystring>",
	description: "Do a search for user/player at knightofsorrow.in",
	process: function (bot, msg, suffix) {
		msg.channel.startTyping();

		var args = suffix.split(' ');
		var type = args.shift();
		var query = args.join(' ');

		//If this is a mentioned whois
		if (query.startsWith('<@')) {
			var member = msg.guild.member(msg.mentions.users.first());
			query = member.displayName;
		}


		if (type == 'user' || type == 'profile') {
			require("request")("http://knightofsorrow.in/api/users2/" + query,
				function (err, res, body) {
					var data = JSON.parse(body);
					if (data && data.length == 1) {
						var user = data[0];
						//To get date of birth
						if (user.dob) {
							var dob = new Date(user.dob);
							var options = { year: 'numeric', month: 'short', day: 'numeric' };
							var user_date_of_birth = dob.toLocaleDateString("en-US", options) + " ■ " + _calculateAge(dob) + " years";
						}
						else {
							var user_date_of_birth = "*not specified*"
						}

						//To get profile picture
						if (user.photo) {
							var user_profile_pic = "http://knightofsorrow.in/image/" + user.photo.url + "/thumbnail/100";
						}
						else {
							var user_profile_pic = "http://knightofsorrow.in/image/vip.jpg/thumbnail/100";
						}

						// For Gameranger
						if (user.gr_id)
							var user_gameranger = user.gr_id;
						else
							var user_gameranger = "*not specified*";

						// For Discord
						if (user.discord_username)
							var user_discord = user.discord_username;
						else
							var user_discord = "*not specified*";

						// For Steam
						if (user.steam_nickname)
							var user_steam = user.steam_nickname;
						else
							var user_steam = "*not specified*";

						// For Gender
						if (user.gender)
							var user_gender = user.gender;
						else
							var user_gender = "*not specified*";

						// For linked player
						if (user.player_totals_name)
							var user_player = user.player_totals_name;
						else
							var user_player = "*not specified*";


						var emb = {
							title: '__Showing data for @' + user.username + '__',
							footer: {
								text: 'Powered by www.knightofsorrow.in',
								icon_url: 'http://knightofsorrow.in/images/swat.png'
							},
							url: 'http://knightofsorrow.in/@' + user.username,
							color: 16729344,
							thumbnail: {
								url: user_profile_pic,
								height: 100,
								width: 100
							},
							fields: [{
								name: "Username",
								value: user.username,
								inline: true
							},
							{
								name: "Full Name",
								value: user.name,
								inline: true
							},
							{
								name: "Country",
								value: user.country.countryName,
								inline: true
							},
							{
								name: "Role",
								value: user.roles[0].display_name,
								inline: true,
							},
							{
								name: "Linked Player",
								value: user_player,
								inline: true
							},
							{
								name: "Date of Birth",
								value: user_date_of_birth,
								inline: true
							},
							{
								name: "Gender",
								value: user_gender,
								inline: true,
							},
							{
								name: "Discord",
								value: user_discord,
								inline: true
							},
							{
								name: "Gameranger",
								value: user_gameranger,
								inline: true
							},
							{
								name: "Steam",
								value: user_steam,
								inline: true,
							},
							{
								name: "Profile URL",
								value: "http://knightofsorrow.in/@" + user.username,
								inline: false
							}]
						}
						msg.channel.sendMessage('', { embed: emb });
					}
					else if (data && data.length > 1) {
						var fields = [];
						var i = 0;
						for (var key in data) {
							if (i >= 10) {
								break;
							};
							fields.push({
								name: data[key].username,
								value: "http://knightofsorrow.in/@" + data[key].username,
								inline: true,
							});

							i++;
						}
						var emb = {
							title: '__Total ' + data.length + ' users found matching \'' + query + '\'__',
							description: "*Showing first 10 matching results.*",
							footer: {
								text: 'Powered by www.knightofsorrow.in',
								icon_url: 'http://knightofsorrow.in/images/swat.png'
							},
							color: 16729344,
							fields: fields
						}
						msg.channel.sendMessage("", { embed: emb });
					}
					else {
						var emb = {
							title: "No user found matching '" + query + "'",
							description: "No user has been found. Please try to use more specific query.",
							footer: {
								text: 'Powered by www.knightofsorrow.in',
								icon_url: 'http://knightofsorrow.in/images/swat.png'
							},
							color: 16729344
						};
						msg.channel.sendMessage("", { embed: emb });
					}
				});
		}
		else if (type == 'player') {
			require("request")("http://knightofsorrow.in/api/players/" + query,
				function (err, res, body) {
					var data = JSON.parse(body);
					if (data && data.length == 1) {
						var player = data[0];
						var emb = {
							title: '__Showing data for ' + player.name + '__',
							footer: {
								text: 'Powered by www.knightofsorrow.in',
								icon_url: 'http://knightofsorrow.in/images/swat.png'
							},
							url: 'http://knightofsorrow.in/statistics/player/' + player.name,
							color: 16729344,
							thumbnail: {
								url: "http://knightofsorrow.in/images/game/insignia/" + player.rank.id + ".png",
								height: 100,
								width: 100
							},
							fields: [{
								name: "Name",
								value: player.name,
								inline: true
							},
							{
								name: "Position",
								value: player.position,
								inline: true
							},
							{
								name: "Rank",
								value: player.rank.name,
								inline: true
							},
							{
								name: "Country",
								value: player.country.countryName,
								inline: true,
							},
							{
								name: "Total Score",
								value: player.total_score,
								inline: true
							},
							{
								name: "Total Points",
								value: player.total_points,
								inline: true
							},
							{
								name: "Visit for full statistics:",
								value: "http://knightofsorrow.in/statistics/player/" + player.name,
								inline: false
							}]
						}
						msg.channel.sendMessage('', { embed: emb });
					}
					else if (data && data.length > 1) {
						var fields = [];
						var i = 0;
						for (var key in data) {
							if (i >= 5) {
								break;
							};
							fields.push({
								name: data[key].name + " ■ #" + data[key].position + " ■ " + data[key].rank.name + " ■ " + data[key].country.countryName,
								value: "http://knightofsorrow.in/statistics/player/" + data[key].name,
								inline: true,
							});

							i++;
						}
						var emb = {
							title: '__Total ' + data.length + ' players found matching \'' + query + '\'__',
							description: "*Showing first 5 matching results.*",
							footer: {
								text: 'Powered by www.knightofsorrow.in',
								icon_url: 'http://knightofsorrow.in/images/swat.png'
							},
							color: 16729344,
							fields: fields
						}
						msg.channel.sendMessage("", { embed: emb });
					}
					else {
						var emb = {
							title: "No player found matching '" + query + "'",
							description: "No player has been found. Please try to use more specific query.",
							footer: {
								text: 'Powered by www.knightofsorrow.in',
								icon_url: 'http://knightofsorrow.in/images/swat.png'
							},
							color: 16729344
						};
						msg.channel.sendMessage("", { embed: emb });
					}
				});
		}
		else {
			msg.channel.sendMessage("```Query type not supported! Try \n!whois player <playername>\n!whois user <username>```");
		}

		msg.channel.stopTyping();
	}
},

	exports.server = {
		usage: "<coop|bs|vip|rd|top10|live>",
		description: "Returns the list of SWAT4 Servers from swat4stats.com",
		process: function (bot, msg, suffix) {
			msg.channel.startTyping();

			var args = suffix.split(' ');
			var type = args.shift();
			var query = args.join(' ');

			if (type.toUpperCase() == 'BS') {
				var fields = [];
				require("request")("https://dev.swat4stats.com/api/servers/",
					function (err, res, body) {
						var data = JSON.parse(body);
						var ipport = "";

						if (data) {
							for (var key in data) {
								if (data[key].status.gametype_slug == "barricaded-suspects") {
									ipport = data[key].ip + ":" + data[key].port;
									fields.push({
										//name: data[key].status.hostname_clean+" - "+data[key].status.player_num+"/"+data[key].status.player_max,
										//value: "`Swat4 "+data[key].status.gamever+" - "+data[key].ip+":"+data[key].port+" - "+data[key].status.mapname+"`",
										name: data[key].status.hostname_clean + " ■ " + data[key].status.gamename + " ■ v" + data[key].status.gamever,
										value: data[key].status.player_num+"/"+data[key].status.player_max+" ■ "+data[key].status.mapname+" ■ "+"["+ipport+"](https://swat4stats.com/servers/"+ipport+")",
										inline: false,
									});

								}

							}

							var emb = {
								title: '__Total ' + fields.length + ' servers with gametype Barricaded Suspects__',
								url: "https://swat4stats.com/servers/?gamename=0&gamever=1.0&filter_gametype=on&gametype=0",
								footer: {
									text: 'Powered by knightofsorrow.in & swat4stats.com',
									icon_url: 'http://knightofsorrow.in/images/swat.png'
								},
								color: 16729344,
								fields: fields
							}
							msg.channel.sendMessage("", { embed: emb });
						}
					});
			}

			else if (type.toUpperCase() == 'COOP') {
				var fields = [];
				require("request")("https://dev.swat4stats.com/api/servers/",
					function (err, res, body) {
						var data = JSON.parse(body);
						var ipport = "";

						if (data) {
							for (var key in data) {
								if (data[key].status.gametype_slug == "co-op") {
									ipport = data[key].ip + ":" + data[key].port;
									fields.push({
										//name: data[key].status.hostname_clean+" - "+data[key].status.player_num+"/"+data[key].status.player_max,
										//value: "`Swat4 "+data[key].status.gamever+" - "+data[key].ip+":"+data[key].port+" - "+data[key].status.mapname+"`",
										name: data[key].status.hostname_clean + " ■ " + data[key].status.gamename + " ■ v" + data[key].status.gamever,
										value: data[key].status.player_num+"/"+data[key].status.player_max+" ■ "+data[key].status.mapname+" ■ "+"["+ipport+"](https://swat4stats.com/servers/"+ipport+")",
										inline: false,
									});

								}

							}

							var emb = {
								title: '__Total ' + fields.length + ' servers with gametype CO-OP__',
								url: "https://swat4stats.com/servers/?gamename=0&gamever=1.0&filter_gametype=on&gametype=3",
								footer: {
									text: 'Powered by knightofsorrow.in & swat4stats.com',
									icon_url: 'http://knightofsorrow.in/images/swat.png'
								},
								color: 16729344,
								fields: fields
							}
							msg.channel.sendMessage("", { embed: emb });
						}
					});
			}

			else if (type.toUpperCase() == 'VIP') {
				var fields = [];
				require("request")("https://dev.swat4stats.com/api/servers/",
					function (err, res, body) {
						var data = JSON.parse(body);
						var ipport = "";

						if (data) {
							for (var key in data) {
								if (data[key].status.gametype_slug == "vip-escort") {
									ipport = data[key].ip + ":" + data[key].port;
									fields.push({
										//name: data[key].status.hostname_clean+" - "+data[key].status.player_num+"/"+data[key].status.player_max,
										//value: "`Swat4 "+data[key].status.gamever+" - "+data[key].ip+":"+data[key].port+" - "+data[key].status.mapname+"`",
										name: data[key].status.hostname_clean + " ■ " + data[key].status.gamename + " ■ v" + data[key].status.gamever,
										value: data[key].status.player_num+"/"+data[key].status.player_max+" ■ "+data[key].status.mapname+" ■ "+"["+ipport+"](https://swat4stats.com/servers/"+ipport+")",
										inline: false,
									});

								}

							}

							var emb = {
								title: '__Total ' + fields.length + ' servers with gametype VIP Escort__',
								url: "https://swat4stats.com/servers/?gamename=0&gamever=1.0&filter_gametype=on&gametype=1",
								footer: {
									text: 'Powered by knightofsorrow.in & swat4stats.com',
									icon_url: 'http://knightofsorrow.in/images/swat.png'
								},
								color: 16729344,
								fields: fields
							}
							msg.channel.sendMessage("", { embed: emb });
						}
					});
			}

			else if (type.toUpperCase() == 'RD') {
				var fields = [];
				require("request")("https://dev.swat4stats.com/api/servers/",
					function (err, res, body) {
						var data = JSON.parse(body);
						var ipport = "";

						if (data) {
							for (var key in data) {
								if (data[key].status.gametype_slug == "rapid-deployment") {
									ipport = data[key].ip + ":" + data[key].port;
									fields.push({
										//name: data[key].status.hostname_clean+" - "+data[key].status.player_num+"/"+data[key].status.player_max,
										//value: "`Swat4 "+data[key].status.gamever+" - "+data[key].ip+":"+data[key].port+" - "+data[key].status.mapname+"`",
										name: data[key].status.hostname_clean + " ■ " + data[key].status.gamename + " ■ v" + data[key].status.gamever,
										value: data[key].status.player_num+"/"+data[key].status.player_max+" ■ "+data[key].status.mapname+" ■ "+"["+ipport+"](https://swat4stats.com/servers/"+ipport+")",
										inline: false,
									});

								}

							}

							var emb = {
								title: '__Total ' + fields.length + ' servers with gametype Rapid Deployment__',
								url: "https://swat4stats.com/servers/?gamename=0&gamever=1.0&filter_gametype=on&gametype=2",
								footer: {
									text: 'Powered by knightofsorrow.in & swat4stats.com',
									icon_url: 'http://knightofsorrow.in/images/swat.png'
								},
								color: 16729344,
								fields: fields
							}
							msg.channel.sendMessage("", { embed: emb });
						}
					});
			}
			else if (type.toUpperCase() == "TOP10" || type.toUpperCase() == "TOP") {
				fields = [
					{
						name: "**#1** ■ Forever United ■ 109.70.149.161:10480",
						value: "United Kingdom ■ http://www.gametracker.com/server_info/109.70.149.161:10480",
						inline: false
					},
					{
						name: "**#2** ■ {KGB}Laura & Guns FuNHoUsE ■ 63.141.226.61:9480",
						value: "United States ■ http://www.gametracker.com/server_info/63.141.226.61:9480/",
						inline: false
					},
					{
						name: "**#3** ■ |SoH| Shadow Of Heroes ■ 158.58.173.64:16480",
						value: "Italy ■ http://www.gametracker.com/server_info/158.58.173.64:16480/",
						inline: false
					},
					{
						name: "**#4** ■ -==MYT Team Svr==- ■ 163.172.55.136:10480",
						value: "France ■ http://www.gametracker.com/server_info/163.172.55.136:10480/",
						inline: false
					},
					{
						name: "**#5** ■ -==MYT Team Svr==- ■ 51.15.152.220:10480",
						value: "United Kingdom ■ http://www.gametracker.com/server_info/51.15.152.220:10480/",
						inline: false
					},
					{
						name: "**#6** ■ WWW.KNIGHTofSORROW.IN (Antics) ■ 31.186.250.32:10480",
						value: "Germany ■ http://www.gametracker.com/server_info/31.186.250.32:10480/",
						inline: false
					},
					{
						name: "**#7** ■ Suspect's Heaven Public Server ■  5.9.50.39:8480",
						value: "Germany ■ http://www.gametracker.com/server_info/5.9.50.39:8480/",
						inline: false
					},
					{
						name: "**#8** ■ WWW.HOUSEOFPAiN.TK (Antics) ■ 31.186.250.156:10480",
						value: "Netherlands ■ http://www.gametracker.com/server_info/31.186.250.156:10480/",
						inline: false
					},
					{
						name: "**#9** ■ Epic Coop ■ 88.99.154.115:10512",
						value: "United Kingdom ■ http://www.gametracker.com/server_info/8.99.154.115:10512/",
						inline: false
					},
					{
						name: "**#10** ■ -==MYT Co-op Svr==- ■ 163.172.55.136:10880",
						value: "France ■ http://www.gametracker.com/server_info/163.172.55.136:10880/",
						inline: false
					}
				]
				var emb = {
					title: '**GameTracker Top Servers**',
					url: "http://www.gametracker.com/search/swat4/?searchipp=50",
					footer: {
						text: 'Powered by knightofsorrow.in',
						icon_url: 'http://knightofsorrow.in/images/swat.png'
					},
					color: 16729344,
					fields: fields
				}
				msg.channel.sendMessage("", { embed: emb });
			}
			else {
				var fields = [];
				require("request")("https://dev.swat4stats.com/api/servers/",
					function (err, res, body) {
						var data = JSON.parse(body);
						var ipport = "";

						if (data) {
							for (var key in data) {
								if (data[key].status.player_num > 0) {
									ipport = data[key].ip + ":" + data[key].port;
									fields.push({
										//name: data[key].status.hostname_clean+" - "+data[key].status.player_num+"/"+data[key].status.player_max,
										//value: "`Swat4 "+data[key].status.gamever+" - "+data[key].ip+":"+data[key].port+" - "+data[key].status.mapname+"`",
										name: data[key].status.hostname_clean + " ■ " + data[key].status.gamename + " ■ v" + data[key].status.gamever,
										value: data[key].status.player_num+"/"+data[key].status.player_max+" ■ "+data[key].status.mapname+" ■ "+"["+ipport+"](https://swat4stats.com/servers/"+ipport+")",
										inline: false,
									});

								}

							}

							var emb = {
								title: '__Total ' + fields.length + ' servers with players in it__',
								url: "https://swat4stats.com/servers/?gamename=0&gamever=1.0&gametype=2&filter_empty=on",
								footer: {
									text: 'Powered by knightofsorrow.in & swat4stats.com',
									icon_url: 'http://knightofsorrow.in/images/swat.png'
								},
								color: 16729344,
								fields: fields
							}
							msg.channel.sendMessage("", { embed: emb });
						}
					});
			}
			msg.channel.stopTyping();
		}
	},

	exports.joke = {
		description: "Show a Random Joke",
		process: function (bot, msg, suffix) {
			require("request")("http://knightofsorrow.in/api/joke",
				function (err, res, body) {
					var data = JSON.parse(body);
					if (data && data.joke) {
						msg.channel.sendMessage("```" + data.joke + "```")
					}
				});
		}
	},

	exports.hint = {
		description: "Gives a random SWAT4 hint.",
		process: function (bot, msg, suffix) {
			require("request")("http://knightofsorrow.in/api/swathint",
				function (err, res, body) {
					var data = JSON.parse(body);
					if (data && data.hint) {
						msg.channel.sendMessage("```" + data.hint + "```")
					}
				});
		}
	},

	exports.insult = {
		description: "Bot will insult the mentioned user",
		usage: "<user>",
		process: function (bot, msg, suffix) {
			require("request")("http://knightofsorrow.in/api/insult",
				function (err, res, body) {
					var data = JSON.parse(body);
					if (data && data.insult) {
						if (msg.mentions.users.first()) {
							var mention = msg.mentions.users.first();
						}
						else {
							var mention = msg.author;
						}

						if(mention == bot.user)
						{
							var array = [
								"Nice Try. I applaud your creativity.  No one else had thought of making me insult myself. This is why we can't have nice things. You are more bot than me.  You will stay a noob forever.",
								"So you are just dumb enough to try to insult a bot. Perhaps this is why you don't have friends. "
							]

							var ins = array[Math.floor(Math.random() * array.length)];
							msg.channel.sendMessage(msg.author+", "+ins)
						}
						else
						{
							msg.channel.sendMessage(mention + " , " + data.insult)
						}
					}
				});
		}
	},

	exports.boobs = {
		description: "Show a random pair of BOOBS ;-)",
		process: function (bot, msg, suffix) {
			require("request")("http://knightofsorrow.in/api/nsfw-boobs",
				function (err, res, body) {
					var data = JSON.parse(body);
					if (data && data.image) {
						if(/^nsfw(-|$)/.test(msg.channel.name))
						{
							msg.channel.sendMessage(data.image)
						}
						else
						{
							msg.channel.sendMessage(":no_entry_sign: This is not a NSFW channel!")
						}
					}
				});
		}
	},

	exports.ass = {
		description: "Show a Random image of ASS <3",
		process: function (bot, msg, suffix) {
			require("request")("http://knightofsorrow.in/api/nsfw-ass",
				function (err, res, body) {
					var data = JSON.parse(body);
					if (data && data.image) {
						if(/^nsfw(-|$)/.test(msg.channel.name))
						{
							msg.channel.sendMessage(data.image)
						}
						else
						{
							msg.channel.sendMessage(":no_entry_sign: This is not a NSFW channel!")
						}
					}
				});
		}
	},

	exports.clans = {
		description: "Show list of all active swat4 clans & teams",
		process: function (bot, msg, suffix) {

			var fields = [
				{
					name: "Shadow Of heroes ■ Tag: «|SoH|»| ■ Mode: VIP",
					value: "http://shadowofheroes.clan.su ■ http://shadowofheroes.clan.su/forum/",
					inline: false
				},
				{
					name: "qRage ■ Tag: qR| ■ Mode: BS",
					value: "http://qrage.top-me.com/login",
					inline: false
				},
				{
					name: "Killer Gaming Buddies ■ Tag: {KGB} ■ V: TSS ■ Mode: BS",
					value: "http://kgbswatclan.foroactivo.com/ ■ https://discord.gg/jxgWEM7",
					inline: false
				},
				{
					name: "Forever United ■ Tag: {|4U|} ■ Mode: VIP",
					value: "http://4uclan.net/ ■ http://discord.gg/rcPYF62",
					inline: false
				},
				{
					name: "MYT ■ Tag: |MYT| ■ Mode: VIP",
					value: "http://www.mytteam.com/ ■ http://mytteam.com/discord",
					inline: false
				},
				{
					name: "UnStopPable GaminG ■ Tag: uS| ■ Mode: BS",
					value: "http://www.knightofsorrow.in/ ■ https://discord.gg/phbysp2",
					inline: false
				},
				{
					name: "SKY ■ Tag: |SKY| ■ Mode: BS",
					value: "http://www.houseofpain.tk/ ■ https://discord.gg/7ErPpR6",
					inline: false
				},
				{
					name: "Best Swat Members ■ Tag: >>|BsM|<< ■ Mode: BS",
					value: "http://bestswatmembers.forumotion.me/ ■ https://discord.gg/pEsw7Gy",
					inline: false
				},
				{
					name: "Special Force Squad ■ Tag: «s|F|s» ■ Mode: BS",
					value: "http://clansfs.forolatin.com/",
					inline: false
				},
				{
					name: "Suspect's Heaven ■ Tag: }S|H{ ■ Mode: BS",
					value: "http://www.suspectsheaven.net/ ■ https://discord.gg/nNRETgN",
					inline: false
				},
				{
					name: "World Mafia ■ Tag: |WM| ■ Mode: VIP",
					value: "http://worldmafia.net/forum/ ■ https://discord.gg/YnrKMH7",
					inline: false
				},
				{
					name: "Clan Swat Mexico ■ Tag: »CSM* ■ Mode: VIP",
					value: "http://clansm.ucoz.com/",
					inline: false
				},
				{
					name: "Elite Tactical Squad ■ Tag: |ETS| ■ Mode: COOP",
					value: "http://www.ets-clan.co.uk/index.php ■ https://discord.gg/eWCm9au",
					inline: false
				},
				{
					name: "Secta Swat Argentina ■ Tag: >|SS|< ■ Mode: COOP",
					value: "http://tropadeelite.freeforo.com/",
					inline: false
				}
			]
			var emb = {
				title: '___List of active Swat4 Clans & Teams___',
				url: "http://knightofsorrow.in",
				footer: {
					text: 'Powered by knightofsorrow.in',
					icon_url: 'http://knightofsorrow.in/images/swat.png'
				},
				color: 16729344,
				fields: fields
			}
			msg.channel.sendMessage("", { embed: emb });
		}
	},

	exports.download = {
		usage: "<antics|gezmods|markmods|votemod|kinnnggmod|clientmod|swat4>",
		description: "Get the link for important downloads.",
		process: function (bot, msg, suffix) {
			msg.channel.startTyping();
			var args = suffix.split(' ');
			var type = args.shift();

			if (type == 'antics') {
				msg.channel.sendMessage("**Antics** -> http://knightofsorrow.in/downloads/2");
			}
			else if (type == "gezmods") {
				msg.channel.sendMessage("**Gez AMMod** -> http://gezmods.co.uk/download/AMMod_v22.zip");
			}
			else if (type == "markmods") {
				msg.channel.sendMessage("**Gez Markmods** -> http://www.markmods.com/?feeder=true&page=download&modID=47");
			}
			else if (type == "votemod") {
				msg.channel.sendMessage("**Kinnngg's Votemod** -> http://knightofsorrow.in/downloads/3");
			}
			else if (type == "kinnnggmod") {
				msg.channel.sendMessage("**Kinnngg's AMMod** -> http://knightofsorrow.in/downloads/1");
			}
			else if (type == "clientmod") {
				msg.channel.sendMessage("**ClientMod** -> http://gezmods.co.uk/download/AMClient_v13.zip");
			}
			else if (type == "markmodslist") {
				msg.channel.sendMessage("**Serverlist Fix & ACM** -> http://www.markmods.com/?feeder=true&page=download&modID=54");
			}
			else if(type == "swat4" || type=="swat")
			{
				msg.channel.sendMessage("**Download SWAT4**\nSwat4 1.0 => http://dl.knightofsorrow.in/Swat4/Installer/SWAT4%20V1.0.rar\nSwat4 1.1 & TSS => http://dl.knightofsorrow.in/Swat4/Installer/swat4.Exp.tar.gz\nMore at http://dl.knightofsorrow.in");
			}
			else {
				msg.channel.sendMessage("**All Downloads** -> http://dl.knightofsorrow.in/");
			}
			msg.channel.stopTyping();
		}
	},

	exports.botinfo = {
		description: "Show the information about the bot",
		process: function (bot, msg, suffix) {

			var fields = [
				{
					name: "Development Team",
					value: "Kinnngg & Keyser",
					inline: true
				},
				{
					name: "Website",
					value: "http://knightofsorrow.in",
					inline: true
				},
				{
					name: "Discord",
					value: "https://discord.gg/Y8DzuUU",
					inline: false
				},
				{
					name: "Information",
					value: "`Swat4eveR is a universal discord bot which can do anything from funny images to play songs. Its dedicated to Swat4 and have a ton of commands to fetch swat4 servers and players. Players infomation are fetch from knightofsorrow.in and servers infomation from swat4stats.com. If you have any query or suggestion or what us to add something please contact Kinnngg or Keyser in our discord group. \nAll hail to |MYT|Serge for server list.`",
					inline: false
				}
			]

			var emb = {
				title: 'Information about Swat4eveR Bot',
				footer: {
					text: 'Powered by knightofsorrow.in',
					icon_url: 'http://knightofsorrow.in/images/swat.png'
				},
				color: 16729344,
				fields: fields
			}
			msg.channel.sendMessage("", { embed: emb });
		}
	},

	exports.rules = {
		usage: "<kos|2v2|hop>",
		description: "Show the rules of the swat4 server.",
		process: function (bot, msg, suffix) {
			var args = suffix.split(' ');
			var type = args.shift();

			if (type == 'hop') {
				msg.channel.sendMessage("```Rules of Houseofpain.tk\nUsing hacks of any kind is not allowed and will result in an instant ban.\n\
Using bugs/glitches of any kind is not allowed.\n\
Camping - especially on respawn - is not allowed.\n\
Insulting other players is not allowed.\n\
Do not team -kill, -nade, -tase, etc. on purpose.\n\
Do not kill or steal arrests.\n\
Do not start kick/mute votes because “it's fun”.\n\
Do not spam/flood/attack the server.\n\
Do not use another player's name. Impersonation will get you banned.```");
			}
			else if (type == '2v2') {
				msg.channel.sendMessage("```Rules for 2v2 War\n1. Each team/clan chooses one map, example: XClan vs. YClan, XClan  choose one map, YClan also choose one map\n\
(A-bomb and The Wolcott Projects are most often chosen). And on both maps you play 2 rounds.\n\
A-Bomb 2 rounds\n\
The Wolcott Projects 2 rounds.\n\
2. After every round you need to switch teams (A-bomb 1st round you are swat, in 2nd round you are suspect, same on second map)\n\
3. Each round lasts 15 minutes.\n\
4. Spray and Pepperball are forbidden in wars.\n\
5. No double switch during the war! (Hurt or no ammo it doesnt metter)\n\
6. You need to wait 3 second after enemy spawn, before you shoot, thow nade, gas or flesh on them. So wait 3 second after they spawn. If they run out from their spawn area before 3 seconds, you can shoot , throw nade, gas or flesh.\n\
7. On the end of war, you count points of every round, who has more points that clan wins.\n\
(To be clear, you dont count round wins! you can lost first 3 rounds for example 55-60, 55-60, 55-60 and in last round to win 80-60, and your team will win that war)```");
			}
			else {
				msg.channel.sendMessage("```Rules of Knightofsorrow.in\nUsing hacks is not allowed.\n\
Be polite. Insulting others will not be tolerated.\n\
Racism, Hatred, etc are strictly prohibited. This may lead to permanent ban.\n\
Using bugs/glitches of any kind is not allowed.\n\
Do not start kick/map/ask/taser votes without reason.\n\
Do not team -kill, -nade, -tase, etc. on purpose.\n\
Do not kill or steal arrests.\n\
Hard camping is strictly prohibited. ( tactical camping allowed )\n\
Tactical camping is only a short wait of 15-20 seconds.\n\
Do not spam/flood/attack the server.\n\
Do not use another player's name. Impersonation will get you banned.\n\
If you find any admin/superadmin misusing his powers, plz shout at shoutbox.\n\
Respect KnightofSorrow & uS| Clan ;)\n\
3 seconds rule: Spawn nade/gas/etc. or killing is NOT allowed until 3 seconds has elapsed after respawn.```");
			}

		}
	},

	exports.dick = {
		description: "Show to dick size of a user",
		usage: "<user>",
		process: function (bot, msg, suffix) {

			if (msg.mentions.users.first()) {
				var user = msg.mentions.users.first();
			}
			else {
				var user = msg.author;
			}
			var id = user.id;
			var args = id.split('');
			var type = args.shift();
			type = args.shift();
			type = args.shift();
			type = args.shift();
			type = args.shift();
			type = args.shift();
			type = args.shift();
			type = parseInt(type);

			var di = "";
			for (i = 0; i <= type; i++) {
				di = di + "==";
			}

			// More fun TODO: Change this to comething more resonable
			if(type == 1)
			{
				di = "";
			}
			else if(type == 2)
			{
				di = "=";
			}

			if(user.bot)
			{
				msg.channel.sendMessage(msg.author+", You just prove to the world that you are dumbest person here. Bots don't have dicks but if it had it would be 5X larger than yours.");
			}
			else
			{
				msg.channel.sendMessage(user + " 8" + di + "D");
			}
		}
	},

	exports.tournaments = {
		description: "Show history of tournaments in SWAT4",
		process: function (bot, msg, suffix) {
			msg.channel.sendMessage("https://cdn.discordapp.com/attachments/319279175968227329/322064952397529088/32.JPG");
		}
	},

	exports.swat4 = {
		usage: "<about|meme|gif|best player|social|links|history|download>",
		description: "Returns Various important information or meme related to Swat4",
		process: function (bot, msg, suffix) {
			var args = suffix.split(' ');
			var type = args.shift();

			if (type == 'social' || type == 'links') {

				var emb = {
							title: "SWAT4 Important links",
							description: "Facebook: https://www.facebook.com/groups/SWAT4First/?ref=br_rs\n\
KoS FB: https://www.facebook.com/knightofsorrow.in/?ref=br_rs\n\
KoS Server: http://www.knightofsorrow.in\n\
HoP Server: http://www.houseofpain.tk\n\
Swat4 Stats: http://www.swat4stats.com\n\
Steam Group:  https://steamcommunity.com/groups/Swat4Steam\n\
Swat Reddit: https://www.reddit.com/r/SWAT4/\n\
Swat 4 Discord General: https://discord.gg/CkQXurF\n\
Swat 4 Discord COOP: https://discord.gg/4APHs5C\n\
Swat4eveR Discord: https://discord.gg/Y8DzuUU\n\
Swat 4 History: http://swat4news.blogspot.rs/\n\
Swat 4 tournaments: http://swat4tournament.forumotion.com/",
							footer: {
								text: 'Powered by www.knightofsorrow.in',
								icon_url: 'http://knightofsorrow.in/images/swat.png'
							},
							color: 16729344
						};
						msg.channel.sendMessage("", { embed: emb });
			}
			else if (type == 'about') {
				msg.channel.sendMessage("```SWAT 4 is a tactical shooter video game developed by Irrational Games and published by Vivendi Universal Games on April 5, 2005. It was built on Irrational Games's Vengeance Engine powered by Unreal Engine 2 technology. In SWAT 4, the player leads a SWAT tactical element in resolving various situations, such as hostage standoffs or apprehensions of dangerous subjects. An expansion to SWAT 4, entitled SWAT 4: The Stetchkov Syndicate, was released on February 28, 2006. On January 24, 2017, it was released digitally on GOG.com.```");
			}
			else if (type == "download") {
				msg.channel.sendMessage("**Download SWAT4**\nSwat4 1.0 => http://dl.knightofsorrow.in/Swat4/Installer/SWAT4%20V1.0.rar\nSwat4 1.1 & TSS => http://dl.knightofsorrow.in/Swat4/Installer/swat4.Exp.tar.gz\nMore at http://dl.knightofsorrow.in");
			}
			else if (type == "meme") {
				require("request")("http://knightofsorrow.in/api/nsfw-meme",
					function (err, res, body) {
						var data = JSON.parse(body);
						if (data && data.image) {
							msg.channel.sendMessage(data.image)
						}
					});
			}
			else if (type == "gif") {
				require("request")("http://knightofsorrow.in/api/nsfw-gif",
					function (err, res, body) {
						var data = JSON.parse(body);
						if (data && data.image) {
							msg.channel.sendMessage(data.image)
						}
					});
			}
			else if (type == "best" || type == "player") {
				var players = [
					"eLe|BUMMYYY",
					"ZatoX",
					"nWo|M!szcz",
					"|SKY|DCT|Vica",
					"wtF^Gibson",
					"|SKY|nubz<3",
					">!CiA!<Bogdy",
					"1u(!f3rO",
					"KATANE|UNDEROATH",
					"nWo|al!",
					"brZ",
					"wtF^The_MaSk",
					"WéstCoast|Satyricon",
					"nRs|k1nd3r",
					"qR|INTERSTELLAR",
					"||ESA||Joky",
					"KATANE|ETsK1||er",
					"Panda",
					"ahmedow",
					"S0und",
					"Naddy",
					"WéstCoast|Undertaker",
					"KATANE|fraN",
					"SaD|Cyrkiel",
					"|SKY|DrEVILKING",
					"SwedishThreesome",
					"nRs|BéRk",
					"8Ball",
					"qR|tommYHILFIGER",
					"No1|KeN",
					"SaD|Tarnold",
					"WéstCoast!SeMaVi",
					"nRs|SteelowJ",
					"No1|Whitey",
					"«CoB»NightCrawle",
					"No1|Sunken",
					"|SKY|KIRsON",
					"No1|KartaL",
					"|WM|Infarlock",
					"|WM|Michal",
					"No1|Shin",
					"SaD|Halaj",
					"<|Seal|>nSt",
					"{IT}Adams",
					"<CST>Bauu",
					"ICGT^Arkhos",
					"{IT}Baczek",
					"SaD|Iamlive",
					"No1|Sunken",
					"qR|September",
					"SaD|Hubert",
					"|G3|Hitman",
					"Soviet",
					"|G3|Czaja",
					"eLe|Perkele",
					"qR|haniso",
					"No1|uNo",
					"Suggest more name at https://discord.gg/Y8DzuUU"
				]
				var rand = players[Math.floor(Math.random() * players.length)];
				//msg.channel.sendMessage("Here is the best player of SWAT4 :donald_trump:\n**"+rand+"**");

				var emb = {
					title: rand,
					footer: {
						text: 'Powered by knightofsorrow.in',
						icon_url: 'http://knightofsorrow.in/images/swat.png'
					},
					image: {
						url: "https://cdn.discordapp.com/attachments/319279175968227329/323584398823784449/oie_tr11_copy.png"
					},
					color: 16729344
				}
				msg.channel.sendMessage("", { embed: emb });

			}
			else {
				msg.channel.sendMessage("```Choose something lad. <about|meme|gif|best player|social|links|history|download>```");
			}
		}
	},

	exports.swat = {
		usage: "<about|meme|best player|gif|social|links|commands|history|download>",
		description: "Returns Various important information related to Swat4. This command is alias of !swat4",
		process: function (bot, msg, suffix) {
			var args = suffix.split(' ');
			var type = args.shift();

			if (type == 'social' || type == 'links') {

				var emb = {
							title: "SWAT4 Important links",
							description: "Facebook: https://www.facebook.com/groups/SWAT4First/?ref=br_rs\n\
KoS FB: https://www.facebook.com/knightofsorrow.in/?ref=br_rs\n\
KoS Server: http://www.knightofsorrow.in\n\
HoP Server: http://www.houseofpain.tk\n\
Swat4 Stats: http://www.swat4stats.com\n\
Steam Group:  https://steamcommunity.com/groups/Swat4Steam\n\
Swat Reddit: https://www.reddit.com/r/SWAT4/\n\
Swat 4 Discord General: https://discord.gg/CkQXurF\n\
Swat 4 Discord COOP: https://discord.gg/4APHs5C\n\
Swat4eveR Discord: https://discord.gg/Y8DzuUU\n\
Swat 4 History: http://swat4news.blogspot.rs/\n\
Swat 4 tournaments: http://swat4tournament.forumotion.com/",
							footer: {
								text: 'Powered by www.knightofsorrow.in',
								icon_url: 'http://knightofsorrow.in/images/swat.png'
							},
							color: 16729344
						};
						msg.channel.sendMessage("", { embed: emb });
			}
			else if (type == 'about') {
				msg.channel.sendMessage("```SWAT 4 is a tactical shooter video game developed by Irrational Games and published by Vivendi Universal Games on April 5, 2005. It was built on Irrational Games's Vengeance Engine powered by Unreal Engine 2 technology. In SWAT 4, the player leads a SWAT tactical element in resolving various situations, such as hostage standoffs or apprehensions of dangerous subjects. An expansion to SWAT 4, entitled SWAT 4: The Stetchkov Syndicate, was released on February 28, 2006. On January 24, 2017, it was released digitally on GOG.com.```");
			}
			else if (type == "download") {
				msg.channel.sendMessage("**Download SWAT4**\nSwat4 1.0 => http://dl.knightofsorrow.in/Swat4/Installer/SWAT4%20V1.0.rar\nSwat4 1.1 & TSS => http://dl.knightofsorrow.in/Swat4/Installer/swat4.Exp.tar.gz\nMore at http://dl.knightofsorrow.in");
			}
			else if (type == "commands" || type == "command") {
				msg.channel.sendMessage("**Download list of useful console commands for SWAT4**\nhttp://dl.knightofsorrow.in/Others/commands.pdf");
			}
			else if (type == "meme") {
				require("request")("http://knightofsorrow.in/api/nsfw-meme",
					function (err, res, body) {
						var data = JSON.parse(body);
						if (data && data.image) {
							msg.channel.sendMessage(data.image)
						}
					});
			}
			else if (type == "gif") {
				require("request")("http://knightofsorrow.in/api/nsfw-gif",
					function (err, res, body) {
						var data = JSON.parse(body);
						if (data && data.image) {
							msg.channel.sendMessage(data.image)
						}
					});
			}
			else if (type == "best" || type == "player") {
				var players = [
					"eLe|BUMMYYY",
					"ZatoX",
					"nWo|M!szcz",
					"|SKY|DCT|Vica",
					"wtF^Gibson",
					"|SKY|nubz<3",
					">!CiA!<Bogdy",
					"1u(!f3rO",
					"KATANE|UNDEROATH",
					"nWo|al!",
					"brZ",
					"wtF^The_MaSk",
					"WéstCoast|Satyricon",
					"nRs|k1nd3r",
					"qR|INTERSTELLAR",
					"||ESA||Joky",
					"KATANE|ETsK1||er",
					"Panda",
					"ahmedow",
					"S0und",
					"Naddy",
					"WéstCoast|Undertaker",
					"KATANE|fraN",
					"SaD|Cyrkiel",
					"|SKY|DrEVILKING",
					"SwedishThreesome",
					"nRs|BéRk",
					"8Ball",
					"qR|tommYHILFIGER",
					"No1|KeN",
					"SaD|Tarnold",
					"WéstCoast!SeMaVi",
					"nRs|SteelowJ",
					"No1|Whitey",
					"«CoB»NightCrawle",
					"No1|Sunken",
					"|SKY|KIRsON",
					"No1|KartaL",
					"|WM|Infarlock",
					"|WM|Michal",
					"No1|Shin",
					"SaD|Halaj",
					"<|Seal|>nSt",
					"{IT}Adams",
					"<CST>Bauu",
					"ICGT^Arkhos",
					"{IT}Baczek",
					"SaD|Iamlive",
					"No1|Sunken",
					"qR|September",
					"SaD|Hubert",
					"|G3|Hitman",
					"Soviet",
					"|G3|Czaja",
					"eLe|Perkele",
					"qR|haniso",
					"No1|uNo",
					"Suggest more name at https://discord.gg/Y8DzuUU"
				]
				var rand = players[Math.floor(Math.random() * players.length)];
				//msg.channel.sendMessage("Here is the best player of SWAT4 :donald_trump:\n**"+rand+"**");

				var emb = {
					title: rand,
					footer: {
						text: 'Powered by knightofsorrow.in',
						icon_url: 'http://knightofsorrow.in/images/swat.png'
					},
					image: {
						url: "https://cdn.discordapp.com/attachments/319279175968227329/323584398823784449/oie_tr11_copy.png"
					},
					color: 16729344
				}
				msg.channel.sendMessage("", { embed: emb });

			}
			else {
				msg.channel.sendMessage("```Choose something lad. <about|meme|gif|best player|social|commands|links|history|download>```");
			}
		}
	}

