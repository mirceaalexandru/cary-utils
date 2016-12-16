'use strict';

const Joi = require('joi');
const Stringify = require('fast-safe-stringify');
const uuid = require('uuid');

exports.register = (server, config, next) => {
	let log = server.app.logger;

	const internalConnection = server.select('internal');
	internalConnection.route({
		method: 'POST',
		path: '/job/progress/notify',
		config: {
			description: 'Job progress update',
			tags: ['service'],
			auth: false,
			response: {
				failAction: 'log',
				status: {
					200: Joi.object({})
				}
			}
		},
		handler: (request, reply) => {
			reply({});
		}
	});

	internalConnection.route({
		method: 'GET',
		path: '/test',
		config: {
			description: 'Job progress update',
			tags: ['service'],
			auth: false,
			response: {
				failAction: 'log',
				status: {
					200: Joi.object({})
				}
			}
		},
		handler: (request, reply) => {
			if (request.payload.userId) {
				server.plugins['utils-job'].notifyJobStatus(request.payload);
			}
			reply({});
		}
	});

	next();
}

exports.register.attributes = {
	name: 'utils-job-api'
};
