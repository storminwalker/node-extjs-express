
require.paths.unshift(__dirname);
require.paths.unshift(__dirname + "./../../../node-extjs");

require("node-extjs");

Ext.Loader.setConfig({
      enabled: true,
      paths: {
      	Examples: __dirname
      }
});

Ext.require("Examples.models.User");

var user = Ext.create("Examples.models.User", {
    name : 'Conan',
    age  : 24,
    phone: '555-555-5555'
});

user.changeName();

console.log(user.get('name')); //returns "Conan The Barbarian"

user.posts().add({
	body: "This is a test"
});

console.log(user.getAssociatedData());

var errors = user.validate();

console.log(typeof errors);


