const express = require('express');
const dotenv = require('dotenv');
// Specify the correct environment file
dotenv.config({ path: './env/development.env' });
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const productRoutes = require('./routes/productRoutes');

const corsOptions = {
    origin: 'https://crudvercel-zf4b-83pgvua0f-amna-razzaqs-projects.vercel.app', // Correctly closed URL
    credentials: true,  // Allow credentials
};

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Connect to Database
connectDB().catch((err) => {
    console.error('Database connection failed:', err.message);
    process.exit(1); // Exit the process if DB connection fails
});
console.log('MONGO_URI:', process.env.MONGO_URI);

// Middleware
app.use(cors(corsOptions));  // Use the CORS middleware with the defined options
app.use(express.json()); // Built-in body parser
app.use(bodyParser.json()); // Optional, you can remove if express.json() is sufficient

// Routes
app.use('/api/products', productRoutes);

// Health Check Route
app.get('/', (req, res) => {
    res.send('Server is running');
});

// Handle undefined routes
app.use((req, res, next) => {
    res.status(404).json({ message: 'Route not found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
});

// Start Server
const PORT = process.env.PORT || 5020;
app.listen(PORT, () => {
    console.log(`Server running on Port ${PORT}`);
});
