// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./Auth.sol";

contract UserLoginContract is Admin {

    using SafeMath for uint256;

    mapping(address => mapping(string => bool)) private _token;
    mapping(address => mapping(string => uint256)) private _tokenExpTime;

    function reg(string memory token, uint256 time) public {
        _token[msg.sender][token] = true;
        _tokenExpTime[msg.sender][token] = block.timestamp.add(time);
    }

    function logout(string memory token) public {
        _token[msg.sender][token] = false;
        _tokenExpTime[msg.sender][token] = block.timestamp;
    }

    function checkToken(address account, string memory token) public view returns (bool){
        if (_token[account][token] && _tokenExpTime[account][token] > block.timestamp) {
            return true;
        }
        return false;
    }
}
