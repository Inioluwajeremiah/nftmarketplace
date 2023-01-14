import React from 'react'

const FormHeader = ({description}) => {
  return (
    <div >
        {/* <img src='' alt='logo'/> */}
        <p className='text-4xl p-4 text-center'><span className='text-blue-700 font-bold'>AgT</span> MarketPlace</p>
        <p className='p-4 text-center'>{description}</p>
    </div>
  )
}

export default FormHeader