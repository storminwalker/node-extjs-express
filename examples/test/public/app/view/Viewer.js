

Ext.define('ToDoIt.view.Viewer', {
    extend: 'Ext.tab.Panel',
    alias: 'widget.viewer',
    
    requires: ['ToDoIt.view.todo.Show'],
    
    activeItem: 0,
    margins: '5 5 5 5',
    
    initComponent: function() {
        this.items = [{
            xtype: 'todoshow',
            title: 'All'
        }];
        
        this.callParent(arguments);
    }
});
