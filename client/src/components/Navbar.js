import React, { useContext } from 'react'
import { Outlet } from 'react-router-dom'
import {IoMenuOutline} from 'react-icons/io5'
import { ListData } from './ListData'
import ListComponent from './ListComponent'
import { NFTContext } from '../AgTContext'

const Navbar = () => {
    const {account, ConnectAccount} = useContext(NFTContext);

  return (
    <>
        <nav className='flex fixed top-0 flex-row justify-between items-center w-full bg-[#000] text-white py-4 px-8 h-20'>
            <div className='logo'>
                <p><span className='text-blue-700 font-bold text-2xl'>AgT</span>Marketplace</p>
            </div>
            <div className='flex flex-row justify-between'>
                <ul className='flex flex-row justify-between items-center'>
                   { ListData.map((item, index) => <ListComponent key={index} title={item.title} link={item.link} />)}
                   {account.length> 0 ? <p className='text-blue-700'>{account.slice(0,5)}...{account.slice(account.length-5, account.length)}</p> :
                    <button onClick={ConnectAccount} className="bg-blue-700 p-4 rounded-sm">Connect Wallet</button>
                   }
                </ul>
                <div>
                    <IoMenuOutline className='hidden'/>
                </div>
            
            </div>
        </nav>
        <Outlet/>
    </>
  )
}

export default Navbar