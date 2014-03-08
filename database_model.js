function Database_Model(value) {
    //this.setValue(value);
}

Database_Model.method('setValue', function (value) {
    this.value = value;
    return this;
});

Database_Model.method('getValue', function () {
    return this.value;
});

Database_Model.method('toString', function () {
    return '(' + this.getValue() + ')';
});
