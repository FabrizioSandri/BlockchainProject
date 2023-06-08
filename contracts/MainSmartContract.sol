// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "./HNFT.sol";

//add for debugging purpuse
//import "truffle/console.sol";

contract MainSmartContract {
    address private owner;
    address[] private issuedItems;
    address[] private inSellItems;

    // Modifier to check that the caller is the owner of
    // the contract.
    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can run this function.");
        _;
    }
    event GetPhysicalHoney(
        address indexed HNFTAddress,
        string message,
        address requester
    );

    constructor() {
        owner = msg.sender;
    }

    function getIssuedItems() external view returns (address[] memory) {
        return issuedItems;
    }

    function getInSellItems() external view returns (address[] memory) {
        return inSellItems;
    }

    function sell(
        address NFTAddress,
        uint256 _price
    ) external onlyOwner returns (bytes memory) {
        if (!containsAddress(NFTAddress, inSellItems)) {
            addNewInSellItem(NFTAddress);
            if (!containsAddress(NFTAddress, issuedItems))
                addNewIssuedItem(NFTAddress);
        }

        (, bytes memory res) = NFTAddress.call(
            abi.encodeWithSignature("setPrice(uint256)", _price)
        );
        return res;
    }

    function setPrice(
        address NFTAddress,
        uint256 _price
    ) external onlyOwner returns (bool) {
        (bool resb, ) = NFTAddress.call(
            abi.encodeWithSignature("setPrice(uint256)", _price)
        );
        if (!resb) {
            revert("error in set Price");
        } else {
            return true;
        }
    }

    function buy(address NFTAddress, address ownerOfNft) external payable {
        (, bytes memory res) = NFTAddress.call(
            abi.encodeWithSignature("getPrice()")
        );
        uint256 price = abi.decode(res, (uint));
        require(msg.value == price * 1 ether, "not enough value provided");

        address payable _owner = payable(ownerOfNft);
        _owner.transfer(msg.value);

        (bool resb, ) = NFTAddress.call(
            abi.encodeWithSignature(
                "transferBuy(address,address)",
                ownerOfNft,
                msg.sender
            )
        );
        if (!resb) {
            revert("The NFT was not transfered");
        }
        if (!removeElement(inSellItems, NFTAddress)) {
            revert("The NFT does not exists in the sell market");
        }
    }

    function CheckValidity(address NFTAddress) external view returns (bool) {
        if (containsAddress(NFTAddress, issuedItems)) {
            return true;
        }
        return false;
    }

    function removeInSellItem(address NFTAddress) external onlyOwner {
        if (!removeElement(inSellItems, NFTAddress)) {
            revert("The NFT does not exists in the sell market");
        }
    }

    function burn() external returns (bool) {
        //change name to getRealHoney
        bool resb;
        bytes memory res;
        address NFTAddress = msg.sender;
        (resb, res) = NFTAddress.call(
            abi.encodeWithSignature("ownerOf(uint256)", 0)
        );

        require(
            containsAddress(msg.sender, issuedItems),
            "The item is not in the issued HNFT"
        );

        require(
            abi.decode(res, (address)) == tx.origin,
            "the transaction origin caller is not the owner of the HNFT"
        );

        emit GetPhysicalHoney(
            NFTAddress,
            "Honey is physical requested from its owner",
            tx.origin
        );
        return true;
    }

    function addNewInSellItem(address newItem) internal {
        inSellItems.push(newItem);
    }

    function addNewIssuedItem(address newItem) internal {
        issuedItems.push(newItem);
    }

    function containsAddress(
        address _address,
        address[] memory array
    ) internal pure returns (bool) {
        for (uint256 index = 0; index < array.length; index++) {
            if (_address == array[index]) {
                return true;
            }
        }
        return false;
    }

    function removeElement(
        address[] storage array,
        address elem
    ) internal returns (bool) {
        uint _index = 0;
        for (uint256 index = 1; index < array.length + 1; index++) {
            if (elem == array[index - 1]) {
                _index = index;
            }
        }
        if (_index != 0) {
            array[_index - 1] = array[array.length - 1];
            array.pop();
            return true;
        } else {
            return false;
        }
    }
}
