// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
pragma experimental ABIEncoderV2;

import "../Interface/IERC721Attr.sol";
import "../Interface/IERC721Token.sol";
import "../library/Bytes.sol";
import "../library/Uint256.sol";
import "./Auth.sol";

contract RacecourseAttrOperaContract is Program {

    using Uint256 for uint256;
    using Bytes for bytes;

    IERC721Attr private _attrAddress;

    string  public   _horseId = "horseId";//报名的马匹id

    function init(address attrAddress) public onlyAdmin returns (bool) {
        _attrAddress = IERC721Attr(attrAddress);
        return true;
    }

    function setHorseId(uint256 tokenId, uint256 horseId) public onlyProgram returns (bool) {
        bool result = _attrAddress.setArrayValue(tokenId, _horseId, horseId.Uint256ToBytes());
        return result;
    }

    // 取消比赛后，清除已经报名的马匹信息
    function delHorseId(uint256 tokenId) public onlyProgram returns (bool) {
        bool result = _attrAddress.delArrayValue(tokenId, _horseId);
        return result;
    }

    // 取消报名后，清除对应的马匹信息
    function delHorseIdOne(uint256 tokenId, uint256 horseId) public onlyProgram returns (bool) {
        bool result = _attrAddress.removeArrayValue(tokenId, _horseId, horseId.Uint256ToBytes());
        return result;
    }

    function delHorseIdBatch(uint256[] memory tokenIds) public onlyProgram returns (bool) {
        require(tokenIds.length > 0 && tokenIds.length <= 256, "Cannot del 0 and must be less than 256");
        for (uint256 i = 0; i < tokenIds.length; i++) {
            _attrAddress.delArrayValue(tokenIds[i], _horseId);
        }
        return true;
    }

    function getHorseId(uint256 tokenId) public view returns (uint256[] memory) {
        return _attrAddress.getArrayValue(tokenId, _horseId);
    }

    function checkHorseId(uint256 tokenId, uint256 horseId) external view returns (bool){
        bool result = _attrAddress.checkArrayValue(tokenId, _horseId, horseId.Uint256ToBytes());
        return result;
    }
}
