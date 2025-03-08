import express from "express";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
import bcrypt from "bcrypt";
import cookieParser from 'cookie-parser';
import nodemailer from 'nodemailer';
import otplib from 'otplib';
import qrcode from 'qrcode';
import CryptoJS from 'crypto-js';
import cors from 'cors';
import axios from 'axios';
import {formatCurrency} from 'country-currency-map'

import {
	getAllUsers,
	createUser,
	getUserByEmail,
	getUserById,
	getUserBalance,
	updatePassword,
	update2fa,
	getSecret,
	createCard,
	addCardToUser,
	deLinkCard,
	getCardsByUser,
	getCardByUserAndSlot,
	updateUserBalance,
	archiveTransaction,
	getTransactionsByUser, getCardById
} from './database.js';

const app = express();
const port = 3000;
const usersData = {};
let user = {};
let tempSecret = [];
let tempEmail = '';
let tempName = '';
let tempCurrency = '';
let encPass = ''
var currencyRates = {}

//await getCurrentRates();

dotenv.config();

const jwt_secret = process.env.API_SECRET;
const enc_key = process.env.ENC_KEY;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const corsOptions = {
	origin: true,
	credentials: true
}

app.use(cors(corsOptions));
app.set('view engine', 'ejs');
app.use(express.json());
app.use(cookieParser());

app.get('/', async (req, res) => {
	try {

		console.log(await getExchangeRate("eur", "rsd"))

		const users = await getAllUsers();

		users.forEach(user => {
			usersData[user.id] = {
				name: user.name,
				email: user.email,
				balance: user.balance,
				twofa: user.twoFA
			};
		});

		res.status(200).json(usersData);
	} catch (error) {
		return res.status(500).json({ message: "Error" });
	}
});

app.get('/:id', authenticateToken, async (req, res) => {
	try {
		const id = parseInt(req.params.id);
		const userIdFromToken = req.user.id;

		if (userIdFromToken !== id) {
			return res.status(403).json({ message: "Forbidden: you are not authorized to view this data" });
		}

		const foundUser = await getUserById(id);

		if (foundUser.length != 0) {
			user = { ...foundUser };
			res.status(200).json(user);
		} else {
			res.status(401).json("User not found");
		}
	} catch (error) {
		return res.status(500).json({ message: "Error" });
	}
});

app.get('/balance/:id', authenticateToken, async (req, res) => {
	try {
		const id = parseInt(req.params.id);
		const userBalance = await getUserBalance(id);
		const user = await getUserById(id)
		const userIdFromToken = req.user.id;

		if (userIdFromToken !== id) {
			return res.status(403).json({ message: "Forbidden: You can only access your own balance" });
		}

		if (userBalance !== null) {
			res.status(200).json({ balance: parseFloat(userBalance).toFixed(2), currency: user.currency });
		} else {
			res.status(401).json("User not found or balance not available");
		}
	} catch (error) {
		return res.status(500).json({ message: "Error" });
	}
});

app.post('/register', async (req, res) => {
	try {
		const data = req.body;

		if (!emailRegex.test(data.email)) {
			return res.status(400).json({ message: "Invalid email address", user: null });
		}

		if (data.password !== data.confirmPassword) {
			return res.status(401).json({ message: "Passwords don't match", user: null});
		}

		tempEmail = data.email;
		tempName = data.name;
		tempCurrency = data.currency;

		encPass = bcrypt.hashSync(data.password, 8);
		const user = await getUserByEmail(data.email);

		if (!user) {
			const secret = otplib.authenticator.generateSecret();

			tempSecret = secret;

			const uri = otplib.authenticator.keyuri(data.email, 'Digital Wallet', secret);

			const image = await qrcode.toDataURL(uri);

			return res.json({ imageData: image });

		} else {
			res.status(401).json({ message: "Email already exists"});
		}
	} catch (error) {
		return res.status(500).json({ message: "Error" });
	}
});

