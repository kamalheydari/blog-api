const mongoose = require('mongoose');

async function connectDB() {
    try {
        const connectionConfig = await new mongoose.connect(process.env.MONGO_URI, {
            useFindAndModify: true,
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('DATABASE CONNECTED');
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
}

module.exports = connectDB;