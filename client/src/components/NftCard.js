import React from 'react'

const NftCard = ({imgSrc, nfttitle, nftdescription,nftprice, onclick}) => {
  return (
    <div className='w-[300px] h-[300px] max-w-[300px] items-center justify-center p-4 m-4 shadow-lg border border-[#ddd]'>
        <div className='flex mx-auto h-24 w-24 items-center justify-center'>
            <img src={imgSrc} alt={nfttitle}/>
        </div>
        <p className='mt-8'>{nfttitle}</p>
        <p>{nftdescription}</p>
        <button className='bg-green-500 text-white p-4  mt-8 w-full mx-auto items-center justify-center rounded-sm' onClick={onclick}>Buy at {nftprice} ETH</button>
    </div>
  )
}

export default NftCard