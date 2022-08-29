// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "../library/Bytes.sol";
import "./Auth.sol";
import "../Interface/IERC721Token.sol";
import "../Interface/IERC721Attr.sol";

contract HorseRaceAttrOpera2_1 is Program {

    using Bytes for bytes;

    IERC721Attr private _horseRaceAttrAddress;
    address private _horseRaceTokenAddress;

    string  public   _headWearId = "headWearId"; //马头饰资产Id uint256
    string  public   _armorId = "armorId"; //马护甲资产Id uint256
    string  public   _ponytailId = "ponytailId"; //马尾饰资产Id uint256
    string  public   _hoofId = "hoofId"; //马蹄饰资产Id uint256

    string  public   _grade = "grade"; //马匹等级 uint256
    string  public   _raceCount = "raceCount"; //参赛次数 uint256
    string  public   _winCount = "winCount"; //获赢次数 uint256

    string  public   _raceId = "raceId"; // 游戏服生成的竞赛唯一id
    string  public   _raceType = "raceType";// 锦标赛/大奖赛/对决
    string  public   _racecourse = "racecourse";//报名比赛赛场资产唯一id
    string  public   _distance = "distance";//报名比赛赛程
    string  public   _raceUpdateTime = "raceUpdateTime";//报名/取消时间

    string  public   _horseRaceStatus = "horseRaceStatus";
    string  public   _horseRaceDiscount = "horseRaceDiscount";
    string  public   _horseRaceReward = "horseRaceReward";
    string  public   _horseRaceCoin = "horseRaceCoin";
    string  public   _horseRaceLastOwner = "horseRaceLastOwner"; // 最后一次操作者
    string  public   _horseRaceLastPrice = "horseRaceLastPrice"; // 最后一次成交价格
    string  public   _horseRacePrice = "horseRacePrice"; // 出售价格
    string  public   _sellUpdateTime = "sellUpdateTime"; // 出售/取消出售时间
    string  public   _studUpdateTime = "studUpdateTime"; // 放入种马场/取消时间

    function init(address raceAttrAddress, address horseRaceToken) public onlyAdmin returns (bool) {
        _horseRaceAttrAddress = IERC721Attr(raceAttrAddress);
        _horseRaceTokenAddress = horseRaceToken;
        return true;
    }

    function getHeadWearId(uint256 tokenId) public view returns (uint256){
        bytes memory bytesInfo = _horseRaceAttrAddress.getValue(address(_horseRaceTokenAddress), tokenId, _headWearId);
        return bytesInfo.BytesToUint256();
    }

    function getArmorId(uint256 tokenId) public view returns (uint256){
        bytes memory bytesInfo = _horseRaceAttrAddress.getValue(address(_horseRaceTokenAddress), tokenId, _armorId);
        return bytesInfo.BytesToUint256();
    }

    function getPonytailId(uint256 tokenId) public view returns (uint256){
        bytes memory bytesInfo = _horseRaceAttrAddress.getValue(address(_horseRaceTokenAddress), tokenId, _ponytailId);
        return bytesInfo.BytesToUint256();
    }

    function getHoofId(uint256 tokenId) public view returns (uint256){
        bytes memory bytesInfo = _horseRaceAttrAddress.getValue(address(_horseRaceTokenAddress), tokenId, _hoofId);
        return bytesInfo.BytesToUint256();
    }

    function getGrade(uint256 tokenId) public view returns (uint256){
        bytes memory bytesInfo = _horseRaceAttrAddress.getValue(address(_horseRaceTokenAddress), tokenId, _grade);
        return bytesInfo.BytesToUint256();
    }

    function getRaceCount(uint256 tokenId) public view returns (uint256){
        bytes memory bytesInfo = _horseRaceAttrAddress.getValue(address(_horseRaceTokenAddress), tokenId, _raceCount);
        return bytesInfo.BytesToUint256();
    }

    function getWinCount(uint256 tokenId) public view returns (uint256){
        bytes memory bytesInfo = _horseRaceAttrAddress.getValue(address(_horseRaceTokenAddress), tokenId, _winCount);
        return bytesInfo.BytesToUint256();
    }

    function getHorseRaceLastOwner(uint256 tokenId) public view returns (address){
        bytes memory ownerBytes = _horseRaceAttrAddress.getValue(address(_horseRaceTokenAddress), tokenId, _horseRaceLastOwner);
        return ownerBytes.BytesToAddress();
    }

    function getHorseRaceStatus(uint256 tokenId) public view returns (uint256){
        bytes memory statusBytes = _horseRaceAttrAddress.getValue(address(_horseRaceTokenAddress), tokenId, _horseRaceStatus);
        return statusBytes.BytesToUint256();
    }

    function getHorseRaceCoin(uint256 tokenId) public view returns (uint256){
        bytes memory coinBytes = _horseRaceAttrAddress.getValue(address(_horseRaceTokenAddress), tokenId, _horseRaceCoin);
        return coinBytes.BytesToUint256();
    }

    function getHorseRacePrice(uint256 tokenId) public view returns (uint256){
        bytes memory priceBytes = _horseRaceAttrAddress.getValue(address(_horseRaceTokenAddress), tokenId, _horseRacePrice);
        return priceBytes.BytesToUint256();
    }

    function getHorseRaceDiscount(uint256 tokenId) public view returns (uint256){
        bytes memory DisBytes = _horseRaceAttrAddress.getValue(address(_horseRaceTokenAddress), tokenId, _horseRaceDiscount);
        return DisBytes.BytesToUint256();
    }

    function getHorseRaceReward(uint256 tokenId) public view returns (uint256){
        bytes memory rewBytes = _horseRaceAttrAddress.getValue(address(_horseRaceTokenAddress), tokenId, _horseRaceReward);
        return rewBytes.BytesToUint256();
    }

    function getHorseRaceLastPrice(uint256 tokenId) public view returns (uint256){
        bytes memory priceBytes = _horseRaceAttrAddress.getValue(address(_horseRaceTokenAddress), tokenId, _horseRaceLastPrice);
        return priceBytes.BytesToUint256();
    }

    function getSellUpdateTime(uint256 tokenId) public view returns (uint256){
        bytes memory priceBytes = _horseRaceAttrAddress.getValue(address(_horseRaceTokenAddress), tokenId, _sellUpdateTime);
        return priceBytes.BytesToUint256();
    }

    function getStudUpdateTime(uint256 tokenId) public view returns (uint256){
        bytes memory priceBytes = _horseRaceAttrAddress.getValue(address(_horseRaceTokenAddress), tokenId, _studUpdateTime);
        return priceBytes.BytesToUint256();
    }

    function getRaceId(uint256 tokenId) public view returns (uint256){
        bytes memory bytesInfo = _horseRaceAttrAddress.getValue(address(_horseRaceTokenAddress), tokenId, _raceId);
        return bytesInfo.BytesToUint256();
    }

    function getRaceType(uint256 tokenId) public view returns (uint256){
        bytes memory bytesInfo = _horseRaceAttrAddress.getValue(address(_horseRaceTokenAddress), tokenId, _raceType);
        return bytesInfo.BytesToUint256();
    }

    function getRacecourse(uint256 tokenId) public view returns (uint256){
        bytes memory bytesInfo = _horseRaceAttrAddress.getValue(address(_horseRaceTokenAddress), tokenId, _racecourse);
        return bytesInfo.BytesToUint256();
    }

    function getDistance(uint256 tokenId) public view returns (uint256){
        bytes memory bytesInfo = _horseRaceAttrAddress.getValue(address(_horseRaceTokenAddress), tokenId, _distance);
        return bytesInfo.BytesToUint256();
    }

    function getRaceUpdateTime(uint256 tokenId) public view returns (uint256){
        bytes memory bytesInfo = _horseRaceAttrAddress.getValue(address(_horseRaceTokenAddress), tokenId, _raceUpdateTime);
        return bytesInfo.BytesToUint256();
    }

    function checkStatus(uint256[] memory tokenIds, uint256 status) public view returns (bool){
        require(tokenIds.length > 0 && tokenIds.length <= 256, "Cannot check 0 and must be less than 256");
        for (uint256 i = 0; i < tokenIds.length; i++) {
            bytes memory statusBytes = _horseRaceAttrAddress.getValue(address(_horseRaceTokenAddress), tokenIds[i], _horseRaceStatus);
            if (statusBytes.BytesToUint256() != status) {
                return false;
            }
        }
        return true;
    }

    function checkGameInfo(uint256[] memory tokenIds, uint256 types, uint256 racecourseId,
        uint256 level, uint256 distance) public view returns (bool){
        require(tokenIds.length > 0 && tokenIds.length <= 256, "Cannot check 0 and must be less than 256");
        for (uint256 i = 0; i < tokenIds.length; i++) {
            if (getRaceType(tokenIds[i]) != types || getRacecourse(tokenIds[i]) != racecourseId
            || getDistance(tokenIds[i]) != distance || getGrade(tokenIds[i]) != level) {
                return false;
            }
        }
        return true;
    }
}
