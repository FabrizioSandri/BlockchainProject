// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;
import "./HNFT.sol";
import "truffle/console.sol";

contract MainSmartContract {
    address private owner;
    address[] private issuedItems;
    address[] private inSellItems;

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
    ) external returns (bytes memory) {
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

    function burn(address NFTAddress) external returns (bool) {
        bool resb;
        (resb, ) = NFTAddress.call(abi.encodeWithSignature("burn()"));
        return resb;
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
