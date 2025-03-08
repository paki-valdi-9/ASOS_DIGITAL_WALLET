import dotenv from 'dotenv';
import mysql from "mysql2";

dotenv.config()

const pool = mysql.createPool({
	host: process.env.MYSQL_HOST,
	database: process.env.MYSQL_DATABASE,
	user: process.env.MYSQL_USER,
	password: process.env.MYSQL_PASSWORD
}).promise()

export async function getAllUsers() {
	const [rows] = await pool.query("SELECT * FROM users");
	return rows
}

export async function getUserById(id) {
	const [rows] = await pool.query("SELECT * from users WHERE id = ?", [id]);
	if(rows.length === 0) {
		return null;
	}
	return rows[0];
}

export async function getUserByEmail(email) {
	const [rows] = await pool.query("SELECT * from users WHERE email = ?", [email]);
	if(rows.length === 0) {
		return null;
	}
	return rows[0];
}

export async function getUserBalance(id) {
	const [rows] = await pool.query("SELECT balance from users WHERE id = ?", [id]);
	if(rows.length === 0) {
		return null;
	}
	return rows[0].balance;
}

export async function getSecret(id) {
	const [rows] = await pool.query("SELECT twoFA from users WHERE id = ?", [id]);
	if(rows.length === 0) {
		return null;
	}
	return rows[0];
}

export async function createUser(email, name, currency, password) {
	const testUser = await getUserByEmail(email);
	if(testUser !== null) {
		return null;
	}
	const [result] = await pool.query("INSERT INTO users (email, name, currency, password, balance) VALUES (?, ?, ?, ?, ?)", [email, name, currency, password, 0]);
	return getUserById(result.insertId);
}

export async function updatePassword(userId, newPassword) {
	const [rows] = await pool.query("UPDATE users SET password = ? WHERE id = ?", [newPassword, userId]);
	if (rows.length === 0) {
		return null;
	}

	return rows[0];
}

export async function update2fa(userId, secret) {
	const [rows] = await pool.query("UPDATE users SET twoFA = ? WHERE id = ?", [secret, userId]);
	if (rows.length === 0) {
		return null;
	}

	return rows[0];
}


export async function getCardById(id) {
	const [rows] = await pool.query("SELECT * from cards WHERE id = ?", [id]);
	if(rows.length === 0) {
		return null;
	}
	return rows[0];
}

export async function createCard(userId, number, expirationDate, CVV, nameOnCard, type) {
	try	{
		const [result] = await pool.query("INSERT INTO cards (userId, number, expirationDate, CVV, nameOnCard, type) VALUES (?, ?, ?, ?, ?, ?)", [userId, number, expirationDate, CVV, nameOnCard, type]);

		return getCardById(result.insertId);
	} catch {
		return res.status(500).json({ message: "Erroree" });
	}
}

export async function addCardToUser(userId, cardId, slot) {

	const user = await getUserById(userId);

	if(slot === 1){
		if(user.card1 == null) {
			const [uRows] = await pool.query("UPDATE users SET card1 = ? WHERE id = ?", [cardId, userId]);
			const [cRows] = await pool.query("UPDATE cards SET userId = ? WHERE id = ?", [userId, cardId]);
			return 1;
		}else {
			return 0;
		}
	}else if(slot === 2){
		if(user.card2 == null) {
			const [uRows] = await pool.query("UPDATE users SET card2 = ? WHERE id = ?", [cardId, userId]);
			const [cRows] = await pool.query("UPDATE cards SET userId = ? WHERE id = ?", [userId, cardId]);
			return 2;
		}else {
			return 0;
		}
	}
	return 0;
}

export async function deLinkCard(userId, cardSlot) {
	if(cardSlot === 1) {
		const [rows] = await pool.query("UPDATE users SET card1 = ? WHERE id = ?", [null, userId]);
		return 1
	} else if(cardSlot === 2) {
		const [rows] = await pool.query("UPDATE users SET card2 = ? WHERE id = ?", [null, userId]);
		return 2
	}
	return 0
}

export async function getCardsByUser(id) {
	const user = await getUserById(id);

	return [await getCardById(user.card1), await getCardById(user.card2)]
}

export async function getCardByUserAndSlot(id, slot) {
	const user = await getUserById(id);

	if(slot === 1) {
		return await getCardById(user.card1);
	} else if (slot === 2) {
		return await getCardById(user.card2);
	} else {
		return null
	}
}

export async function updateUserBalance(id, amount) {
	const currBalance = await getUserBalance(id)
	amount = parseFloat(amount);

	const [rows] = await pool.query("UPDATE users SET balance = ? WHERE id = ?", [currBalance + amount, id]);
}

function formatDateTime(date) {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	const hours = String(date.getHours()).padStart(2, '0');
	const minutes = String(date.getMinutes()).padStart(2, '0');
	const seconds = String(date.getSeconds()).padStart(2, '0');

	return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
}

export async function archiveTransaction(userId1, userId2 = null, transType, cardUsed, card = null, amount, accountPayedTo = null, accountRecievedFrom = null, currency) {
	const date = formatDateTime(new Date())

	const [result] = await pool.query("INSERT INTO transactions (userId1, userId2, transType, cardUsed, card, amount, date, accountPayedTo, accountRecievedFrom, currency) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [userId1, userId2, transType, cardUsed, card, amount, date, accountPayedTo, accountRecievedFrom, currency]);

	return result.insertId
}

export async function getTransactionsByUser(id) {
	const [rows] = await pool.query("SELECT * FROM transactions WHERE userId1 = ? OR userId2 = ?", [id, id]);
	return rows
}