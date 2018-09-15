var params = {
    TableName: 'User',
    AttributeDefinitions: [
        {AttributeName: 'name', AttributeType: 'S'},
        {AttributeName: 'id', AttributeType: 'S'}
    ],
    KeySchema: [{AttributeName: 'id', KeyType: 'HASH'}],
    GlobalSecondaryIndexes: [{
        IndexName: 'name_index',
        KeySchema: [{AttributeName: 'name', KeyType: 'HASH'}],
        Projection: {ProjectionType: 'ALL',},
        ProvisionedThroughput: {ReadCapacityUnits: 1, WriteCapacityUnits: 1}
    }],
    ProvisionedThroughput: {ReadCapacityUnits: 1, WriteCapacityUnits: 1},
};
dynamodb.createTable(params, function (err, data) {
    if (err) ppJson(err); // an error occurred
    else ppJson(data); // successful response
});