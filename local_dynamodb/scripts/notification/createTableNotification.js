var params = {
    TableName: 'Notification',
    AttributeDefinitions: [
        {AttributeName: 'id', AttributeType: 'S'},
        {AttributeName: 'userId', AttributeType: 'S'},
        {AttributeName: 'timestamp', AttributeType: 'N'},
    ],
    KeySchema: [{AttributeName: 'id', KeyType: 'HASH'}],
    GlobalSecondaryIndexes: [{
        IndexName: 'user_id_timestamp_index',
        KeySchema: [
            {AttributeName: 'userId', KeyType: 'HASH'},
            {AttributeName: 'timestamp', KeyType: 'RANGE'}],
        Projection: {ProjectionType: 'ALL',},
        ProvisionedThroughput: {ReadCapacityUnits: 1, WriteCapacityUnits: 1}
    }],
    ProvisionedThroughput: {ReadCapacityUnits: 1, WriteCapacityUnits: 1},
};
dynamodb.createTable(params, function (err, data) {
    if (err) ppJson(err); // an error occurred
    else ppJson(data); // successful response
});