
Ext.define("ToDoIt.view.todo.Show", {
	extend: "Ext.panel.Panel",
	alias: "widget.todoshow",

    requires: [
        "ToDoIt.view.todo.Grid",
        "ToDoIt.view.todo.Edit"
    ],

	closable: false,
	
	layout: {
		type: 'vbox',
		align : "stretch",
		pack: "start"
	},

	initComponent: function() {
		Ext.apply(this, {
			items: [{
				xtype: 'todogrid',
				flex: 1
			},{
				xtype: "todoedit"
			}]
		});

		this.callParent(arguments);
	}
});

