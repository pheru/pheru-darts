var params = {
    ExclusiveStartTableName: 'table_name', // optional (for pagination, returned as LastEvaluatedTableName)
    Limit: 0, // optional (to further limit the number of table names returned per page)
};
dynamodb.listTables(params, function(err, data) {
    if (err) ppJson(err); // an error occurred
    else ppJson(data); // successful response
});