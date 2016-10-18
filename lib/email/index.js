'use strict';

var ejs = require('ejs')
var nodemailer = require('nodemailer');
var smtpTransport = require("nodemailer-smtp-transport");
var Joi = require('joi');

exports.register = function (server, config, next) {
	var transporter = null;

	function send(input, done) {
		Joi.validate(
			input,
			Joi.object().keys({
				template: Joi.string().min(3).max(30).required(),
				subject: Joi.string().min(3).max(30).required(),
				data: Joi.object(),
				to: Joi.string().email().required(),
				cc: Joi.string().email(),
				bcc: Joi.string().email(),
			}),
			function (err) {
				if (err) {
					return done(err);
				}

				server.plugins['utils-mail-template'].getTemplate(input.template, (err, templateContent) => {
					if (err) {
						return done(err);
					}

					input.server = server.settings.app.web.url;
					input.from = server.settings.app.mail.fromAddress;
					server.app.logger.debug(`Send email: ${JSON.stringify(input, null, 2)}`)

					try {
						input.html = ejs.render(templateContent, input.data);
					}catch (err) {
						if (err) {
							server.app.logger.error(`Send email error: ${err}`);
							return done(err);
						}
					}

					transporter.sendMail(input, function (err){
						if (err) {
							server.app.logger.error(`Send email error: ${err}`)
						}
						done(err);
					});
				})
			});
	}

	function init(done) {
		transporter = nodemailer.createTransport(smtpTransport(server.settings.app.mail.settings));
		done();
	}

	server.expose('send', send);
	init(next);
}


exports.register.attributes = {
	name: 'utils-mail'
};
