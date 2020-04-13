const mongodb = require("mongodb");

mongodb.connect(process.env.CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true }, function(err, client) {
    client.db();
});