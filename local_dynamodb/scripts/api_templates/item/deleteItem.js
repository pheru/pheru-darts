var params = {
    TableName: 'table_name',
    Key: { // a map of attribute name to AttributeValue for all primary key attributes

        attribute_name: attribute_value,
        // attribute_value (string | number | boolean | null | Binary)
        // more attributes...

    },
    ConditionExpression: 'attribute_exists(attribute_name)', // optional String describing the constraint to be placed on an attribute
    ExpressionAttributeNames: { // a map of substitutions for attribute names with special characters
        //'#name': 'attribute name'
    },
    ExpressionAttributeValues: { // a map of substitutions for all attribute values
        //':value': 'VALUE'
    },
    ReturnValues: 'NONE', // optional (NONE | ALL_OLD)
    ReturnConsumedCapacity: 'NONE', // optional (NONE | TOTAL | INDEXES)
    ReturnItemCollectionMetrics: 'NONE', // optional (NONE | SIZE)
};
docClient.delete(params, function(err, data) {
    if (err) ppJson(err); // an error occurred
    else ppJson(data); // successful response
});