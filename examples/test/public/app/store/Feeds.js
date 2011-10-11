
Ext.define('ToDoIt.store.Feeds', {
    extend: 'Ext.data.Store',

    model: 'ToDoIt.model.Feed',

    data: [
        { name: 'ToDo', url: "/todo/todo" },
        { name: 'Completed', url: "/todo/completed" },
        { name: 'All', url: "/todo/all" }
    ]
});

