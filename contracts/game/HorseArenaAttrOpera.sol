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

contract HorseArenaAttrOperaContract is Program {

    using Uint256 for uint256;
    using String for string;
    using Address for address;
    using Bytes for bytes;

    IERC721Attr private _horseFactoryAttrAddress;
    IERC721Token private _horseFactoryTokenAddress;

    string  public   _name = "name";//名称
    string  public   _createTime = "createTime";//创建日期
    string  public   _ownerType = "ownerType";//类型
    string  public   _isClose = "isClose"; // 是否关闭
    string  public   _raceCount = "raceCount";//当天开赛次数，私人赛场每天有次数限制
    string  public   _lastRaceTime = "lastRaceTime";//最后一次开赛时间
    string  public   _totalRaceCount = "totalRaceCount";//总开赛次数
    string  public   _mortAmount = "mortAmount";//抵押金额
    string  public   _gameId = "gameId";//比赛的id
    string  public   _horseIds = "horseIds";//比赛的id


    modifier checkOwnerTypeValue(uint256 ownerType) {
        if (ownerType == 0 || ownerType == 1) {
            require(true, "Legal field value");
        } else {
            require(false, "Invalid field value");
        }
        _;
    }
    modifier checkAuth(uint256 tokenId) {
        require(_horseFactoryTokenAddress.ownerOf(tokenId) == msg.sender, "only owner can do it!");
        _;
    }

    function init(address factoryAttrAddress, address factoryToken) public onlyAdmin returns (bool) {
        _horseFactoryAttrAddress = IERC721Attr(factoryAttrAddress);
        _horseFactoryTokenAddress = IERC721Token(factoryToken);
        return true;
    }

    function setHorseFactName(uint256 tokenId, string memory name) public onlyProgram returns (bool) {
        bytes memory nameBytes = name.StringToBytes();
        bool boo = _horseFactoryAttrAddress.getUniques(address(_horseFactoryTokenAddress), _name, nameBytes);
        require(!boo, "Name already used");
        bool result = _horseFactoryAttrAddress.setValues(address(_horseFactoryTokenAddress), tokenId, _name, nameBytes);
        _horseFactoryAttrAddress.setUniques(address(_horseFactoryTokenAddress), _name, nameBytes);
        return result;
    }

    function setCreateTime(uint256 tokenId, uint256 time) public onlyProgram returns (bool) {
        bool result = _horseFactoryAttrAddress.setValues(address(_horseFactoryTokenAddress), tokenId, _createTime, time.Uint256ToBytes());
        return result;
    }

    function setHorseFactTypes(uint256 tokenId, uint256 types) public onlyProgram returns (bool) {
        bool result = _horseFactoryAttrAddress.setValues(address(_horseFactoryTokenAddress), tokenId, _ownerType, types.Uint256ToBytes());
        return result;
    }

    function setFactoryStatus(uint256 tokenId, uint256 status) public onlyProgram returns (bool) {
        bool result = _horseFactoryAttrAddress.setValues(address(_horseFactoryTokenAddress), tokenId, _isClose, status.Uint256ToBytes());
        return result;
    }

    function setRaceCount(uint256 tokenId, uint256 count) public onlyProgram returns (bool) {
        bool result = _horseFactoryAttrAddress.setValues(address(_horseFactoryTokenAddress), tokenId, _raceCount, count.Uint256ToBytes());
        return result;
    }

    function uptTotalRaceCount(uint256 tokenId, uint256 count) public onlyProgram returns (bool) {
        bool result = _horseFactoryAttrAddress.setValues(address(_horseFactoryTokenAddress), tokenId, _totalRaceCount, count.Uint256ToBytes());
        return result;
    }

    function setLastRaceTime(uint256 tokenId, uint256 time) public onlyProgram returns (bool) {
        bool result = _horseFactoryAttrAddress.setValues(address(_horseFactoryTokenAddress), tokenId, _lastRaceTime, time.Uint256ToBytes());
        return result;
    }

    function setMortAmount(uint256 tokenId, uint256 amount) public onlyProgram returns (bool) {
        bool result = _horseFactoryAttrAddress.setValues(address(_horseFactoryTokenAddress), tokenId, _mortAmount, amount.Uint256ToBytes());
        return result;
    }

    function getFactoryName(uint256 tokenId) public view returns (string memory){
        bytes memory bytesInfo = _horseFactoryAttrAddress.getValue(address(_horseFactoryTokenAddress), tokenId, _name);
        return bytesInfo.BytesToString();
    }

    function getCreateTime(uint256 tokenId) public view returns (uint256){
        bytes memory bytesInfo = _horseFactoryAttrAddress.getValue(address(_horseFactoryTokenAddress), tokenId, _createTime);
        return bytesInfo.BytesToUint256();
    }

    function getOwnerType(uint256 tokenId) public view returns (uint256){
        bytes memory bytesInfo = _horseFactoryAttrAddress.getValue(address(_horseFactoryTokenAddress), tokenId, _ownerType);
        return bytesInfo.BytesToUint256();
    }

    function getIsClose(uint256 tokenId) public view returns (uint256){
        bytes memory bytesInfo = _horseFactoryAttrAddress.getValue(address(_horseFactoryTokenAddress), tokenId, _isClose);
        return bytesInfo.BytesToUint256();
    }

    function getRaceCount(uint256 tokenId) public view returns (uint256){
        bytes memory bytesInfo = _horseFactoryAttrAddress.getValue(address(_horseFactoryTokenAddress), tokenId, _raceCount);
        return bytesInfo.BytesToUint256();
    }

    function getLastRaceTime(uint256 tokenId) public view returns (uint256){
        bytes memory bytesInfo = _horseFactoryAttrAddress.getValue(address(_horseFactoryTokenAddress), tokenId, _lastRaceTime);
        return bytesInfo.BytesToUint256();
    }

    function getTotalRaceCount(uint256 tokenId) public view returns (uint256){
        bytes memory bytesInfo = _horseFactoryAttrAddress.getValue(address(_horseFactoryTokenAddress), tokenId, _totalRaceCount);
        return bytesInfo.BytesToUint256();
    }

    function getMortAmount(uint256 tokenId) public view returns (uint256){
        bytes memory bytesInfo = _horseFactoryAttrAddress.getValue(address(_horseFactoryTokenAddress), tokenId, _mortAmount);
        return bytesInfo.BytesToUint256();
    }

    function setGameId(uint256 tokenId, uint256 gameId) public onlyProgram returns (bool) {
        bool result = _horseFactoryAttrAddress.setArrayValue(tokenId, _gameId, gameId.Uint256ToBytes());
        return result;
    }

    function setHorseId(uint256 tokenId, uint256 horseId) public onlyProgram returns (bool) {
        bool result = _horseFactoryAttrAddress.setArrayValue(tokenId, _horseIds, horseId.Uint256ToBytes());
        return result;
    }

    function checkGameId(uint256 tokenId, uint256 gameId) public view returns (bool){
        bool result = _horseFactoryAttrAddress.checkArrayValue(tokenId, _gameId, gameId.Uint256ToBytes());
        return result;
    }

    function delGameId(uint256 tokenId, uint256 gameId) public onlyProgram returns (bool) {
        bool result = _horseFactoryAttrAddress.removeArrayValue(tokenId, _gameId, gameId.Uint256ToBytes());
        return result;
    }

    function checkGameIdIsExit(uint256 gameId) public view returns (bool){
        bytes memory idBytes = gameId.Uint256ToBytes();
        bool boo = _horseFactoryAttrAddress.getUniques(address(_horseFactoryTokenAddress), _gameId, idBytes);
        return boo;
    }

    function setGameIdUniques(uint256 gameId) public onlyProgram returns (bool) {
        bytes memory idBytes = gameId.Uint256ToBytes();
        bool boo = _horseFactoryAttrAddress.setUniques(address(_horseFactoryTokenAddress), _gameId, idBytes);
        return boo;
    }

    function clearGameIdUniques(uint256 gameId) public onlyProgram returns (bool) {
        bytes memory idBytes = gameId.Uint256ToBytes();
        bool boo = _horseFactoryAttrAddress.setUniques(address(_horseFactoryTokenAddress), _gameId, idBytes);
        return boo;
    }

    function checkHorseId(uint256 tokenId, uint256 horseId) public view returns (bool){
        bool result = _horseFactoryAttrAddress.checkArrayValue(tokenId, _horseIds, horseId.Uint256ToBytes());
        return result;
    }

    function getHorseIdCount(uint256 tokenId) public view returns (uint256){
        uint256 count = _horseFactoryAttrAddress.getArrayCount(tokenId, _horseIds);
        return count;
    }

    function delHorseIdOne(uint256 tokenId, uint256 horseId) public onlyProgram returns (bool) {
        bool result = _horseFactoryAttrAddress.removeArrayValue(tokenId, _horseIds, horseId.Uint256ToBytes());
        return result;
    }

}
