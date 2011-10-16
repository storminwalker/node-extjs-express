
Ext.define("ToDoIt.model.ToDo", {

	extend: "ToDoIt.shared.model.ToDo",

	fields: [
   		{ name: "type", type: "string" },
        { name: "user_id", type: "string" }
    ],

	proxy: {
        type: "couch.model"
	}
});
