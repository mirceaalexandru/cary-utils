'use strict';

const stringify = require('fast-safe-stringify');

exports.register = (server, config, next) => {
	let log = server.app.logger;

	function send ( args, done ) {
		log.info(`Send alert ${stringify(args)}`);
		var job = {
			topic: server.settings.app.aws.alertSNS,
			message: args
		}
		server.plugins['utils-aws-sns'].publish(job, function (err) {
			if (err) {
				log.error(`Error sending alert: ${err}`);
			}
			done();
		})
	}

	server.expose('send', send);
	next();
}

exports.register.attributes = {
	name: 'utils-alert'
};
