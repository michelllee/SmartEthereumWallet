const express = require('express');
const { ethers } = require('ethers');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// Initialize the provider with Infura
const provider = new ethers.InfuraProvider('mainnet', process.env.INFURA_API_KEY);

// Endpoint to track a wallet's balance
app.get('/balance/:address', async(req, res) => {
    const { address } = req.params;

    // Validate Ethereum address
    if (!address || !ethers.utils.isAddress(address)) {
        console.log(`Invalid address received: ${address}`);
        return res.status(400).json({ error: 'Invalid address' });
    }

    console.log(`Request for balance of address: ${address}`);

    try {
        const balance = await provider.getBalance(address);
        const balanceInEth = ethers.utils.formatEther(balance);
        res.json({ address, balance: balanceInEth });
    } catch (error) {
        console.error('Error fetching balance:', error);
        res.status(500).json({ error: 'Error fetching balance' });
    }
});

// Endpoint to notify of incoming/outgoing transactions
app.get('/transactions/:address', async(req, res) => {
    const { address } = req.params;

    // Validate Ethereum address
    if (!address || !ethers.utils.isAddress(address)) {
        console.log(`Invalid address received: ${address}`);
        return res.status(400).json({ error: 'Invalid address' });
    }

    console.log(`Request for transactions of address: ${address}`);

    try {
        const history = await provider.getHistory(address);
        res.json({ address, history });
    } catch (error) {
        console.error('Error fetching transaction history:', error);
        res.status(500).json({ error: 'Error fetching transaction history' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});