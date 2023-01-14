const main = async () => {

    // HgSol contract
  const HGToken = await ethers.getContractFactory("HGToken");
   // HGTMarketPlace contractt
   const HGTMarketPlace = await ethers.getContractFactory("HGTMarketPlace");

   const hgtMarketPlace = await HGTMarketPlace.deploy(1);
   const hgToken = await HGToken.deploy();
   
   await hgToken.deployed();
   await hgtMarketPlace.deployed();

  console.log(`HGToken Transactions deployed to ${hgToken.address}`);
  console.log(`HGTMarketPlace Transactions deployed to ${hgtMarketPlace.address}`);

  // get signer
  const [signer] = await ethers.getSigners();
  const signerAddress = signer.address;
  const signerBalance = await signer.getBalance().toString();
  console.log("Signer address => ", signerAddress);
  console.log("Signer balance => ", signerBalance.toString());
}

// HGToken Transactions deployed to 0xa513E6E4b8f2a923D98304ec87F64353C4D5C853
// HGTMarketPlace Transactions deployed to 0x0165878A594ca255338adfa4d48449f69242Eb8F
// Signer address =>  0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266

const mainResult = async () => {
  try {
    await main();
    process.exitCode = 0;
  } catch (error) {
    console.error(error);
    process.exitCode = 1;
  }
}
mainResult();


