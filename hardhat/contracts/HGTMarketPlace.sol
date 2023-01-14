// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "../node_modules/@openzeppelin/contracts/token/ERC721/IERC721.sol";

import "../node_modules/@openzeppelin/contracts/security/ReentrancyGuard.sol";

// https://www.linkedin.com/pulse/nft-minting-smart-contract-explained-line-matthew-willox/
// smart contracts for the market place
contract  HGTMarketPlace is ReentrancyGuard{
    
    // declare state variables
    address payable public immutable receipientAccount;
    uint public immutable chargePercent;
    uint public counter;

    struct HgtNFTData {
        uint id;
        address payable owner;
        uint nftPrice;
        uint hgtTokenId;
        IERC721 hgtNFT;
        bool bought;
    }

    mapping (uint => HgtNFTData) public hgtNftdata;

    event HgtNFTProductEvent (uint id,address indexed hgtNftAddress,uint nftPrice,uint hgtTokenId,address indexed nftSeller);
    event HgtNFTSalesEvent (uint id,uint hgtTokenId,uint nftPrice,address indexed hgtNftAddress,address indexed nftSeller, address indexed nftBuyer);

    constructor(uint _chargePercent) {
        receipientAccount = payable(msg.sender); 
        chargePercent = _chargePercent;
    }

       function CreateNFTItem(uint _hgtTokenId, uint _nftPrice, IERC721 _hgtNFT) external nonReentrant {
        require(_nftPrice > 0, "NFT price must be greater than 0");
        counter ++;
        _hgtNFT.transferFrom(msg.sender, address(this), _hgtTokenId);
        hgtNftdata[counter] = HgtNFTData (counter,payable(msg.sender),_nftPrice,_hgtTokenId,_hgtNFT,false);   
        emit HgtNFTProductEvent (counter,address (_hgtNFT), _nftPrice, _hgtTokenId,msg.sender);
    }

    // buy nft
    function BuyHGTNFT (uint _id) external payable nonReentrant{
        uint _hgtNftTotalPrice = HGTNFTotalPrice(_id);
        HgtNFTData storage nftdata = hgtNftdata[_id];
        
        require(_id > 0 && _id <= counter, "NFT doesn't exist");
        require(msg.value >= _hgtNftTotalPrice, "Ether balance is too low to purchase this NFT");
        require(!nftdata.bought, "NFT is no longer available, it has been bought");
        // remit amount due to seller with charged fee to nft market place owner (receipientAccount)
        nftdata.owner.transfer(nftdata.nftPrice);
        receipientAccount.transfer(_hgtNftTotalPrice - nftdata.nftPrice);
        // update nft  sold
        nftdata.bought = true;
        // transfer nft to buyer
        nftdata.hgtNFT.transferFrom(address(this), msg.sender, nftdata.hgtTokenId);
        // emit Bought event
        emit HgtNFTSalesEvent (_id, nftdata.hgtTokenId, nftdata.nftPrice,address(nftdata.hgtNFT), nftdata.owner, msg.sender);

    }
    // get total price 
    function HGTNFTotalPrice (uint _id) view public returns(uint) {
        return ((hgtNftdata[_id].nftPrice *(100 + 1) ) / 100);
    }   
} 
