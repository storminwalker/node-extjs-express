require.paths.unshift(__dirname);
require.paths.unshift(__dirname + "./../../../node-extjs");

require("node-extjs");

console.log(Ext.getVersion().version);

Ext.ns("ext");
Ext.require("ext.test");

console.log(new ext.test());

console.log(new ext.test({
	listeners: {
		"test": function() {
			console.log("yada");
		}
	}
}).getFoo());

var yada = Ext.create("ext.test");
console.log(yada);

yada.on({
	test: function() {
		console.log("yada again");
	}
});

console.log(yada.getFoo());

var callbackTest = function() {
	console.log("callbacked");
	console.log(this);
	console.log("callbacked end");
}

Ext.callback(callbackTest, yada);


var bindTest = function() {
	console.log("binding");
	console.log(this);
	console.log("binding end");
}

Ext.bind(bindTest, yada)();
