
Ext.define("ToDoIt.model.ToDo", {
	extend: "ToDoIt.shared.model.ToDo",
	
	proxy: {
        type: 'rest',
        api: {
            create  : '/todo',
            read    : '/todo',
            update  : '/todo',
            destroy : '/todo'
        },
        appendId: true,
        noCache: true,
        reader: {
            type: 'json',
            root: 'rows',
            idProperty : '_id',
            totalProperty: 'total_rows'
        },
        writer: {
            allowSingle: true,
            encode: false,
            writeAllFields: true,
            root: ''
        }
    }
});
