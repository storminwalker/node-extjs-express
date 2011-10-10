
Ext.define("ToDoIt.shared.model.ToDo", {
    extend: 'Ext.data.Model',
    
    idProperty: "_id",
    
    fields: [
    	{ name: '_id', type: 'string' },
        { name: '_rev', type: 'string' },
        { name: 'name', type: 'string'},
        { name: 'createdOn', type: 'date'},
        { name: 'dueOn', type: 'string'},
        { name: 'notes', type: 'string'},
        { name: 'priority', type: 'int'},
        { name: 'completed', type: 'boolean'},
        { name: 'completedOn', type: 'date'},
        { name: 'tags' }
    ],

	validations: [
        { type: 'presence', field: 'name' },
		{ type: 'presence', field: 'dueOn' },		
        { type: 'length', field: 'name', max: 100}
    ]
});
