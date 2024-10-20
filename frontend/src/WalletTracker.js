import React, { useState } from 'react';
import axios from 'axios';
import { formatEther, isAddress } from 'ethers';

const WalletTracker = () => {
        const [address, setAddress] = useState('');
        const [balance, setBalance] = useState(null);
        const [transactions, setTransactions] = useState([]);
        const [error, setError] = useState(null);
        const [isLoading, setIsLoading] = useState(false);

        const fetchBalance = async() => {
            if (!isAddress(address)) {
                setError('Invalid Ethereum address format');
                return;
            }
            setIsLoading(true);
            try {
                const response = await axios.get(`http://localhost:5001/balance/${address}`);
                setBalance(response.data.balance);
                setError(null);
            } catch (error) {
                setError('Invalid address or network error');
                setBalance(null);
            }
            setIsLoading(false);
        };

        const fetchTransactions = async() => {
            if (!isAddress(address)) {
                setError('Invalid Ethereum address format');
                return;
            }
            setIsLoading(true);
            try {
                const response = await axios.get(`http://localhost:5001/transactions/${address}`);
                if (response.data.history) {
                    setTransactions(response.data.history);
                    setError(null);
                } else {
                    setError('No transactions found or issue with fetching.');
                }
            } catch (error) {
                if (error.response) {
                    setError(`Error fetching transaction history: ${error.response.data.error}`);
                } else {
                    setError('Network error, please try again later');
                }
                setTransactions([]);
            }
            setIsLoading(false);
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
                button onClick = { fetchBalance }
                disabled = {!address || isLoading } > Get Balance < /button> <
                button onClick = { fetchTransactions }
                disabled = {!address || isLoading } > Get Transactions < /button>

                {
                    isLoading && < p > Loading... < /p>}

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
                                            Hash: { tx.hash } - Value: { formatEther(tx.value) }
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