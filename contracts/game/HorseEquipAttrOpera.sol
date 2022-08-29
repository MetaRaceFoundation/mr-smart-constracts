// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
pragma experimental ABIEncoderV2;

import "../Interface/IERC721Attr.sol";
import "../Interface/IERC721Token.sol";
import "../library/Bytes.sol";
import "../library/Uint256.sol";
import "../library/String.sol";
import "../library/Address.sol";
import "./Auth.sol";

contract HorseEquipAttrOperaContract is Program {

    using Uint256 for uint256;
    using String for string;
    using Address for address;
    using Bytes for bytes;

    IERC721Attr private _horseEquipAttrAddress;

    IERC721Token private _horseEquipTokenAddress;

    string  public   _horseEquipTypes = "horseEquipTypes";
    string  public   _horseEquipStyle = "horseEquipStyle";
    string  public   _horseEquipStatus = "horseEquipStatus";
    string  public   _horseEquipPrice = "horseEquipPrice"; // 出售价格
    string  public   _horseEquipOfUid = "horseEquipOfUid";
    string  public   _horseEquipOfHorseId = "horseEquipOfHorseId";
    string  public   _horseEquipDiscount = "horseEquipDiscount";
    string  public   _horseEquipReward = "horseEquipReward";
    string  public   _horseEquipCoin = "horseEquipCoin";
    string  public   _horseEquipLastOwner = "horseEquipLastOwner"; // 最后一次操作者
    string  public   _horseEquipLastPrice = "horseEquipLastPrice"; // 最后一次成交价格
    string  public   _lastOperaTime = "lastOperaTime"; // 最后操作时间

    modifier checkEquipTypesValue(uint256 equip_types) {
        if (equip_types == 1 || equip_types == 2 || equip_types == 3 || equip_types == 4) {
            require(true, "Legal field value");
        } else {
            require(false, "Invalid field value");
        }
        _;
    }
    modifier checkEquipStyleValue(uint256 equip_style) {
        if (equip_style == 1 || equip_style == 2 || equip_style == 3 || equip_style == 4 || equip_style == 5) {
            require(true, "Legal field value");
        } else {
            require(false, "Invalid field value");
        }
        _;
    }
    modifier checkSellAuth(uint256 tokenId) {
        require(_horseEquipTokenAddress.ownerOf(tokenId) == msg.sender, "only owner can do it!");
        _;
    }

    function init(address equipAttrAddress, address horseEquipToken) public onlyAdmin returns (bool) {
        _horseEquipAttrAddress = IERC721Attr(equipAttrAddress);
        _horseEquipTokenAddress = IERC721Token(horseEquipToken);
        return true;
    }

    function setEquipStatus(uint256 tokenId, uint256 status) public onlyProgram returns (bool) {
        bool result = _horseEquipAttrAddress.setValues(address(_horseEquipTokenAddress), tokenId, _horseEquipStatus, status.Uint256ToBytes());
        return result;
    }

    function setEquipStatusBatch(uint256[] memory tokenIds, uint256 status) public onlyProgram returns (bool) {
        require(tokenIds.length <= 256, "Invalid parameters");
        for (uint256 i = 0; i < tokenIds.length; i++) {
            bool result = _horseEquipAttrAddress.setValues(address(_horseEquipTokenAddress), tokenIds[i], _horseEquipStatus, status.Uint256ToBytes());
            require(result, "setEquipStatus error");
        }
        return true;
    }

    function setEquipTypes(uint256 tokenId, uint256 types) public onlyProgram returns (bool) {
        bool result = _horseEquipAttrAddress.setValues(address(_horseEquipTokenAddress), tokenId, _horseEquipTypes, types.Uint256ToBytes());
        return result;
    }

    function setEquipStyle(uint256 tokenId, uint256 style) public onlyProgram returns (bool) {
        bool result = _horseEquipAttrAddress.setValues(address(_horseEquipTokenAddress), tokenId, _horseEquipStyle, style.Uint256ToBytes());
        return result;
    }

    function setEquipPrice(uint256 tokenId, uint256 price) public onlyProgram returns (bool) {
        bool result = _horseEquipAttrAddress.setValues(address(_horseEquipTokenAddress), tokenId, _horseEquipPrice, price.Uint256ToBytes());
        return result;
    }

    function setEquipOfHorseId(uint256 tokenId, uint256 horseId) public onlyProgram returns (bool) {
        bool result = _horseEquipAttrAddress.setValues(address(_horseEquipTokenAddress), tokenId, _horseEquipOfHorseId, horseId.Uint256ToBytes());
        return result;
    }

    function setEquipDis(uint256 tokenId, uint256 discount) public onlyProgram returns (bool) {
        bool result = _horseEquipAttrAddress.setValues(address(_horseEquipTokenAddress), tokenId, _horseEquipDiscount, discount.Uint256ToBytes());
        return result;
    }

    function setEquipReward(uint256 tokenId, uint256 reward) public onlyProgram returns (bool) {
        bool result = _horseEquipAttrAddress.setValues(address(_horseEquipTokenAddress), tokenId, _horseEquipReward, reward.Uint256ToBytes());
        return result;
    }

    function setEquipCoin(uint256 tokenId, uint256 coin) public onlyProgram returns (bool) {
        bool result = _horseEquipAttrAddress.setValues(address(_horseEquipTokenAddress), tokenId, _horseEquipCoin, coin.Uint256ToBytes());
        return result;
    }

    function setLastOperaTime1(uint256 tokenId, uint256 operaTime) public onlyProgram returns (bool) {
        bool result = _horseEquipAttrAddress.setValues(address(_horseEquipTokenAddress), tokenId, _lastOperaTime, operaTime.Uint256ToBytes());
        return result;
    }

    function setLastOperaTime2(uint256 tokenId) public onlyProgram returns (bool) {
        bool result = _horseEquipAttrAddress.setValues(address(_horseEquipTokenAddress), tokenId, _lastOperaTime, block.timestamp.Uint256ToBytes());
        return result;
    }

    function setEquipLastOwner(uint256 tokenId, address addr) public onlyProgram returns (bool) {
        bool result = _horseEquipAttrAddress.setValues(address(_horseEquipTokenAddress), tokenId, _horseEquipLastOwner, addr.AddressToBytes());
        return result;
    }

    function setEquipLastPrice(uint256 tokenId, uint256 price) public onlyProgram returns (bool) {
        bool result = _horseEquipAttrAddress.setValues(address(_horseEquipTokenAddress), tokenId, _horseEquipLastPrice, price.Uint256ToBytes());
        return result;
    }

    function getLastOperaTime(uint256 tokenId) public view returns (uint256){
        bytes memory timeBytes = _horseEquipAttrAddress.getValue(address(_horseEquipTokenAddress), tokenId, _lastOperaTime);
        return timeBytes.BytesToUint256();
    }

    function getHorseEquipLastOwner(uint256 tokenId) public view returns (address){
        bytes memory ownerBytes = _horseEquipAttrAddress.getValue(address(_horseEquipTokenAddress), tokenId, _horseEquipLastOwner);
        return ownerBytes.BytesToAddress();
    }

    function getHorseEquipStatus(uint256 tokenId) public view returns (uint256){
        bytes memory statusBytes = _horseEquipAttrAddress.getValue(address(_horseEquipTokenAddress), tokenId, _horseEquipStatus);
        return statusBytes.BytesToUint256();
    }

    function getHorseEquipCoin(uint256 tokenId) public view returns (uint256){
        bytes memory coinBytes = _horseEquipAttrAddress.getValue(address(_horseEquipTokenAddress), tokenId, _horseEquipCoin);
        return coinBytes.BytesToUint256();
    }

    function getHorseEquipPrice(uint256 tokenId) public view returns (uint256){
        bytes memory priceBytes = _horseEquipAttrAddress.getValue(address(_horseEquipTokenAddress), tokenId, _horseEquipPrice);
        return priceBytes.BytesToUint256();
    }

    function getHorseEquipDiscount(uint256 tokenId) public view returns (uint256){
        bytes memory DisBytes = _horseEquipAttrAddress.getValue(address(_horseEquipTokenAddress), tokenId, _horseEquipDiscount);
        return DisBytes.BytesToUint256();
    }

    function getHorseEquipReward(uint256 tokenId) public view returns (uint256){
        bytes memory rewBytes = _horseEquipAttrAddress.getValue(address(_horseEquipTokenAddress), tokenId, _horseEquipReward);
        return rewBytes.BytesToUint256();
    }

    function getHorseEquipTypes(uint256 tokenId) public view returns (uint256){
        bytes memory typesBytes = _horseEquipAttrAddress.getValue(address(_horseEquipTokenAddress), tokenId, _horseEquipTypes);
        return typesBytes.BytesToUint256();
    }

    function getHorseEquipStyle(uint256 tokenId) public view returns (uint256){
        bytes memory styleBytes = _horseEquipAttrAddress.getValue(address(_horseEquipTokenAddress), tokenId, _horseEquipStyle);
        return styleBytes.BytesToUint256();
    }

    function getHorseEquipLastPrice(uint256 tokenId) public view returns (uint256){
        bytes memory priceBytes = _horseEquipAttrAddress.getValue(address(_horseEquipTokenAddress), tokenId, _horseEquipLastPrice);
        return priceBytes.BytesToUint256();
    }

    function getEquipOfHorseId(uint256 tokenId) public view returns (uint256){
        bytes memory idBytes = _horseEquipAttrAddress.getValue(address(_horseEquipTokenAddress), tokenId, _horseEquipOfHorseId);
        return idBytes.BytesToUint256();
    }

}
