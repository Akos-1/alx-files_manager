const redisClient = require('../utils/redis');
const dbClient = require('../utils/db');

class UsersController {
    static async postNew(req, res) {
        // Implementation remains unchanged
    }

    static async getMe(req, res) {
        const { 'x-token': token } = req.headers;

        if (!token) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const key = `auth_${token}`;
        const userId = await redisClient.client.get(key);

        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const user = await dbClient.client.db().collection('users').findOne({ id: userId });
        
        if (!user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        res.status(200).json({ email: user.email, id: user.id });
    }
}

module.exports = UsersController;
