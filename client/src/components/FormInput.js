import React from 'react'

const FormInput = ({Type, IonIcons, placeHolder, onCHangeText}) => {
  return (
    <div className='flex-row  '>
        {/* {IonIcons} */}
        <input type={Type} placeholder={placeHolder} onChange={onCHangeText}
          className="border-solid rounded-sm border-[1px] border-[#ddd] mb-4 p-4 outline-none w-full"
         />
    </div>
  )
}

export default FormInput