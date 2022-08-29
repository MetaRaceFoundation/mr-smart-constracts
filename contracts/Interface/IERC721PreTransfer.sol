// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

interface IERC721BeforeTransfer {
    function beforeTransfer(address from, address to, uint256 tokenId) external returns (bool);
}

interface IERC721AfterTransfer {
    function afterTransfer(address from, address to, uint256 tokenId) external returns (bool);
}
