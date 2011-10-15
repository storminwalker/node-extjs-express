
Ext.define('ToDoIt.view.Login', {
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
	
		this.userNameField = Ext.create("widget.textfield", {
			fieldLabel: "Login",
			name: "username"
		});
		
		this.passwordField = Ext.create("widget.textfield", {
			inputType: "password",
			fieldLabel: "Password",
			name: "password"
		});
	
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
				},
				this.userNameField,
				this.passwordField
				]
			}]
		});

		this.addEvents("login");
		this.callParent(arguments);
	},
	
	onRender: function() {
		this.callParent(arguments);
		
		Ext.create("Ext.util.KeyNav", this.getEl(), {
			scope: this,
			enter: this.login
		});

	},
	
	login: function() {
		this.passwordField.blur();
	
		var userName = this.userNameField.getValue();
		var password = this.passwordField.getValue();

		this.fireEvent("login", this, userName, password);  	
	},
	
	reset: function() {
		this.down("form").getForm().reset();
	},
	
	onError: function() {
		this.down("#error-msg").getEl().slideIn();
	}
});