app.get('/set2fa/:authCode', async (req, res) => {
    try {
        const authCode = req.params.authCode;
        const verified = otplib.authenticator.check(authCode, tempSecret);
		if (!verified) return res.json({ message: "User failed to verify" , created: "false" });

		const user = await createUser(tempEmail, tempName, tempCurrency, encPass);
		const twoFA = await update2fa(user.id, tempSecret);
		encPass = '';
		tempSecret = '';
		tempEmail = '';
		tempName = '';
		tempCurrency = '';

		const foundUser = await getUserById(user.id);

		const token = jwt.sign({ id: user.id }, jwt_secret, { expiresIn: "24h" });

		res.cookie("accessToken", token, { httpOnly: true });
		return res.json({ message: "User created", user: foundUser, created: "true"});
	} catch (error) {
		return res.status(500).json({ message: "Error" });
	}
});


app.post('/login', async (req, res) => {
	try {
		const { email, password, authCode } = req.body;
		const user = await getUserByEmail(email);

		if (!user) {
			res.status(401).json({ message: "Your username or password is incorrect." });
			return;
		}

		const passwordIsValid = bcrypt.compareSync(password, user.password);

		if (!passwordIsValid) {
			res.status(401).json({ message: "Your username or password is incorrect." });
			return;
		}

		if (user.twoFA) {
			if (!authCode) {
				return res.status(401).json({
					codeRequested: true,
				});
			}

			const secret = await getSecret(user.id)
			const verified = otplib.authenticator.check(authCode, secret['twoFA']);
			if (!verified) return res.json({ message: "User failed to verify" , created: "false" });
		}

		const token = jwt.sign({ id: user.id }, jwt_secret, { expiresIn: "24h" });

		res.cookie("accessToken", token, { httpOnly: true });
		res.status(200).json({ message: "Login successful", token, user });
	} catch (error) {
		return res.status(500).json({ message: "Error" });
	}
});

app.post('/logout', (req, res) => {
	try {
		res.clearCookie('accessToken');
		res.status(200).json({ message: 'Logout successful' });
	} catch (error) {
		return res.status(500).json({ message: "Error" });
	}
});


app.post('/forgotPassword', async (req, res) => {
	try {
		const { email } = req.body;

		const user = await getUserByEmail(email);

		if (!user) {
			return res.status(401).json({ message: 'User not found', status: '401' });
		}

		const randomPassword = generateRandomString();

		const encPass = bcrypt.hashSync(randomPassword, 8);

		const updatedUser = await updatePassword(user.id, encPass);

		sendPasswordResetEmail(email, randomPassword);

		return res.status(200).json({ message: 'Password reset successful', status: '200' });
	} catch (error) {
		return res.status(500).json({ message: "Error" });
	}
});

app.post('/resetPassword', authenticateToken, async (req, res) => {
	try {
		const oldPassword = req.body.oldPassword
		const newPassword = req.body.password;
		const confirmPassword = req.body.confirmPassword;
		const id = req.user.id;
		const foundUser = await getUserById(id);

		if(!foundUser){
			res.status(401).json({ message: "User not found" });
			return;
		}

		if (newPassword !== confirmPassword) {
			return res.status(401).json({ message: "Passwords don't match", user: null});
		}

		const passwordIsValid = bcrypt.compareSync(oldPassword, foundUser.password);

		if (!passwordIsValid) {
			res.status(401).json({ message: "Your password is incorrect." });
			return;
		}

		const encPass = bcrypt.hashSync(newPassword, 8);

		const updatedUser = await updatePassword(id, encPass);

		return res.json({ message: 'Password reset successful', reset: "true"});

	} catch (error) {
		return res.status(403).json({ message: "Error" });
	}
});

app.post('/addCard/:id', authenticateToken, async (req, res) => {
	try {
		const data = req.body;
		const id = parseInt(req.params.id);
		const slot = data.slot;

		const foundUser = await getUserById(id);

		if (foundUser.length === 0) {
			return res.status(401).json({message: "User not found", registered: "false"});
		}
		const resultCard = await createCard(
			id,
			encryptData(data.number, enc_key),
			encryptData(data.expirationDate, enc_key),
			encryptData(data.CVV, enc_key),
			encryptData(data.nameOnCard, enc_key),
			data.type
		)

		const result = await addCardToUser(id, resultCard.id, parseInt(slot));
		if (result === 1) {
			return res.json({message: "Card registered to slot 1 successfully", registered: "true"});
		} else if (result === 2) {
			return res.json({message: "Card registered to slot 2 successfully", registered: "true"});
		} else {
			return res.json("Card slot full");
		}
	} catch (error) {
		return res.status(500).json({message: "Error"});
	}
});

