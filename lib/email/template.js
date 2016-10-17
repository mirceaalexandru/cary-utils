'use strict';

const Path = require('path');
const FS = require('fs');

exports.register = function (server, config, next) {
	function getTemplate(templateName, done) {
		let filePath = Path.resolve(server.settings.app.mail.templateFolder, templateName + '.html');
		server.app.logger.info(`User template ${filePath}`);

		FS.readFile(filePath, function (err, content) {
			if (err) return done(err)
			done(err, content.toString())
		})
	}

	server.expose('getTemplate', getTemplate);
	next();
};


exports.register.attributes = {
	name: 'utils-mail-template'
};
