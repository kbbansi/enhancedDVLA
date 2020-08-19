const mysql = require('mysql');



let connectionPool = mysql.createPool({
    host: 'mysql-11316-0.cloudclusters.net', //'mysql-11316-0.cloudclusters.net',
    port: 11316, //11316,
    user: 'BaeBoo', //root',
    password: 'recruitBaeBoo', //'root',
    database: 'enhanced_dvla',
    connectionLimit: 30
});

connectionPool.getConnection( function databaseConnection(err, connection){
    if (err) {
        switch (err.code) {
            case 'PROTOCOL_CONNECTION_LOST':
                console.log('Database connection was closed');
                break;
            
            case 'ER_CON_COUNT_ERROR':
                console.log('Database connection limit exceeded');
                break;

            case 'ECONNREFUSED':
                console.log('Database connection was refuesed');
                break;
            
            case 'ECONNREST':
                console.log('The Connection was reset');
                break;
            default:
                console.log(`Encountered error: ${err.code}`);
                break;
        }
    }

    if (connection) {
        console.log('Connection Established');
        console.log(connection.state);
        connection.release();
    }
});

module.exports = connectionPool;
