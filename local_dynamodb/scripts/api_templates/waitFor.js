// Waits for tables to be come ACTIVE.
// Useful for waiting for table operations like CreateTable to complete.
var params = {
    TableName: 'table_name',
};
// Supports 'tableExists' and 'tableNotExists'
dynamodb.waitFor('tableExists', params, function(err, data) {
    if (err) ppJson(err); // an error occurred
    else ppJson(data); // successful response
});