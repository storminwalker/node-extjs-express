
Ext.define("ToDoIt.model.Feed", {
    extend: "Ext.data.Model",
    
    fields: [
        { name: "name", type: "string" },
        { name: "description", type: "string" },
        { name: "params" }
    ],
    
    proxy: {
        type: "memory"
    }
});
