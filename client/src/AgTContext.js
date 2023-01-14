import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { HGTokenAbi, MarketAddress, MarketPLaceABI, TokenAddress } from './AbiData';

export const NFTContext = React.createContext();

export const AgTContext = ({children}) => {

    const [account, setAccount] = useState({});
    const [tokenContract, setTokenContract] = useState({});
    const [marketContract, setMarketContract] = useState({}); 
    const [loading, setLoading] = useState(true);
  
    const ConnectAccount = async () => {
  
      // A Web3Provider wraps a standard Web3 provider, which is
      // what MetaMask injects as window.ethereum into each page
  
      // MetaMask requires requesting permission to connect users accounts
     
      // The MetaMask plugin also allows signing transactions to
      // send ether and pay to change state within the blockchain.
      // For this, you need the account signer...
  
       const provider = new ethers.providers.Web3Provider(window.ethereum);
  
       const getAccounts = await provider.send("eth_requestAccounts", [])
       setAccount(getAccounts[0])
       console.log("list accounts => ", getAccounts);
       console.log("connected account => ", account);
  
      const signer = provider.getSigner()
      console.log("signer => ", signer);
  
      // connecting account method II
      // const getAccountsII = await window.ethereum.request({method: 'eth_requestAccounts'})
      // setAccount (getAccountsII[0])
      // console.log("connected account => ", account);
  
  
      // connect ABI using the Contract abstraction layer
  
      // The Contract object
      const TokenContract = new ethers.Contract(TokenAddress, HGTokenAbi, signer);
      setTokenContract(TokenContract);
      const MarketPlaceContract = new ethers.Contract(MarketAddress, MarketPLaceABI, signer);
      setMarketContract(MarketPlaceContract);
      setLoading(false)
    }
    // ConnectAccount()
  
    useEffect(()=> {
      ConnectAccount()
    }, [])
  
  

  return (
   <NFTContext.Provider value={{ConnectAccount, account, marketContract, tokenContract, loading}}>
    {children}
   </NFTContext.Provider>
  )
}

