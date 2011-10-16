
Ext.define('ToDoIt.store.ToDos', {
    extend: 'Ext.data.Store',

    model: 'ToDoIt.model.ToDo',

	proxy: {
		type: "json",
		url: "/todo/all",
		reader: {
			type: "json",
			idProperty: "_id",
			root: "rows",
			totalProperty: "total_rows"
		}
	},

	sorters: [{
		property: "priority",
		direction: "ASC"
	},{
		property: "dueOn",
		direction: "DESC"	
	}]
});

