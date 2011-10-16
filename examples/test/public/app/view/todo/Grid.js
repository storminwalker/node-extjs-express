
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
	
		Ext.apply(this, {
		    store: 'ToDos',

			columns: [{
				text: 'Priority',
				dataIndex: 'priority',
				width: 75
			},{
				text: 'Created',
				dataIndex: 'createdOn',
				renderer: this.formatDate,
				width: 125
			},{
				text: 'Name',
				dataIndex: 'name',
				flex: 1
			}, /*{
				text: 'Notes',
				dataIndex: 'notes',
				flex: 1
			},*/{
				text: 'Due',
				dataIndex: 'dueOn',
				renderer: this.formatDate
			},{
				text: 'Tags',
				dataIndex: 'tags',
				renderer: this.formatTags
			},{
				xtype: 'checkcolumn',
				header: 'Completed?',
				dataIndex: 'completed',
				width: 75,
				editor: {
					xtype: 'checkbox',
					cls: 'x-grid-checkheader-editor'
				}
			}],
			tbar: [{
				text: 'Add',
				iconCls: 'todo-add',
				action: "add"
			}, {
				itemId: 'deleteTodo',
				text: 'Delete',
				iconCls: 'todo-delete',
				action: "delete",
				disabled: true
			}]
		});

		this.callParent(arguments);
	},

	formatTags: function(tags) {
		return (tags || []).join(", ");
	},
	
	formatDate: function(date) {
		if (!date) {
			return '';
		}

		var now = new Date(),
			d = Ext.Date.clearTime(now, true),
			notime = Ext.Date.clearTime(date, true).getTime();

		if (notime === d.getTime()) {
			return "Today";// at ' + Ext.Date.format(date, 'g:i a');
		}

		d = Ext.Date.add(d, "d", -1);
		if (d.getTime() <= notime) {
			return "Yesterday";// at ' + Ext.Date.format(date, 'g:i a');
//			return Ext.Date.format(date, 'D g:i a');
		}
		return Ext.Date.format(date, "M d, Y"); // g:i a');
	}
});

