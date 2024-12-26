const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
dotenv.config();

const app = express();

connectDB();

app.use(express.json());
app.use('/api/auth', require('./routes/auth'));
app.use('/api/invoices', require('./routes/invoice'));



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
