
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

	sortInfo: {
		property: 'priority',
		direction: 'ASC'
	}
});

