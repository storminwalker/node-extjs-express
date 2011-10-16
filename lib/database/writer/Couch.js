

Ext.define("Ext.database.writer.Couch", {
    extend: "Ext.data.writer.Json",
    alias: "writer.couch",

	allowSingle: true,
	encode: false,
	writeAllFields: true,
	
    write: function(request) {
        var operation = request.operation,
            records   = operation.records || [],
            len       = records.length,
            i         = 0,
            data      = [],
			excludes = request.excludes || [],
			deep	 = request.deep || false;

        for (; i < len; i++) {
            data.push(this.getRecordData(records[i], deep, excludes));
        }
        return this.writeRecords(request, data);
    },

    getRecordData: function(record, deep, excludes) {
        var isPhantom = record.phantom === true,
            writeAll = this.writeAllFields || isPhantom,
            nameProperty = this.nameProperty,
            fields = record.fields,
            data = {},
            changes,
            name,
            field,
            key;
        
        if (writeAll) {
            fields.each(function(field){
                if (field.persist && excludes.indexOf(field.name) === -1) {
                    name = field[nameProperty] || field.name;
                    data[name] = record.get(field.name);
                }
            });
            
            if(deep === true) {
				Ext.apply(data, record.getAssociatedData());
			}
        } else {
            // Only write the changes
            changes = record.getChanges();
            for (key in changes) {
                if (changes.hasOwnProperty(key)) {
                    field = fields.get(key);
                    name = field[nameProperty] || field.name;
                    data[name] = changes[key];
                }
            }
            if (!isPhantom) {
                // always include the id for non phantoms
                data[record.idProperty] = record.getId();
            }
        }
        return data;
    }	
})
