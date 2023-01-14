//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "../node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract HGToken is ERC721URIStorage {
    uint public transactionCounter;
    constructor() ERC721("Silver Token", "AgT") {
    }

    function mint(string memory hgtBaseUri) external returns (uint) {
        transactionCounter ++;
        _safeMint(msg.sender, transactionCounter);
        _setTokenURI(transactionCounter, hgtBaseUri);
        return(transactionCounter);
    }
}