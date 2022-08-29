// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;
pragma experimental ABIEncoderV2;

import "../library/ERC20Token.sol";

uint8 constant DECIMAL_TOKEN = 18;
uint256 constant Thousand = 10 ** 3;
uint256 constant MILLION = 10 ** 6;
uint256 constant BILLION = 10 ** 9;

abstract contract BaseERC20TokenMinable is ERC20TokenMinable {
    constructor(string memory name, string memory symbol, uint256 maxTotalSupply, uint256 maxMintAmount, uint256 initAmount) ERC20TokenMinable(name, symbol, DECIMAL_TOKEN, DECIMAL_TOKEN, maxTotalSupply, maxMintAmount, initAmount, address(0)) {}
}

contract MetaToken is BaseERC20TokenMinable {
    constructor() BaseERC20TokenMinable("t1.META", "t1.META", 210 * MILLION, 73500 * Thousand, 136500 * Thousand) {}
}

contract RaceToken is BaseERC20TokenMinable {
    constructor() BaseERC20TokenMinable("t1.RACE", "t1.RACE", 10 * BILLION, 9900 * MILLION, 100 * MILLION) {}
}

contract UsdtToken is BaseERC20TokenMinable {
    constructor() BaseERC20TokenMinable("t1.USDT", "t1.USDT", 10 * BILLION, 0, 10 * BILLION) {}
}