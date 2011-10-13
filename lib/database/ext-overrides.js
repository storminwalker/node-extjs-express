
Ext.apply(Ext.data.validations, {
	custom: function(config, value, callback) {
		return (config.handler) ? config.handler.call(config.scope || this, config, value, callback) : true;
	}
});

Ext.override(Ext.data.Model, {
    
	validate: function(callback) {
	console.log("validating!!");
        var errors      = new Ext.data.Errors(),
            validations = (type && this.validations[type]) ? this.validations[type] : this.validations,
            validators  = Ext.data.validations,
            length, validation, field, association, valid, type, i;

        if (validations) {
            length = validations.length;
			var waiting = length;

			function complete() {
				if (!waiting) {
				   callback((errors.getCount() === 0), errors);
				}
			}

            for (i = 0; i < length; i++) {
                validation = validations[i];
                field = validation.field || validation.name;
                type  = validation.type;
                associationName = validation.association;

				if(type === "custom") {
					validation["scope"] = this;
					validators[type](validation, this.get(field), function(valid) {
						if(! valid) {
							errors.add({
								field  : field,
								message: validation.message || validators[type + 'Message'],
								scope: this
							});
                        }
						waiting--;
						complete();
					});
				} else {
					valid = validators[type](validation, this.get(field));
                    if (!valid) {
                        errors.add({
                            field  : field,
                            message: validation.message || validators[type + 'Message'],
                            scope: this
                        });
                    }
                    waiting--;
					complete();
				}
            }
        }
    }
    
    /*
    validate: function(deep, type) {
        var errors      = new Ext.data.Errors(),
            validations = (type && this.validations[type]) ? this.validations[type] : this.validations,
            validators  = Ext.data.validations,
            length, validation, field, association, valid, type, i;

        if (validations) {
            length = validations.length;

            for (i = 0; i < length; i++) {
                validation = validations[i];
                field = validation.field || validation.name;
                type  = validation.type;
                associationName = validation.association;

				if(type === "custom") {
					validation["scope"] = this;
				}
				
                if (type && (type === "custom" || field)) {
                    valid = validators[type](validation, this.get(field));
                    if (!valid) {
                        errors.add({
                            field  : field,
                            message: validation.message || validators[type + 'Message'],
                            scope: this
                        });
                    }
                } else if (deep && associationName && this.associations.map[associationName]) {
                    this[associationName]().each(function (record) {
                        var errs = record.validate(deep, type);
                        if (!errs.isValid()) {
                            errors.addAll(errs.items);
                        }
                    });
                }
            }
        }

        return errors;
    },
    
    isValid: function(deep, type) {
    	var errors = this.validate(deep, type);
    	return (errors.getCount() == 0);
    }*/
});

