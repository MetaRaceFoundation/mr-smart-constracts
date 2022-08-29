// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "./Auth.sol";


interface IERC721Token {
    function balanceOf(address owner) external view returns (uint256 balance);
    function ownerOf(uint256 tokenId) external view returns (address owner);
    function safeTransferFrom(address from, address to, uint256 tokenId) external;
    function transferFrom(address from, address to, uint256 tokenId) external;

    function approve(address to, uint256 tokenId) external;
    function getApproved(uint256 tokenId) external view returns (address operator);

    function safeTransferFrom(address from, address to, uint256 tokenId, bytes calldata data) external;
}

contract Coin721 is Program, MinterAble {
    using SafeMath for uint256;

    mapping(address => address) public addressOf;

    /**
* @dev Add supported token addresses
*/
    function add(address[] memory _address) public onlyAdmin returns (bool) {
        require(_address.length <= 256, "Invalid parameters");
        for (uint256 i = 0; i < _address.length; i++) {
            addressOf[_address[i]] = _address[i];
        }
        return true;
    }

    /**
    * @dev Del supported addresses
    */
    function del(address[] memory _coins) public onlyAdmin returns (bool) {
        require(_coins.length > 0 && _coins.length <= 256, "Invalid parameters");
        for (uint256 i = 0; i < _coins.length; i++) {
            delete addressOf[_coins[i]];
        }
        return true;
    }

    /**
    * @dev Safe transfer from 'from' account to 'to' account
    */
    function safeTransferFrom(address token, address from, address to, uint256 tokenId) public onlyMiner {
        require(addressOf[token] != address(0), "Not supported coin!");
        IERC721Token(addressOf[token]).safeTransferFrom(from, to, tokenId);
    }

    function balanceOf(address token, address account) public view returns (uint256){
        require(addressOf[token] != address(0), "Not supported coin!");
        uint256 balance = IERC721Token(addressOf[token]).balanceOf(account);
        return balance;
    }

    function ownerOf(address token, uint256 tokenId) public view returns (address) {
        require(addressOf[token] != address(0), "Not supported coin!");
        address owner = IERC721Token(addressOf[token]).ownerOf(tokenId);
        return owner;
    }
    function onERC721Received(address, address, uint256, bytes calldata) external pure returns(bytes4) {
        return bytes4(keccak256("onERC721Received(address,address,uint256,bytes)"));
    }
}
