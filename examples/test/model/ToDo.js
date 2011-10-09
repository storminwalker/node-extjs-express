
Ext.define("ToDoIt.model.ToDo", {

	extend: "ToDoIt.shared.model.ToDo",

	proxy: {
        type: "couch.model"
	}
});
