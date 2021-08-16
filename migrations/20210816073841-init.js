'use strict';

var dbm;
var type;
var seed;
var fs = require('fs');
var path = require('path');

exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db, callback) {
  var filePath = path.join(__dirname + '/sql/20210816073841-init.sql');
  fs.readFile(filePath, {encoding: 'utf-8'}, function(err,data){
    if (err) return console.log(err);

    db.runSql(data, function(err) {
      if (err) return console.log(err);
      callback();
    });
  });
};

exports.down = function(db) {
  return null;
};

exports._meta = {
  "version": 1
};
