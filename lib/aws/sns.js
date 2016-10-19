'use strict';

var AWS = require('aws-sdk');

exports.register = (server, config, next) => {
	var sns = null;

	function publishJob ( args, done ) {
		publish(
			server.settings.app.sns.joburl,
			args.subject || 'job',
			args.message,
			args.messageAttributes || null,
			done
		);
	}

	function publish(topic, subject, message, messageAttributes, done) {
		message = JSON.stringify(message);

		var data = {
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

	server.expose('publishJob', publishJob);

	function init(done) {
		//AWS.config.update(server.settings.app.aws);
		//sns = new AWS.SNS();
		done()
	}

	init(next);
}

exports.register.attributes = {
	name: 'utils-aws-sns'
};
