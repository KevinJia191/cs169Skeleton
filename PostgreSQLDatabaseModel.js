function PostgreSQLDatabaseModel(value) {
    //this.setValue(value);
}

PostgreSQLDatabaseModel.inherits(Database_Model);

PostgreSQLDatabaseModel.method('toString', function () {
    if (this.getValue()) {
        return this.uber('toString');
    }
    return "-0-";
});