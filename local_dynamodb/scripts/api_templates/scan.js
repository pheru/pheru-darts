var params = {
    TableName: 'table_name',
    Limit: 0, // optional (limit the number of items to evaluate)
    FilterExpression: 'attribute_name = :value', // a string representing a constraint on the attribute
    ExpressionAttributeNames: { // a map of substitutions for attribute names with special characters
        //'#name': 'attribute name'
    },
    ExpressionAttributeValues: { // a map of substitutions for all attribute values
        ':value': 'STRING_VALUE'
    },
    Select: 'ALL_ATTRIBUTES', // optional (ALL_ATTRIBUTES | ALL_PROJECTED_ATTRIBUTES |
                              //           SPECIFIC_ATTRIBUTES | COUNT)
    AttributesToGet: [ // optional (list of specific attribute names to return)
        'attribute_name',
        // ... more attributes ...
    ],
    ConsistentRead: false, // optional (true | false)
    Segment: 0, // optional (for parallel scan)
    TotalSegments: 0, // optional (for parallel scan)
    ExclusiveStartKey: { // optional (for pagination, returned by prior calls as LastEvaluatedKey)
        attribute_name: attribute_value,
        // attribute_value (string | number | boolean | null | Binary | DynamoDBSet | Array | Object)
        // anotherKey: ...
    },
    ReturnConsumedCapacity: 'NONE', // optional (NONE | TOTAL | INDEXES)
};
dynamodb.scan(params, function(err, data) {
    if (err) ppJson(err); // an error occurred
    else ppJson(data); // successful response
});