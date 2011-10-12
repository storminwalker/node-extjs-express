
Ext.define('ToDoIt.view.todo.List', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.todolist',

	title: 'ToDos',
	collapsible: true,
	animCollapse: true,
	margins: '5 0 5 5',
	layout: 'fit',

	initComponent: function() {
		Ext.apply(this, {
			items: [{
				xtype: 'dataview',
				trackOver: true,
				store: this.store,
				cls: 'feed-list',
				itemSelector: '.feed-list-item',
				overItemCls: 'feed-list-item-hover',
				tpl: '<tpl for="."><div class="feed-list-item">{description}</div></tpl>'
			}]
		});

		this.callParent(arguments);
	}
});

