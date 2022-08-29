// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";
import "../Interface/IERC721Attr.sol";
import "../Interface/IERC721Token.sol";
import "../Interface/IConstant.sol";
import "../Interface/ICoin.sol";
import "./Auth.sol";
import "../library/Bytes.sol";
import "hardhat/console.sol";

interface IArenaOpera {

    function setHorseFactName(uint256 tokenId, string calldata name) external returns (bool);

    function setCreateTime(uint256 tokenId, uint256 time) external returns (bool);

    function setHorseFactTypes(uint256 tokenId, uint256 types) external returns (bool);

    function setFactoryStatus(uint256 tokenId, uint256 status) external returns (bool);

    function setMortAmount(uint256 tokenId, uint256 amount) external returns (bool);

    function getCreateTime(uint256 tokenId) external returns (uint256);

    function getMortAmount(uint256 tokenId) external returns (uint256);
}

contract HorseArenaContract is Program {

    using SafeMath for uint256;
    using Math for uint256;
    using Bytes for bytes;
    ICoin               private     _coin; // 抵押token合约地址
    IArenaOpera         private     _opera;
    IERC721Token        private     _arenaTokenAddress;
    IConstant           private     _constant; // 常量合约地址

    event MintArena(address account, uint256 tokenId, uint256 time, uint256 types, uint256 mortAmount, string name, uint256 status);
    event CloseArena(address account, uint256 tokenId, uint256 time, uint256 mortAmount, uint256 status);
    event ArenaTransfer(address from, address to, uint256 tokenId, uint256 time);

    modifier checkAuth(uint256 tokenId) {
        require(_arenaTokenAddress.ownerOf(tokenId) == msg.sender, "only owner can do it!");
        _;
    }

    modifier senderIsToken() {
        require(msg.sender == address(_arenaTokenAddress), "only token contract can do it");
        _;
    }

    function init(address operaAddr, address tokenAddr, address coinAddr, address consAddr) public onlyAdmin returns (bool){
        _opera = IArenaOpera(operaAddr);
        _arenaTokenAddress = IERC721Token(tokenAddr);
        _coin = ICoin(coinAddr);
        _constant = IConstant(consAddr);
        return true;
    }
    // 生成马场:type : 0 官方的， 1 私人的
    function _mintArena(string memory name, bytes memory sign, uint256 types) internal returns (uint256) {
        require(sign.Decode(name) == _constant.getAccount(), "Signature verification failure");
        require(types == 0 || types == 1, "invalid arena type");
        _coin.safeTransferFrom1(_constant.getMortToken(), msg.sender, address(_coin), _constant.getMortAmount());
        uint256 tokenId = _arenaTokenAddress.mint(msg.sender);
        _opera.setHorseFactName(tokenId, name);
        _opera.setCreateTime(tokenId, block.timestamp);
        _opera.setHorseFactTypes(tokenId, types);
        _opera.setFactoryStatus(tokenId, 1);
        _opera.setMortAmount(tokenId, _constant.getMortAmount());
        emit MintArena(msg.sender, tokenId, block.timestamp, types, _constant.getMortAmount(), name, 1);
        return tokenId;
    }

    function mintOfficialArena(string memory name, bytes memory sign) public onlyAdmin() {
        _mintArena(name, sign, 0);
    }

    // 抵押增发赛场
    function mintArena(string memory name, bytes memory sign) public returns (uint256) {
        return _mintArena(name, sign, 1);
    }
    
    // 关闭赛场
    function closeArena(uint256 tokenId) public checkAuth(tokenId) returns (bool) {
        uint256 current = block.timestamp;
        uint256 spacing = current.sub(_opera.getCreateTime(tokenId));
        require(spacing > _constant.getMinMortTime(), "Must not be less than the minimum mortgage time");
        uint256 mortAmount = _opera.getMortAmount(tokenId);
        _coin.safeTransfer1(_constant.getMortToken(), msg.sender, mortAmount);
        _opera.setFactoryStatus(tokenId, 2);
        _arenaTokenAddress.safeTransferFrom(msg.sender, address(_arenaTokenAddress), tokenId);
        emit CloseArena(msg.sender, tokenId, block.timestamp, mortAmount, 2);
        return true;
    }
    function beforeTransfer(address from, address to, uint256) public view senderIsToken returns (bool) {
        // no need more handler.
        if (_constant.isOfficialContract(from) || _constant.isOfficialContract(to)) {
            //console.log("no need handler for arena extra contract transfer");
        } else {
            // nothing to do.
        }
        return true;
    }

    function afterTransfer(address from, address to, uint256 tokenId) public senderIsToken returns (bool) {
        if (_constant.isOfficialContract(from) || _constant.isOfficialContract(to)) {
            //console.log("no need handler for arena extra contract transfer");
        } else {
            console.log("emit event arenatransfer");
            emit ArenaTransfer(from, to, tokenId,block.timestamp);
        }
        return true;
    }
}