app.post('/deleteCard', authenticateToken, async (req, res) => {
	try {
		const data = req.body;
		const id = req.user.id;

		const foundUser = await getUserById(id);

		if (foundUser.length === 0) {
			res.status(401).json("User not found");
			return;
		}

		if(!(data.cardSlot === 1 || data.cardSlot ===2)) {
			return res.json("Invalid card slot");
		}

		if(data.cardSlot === 1){
			if(foundUser.card1 === null){
				return res.json({message: "Card does not exist."});
			}
		}else{
			if(foundUser.card2 === null){
				return res.json({message: "Card does not exist."});
			}
		}

		const result = await deLinkCard(id, data.cardSlot);

		if (result === 1) {
			return res.json({message: "Card removed from slot 1 successfully", registered: 'false'});
		} else if(result === 2) {
			return res.json({message: "Card removed from slot 2 successfully", registered: 'false'});
		} else {
			return res.json({message: "???????"});
		}
	} catch (error) {
		return res.status(500).json({ message: "Error" });
	}
});

app.get('/cards/:id', authenticateToken, async (req, res) => {
	try {
		const id = parseInt(req.params.id);
		const idFromToken = req.user.id;

		if (idFromToken !== id) {
			return res.status(403).json({ message: "Forbidden: you are not authorized to view this data" });
		}

		const user = await getUserById(id);

		if (user.length === 0) {
			res.status(401).json("User not found");
			return;
		}

		const cards = await getCardsByUser(id);
		let card1;
		let card2;
		if (cards[0]) {
			card1 = createCardForUser(cards[0]);
		}

		if (cards[1]) {
			card2 = createCardForUser(cards[1]);
		}

		res.json([card1, card2]);
	} catch (error) {
		return res.status(500).json({ message: "Error" });
	}
});

app.post('/deposit/:id', authenticateToken, async (req, res) => {
	try {
		const data = req.body;
		const id  = parseInt(req.params.id);
		const user = await getUserById(id)

		if(data.amount <= 0){
			res.json({message: "Cannot process negative amount."});
		}

		const foundUser = await getUserById(id);

		if (foundUser.length === 0) {
			res.status(401).json({message: "User not found"});
			return;
		}

		const card = await getCardByUserAndSlot(id, parseInt(data.slot));
		if(!card) {
			res.json({message: "Failed to find card"});
		}

		const check = checkCard(card)
		if(!check) {
			res.json("Failed");
		}

		const resultId = await archiveTransaction(id, null, "Deposit", true, card.id, data.amount, null, null, user.currency);

		updateUserBalance(id, data.amount);

		if(resultId) {
			res.json({message: "Deposit successful", sent: "true"});
		} else {
			res.json({message: "Deposit failed", sent: "false"});
		}
	} catch (error) {
		return res.status(500).json({ message: "Error" });
	}
});

app.post('/withdrawal/:id', authenticateToken, async (req, res) => {
	try {
		const data = req.body;
		const id = parseInt(req.params.id);
		const user = await getUserById(id)

		if(data.amount <= 0){
			res.json({message: "Cannot process negative amount."});
			return;
		}

		const foundUser = await getUserById(id);

		if (foundUser.length === 0) {
			res.status(401).json({ message: "User not found" });
			return;
		}

		if(data.amount > await getUserBalance(id)) {
			res.json({ message: "Insufficient funds." });
			return
		}

		const card = await getCardByUserAndSlot(id, parseInt(data.slot))
		if (!card) {
			res.json({ message: "Failed to find card" });
			return
		}

		const check = checkCard(card)
		if (!check) {
			res.json({ message: "Failed" });
			return
		}

		const resultId = await archiveTransaction(id, null, "Withdrawal", true, card.id, data.amount, null, null, user.currency);

		updateUserBalance(id, -data.amount);

		if(resultId) {
			res.json({message: "Withdrawl successful", withdrawl: "true"});
		} else {
			res.json({message: "Withdrawl failed", withdrawl: "false"});
		}
	} catch (error) {
		return res.status(500).json({ message: "Error" });
	}
});


