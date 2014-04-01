var ActiveRecord = require('./ActiveRecord.js');
var Constants = require('./Constants.js');

function UserRecord(username, hashed_password, salt) {
    ActiveRecord.call(this);
    this.fields["username"] = username;
    this.fields["hashed_password"] = hashed_password;
    this.fields["salt"] = salt;
    this.numFields = Constants.USERS_NUM_FIELDS;
    this.tableName = Constants.USERS_TABLE;
}
UserRecord.prototype = Object.create(ActiveRecord.prototype);
UserRecord.prototype.constructor = ActiveRecord;

module.exports = UserRecord;