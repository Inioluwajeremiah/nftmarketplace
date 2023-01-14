import React from 'react'

const Spinner = () => {
  return (
    <div className="items-center justify-center max-h-['500px'] flex flex-col">
      <div className="w-24 h-24 border-8 rounded-full border-blue-500 border-t-8 border-t-green-500 animate-spin">
      </div>
      <p>Loading</p>
    </div>
  )
}
// @keyframes spinner {
//     0% {
//       transform: rotate(0deg);
//     }
//     100% {
//       transform: rotate(360deg);
//     }
//   }
//   .loading-spinner {
//     width: 50px;
//     height: 50px;
//     border: 10px solid #f3f3f3; /* Light grey */
//     border-top: 10px solid #383636; /* Black */
//     border-radius: 50%;
//     animation: spinner 1.5s linear infinite;
//   }

export default Spinner