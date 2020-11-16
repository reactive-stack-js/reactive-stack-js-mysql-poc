![reactive-stack-js](https://avatars0.githubusercontent.com/u/72337471?s=75)
## reactive-stack-js-mysql-poc

See [reactive-stack-js](https://github.com/reactive-stack-js) for more info.

This is a MySQL Change Data Capture (CDC) POC for those who may want to use MySQL instead of MongoDB, which is used in all reactive-stack-js packages.

In this POC, I am using [Docker](https://www.docker.com/) to run MySQL because... well, why not?

You can, of course, still use your own MySQL installation instead. Just skip all the Docker stuff below.

### Requirements
Well, [Docker](https://www.docker.com/).

And, [NodeJS](https://nodejs.org/)

### Docker stuff

Pull the mysql image:
```cmd
docker pull mysql
```

Start the mysql container:
```cmd
docker run -p 3306:3306 -v C:/git/github/reactive-stack-js-mysql-poc/mysqlconf:/etc/mysql/conf.d -v C:/git/github/reactive-stack-js-mysql-poc/mysqlvolume:/var/lib/mysql --name mysql -e MYSQL_ROOT_PASSWORD=root -d mysql
```

__NOTE__: _Replace ```C:/git/github/reactive-stack-js-mysql-poc/``` with your folder path._

At this point, you can use your prefered MySQL GUI, like [HeidiSQL](https://www.heidisql.com/) for example.

Or you can use the console:
```cmd
docker exec -it mysql bash
```
```mysql
mysql -u root -p db2mirror
```

__NOTE__: _You will have to create db2mirror once, of course._

Run the following MySQL commands:
```mysql
CREATE USER 'root' IDENTIFIED BY 'root';
ALTER USER 'root' IDENTIFIED WITH mysql_native_password BY 'root';
flush privileges;

GRANT REPLICATION SLAVE ON *.* TO 'root';

CREATE DATABASE `db2mirror`;

CREATE TABLE `glob_locks` (
	`GLOB_LOCK_ID` INT(11) NOT NULL,
	`RES_NAME` VARCHAR(128),
	`MESSAGE` MEDIUMTEXT,
	PRIMARY KEY (`GLOB_LOCK_ID`) USING BTREE
);
```

Since we are mounting the volume in the above Docker run command, the above MySQL commands only need to be executed once.

### MySQL CDC
```cmd
yarn cdc
```
or
```cmd
node mysql.js
```
Then do something in your MySQL instance, create, modify or delete a row and you will see messages like those listed in the [out.mysql.events](out.mysql.events) file.

Enjoy :)