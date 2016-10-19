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
			register: require('./lib/aws/sns')
		},
		{
			register: require('./lib/job/index')
		},
		{
			register: require('./lib/token')
		}
	], next);
};

exports.register.attributes = {
	pkg: require('./package.json')
};
