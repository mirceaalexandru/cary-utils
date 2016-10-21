'use strict';

const Joi = require('joi');
const Stringify = require('fast-safe-stringify');
const uuid = require('node-uuid');

exports.register = (server, config, next) => {
	let log = server.app.logger;

	// register job progress subscription
	server.subscription('/job/progress', {
		filter: function (path, message, options, next) {
			return next(message.userId === options.credentials.userId);
		}
	});

	function notifyJobStatus(status, done){
		server.publish('/job/progress', status);
		done && done();
	}

	function send(args, done) {
		Joi.validate(
			args,
			Joi.object().keys({
				job: Joi.string().min(3).max(30).required(),
				jobId: Joi.string().min(3).max(30),
				data: Joi.object().required(),
			})
			, (err) => {
				if (err) {
					log.error(err);
					return done("Invalid job");
				}

				args.jobId = args.jobId || uuid.v4();

				log.info(`Send job ${Stringify(args)}`);
				let job = {
					topic: server.settings.app.aws.jobSNS,
					message: args
				}
				server.plugins['utils-aws-sns'].publish(job, function (err) {
					if (err) {
						log.error(`Error sending job: ${err}`);
					}
					done();
				})
			})
	}

	server.expose('send', send);
	server.expose('notifyJobStatus', notifyJobStatus);

	next();
}

exports.register.attributes = {
	name: 'utils-job'
};
