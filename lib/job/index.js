'use strict';

const stringify = require('fast-safe-stringify');

exports.register = (server, config, next) => {
	let log = server.app.logger;

	function send ( args, done ) {
		log.info(`Send job ${stringify(args)}`);
		var job = {
			topic: server.settings.app.aws.jobSNS,
			message: args
		}
		server.plugins['utils-aws-sns'].publish(job, function (err) {
			if (err) {
				log.error(`Error sending job: ${err}`);
			}
			done();
		})
	}

	server.expose('send', send);
	next();
}

exports.register.attributes = {
	name: 'utils-job'
};
