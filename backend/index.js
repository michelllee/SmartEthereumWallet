const express = require('express');
const { ethers } = require('ethers');
require('dotenv').config();
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 5001;

// Initialize the provider with Infura
const provider = new ethers.JsonRpcProvider(`https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`);

// Endpoint to track a wallet's balance
app.get('/balance/:address', async(req, res) => {
    const { address } = req.params;

    if (!ethers.isAddress(address)) {
        return res.status(400).json({ error: 'Invalid address' });
    }

    try {
        const balance = await provider.getBalance(address);
        const balanceInEth = ethers.formatEther(balance);
        res.json({ address, balance: balanceInEth });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching balance' });
    }
});

// Endpoint to notify of incoming/outgoing transactions using Etherscan
app.get('/transactions/:address', async(req, res) => {
    const { address } = req.params;

    if (!ethers.isAddress(address)) {
        return res.status(400).json({ error: 'Invalid address' });
    }

    try {
        const response = await axios.get(`https://api.etherscan.io/api`, {
            params: {
                module: 'account',
                action: 'txlist',
                address: address,
                startblock: 0,
                endblock: 99999999,
                sort: 'asc',
                apikey: process.env.ETHERSCAN_API_KEY
            }
        });

        if (response.data.status === '1') {
            res.json({ address, history: response.data.result });
        } else {
            res.status(500).json({ error: 'Error fetching transaction history' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error fetching transaction history' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});