
Ext.define('FV.view.Login', {
	extend: 'Ext.window.Window',

	alias: 'widget.loginwindow',

    requires: ['Ext.form.Panel'],

	height: 200,
	width: 400,
	title: 'Login',
	
	closeAction: 'hide',
	layout: 'fit',
	modal: true,

	initComponent: function() {
		Ext.apply(this, {
			buttons: [{
				text: 'Login',
				scope: this,
				handler: this.login
			}, {
				text: 'Reset',
				scope: this,
				handler: this.reset
			}],
			items: [{
				xtype: 'form',
				bodyStyle: 'padding: 10px;',
				frame: true,
				items: [{
					xtype: "panel",
					itemId: "error-msg",
					html: "Login didn't work",
					hidden: true
				},{
					xtype: 'textfield',
					fieldLabel: 'Login',
					name: 'username'
				},{
					xtype: 'textfield',
					inputType: 'password',
					fieldLabel: 'Password',
					name: 'password'
				}]
			}]
		});

		this.addEvents("login");
		this.callParent(arguments);
	},
	
	login: function() {
		this.down("form > textfield[inputType='password']").blur();
	
		var userName = this.down("form > textfield[name='username']").getValue();
		var password = this.down("form > textfield[name='password']").getValue();

		this.fireEvent("login", this, userName, password);  	
	},
	
	reset: function() {
		this.down("form").getForm().reset();
	},
	
	onError: function() {
		this.down("#error-msg").getEl().slideIn();
	}
});

