var express = require("express");
var logfmt = require("logfmt");
var app = express();
var pg = require('pg');

var user_controller = require('./usercontroller.js');
var history_controller = require('./historycontroller.js');
var search_controller = require('./searchcontroller.js');


//Take in a Ingredient Object eventually
var addIngredient = function (user, ingredient_name, quantity, unit, expiration_date){
    return {errCode : 1};
}

//Take in a Ingredient Object eventually
var removeIngredient = function(user, ingredient_name, quantity, unit, expiration_date){
    return {errCode : 1};
}

var removeAll = function(user){
    return {errCode : 1};
}

var getInventory = function(user){
    return {errCode : 1};
}

exports.addIngredient = addIngredient;
exports.removeIngredient = removeIngredient;
exports.removeAll = removeAll;
exports.getInventory = getInventory;

