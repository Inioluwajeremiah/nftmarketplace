import React, { useContext, useState } from 'react'
import { create } from 'ipfs-http-client'
import { ethers } from 'ethers';
import { NFTContext } from '../AgTContext';
import FormHeader from '../components/FormHeader';
import FormInput from '../components/FormInput';
import axios from 'axios';
// import { PINATA_API_JWT } from '../ipfconfig'

const client = create({ url: "https://ipfs.infura.io:5001/api/v0" });

const NewNFT = () => {

  const {marketContract, tokenContract} = useContext(NFTContext);

  const [fileImage, setFileImage] = useState(null);
  const [imageUri, setImageUri] = useState('');
  const [nftTitle, setNftTitle] = useState({});
  const [nftDescription, setNftDescription] = useState('');
  const [nftPriceTag, setNftPriceTag] = useState('');

  // const UploadImage = async (e) => {
  //   e.preventDefault();
  //   const file = e.target.files[0]
  //   try {
  //     const result = await client.add(file)
  //     console.log(result);
  //     setImageUri('https://ipfs.infura.io/ipfs/' + result.path)

  //   } catch (error) {
  //     alert(error)
  //   }
  // }


  const UploadImage = async (event) => {

    event.preventDefault()
    const selectedImage = event.target.files[0];
    setFileImage(selectedImage);

    console.log("jwt token", process.env.REACT_APP_PINATA_API_JWT);

    if (selectedImage)  {
        try {
            const formData = new FormData();
            formData.append("file", selectedImage); 

            const uploadFile = await axios({
                method: "post",
                url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
                data: formData,
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": 'Bearer ' + process.env.REACT_APP_PINATA_API_JWT
                },
            });
            // get hCID of the uploaded image
            const hash = "https://gateway.pinata.cloud/ipfs/" + uploadFile.data.IpfsHash
            console.log(uploadFile.data.IpfsHash);
            console.log("hash => ", hash);
            setImageUri(hash)
            console.log("image hash => ", imageUri);    
        } catch (error) {
            console.log("Error sending File to IPFS: ")
            console.log(error.message, error.request, error.response)
        }
    }
}

  const UploadMetaData = async(e) => {
    e.preventDefault()
    if (!imageUri) {
      
    }else if (!nftTitle) {

    } else if (!nftPriceTag) {

    }else if (!nftDescription) {
      
    } else {

      try {

        const data_data = JSON.stringify({
          "pinataOptions": {
            "cidVersion": 1
          },
          "pinataMetadata": {
            "name": "AgtToken",
            "keyvalues": {
              customeKey1: 'customValue1',
              customKey2: 'customValue2'
            }
          },
          "pinataContent": {
            title: nftTitle,
            description: nftDescription,
            imageuri: imageUri,
            pricetag: nftPriceTag
          }
        });

        console.log("data data => ", data_data);

        const config = {
          method: 'post',
          url: 'https://api.pinata.cloud/pinning/pinJSONToIPFS',
          headers: { 
            'Content-Type': 'application/json', 
            "Authorization": 'Bearer ' + process.env.REACT_APP_PINATA_API_JWT
          },
          data : data_data
        };
        
        const result = await axios(config);
        
        console.log("result data => ", result.data);
        // const result = await client.add(JSON.stringify({imageUri, nftTitle, nftDescription})) 
        mintNFT(result)         
      } catch (error) {
        alert(error)
      }
    }
  }

  const mintNFT = async (result) => {
    const uri = "https://gateway.pinata.cloud/ipfs/" + result.data.IpfsHash;
    console.log("uri => ", uri);
    await (await tokenContract.mint(uri)).wait();
    const transactionId = await tokenContract.transactionCounter();
    console.log("transactionid", transactionId);
    await (await tokenContract.setApprovalForAll(marketContract.address, true)).wait();
    const PriceTag = ethers.utils.parseEther(nftPriceTag.toString());
    console.log(PriceTag);
    // call market place create function to mint nft, passing in the required arguements
    // CreateNFTItem(uint _hgtTokenId, uint _nftPrice, IERC721 _hgtNFT)
    await (await marketContract.CreateNFTItem(transactionId, PriceTag, tokenContract.address)).wait();
  }

  return (
    <form action='/newnft' encType='multipart/form-data' className='max-w-[500px] mx-auto my-24 shadow-md p-4 border-[1px]'>
      <FormHeader description="Upload new NFT"/>
      <FormInput 
        Type='text'
        placeHolder="NFT name"
        onCHangeText={(e) =>setNftTitle(e.target.value) }
      />
       <FormInput 
        Type='text'
        placeHolder="NFT description"
        onCHangeText={(e) =>setNftDescription(e.target.value) }
      />
       <FormInput 
        Type='text'
        placeHolder="NFT price tag (ETH)"
        onCHangeText={(e) =>setNftPriceTag(e.target.value) }
      />
       <div>
        <input type="file" accept='image/*' onChange={UploadImage}
          className="border-solid rounded-sm border-[1px] border-[#ddd] mb-4 p-4 outline-none w-full"
        />
       </div> 
       <div className='flex flex-row justify-center items-center '>
        <button onClick={UploadMetaData} className="bg-green-700 text-white p-4 rounded-md hover:tracking-widest ease-in-out duration-500">
          Upload NFT
        </button>
       </div>
        
    </form>
    
  )
}

export default NewNFT