var express = require("express");
var logfmt = require("logfmt");
var app = express();
var pg = require('pg');


var ingredient_controller = require('/ingredientcontroller.js');
var history_controller = require('/historycontroller.js');
var search_controller = require('/searchcontroller.js');

var addUser = function(username, password){
    return {errCode : 1};
}

var login = function(username, password){
    return {errCode : 1};
}

exports.addUser = addUser;
exports.login = login;