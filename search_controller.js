var express = require("express");
var logfmt = require("logfmt");
var app = express();
var pg = require('pg');

var user_controller = require('/user_controller.java');
var ingredient_controller = require('/ingredient_controller.java');
var history_controller = require('/history_controller.java');
var search_controller = require('/search_controller.java');


var search = function(param1, param2){
    return {errCode : 1};
}

var getRecipeData = function(param1, param2){
    return {errCode : 1};
}

exports.search = search;
exports.getRecipeData = getRecipeData;
