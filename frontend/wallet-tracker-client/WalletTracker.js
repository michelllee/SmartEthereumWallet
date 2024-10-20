import React, { useState } from 'react';
import axios from 'axios';
import { ethers } from 'ethers';

const WalletTracker = () => {
        const [address, setAddress] = useState('');
        const [balance, setBalance] = useState(null);
        const [transactions, setTransactions] = useState([]);
        const [error, setError] = useState(null);

        const fetchBalance = async() => {
            try {
                const response = await axios.get(`http://localhost:5001/balance/${address}`);
                setBalance(response.data.balance);
                setError(null); // Clear any previous errors
            } catch (error) {
                setError('Invalid address or network error');
                setBalance(null);
            }
        };

        const fetchTransactions = async() => {
            try {
                const response = await axios.get(`http://localhost:5001/transactions/${address}`);
                setTransactions(response.data.history);
                setError(null); // Clear any previous errors
            } catch (error) {
                setError('Error fetching transaction history');
                setTransactions([]);
            }
        };

        return ( <
                div >
                <
                h1 > Ethereum Wallet Tracker < /h1> <
                input type = "text"
                placeholder = "Enter Ethereum address"
                value = { address }
                onChange = {
                    (e) => setAddress(e.target.value)
                }
                /> <
                button onClick = { fetchBalance } > Get Balance < /button> <
                button onClick = { fetchTransactions } > Get Transactions < /button>

                {
                    error && < p style = {
                        { color: 'red' }
                    } > { error } < /p>}

                    {
                        balance && < p > Balance: { balance }
                        ETH < /p>}

                        {
                            transactions.length > 0 && ( <
                                div >
                                <
                                h2 > Transaction History: < /h2> <
                                ul > {
                                    transactions.map((tx, index) => ( <
                                        li key = { index } >
                                        Hash: { tx.hash } - Value: { ethers.utils.formatEther(tx.value) }
                                        ETH <
                                        /li>
                                    ))
                                } <
                                /ul> < /
                                div >
                            )
                        } <
                        /div>
                    );
                };

                export default WalletTracker;