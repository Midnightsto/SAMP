exports.run = async (client,message, args) =>{
console.log("cat works")
const request = require('request');
request.get('http://thecatapi.com/api/images/get?format=src&type=gif', {

}, function(error, response, body) {
	if(!error && response.statusCode == 200) {
		message.channel.send(response.request.uri.href);
	} else {
		console.log(error);
	}
})
}
module.exports.help = {
    name:"cat",
    usage:"cat"
}