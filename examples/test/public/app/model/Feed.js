
Ext.define("ToDoIt.model.Feed", {
    extend: "Ext.data.Model",
    
    fields: [
        { name: 'url',  type: 'string' },
        { name: 'name', type: 'string' }
    ],
    
    proxy: {
        type: "memory"
    }
});
