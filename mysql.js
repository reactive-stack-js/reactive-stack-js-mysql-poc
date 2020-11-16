const mysql = require('mysql');
const MySQLEvents = require('@rodrigogs/mysql-events');

const _testConnection = () => {
	const connection = mysql.createConnection({
		host: 'localhost',
		user: 'root',
		password: 'root',
		database: 'db2mirror'
	});

	connection.connect();
	connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
		if (error) throw error;
		console.log('The solution is: ', results[0].solution);
	});
	connection.end();
};

const program = async () => {
	const connection = mysql.createConnection({
		host: 'localhost',
		user: 'root',
		password: 'root',
		database: 'db2mirror'
	});

	// connection.host = 'localhost';
	// connection.user = 'root';
	// connection.password = 'root';
	// connection.database = 'db2mirror';
	const instance = new MySQLEvents(connection, {
		startAtEnd: true,
		excludedSchemas: {
			mysql: true
		}
	});

	await instance.start();

	instance.addTrigger({
		name: 'TEST',
		expression: '*',
		statement: MySQLEvents.STATEMENTS.ALL,
		onEvent: (event) => {	// You will receive the events here
			console.log(JSON.stringify(event, null, 4));
		}
	});

	instance.on(MySQLEvents.EVENTS.CONNECTION_ERROR, console.error);
	instance.on(MySQLEvents.EVENTS.ZONGJI_ERROR, console.error);
};

program()
	.then(() => console.log('Waiting for mysql database events...'))
	.catch(console.error);