'use strict';

var TokenColl = 'token';

function create(DB, user, done) {
	DB.insert(TokenColl, user, done);
}

function findOne(DB, cond, done) {
	DB.findOne(TokenColl, cond, done);
}

exports.create = create;
exports.findOne = findOne;
