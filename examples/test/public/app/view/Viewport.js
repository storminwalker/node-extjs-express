
Ext.define('ToDoIt.view.Viewport', {
    extend: 'Ext.container.Viewport',

    requires: [
        'ToDoIt.view.Viewer',
        'ToDoIt.view.todo.List',
        'Ext.layout.container.Border'
    ],

	layout: 'border',

	items: [{
		region: 'center',
		xtype: 'viewer'
	}, {
		region: 'west',
		width: 225,
		xtype: 'feedlist'
	}]
});

