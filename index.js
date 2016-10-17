'use strict';

exports.register = function (server, options, next) {
	server.register([
		{
			register: require('./lib/email/index')
		},
		{
			register: require('./lib/email/template')
		},
		{
			register: require('./lib/token')
		}
	], next);
};

exports.register.attributes = {
	pkg: require('./package.json')
};
