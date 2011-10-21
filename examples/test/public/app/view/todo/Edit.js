
Ext.define("ToDoIt.view.todo.Edit", {
	extend: "Ext.form.Panel",
	alias: "widget.todoedit",

	initComponent: function() {
	
		Ext.apply(this, {
			region: 'south',
			frame: true,
			border: true,
			title: "Edit ToDo",
			bodyStyle:'padding:5px 5px 0',
			collapsible: true,
			collapseDirection: "bottom",
			items: [{
				fieldLabel: 'Action',
				xtype: 'textfield',
				name: 'name',
				anchor: "100%"
			}, {
				xtype: "container",
				anchor: '100%',
				layout:'column',
				defaults: {
					xtype: "container",
					columnWidth: 0.5,
					layout: 'anchor',
					border: false
				},
				items: [{
					items: [{
						xtype: 'datefield',
						fieldLabel: 'Due Date',
						name: "dueOn",
						anchor:'96%'
					},{
						xtype: 'textfield',
						fieldLabel: 'Tags',
						name: "tags",
						anchor:'96%'
					}]
				},{
					items: [{
						xtype: "numberfield",
						fieldLabel: 'Priority',
						anchor:'100%',
						name: "priority"
					},{
						xtype: 'combobox',
						name: 'status',
						mode: 'local',
						store: ['Open', 'On Hold', 'Waiting', 'Inactive'],
						editable: true,
						forceSelection: true,
						triggerAction: 'all',
						emptyText: 'Status',
						selectOnFocus: true,
						typeAhead: true,
						fieldLabel: 'Status',
						anchor:'100%'
					}]
				}]
			}, {
				xtype: 'htmleditor',
				name: 'notes',
				fieldLabel: 'Notes',
				height: 200,
				anchor: '100%'
        	}],
			buttons: [{
				text: "Save",
				action: "save"
			},{
				text: "Cancel",
				action: "cancel"
			}]
		});
		
		this.callParent(arguments);
	},
	
	onRender: function() {
		this.callParent(arguments);
	}
});
