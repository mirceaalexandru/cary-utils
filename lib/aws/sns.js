'use strict';

const AWS = require('aws-sdk');
const stringify = require('fast-safe-stringify');

exports.register = (server, config, next) => {
	let sns = null;
	let log = server.app.logger;

	function publishJob ( args, done ) {
		publish(
			args.topic,
			args.subject || 'job',
			args.message,
			args.messageAttributes || null,
			done
		);
	}

	function publish(topic, subject, message, messageAttributes, done) {
		message = JSON.stringify(message);

		let data = {
			TopicArn: topic,
			Subject: subject,
			Message: message
		};

		if (messageAttributes) {
			data.MessageAttributes = messageAttributes;
		}

		sns.publish(data, function (err, result) {
			if (err) {
				log.error({module: 'sns', originalError: err, message: message}, 'Cannot send message to SNS.');
			}

			done(err, result);
		});
	}

	server.expose('publish', publishJob);

	function init(done) {
		log.info(`Using ${stringify(server.settings.app.aws.settings)} as AWS configuration`);
		AWS.config.update(server.settings.app.aws.settings);
		sns = new AWS.SNS();
		done()
	}

	init(next);
}

exports.register.attributes = {
	name: 'utils-aws-sns'
};
