
Ext.define("ToDoIt.view.todo.Grid", {
	extend: "Ext.grid.Panel",
	alias: "widget.todogrid",

	cls: "todo-grid",
	
    requires: [
    	"Ext.toolbar.Toolbar",
   		"Ext.ux.CheckColumn"
    ],
    
    border: false,
    
	initComponent: function() {
	
		var rowEditing = Ext.create('Ext.grid.plugin.RowEditing', {
			clicksToMoveEditor: 1
		});
	
		Ext.apply(this, {
		    store: 'ToDos',

			columns: [{
				text: 'Priority',
				dataIndex: 'priority'
			},{
				text: 'Created',
				dataIndex: 'createdOn',
				renderer: this.formatDate
			},{
				text: 'Name',
				dataIndex: 'name',
			}, {
				text: 'Notes',
				dataIndex: 'notes',
			},  {
				text: 'Due',
				dataIndex: 'dueOn',
				renderer: this.formatDate
			},{
				text: 'Tags',
				dataIndex: 'tags',
			},{
				xtype: 'checkcolumn',
				header: 'Completed?',
				dataIndex: 'completed',
				width: 60,
				editor: {
					xtype: 'checkbox',
					cls: 'x-grid-checkheader-editor'
				}
			}]
		});
			/*,
			
			tbar: [{
				text: 'Add',
				iconCls: 'todo-add',
				handler : function() {
					rowEditing.cancelEdit();
	
					// Create a model instance
					var r = Ext.create('Employee', {
						name: 'New Guy',
						email: 'new@sencha-test.com',
						start: new Date(),
						salary: 50000,
						active: true
					});
	
					store.insert(0, r);
					rowEditing.startEdit(0, 0);
				}
			}, {
				itemId: 'deleteTodo',
				text: 'Delete',
				iconCls: 'todo-delete',
				handler: function() {
					var sm = grid.getSelectionModel();
					rowEditing.cancelEdit();
					store.remove(sm.getSelection());
					if (store.getCount() > 0) {
						sm.select(0);
					}
				},
				disabled: true
			}],
	        plugins: [rowEditing],
			listeners: {
				'selectionchange': function(view, records) {
					grid.down('#deleteTodo').setDisabled(!records.length);
				}
			}
		});
*/
		this.callParent(arguments);
	},

	formatDate: function(date) {
		if (!date) {
			return '';
		}

		var now = new Date(),
			d = Ext.Date.clearTime(now, true),
			notime = Ext.Date.clearTime(date, true).getTime();

		if (notime === d.getTime()) {
			return 'Today ' + Ext.Date.format(date, 'g:i a');
		}

		d = Ext.Date.add(d, 'd', -6);
		if (d.getTime() <= notime) {
			return Ext.Date.format(date, 'D g:i a');
		}
		return Ext.Date.format(date, 'Y/m/d g:i a');
	}
});

