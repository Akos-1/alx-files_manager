const { v4: uuidv4 } = require('uuid');
const sha1 = require('sha1');
const dbClient = require('../utils/db');

class UsersController {
    static async postNew(req, res) {
        const { email, password } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Missing email' });
        }

        if (!password) {
            return res.status(400).json({ error: 'Missing password' });
        }

        const usersCollection = dbClient.client.db().collection('users');

        const existingUser = await usersCollection.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Already exist' });
        }

        const hashedPassword = sha1(password);
        const newUser = {
            email,
            password: hashedPassword,
            id: uuidv4(), // Generating unique id
        };

        await usersCollection.insertOne(newUser);

        // Return the new user with only email and id
        res.status(201).json({ email: newUser.email, id: newUser.id });
    }
}

module.exports = UsersController;
