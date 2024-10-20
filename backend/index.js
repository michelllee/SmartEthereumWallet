const express = require('express');
const { ethers } = require('ethers');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

const provider = new ethers.InfuraProvider('mainnet', process.env.INFURA_API_KEY);


// Endpoint to track a wallet's balance
app.get('/balance/:address', async(req, res) => {
    const { address } = req.params;

    try {
        const balance = await provider.getBalance(address);
        const balanceInEth = ethers.utils.formatEther(balance);
        res.json({ address, balance: balanceInEth });
    } catch (error) {
        res.status(400).json({ error: 'Invalid address' });
    }
});

// Endpoint to notify of incoming/outgoing transactions
app.get('/transactions/:address', async(req, res) => {
    const { address } = req.params;

    try {
        const history = await provider.getHistory(address);
        res.json({ address, history });
    } catch (error) {
        res.status(400).json({ error: 'Error fetching transaction history' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});