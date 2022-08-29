// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

interface ICoin721 {
    function safeTransferFrom(address token, address from, address to, uint256 tokenId) external;

    function balanceOf(address token, address account) external returns (uint256);

    function ownerOf(address token, uint256 tokenId) external returns (address);
}
