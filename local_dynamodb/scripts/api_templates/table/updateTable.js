var params = {
    TableName: 'table_name',
    GlobalSecondaryIndexUpdates: [{ // optional
        Update: {
            IndexName: 'index_name',
            ProvisionedThroughput: {
                ReadCapacityUnits: 0,
                WriteCapacityUnits: 0,
            },
        },
    },
        // ... more optional indexes ...
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 0,
        WriteCapacityUnits: 0,
    },
};
dynamodb.updateTable(params, function(err, data) {
    if (err) ppJson(err); // an error occurred
    else ppJson(data); // successful response
});