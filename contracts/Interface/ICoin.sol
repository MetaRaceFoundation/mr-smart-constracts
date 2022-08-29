// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

interface ICoin {
    function safeTransferFrom(uint256 coin, address from, address to, uint256 value) external;

    function safeTransferFrom1(uint256 coin, address from, address to, uint256 value) external;

    function safeTransfer(uint256 coin, address to, uint256 value) external;

    function safeTransfer1(uint256 coin, address to, uint256 value) external;
    function safeTransferWei(uint256 _coinName, address to, uint256 value) external;

    function balanceOf(uint256 _coinName, address account) external returns (uint256);
    function decimals(uint256 _coinName) external returns (uint);
}
