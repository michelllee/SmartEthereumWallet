const express = require('express');
const cors = require('cors');

const app = express();

// Configure CORS to allow requests from frontend
app.use(cors({
    origin: 'http://localhost:3000'
}));

// Existing routes and server setup
app.get('/balance/:address', (req, res) => {
    // Example response for balance
    res.json({ balance: '0.5' });
});

app.get('/transactions/:address', (req, res) => {
    // Example response for transactions
    res.json({ history: [{ hash: '0x123...', value: '1000000000000000000' }] });
});

const PORT = 5001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});