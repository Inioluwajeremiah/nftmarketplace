import { ethers } from 'ethers';
import React, { useEffect, useState, useContext} from 'react'
import {NFTContext } from '../AgTContext';
import NftCard from '../components/NftCard';
import Spinner from '../components/Spinner';

const Dashboard = () => {

    const {marketContract, tokenContract, account} = useContext(NFTContext);

    const [loading, setLoading] = useState(true);
    const [mintedProducts, setMintedProducts] = useState([]);
    const [soldProducts, setSoldProducts] = useState([]);
    const [boughtProducts, setBoughtProducts] = useState([]);
    const [loadingBoughtProducts, setLoadingBoughtProducts] = useState([]);
    // const [metadata, setMetadata] = useState(null);

  const getMinterProducts = async () => {

    let mintedProducts = [];
    let soldProducts = []
      // load all sold products
      // first call the public counter method saved in the EVM state to
      //  get the total number of transactions made
      const getCounter = await marketContract.counter();

      console.log("get counter => ", getCounter);
      // convert to string to avoid the bignumber error
      const counter = getCounter.toString();
      // / loop through the counter to get each hgtnftdata  mapped struct
      for (let i=1; i<= counter; i++) {
        console.log("loop => ", i);
          // get properties of hgnftdata struct    
          const hgtnftdata = await marketContract.hgtNftdata(i);
          console.log("hgnftdata => ", hgtnftdata);
          console.log("connected address => ", account);
          console.log("owner account address => ", hgtnftdata.owner);
          // get the address of each struct and compare with owner's address
          if (hgtnftdata.owner.toLowerCase() == account) {
              // if true, get the token uri at this index
              const tokenuri = await tokenContract.tokenURI(hgtnftdata.hgtTokenId);
              console.log( "token uri => ", tokenuri);
              // use the token uri to fetch metadata store on ipfs using the pinata gateway and fetch api
              // await fetch(tokenuri).then(res => res.json()).then((result) => {
              //   console.log("result data => ",result.data);
              //   setMetadata(result.data)
              // });

              const result = await fetch(tokenuri)
              const metadata = await result.json();

              console.log("Metadata result => ", metadata);

              const totalPrice = await marketContract.HGTNFTotalPrice(hgtnftdata.id);
              let product = {
                  totalPrice, 
                  pricetag: hgtnftdata.nftPrice,
                  productId: hgtnftdata.id, 
                  owner: hgtnftdata.owner, 
                  title:metadata.title, 
                  description: metadata.description,
                  imageuri: metadata.imageuri    
              }
              mintedProducts.push(product);

              if (hgtnftdata.bought == true) {
                soldProducts.push(product)
              } 
          }
        }
        setLoading(false);
        setMintedProducts(mintedProducts);
        setSoldProducts(soldProducts);
        console.log("sold p => ", soldProducts);
        console.log("minted p => ", mintedProducts);
    }

  const getBoughtProducts = async () => {
    const filteredData = await marketContract.filters.HgtNFTSalesEvent (null, null, null, null, null, account);
    const  filterResults= await marketContract.queryFilter(filteredData);
    const boughtProducts = await Promise.all(filterResults.map(async result => {
      result = result.args
      // get token uri
      const tokenuri = await tokenContract.tokenURI(result.hgtTokenId);
      // pass token uri into fetch api to get the metadata
      const metadata = await fetch(tokenuri)
      const hgtmetadata = await metadata.json();
      // get total price
      const totalPrice = await marketContract.HGTNFTotalPrice(result.id);
      console.log("Metadata result => ", metadata);
      let boughtItems = {
        totalPrice, price:result.nftPrice, id:result.id, title:hgtmetadata.title,
        description:hgtmetadata.description, imageuri:hgtmetadata.imageuri
      }
      return boughtItems;
    }));
    setLoadingBoughtProducts(false)
    setBoughtProducts(boughtProducts)
  }


    useEffect (() => {
      getMinterProducts()
      getBoughtProducts()
    }, [])

  return (
    <>
    
      {
        (loading ==true)  ?  
          <main className='text-center mt-36'>
              <Spinner/>
              <button onClick={getMinterProducts}>get minter product</button>
          </main> 

        : 
          <main className='text-center mt-36 '>
            {
              mintedProducts.length > 0 ? 
              <section className='h-screen shadow-md w-[80%] m-auto shadow-md border border-inherit overflow-y-scroll'> 
                <h2 className='text-center'>All Minted Products</h2>
                <button onClick={getMinterProducts}>get minter product</button>
              
                  <div className='flex flex-row flex-wrap'>
                    {mintedProducts.map((item, index) =>
                      <NftCard key={index}
                        imgSrc = {item.imageuri}
                        nftprice = {ethers.utils.formatEther(item.totalPrice)}
                        nfttitle = {item.title}
                        nftdescription = {item.description}
                      />
                    )}
                  </div>
                  
                  
               
              </section>
              : ""
            }

            {/* section for sold nfts */}

            { soldProducts.length > 0 ? 
              <section className='h-screen shadow-md w-[80%] m-auto shadow-md mt-12 border border-gray-300'>
                <h2 className='text-center mt-12'>Sold NFT Products</h2>
                  
                  <div className='flex flex-row flex-wrap'>
                    {soldProducts.map((item, index) =>
                    <div className='w-[300px] max-w-[300px] h-[300px] border border-[#ddd] items-center justify-center p-4 m-4 shadow-lg' key={index}>
                      <div className='flex mx-auto h-24 w-24 items-center justify-center'>
                          <img src={item.imageuri} alt={item.title}/>
                      </div>
                      <p className='mt-8'>{item.title}</p>
                      <p>{item.description}</p>
                      <p className='font-bold'>Total price - {ethers.utils.formatEther(item.totalPrice)} ETH</p>
                      <p className='font-bold'>Price tag - {ethers.utils.formatEther(item.pricetag)} ETH</p>
                  </div>
                      
                    )}
                  </div>
              </section>
              : ""
            }

            {/* for bought nfts */}
            { boughtProducts.length > 0 ? 
              <section className='h-screen shadow-md w-[80%] m-auto shadow-md mt-12 border border-gray-300'>
                <h2 className='text-center mt-12'>Bought NFT Products</h2>
                <div className='flex flex-row flex-wrap items-center'>

                {boughtProducts.map((item, index) =>
                  <div key={index} className="w-[300px] h-[300px] max-w-[300px] items-center justify-center p-4 m-4 shadow-lg border border-[#ddd]">
                      <div className='flex mx-auto h-24 w-24 items-center justify-center '>
                          <img src={item.imageuri} alt={item.title} />
                      </div>
                      <p className='mt-8'>{item.title}</p>
                      <p>{item.description}</p>
                      <p className='font-bold'>Total - {ethers.utils.formatEther(item.totalPrice)}</p>
                  </div>
                )}
                </div>
              </section>
              : ""
            }

          </main>
      }
   
    </>
  )
}

export default Dashboard