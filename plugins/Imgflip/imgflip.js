exports.commands = [
	"meme"
]

var AuthDetails = require("../../auth.json");

//https://api.imgflip.com/popular_meme_ids
var meme = {
	"brace": 61546,
	"mostinteresting": 61532,
	"fry": 61520,
	"onedoesnot": 61579,
	"yuno": 61527,
	"success": 61544,
	"allthethings": 61533,
	"doge": 8072285,
	"drevil": 40945639,
	"skeptical": 101711,
	"notime": 442575,
	"yodawg": 101716,
	"awkwardpenguin": 61584,
	"ancientalien": 101470,
	"everywhere": 347390,
	"faceplan": 1509839,
	"leocheers": 5496396,
	"africankid": 101288,
	"grumpycat": 405658,
	"whatif": 100947,
	"amionly": 259680,
	"idareyou": 124212,
	"computerguy": 105347391,
	"swatff": 105431428,
	"swatwc": 105431628,
	"swatgang": 105431693,
	"swatsmoke": 105431736,
	"swatbar": 105431773,
	"swatcum": 105431813,
	"swathandwash": 105431844,
	"swatdj": 105431898,
	"swatrussian": 105431949,
	"swatjogging": 105431983
};

exports.meme = {
	usage: 'meme "top text" "bottom text"',
			description: function() {
		var str = "Currently available memes:\n"
		for (var m in meme){
			str += "\t\t" + m + "\n"
		}
		return str;
	},
	process: function(bot,msg,suffix) {
		var tags = msg.content.split('"');
		var memetype = tags[0].split(" ")[1];
		//msg.channel.sendMessage(tags);
		var Imgflipper = require("imgflipper");
		var imgflipper = new Imgflipper(AuthDetails.imgflip_username, AuthDetails.imgflip_password);
		imgflipper.generateMeme(meme[memetype], tags[1]?tags[1]:"", tags[3]?tags[3]:"", function(err, image){
			//console.log(arguments);
			msg.channel.sendMessage(image);
		});
	}
}
