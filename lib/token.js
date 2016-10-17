'use strict';

const TokenModel = require('./../models/token');

exports.register = (server, config, next) => {
	function genrandstr ( args, done ) {
		var len = args.len || 8
		var dict = args.dict || "abcdefghjkmnpqrstuvwxyzACDEFGHJKLMNPQRSTUVWXYZ2345679";

		var str = "";
		for (var i = 0; i < len; i++) {
			str += dict.charAt(Math.floor(Math.random() * dict.length))
		}

		done(null, str);
	}

	function saveToken (data, done) {
		genrandstr({}, (err, token) => {
			let data = {
				token: token,
				data: data
			};
			TokenModel.create(server.plugins.db.instance, data, (err) => {
				done(null, token);
			})
		})
	}

	server.expose('save', saveToken);
	server.expose('genrandstr', genrandstr)
	next();
}

exports.register.attributes = {
	name: 'utils-token'
};