app.post('/userToUser', authenticateToken, async (req, res) => {
	try {
		console.log('hello')
		const data = req.body;
		const id = req.user.id;
		console.log(data)
		const sender = await getUserById(id);

		if (sender.length == 0) {
			res.status(401).json("User not found");
			return;
		}

		const reciever = await getUserByEmail(data.email)

		if(sender.id === reciever.id){
			res.json({message: "Cannot send to yourself."});
			return;
		}

		const amount = data.amount;

		if(amount <= 0){
			res.json({message: "Cannot process negative amount."});
			return;
		}

		if(amount > await getUserBalance(id)){
			res.json({message: "Insufficient funds."});
			return
		}
		const resultId = await archiveTransaction(id, reciever.id, "UserToUser", false, null, amount, null, null, sender.currency);

		console.log(resultId);

		let rate = 1
		if(sender.currency !== reciever.currency){
			console.log('hello')
			rate = await getExchangeRate(sender.currency.toLowerCase(), reciever.currency.toLowerCase())
			console.log(rate)
		}

		console.log('here')

		updateUserBalance(id, -amount);

		console.log('am')

		updateUserBalance(reciever.id, amount*rate);

		console.log('1')
		console.log(resultId > 0)
		if(resultId > 0) {
			res.json({message: "Transaction successful", sent: "true"});
		} else {
			res.json({message: "Transaction failed", sent: "false"});
		}
	} catch (error) {
		return res.status(500).json({ message: "Error" });
	}
});

app.post('/cardToUser', authenticateToken, async (req, res) => {
	try {
		const data = req.body;
		const id = req.user.id;

		const sender = await getUserById(id);


		if (sender.length == 0) {
			res.status(401).json("User not found");
			return;
		}

		const reciever = await getUserByEmail(data.email);

		if(sender.id === reciever.id){
			res.json({message: "Cannot send to yourself."});
			return;
		}

		const amount = data.amount;

		if(amount <= 0){
			res.json({message: "Cannot process negative amount."});
			return;
		}

		const card = await getCardByUserAndSlot(id, data.slot);
		if(card === null){
			res.json({message: "Card not found."});
			return;
		}

		const resultId = await archiveTransaction(id, reciever.id, "CardToUser", true, card.id, amount, null, null, sender.currency);

		let rate = 1
		if(sender.currency !== reciever.currency){
			rate = await getExchangeRate(sender.currency.toLowerCase(), reciever.currency.toLowerCase())
		}

		await updateUserBalance(reciever.id, amount*rate);


		if(resultId) {
			res.json({message: "Transaction successful", sent: "true"});
		} else {
			res.json({message: "Transaction failed", sent: "false"});
		}
	} catch (error) {
		return res.status(500).json({ message: "Error" });
	}
});

app.get('/transactions/:id', authenticateToken, async (req, res) => {
	try {
		const id = parseInt(req.params.id);
		const idFromToken = req.user.id;

		if (idFromToken !== id) {
			return res.status(403).json({ message: "Forbidden: you are not authorized to view this data" });
		}

		const user = await getUserById(id);

		if (user.length === 0) {
			res.status(401).json({ message:"User not found"});
			return;
		}

		const rows = await getTransactionsByUser(id);

		const outTran = [];

		for (const transaction of rows) {
			if(transaction.transType === "Deposit" || transaction.userId2 === id) {
				//money gained
				if(transaction.transType === "Deposit") {
					const card = await getCardById(id);

					outTran.push({
						"type": "Deposit from card",
						"card": decryptData(card.number, enc_key).substring(0, 4)+" **** **** ****",
						"currency": user.currency,
						"amount": formatCurrency(parseFloat(transaction.amount).toFixed(2), user.currency),
						"date": transaction.date.slice(0, -3)
					})
				} else {
					let rate = 1;
					if(transaction.currency !== user.currency){
						rate = await getExchangeRate(transaction.currency.toLowerCase(), user.currency.toLowerCase())
					}

					if(transaction.cardUsed === 1) {
						const fromUser = await getUserById(transaction.userId1);

						outTran.push({
							"type": "Recieved from card from user: "+ fromUser.email,
							"card": null,
							"amount": formatCurrency(parseFloat(transaction.amount*rate).toFixed(2), user.currency),
							"date": transaction.date.slice(0, -3)
						})
					} else {
						const fromUser = await getUserById(transaction.userId1);

						outTran.push({
							"type": "Recieved from balance from user: "+ fromUser.email,
							"card": null,
							"amount": formatCurrency(parseFloat(transaction.amount*rate).toFixed(2), user.currency),
							"date": transaction.date.slice(0, -3)
						})
					}
				}
			} else {
				//money lost
				if(transaction.transType === "Withdrawal") {
					const card = await getCardById(id);

					outTran.push({
						"type": "Withdrew to card",
						"card": decryptData(card.number, enc_key).substring(0, 4)+" **** **** ****",
						"amount": formatCurrency("-"+(parseFloat(transaction.amount).toFixed(2)), user.currency),
						"date": transaction.date.slice(0, -3)
					})
				} else {
					if(transaction.cardUsed === 1) {
						const card = await getCardById(id);
						const toUser = await getUserById(transaction.userId2);

						outTran.push({
							"type": "Payment from card to user: "+ toUser.email,
							"card": decryptData(card.number, enc_key).substring(0, 4)+" **** **** ****",
							"amount": formatCurrency("-"+(parseFloat(transaction.amount).toFixed(2)), user.currency),
							"date": transaction.date.slice(0, -3)
						})

					} else {
						const toUser = await getUserById(transaction.userId2);

						outTran.push({
							"type": "Payment from balance to user: "+ toUser.email,
							"card": null,
							"amount": formatCurrency("-"+(parseFloat(transaction.amount).toFixed(2)), user.currency),
							"date": transaction.date.slice(0, -3)
						})
					}
				}
			}
		}
		res.json(outTran)
	} catch (error) {
		return res.status(500).json({ message: "Error" });
	}
});

