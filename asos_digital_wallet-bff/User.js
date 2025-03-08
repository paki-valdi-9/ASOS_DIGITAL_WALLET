import dotenv from 'dotenv';
import mysql from "mysql2";


dotenv.config()


class User {
    constructor(id, username, password, email, card1, card2, balance=0, country, twoFa) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.email = email;
        this.card1 = card1;
        this.card2 = card2;
        this.balance = balance;
        this.country = country;
        this.twoFa = twoFa
    }


    async createUser() {
        try {
            const connection = await mysql.createConnection({
                host: process.env.MYSQL_HOST,
                database: process.env.MYSQL_DATABASE,
                user: process.env.MYSQL_USER,
                password: process.env.MYSQL_PASSWORD
            });

            console.log(this.email)
            const userCheck = await this.getUserByEmail(this.email)

            if(userCheck !== null){
                console.log("user already exists")
                return null;
            }


            // Assuming the 'Users' table has columns: 'email', 'name', and 'password'
            const [result] = await connection.execute(
                'INSERT INTO Users (email, name, password, balance) VALUES (?, ?, ?, ?)',
                [this.email, this.username, this.password, this.balance]
            );

            // Close the database connection
            await connection.end();

            // Check if the user was successfully created
            if (result.affectedRows === 1) {
                console.log('User created successfully.');
                this.id = result.insertId;
                this.balance = 0; // You may need to adjust the balance and twofa values accordingly
                console.log('User ID:', this.id);
                return this;
            } else {
                console.error('User creation failed.');
                return null;
            }
        } catch (error) {
            console.error('Error creating user:', error.message);
            return null;
        }
    }










    //migt be capital U the issue







    async getUserByEmail(email) {
        try {
            console.log("test1")

            const connection = await mysql.createConnection({
                host: process.env.MYSQL_HOST,
                database: process.env.MYSQL_DATABASE,
                user: process.env.MYSQL_USER,
                password: process.env.MYSQL_PASSWORD
            });

            console.log('SQL Query:', 'SELECT * FROM Users WHERE email = ?', [email]);
            const [rows] = await connection.query('SELECT * FROM Users WHERE email = ?', [email.trim()]);
            console.log('Query Results:', rows);

            console.log("test4")
            if (rows !== null) {
                const userData = rows;
                return new User(userData.id, userData.email, userData.name, userData.password, userData.balance, userData.twoFa);
            } else {
                console.log('User not found.');
                return null;
            }
        } catch (error) {
            console.error('Error getting user by email:', error.message);
            return null;
        }
    }


    // // Get user by ID
    // getUserById(id) {
    //     // Assume you have a method to interact with the database to retrieve a user by ID
    //     const user = /* Database operation to get user by ID */;
    //     return user;
    // }
    //
    // // Get user by email
    // getUserByEmail(email) {
    //     // Assume you have a method to interact with the database to retrieve a user by email
    //     const user = /* Database operation to get user by email */;
    //     return user;
    // }
    //
    // // Add a card to the user
    // addCard(userId, card) {
    //     // Assume you have a method to interact with the database to add a card to the user
    //     /* Database operation to add card to user */;
    // }
    //
    // // Remove a card from the user
    // removeCard(userId, cardId) {
    //     // Assume you have a method to interact with the database to remove a card from the user
    //     /* Database operation to remove card from user */;
    // }
    //
    // // Update username
    // updateUserName(id, newUserName) {
    //     // Assume you have a method to interact with the database to update the username
    //     /* Database operation to update username */;
    // }
    //
    // // Update email
    // updateEmail(id, newEmail) {
    //     // Assume you have a method to interact with the database to update the email
    //     /* Database operation to update email */;
    // }
}

export default User;