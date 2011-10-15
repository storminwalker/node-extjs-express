
Ext.define("ToDoIt.model.ToDo", {
	extend: "ToDoIt.shared.model.ToDo",
	
	proxy: {
        type: 'rest',
        //url: 'http://localhost:5984',
        //url: 'http://shaneavery.couchone.com',
        api: {
            create  : '/todo',
            read    : '/todo',
            update  : '/todo',
            destroy : '/todo'
        },
       // idProperty: '_id',
        appendId: true,
       //noCache: true,
        reader: {
            type: 'json',
            root: 'rows',
            idProperty : '_id',
            totalProperty: 'total_rows'
        },
        writer: {
            //nameProperty: 'mapping',
            allowSingle: true,
            encode: false,
            writeAllFields: true,
            root: ''
        }
    }
});
