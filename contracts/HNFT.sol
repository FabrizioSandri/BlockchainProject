// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

//add for debugging purpuse
//import "truffle/console.sol";

contract HNFT is ERC721URIStorage {
    uint price;
    address issuer;

    constructor(
        string memory _name,
        string memory _symbol,
        string memory tokenURI
    ) ERC721(_name, _symbol) {
        issuer = msg.sender;
        _safeMint(msg.sender, 0);
        _setTokenURI(0, tokenURI);
    }

    function getIssuer() external view returns (address) {
        return issuer;
    }

    function getPrice() external view returns (uint) {
        return price;
    }

    function setPrice(uint _price) public returns (bool) {
        require(
            _isApprovedOrOwner(tx.origin, 0),
            "The transaction origin caller is not allowed to perform this action"
        );
        require(
            _isApprovedOrOwner(msg.sender, 0),
            "The transaction caller is not allowed to perform this action"
        );
        price = _price;
        return true;
    }

    function transferBuy(address from, address to) public {
        require(
            _isApprovedOrOwner(msg.sender, 0),
            "The transaction caller is not allowed to perform this action"
        );
        super.transferFrom(from, to, 0);
    }

    function burn(address mainSmartContractAddress) public {
        require(
            _isApprovedOrOwner(tx.origin, 0),
            "The transaction origin caller is not allowed to perform this action"
        );
        (bool resb, ) = mainSmartContractAddress.call(
            abi.encodeWithSignature("burn()")
        );
        if (resb) {
            super._burn(0);
        } else {
            revert("error in main smart contract burn");
        }
    }
}
