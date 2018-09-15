var params = {
    TableName: 'table_name',
    Key: { // a map of attribute name to AttributeValue for all primary key attributes

        attribute_name: attribute_value, //(string | number | boolean | null | Binary)
        // more attributes...

    },
    AttributesToGet: [ // optional (list of specific attribute names to return)
        'attribute_name',
        // ... more attribute names ...
    ],
    ConsistentRead: false, // optional (true | false)
    ReturnConsumedCapacity: 'NONE', // optional (NONE | TOTAL | INDEXES)
};
docClient.get(params, function(err, data) {
    if (err) ppJson(err); // an error occurred
    else ppJson(data); // successful response
});