function authenticateToken(req, res, next) {
	try {
		const token = req.cookies.accessToken;

		if (!token) {
			return res.status(401).json({ message: "Unauthorized: Missing token" });
		}

		jwt.verify(token, jwt_secret, (err, user) => {
			if (err) {
				return res.status(403).json({ message: "Forbidden: Invalid token" });
			}
			req.user = user;
			next();
		});
	} catch (error) {
		return res.status(500).json({ message: "Error" });
	}
}

async function sendPasswordResetEmail(email, newPassword) {
	try {
		const transporter = nodemailer.createTransport({
			host: 'smtp.gmail.com',
			port: 587,
			auth: {
				user: 'xhrcan@stuba.sk',
				pass: process.env.SMTP_PASSWORD
			},
		});

		const mailOptions = {
			from: 'The Express App <xhrcan@stuba.sk>',
			to: email,
			subject: 'Password Reset',
			html: `<p>New password: ${newPassword}</p>`,
		};

		const info = await transporter.sendMail(mailOptions);
	} catch (error) {
		console.log("error: " + error);
	}
}

function encryptData(data, key) {
	try {
		const encryptedData = CryptoJS.AES.encrypt(data, key);
		return encryptedData.toString();
	} catch (error) {
		console.log("error: " + error);
	}
}

function decryptData(encryptedData, key) {
	try {
		const decryptedBytes = CryptoJS.AES.decrypt(encryptedData, key);
		const decryptedData = CryptoJS.enc.Utf8.stringify(decryptedBytes);
		return decryptedData;
	} catch (error) {
		console.log("error: " + error);
	}
}

function createCardForUser(card) {
	return {
		"number": decryptData(card.number, enc_key).substring(0, 4) + " **** **** **** ",
		"expirationDate": decryptData(card.expirationDate, enc_key),
		"CVV": decryptData(card.CVV, enc_key),
		"nameOnCard": decryptData(card.nameOnCard, enc_key),
		"type": card.type
	}
}


// async function getCurrentRates(){
// 	const response = await axios.get("https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/eur.json");
// 	currencyRates = response.data
// }

async function getExchangeRate(curr1, curr2){
	try {
		let rate = await axios.get(`https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/${curr1}/${curr2}.json`);
		console.log(rate);
		return rate.data[curr2];
	  } catch (error) {
		console.error('Error fetching exchange rate:', error);
	  }
}

function checkCard(card) {
	// here we would try to take funds from the card, this is outside the scope of this project
	// for the purposes of this class we assume its true
	return true
}

function generateRandomString() {
	const charset = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+";
	let randomString = "";
	const stringLength = 16;

	for (let i = 0; i < stringLength; i++) {
		const randomIndex = Math.floor(Math.random() * charset.length);
		randomString += charset.charAt(randomIndex);
	}

	return randomString;
}

app.listen(port, () => {
	console.log(`App listening on port ${port}`)
});