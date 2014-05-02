var ActiveRecord = require('./ActiveRecord.js');
var Constants = require('./Constants.js');
var util = require("util");
function IngredientRecord(username, ingredient_name, expiration_date, quantity, unit, notification_sent) {
    ActiveRecord.call(this);
    this.put("username", username);
    this.put("ingredient_name", ingredient_name);
    this.put("expiration_date", expiration_date);
    this.put("quantity", quantity);
    this.put("unit", unit);
    this.put("notification_sent", notification_sent);
    this.numFields = Constants.INGREDIENTS_NUM_FIELDS;
    this.tableName = Constants.INGREDIENTS_TABLE;
}
IngredientRecord.prototype = Object.create(ActiveRecord.prototype);
IngredientRecord.prototype.constructor = ActiveRecord;
//util.inherits(IngredientRecord, ActiveRecord);

module.exports = IngredientRecord;
