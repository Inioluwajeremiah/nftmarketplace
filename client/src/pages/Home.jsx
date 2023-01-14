import React, { useContext, useEffect, useState } from 'react'
import { ethers } from 'ethers';
import { NFTContext } from '../AgTContext';
import NftCard from '../components/NftCard';
import Spinner from '../components/Spinner';

const Home = () => {

  const {marketContract, tokenContract, loading} = useContext(NFTContext);

  const [items, setItems] = useState([]);
  const [loadingII, setLoadingII] = useState(true);
  const [contractLoadibg, setCoontractLoading] = useState({})

  const getAgTNFTItems = async () => {
    console.log("marketplace contract 2", marketContract);
    
    const getcounter = await marketContract.counter();
    const counter = getcounter.toString();
    console.log("counter => ", counter);
    let items = []
    for ( let i=1; i<= counter; i++) {
      console.log("for loop", i);
      const item = await marketContract.hgtNftdata(i);
      console.log("item index from hgtNftdata mapping => ", item );

      if(!item.bought) {
        const uri = await tokenContract.tokenURI(item.hgtTokenId)
        const response = await fetch(uri);
        const metadata = await response.json();
        const totalPrice = await marketContract.HGTNFTotalPrice(item.id)
        items.push({totalPrice, 
          itemId: item.id, 
          seller: item.owner, 
          name:metadata.title, 
          description: metadata.description,
          image: metadata.imageuri
        })
      }
    }
    setItems(items)
    console.log("items at market place => ", items);
    setLoadingII(false)
  }

  const BuyNFT = async (item) => {
    await (await marketContract.BuyHGTNFT(item.itemId, {value: item.totalPrice})).wait()
    console.log('nfyt item sold successfully')
    getAgTNFTItems();
  }


  useEffect(() => {
    getAgTNFTItems()
  }, [])

  if (!marketContract) return (
    <main className='text-center mt-36'>
      <Spinner/>
      <button onClick={getAgTNFTItems}>get minter product</button>
  </main> 
  )
  return (
    <div className='h-screen shadow-md w-[80%] m-auto items-center justify-center'>
      {
        items.length > 0 ? 
        <div className='flex flex-row flex-wrap items-center mt-32'>
          {items.map((item, index) =>
            <NftCard key={index}
              imgSrc = {item.image}
              nftprice = {ethers.utils.formatEther(item.totalPrice)}
              nfttitle = {item.name}
              nftdescription = {item.description}
              onclick={() => BuyNFT(item)}
            />
          )}
        </div>
        : 
        <div>
          <p>No recent NFT</p> <button onClick={getAgTNFTItems}>Get all nfts</button>
        </div>
      }
    </div>
  )
}

export default Home