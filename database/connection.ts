  GNU nano 6.2                                                                                                                                                     connection.ts                                                                                                                                                              
import {
    createConnection,
    Connection
} from "mysql";

const options = {
    host: process.env.HOST,
    port: process.env.PORT ? Number(process.env.PORT) : 3306,
    user: process.env.DB_USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
};

const uri = `mysql://${options.user}:${options.password}@${options.host}:${options.port}/${options.database}`;

const mysql: Connection = createConnection(uri);
export default {
    mysql,
    async executeQueries(): Promise<void> {
        const queries = [
            `CREATE TABLE IF NOT EXISTS invites (
                id int(11) PRIMARY KEY AUTO_INCREMENT,
                user varchar(25) NOT NULL,
                guild varchar(25) NOT NULL,
                inviter varchar(25) NOT NULL,
                code varchar(10) NOT NULL,
                fake tinyint(1) NOT NULL,
                inactive tinyint(1) NOT NULL,
                active tinyint(1) DEFAULT 0 NOT NULL
            );`,
            `CREATE TABLE IF NOT EXISTS leaves (
                id int(11) PRIMARY KEY AUTO_INCREMENT,
                user varchar(25) NOT NULL,
                guild varchar(25) NOT NULL,
                inviter varchar(25) NOT NULL,
                code varchar(10) NOT NULL,
                fake tinyint(1) NOT NULL,
                inactive tinyint(1) NOT NULL
            );`,
            `CREATE TABLE IF NOT EXISTS bonus (
                id int(11) PRIMARY KEY AUTO_INCREMENT,
                user varchar(25) NOT NULL,
                guild varchar(25) NOT NULL,
                bonus int(11) NOT NULL
            );`,
            `CREATE TABLE IF NOT EXISTS links (
                id int(11) PRIMARY KEY AUTO_INCREMENT,
                user varchar(25) NOT NULL,
                guild varchar(25) NOT NULL,
                code varchar(10) NOT NULL
            );`,
            `CREATE TABLE IF NOT EXISTS channels (
                id int(11) PRIMARY KEY AUTO_INCREMENT,
                setup tinyint(1) NOT NULL,
                guild varchar(25) NOT NULL,
                welcome varchar(25) DEFAULT 'undefined' NOT NULL,
                \`leave\` varchar(25) DEFAULT 'undefined' NOT NULL,
                log varchar(25) DEFAULT 'undefined' NOT NULL
            );`
        ];

        for (let query of queries) {
            try {
                await mysql.query(query);
            } catch (error) {
                console.log(error);
            }
        }
    }
}
