import React, { useState } from 'react';
import axios from 'axios';
import { formatEther, isAddress } from 'ethers';

const WalletTracker = () => {
    const [address, setAddress] = useState('');
    const [balance, setBalance] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [error, setError] = useState(null);
    const [isBalanceLoading, setIsBalanceLoading] = useState(false);
    const [isTransactionsLoading, setIsTransactionsLoading] = useState(false);

    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001';

    const fetchBalance = async () => {
        if (!isAddress(address)) {
            setError('Invalid Ethereum address format');
            setBalance(null);
            setTransactions([]);
            return;
        }
        setIsBalanceLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/balance/${address}`);
            setBalance(response.data.balance);
            setError(null);
        } catch (error) {
            setError(
                error.response?.data?.error || error.message || 'Invalid address or network error'
            );
            setBalance(null);
        }
        setIsBalanceLoading(false);
    };

    const fetchTransactions = async () => {
        if (!isAddress(address)) {
            setError('Invalid Ethereum address format');
            setTransactions([]);
            return;
        }
        setIsTransactionsLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/transactions/${address}`);
            if (response.data.history) {
                setTransactions(response.data.history);
                setError(null);
            } else {
                setError('No transactions found or issue with fetching.');
            }
        } catch (error) {
            setError(
                error.response?.data?.error || 'Network error, please try again later'
            );
            setTransactions([]);
        }
        setIsTransactionsLoading(false);
    };

    return (
        <div>
            <h2>Enter an Ethereum Address</h2>
            <input
                type="text"
                placeholder="Enter Ethereum address"
                value={address}
                onChange={(e) => setAddress(e.target.value.trim())}
            />
            <button onClick={fetchBalance} disabled={!address || isBalanceLoading}>
                Get Balance
            </button>
            <button onClick={fetchTransactions} disabled={!address || isTransactionsLoading}>
                Get Transactions
            </button>

            {isBalanceLoading && <p>Loading balance...</p>}
            {isTransactionsLoading && <p>Loading transactions...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {balance && !isBalanceLoading && <p>Balance: {balance} ETH</p>}
            {transactions.length > 0 && !isTransactionsLoading && (
                <div>
                    <h2>Transaction History:</h2>
                    <ul>
                        {transactions.map((tx, index) => (
                            <li key={index}>
                                Hash: {tx.hash} - Value: {formatEther(tx.value)} ETH
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default WalletTracker;
