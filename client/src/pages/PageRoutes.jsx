import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Navbar from '../components/Navbar'
import AllNFTs from './AllNFTs'
import Cart from './Cart'
import Dashboard from './Dashboard'
import ErrorPage from './ErrorPage'
import Home from './Home'
import NewNFT from './NewNFT'

const PageRoutes = () => {

  return (
    <BrowserRouter>
          <Navbar/>
        <Routes >
            <Route path='/' element={<Home/>} />
            <Route path="/dashboard" element={<Dashboard/>} />
            <Route path="/newnft" element={<NewNFT />} />
            <Route path="/allnfts" element={<AllNFTs/>} />
            <Route path="/cart" element={<Cart/>} />
            <Route path="*" element={<ErrorPage/>} />
        </Routes>
    </BrowserRouter>
  )
}
export default PageRoutes;