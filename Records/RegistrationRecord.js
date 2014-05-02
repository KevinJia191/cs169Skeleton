var ActiveRecord = require('../Models/ActiveRecord.js');
var Constants = require('../Constants.js');

function RegistrationRecord(username, reg_id) {
    ActiveRecord.call(this);
    this.put["username"] = username;
    this.put["reg_id"] = reg_id;
    this.numFields = Constants.REGISTRATION_NUM_FIELDS;
    this.tableName = Constants.REGISTRATION_TABLE;
}
RegistrationRecord.prototype = Object.create(ActiveRecord.prototype);
RegistrationRecord.prototype.constructor = ActiveRecord;

module.exports = RegistrationRecord;