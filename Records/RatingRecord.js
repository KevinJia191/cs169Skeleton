var ActiveRecord = require('../Models/ActiveRecord.js');
var Constants = require('../Constants.js');

function RatingRecord(username, recipe_name, rating) {
    ActiveRecord.call(this);
    this.fields["username"] = username;
    this.fields["recipe_name"] = recipe_name;
    this.fields["rating"] = rating;
    this.numFields = Constants.RATINGS_NUM_FIELDS;
    this.tableName = Constants.RATING_TABLE;
}
RatingRecord.prototype = Object.create(ActiveRecord.prototype);
RatingRecord.prototype.constructor = ActiveRecord;

module.exports = RatingRecord;
