
Ext.define('ToDoIt.store.Feeds', {
    extend: 'Ext.data.Store',

    model: 'ToDoIt.model.Feed',

    data: [
        { name: 'ToDo', description: "Still to do...", params: { completed: false }},
        { name: 'Completed', description: "Completed", params: { completed: true }},
        { name: 'All', description: "All", params: null}
    ]
});

