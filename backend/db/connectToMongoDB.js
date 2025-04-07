import mongoose from 'mongoose';

const connectToMongoDB = async () => {
    try {
        // Connection options for better performance and stability
        await mongoose.connect(process.env.MONGO_DB_URL, {
            serverSelectionTimeoutMS: 5000,  // Timeout after 5s if no connection
            socketTimeoutMS: 45000,        // Close sockets after 45s of inactivity
            maxPoolSize: 10,               // Maximum number of socket connections
            retryWrites: true,             // Retry write operations on failure
            retryReads: true               // Retry read operations on failure
        });
        
        console.log("✅ Connected to MongoDB");
        
        // Log connection events for debugging
        mongoose.connection.on('connected', () => {
            console.log('Mongoose connected to DB');
        });
        
        mongoose.connection.on('error', (err) => {
            console.error(`Mongoose connection error: ${err}`);
        });
        
        mongoose.connection.on('disconnected', () => {
            console.warn('Mongoose disconnected from DB');
        });
        
    } catch (error) {
        console.error(`❌ Error connecting to MongoDB: ${error.message}`);
        // Graceful shutdown if DB connection fails (critical for serverless/containers)
        process.exit(1);
    }
};

export default connectToMongoDB;