const { expect } = require("chai");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

const toWei = (eth) => ethers.utils.parseEther(eth.toString())
const fromWei = (eth) => ethers.utils.formatEther(eth)

describe ("HGTMarketTest", () => {
    let owner, accountOne, accountTwo;
    let  HGToken, HGTMarketPlace, hgToken, hgtMarketPlace;
    let chargePercent = 1;
    let URI = "hgt base uri";

    beforeEach (async function () {
        // re-using common test setups with fixtures 
        HGToken = await ethers.getContractFactory("HGToken");
        HGTMarketPlace = await ethers.getContractFactory("HGTMarketPlace");
        
        // Contracts are deployed using the first signer/account by default
        [owner, accountOne, accountTwo,  ...accounts] = await ethers.getSigners();

        hgToken = await HGToken.deploy();
        hgtMarketPlace = await HGTMarketPlace.deploy(chargePercent);

    })  
    // test for deployment of HGToken smart contract
    describe("Deployment",  () => {

        it("Test for name and symbol of NFT", async () => {
           
            expect(await hgToken.name()).to.equal("Silver Token");
            expect(await hgToken.symbol()).to.equal("AgT");
        });
        it("Test for the recipient's account and charge percent", async () => {
            expect(await hgtMarketPlace.receipientAccount()).to.equal(owner.address);
            expect(await hgtMarketPlace.chargePercent()).to.equal(chargePercent);
        })
      });

    describe("Test for minting NFT", () => {
        it("Test for minted NFT", async () => {
            await hgToken.connect(accountOne).mint(URI);
            expect (await hgToken.transactionCounter()).to.equal(1);
            expect (await hgToken.balanceOf(accountOne.address)).to.equal(1);
            expect (await hgToken.tokenURI(1)).to.equal(URI)

            await hgToken.connect(accountTwo).mint(URI);
            expect (await hgToken.transactionCounter()).to.equal(2);
            expect (await hgToken.balanceOf(accountTwo.address)).to.equal(1);
            expect (await hgToken.tokenURI(2)).to.equal(URI);
        }); 
    })

    describe("Create hgt market place item", () => {
        let nft_price = 1
        beforeEach ( async function() {
            await hgToken.connect(accountOne).mint(URI);
            await hgToken.connect(accountOne).setApprovalForAll(hgtMarketPlace.address, true)
        })

        it("Test for hgt market place Item created", async () => {
            await expect(hgtMarketPlace.connect(accountOne).CreateNFTItem(1, toWei(1), hgToken.address)).
            to.emit(hgtMarketPlace, "HgtNFTProductEvent").withArgs(1, hgToken.address, toWei(1), 1, accountOne.address);
            // owner of NFT should now be the market place
            expect (await hgToken.ownerOf(1)).to.equal(hgtMarketPlace.address);
            expect (await hgtMarketPlace.counter()).to.equal(1);
            const nftdata = await hgtMarketPlace.hgtNftdata(1);
            expect(nftdata.id).to.equal(1);
          
            expect(nftdata.hgtNFT).to.equal(hgToken.address)
            expect(nftdata.hgtTokenId).to.equal(1);
            expect(nftdata.nftPrice).to.equal(toWei(1))
            expect(nftdata.bought).to.equal(false)
        })
        it("Test fails when price is set to Zero", async ()=> {
            await expect(hgtMarketPlace.connect(accountOne).CreateNFTItem(1, 0, hgToken.address)).to.be.revertedWith("NFT price must be greater than 0");
        });
    });

    describe("Market place trading", function () {
        let nft_price = 2;
        let charge_fee = (chargePercent/100) * nft_price
        let totalPrice   // in wei

        beforeEach ( async function () {
            await hgToken.connect(accountOne).mint(URI)
            
            await hgToken.connect(accountOne).setApprovalForAll(hgtMarketPlace.address, true)
            
            await hgtMarketPlace.connect(accountOne).CreateNFTItem(1, toWei(nft_price), hgToken.address);
            
        } )
        

        it("Should update item as sold, pay seller, transfer NFT to buyer, charge fees and emit a Bought event", async function () {
            const getSellerBalance = await accountOne.getBalance();
            const ownerBalance = await owner.getBalance();
            totalPrice = await hgtMarketPlace.HGTNFTotalPrice(1);
           
     
            await expect(hgtMarketPlace.connect(accountTwo).BuyHGTNFT(1, {value: totalPrice}))
            .to.emit(hgtMarketPlace, "HgtNFTSalesEvent")
                .withArgs(
                1,1,toWei(nft_price),
                hgToken.address,
                accountOne.address,
                accountTwo.address
                )
            const sellerBalAfterSale = await accountOne.getBalance()
            const ownerBalanceAfterSale = await owner.getBalance()
          
            expect((await hgtMarketPlace.hgtNftdata(1)).bought).to.equal(true)
           
            expect(+fromWei(sellerBalAfterSale)).to.equal(+nft_price + +fromWei(getSellerBalance))
            
            expect(+fromWei(ownerBalanceAfterSale)).to.equal(+charge_fee + +fromWei(ownerBalance))
            
            expect(await hgToken.ownerOf(1)).to.equal(accountTwo.address);
            })
        it("Test for non existent nft id, insufficent fund", async function () {
      
        await expect(
            hgtMarketPlace.connect(accountTwo).BuyHGTNFT(2, {value: totalPrice})
        ).to.be.revertedWith("NFT doesn't exist");
        await expect(
            hgtMarketPlace.connect(accountTwo).BuyHGTNFT(0, {value: totalPrice})
        ).to.be.revertedWith("NFT doesn't exist");
        
        await expect(
            hgtMarketPlace.connect(accountTwo).BuyHGTNFT(1, {value: toWei(nft_price)})
        ).to.be.revertedWith("Ether balance is too low to purchase this NFT"); 

        await hgtMarketPlace.connect(accountTwo).BuyHGTNFT(1, {value: totalPrice})
      
        const accountThree = accounts[0]
        await expect(
            hgtMarketPlace.connect(accountThree).BuyHGTNFT(1, {value: totalPrice})
        ).to.be.revertedWith("NFT is no longer available, it has been bought");
        });
      })
})