
Ext.define("ToDoIt.shared.model.User", {
    extend: 'Ext.data.Model',
    
    idProperty: "_id",
    
    fields: [
    	{ name: "_id", type: "string" },
        { name: "_rev", type: "string" },
        { name: "name",     type: "string" },
        { name: "username", type: "string" },
        { name: "password", type: "string" },
        { name: "salt", type: "string" }
    ],

	validations: [
    	{ type: "format", field: "username", matcher: /([a-z]+)[0-9]{2,3}/ }
    ]
    
});
