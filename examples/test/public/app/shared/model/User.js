
Ext.define("ToDoIt.shared.model.User", {
    extend: 'Ext.data.Model',
    
    idProperty: "_id",
    
    fields: [
    	{ name: "_id", type: "string" },
        { name: "_rev", type: "string" },
        { name: "firstName", type: "string" },
        { name: "lastName", type: "string" },
        { name: "userName", type: "string" },
        { name: "email", type: "string" },
        { name: "password", type: "string" }
    ],

	validations: [
    	{ type: "format", field: "username", matcher: /([a-z]+)[0-9]{2,3}/ }
    ]
    
});
