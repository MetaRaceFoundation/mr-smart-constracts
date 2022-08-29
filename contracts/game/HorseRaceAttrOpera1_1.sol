// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "../library/Bytes.sol";
import "../library/Uint256.sol";
import "../library/String.sol";
import "./Auth.sol";
import "../Interface/IERC721Attr.sol";
import "../library/Address.sol";

contract HorseRaceAttrOpera1_1 is Program {

    using Address for address;
    using Uint256 for uint256;
    using String for string;
    using Bytes for bytes;
    using SafeMath for uint256;

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

    modifier checkStatusValue(uint256 status) {
        if (status == 1 || status == 2 || status == 3 || status == 4 || status == 0) {
            require(true, "Legal field value");
        } else {
            require(false, "Invalid field value");
        }
        _;
    }
    modifier checkGradeValue(uint256 grade) {
        if (grade == 1 || grade == 2 || grade == 3 || grade == 4 || grade == 5 || grade == 0 || grade == 999) {
            require(true, "Legal field value");
        } else {
            require(false, "Invalid field value");
        }
        _;
    }

    function init(address raceAttrAddress, address horseRaceToken) public onlyAdmin returns (bool) {
        _horseRaceAttrAddress = IERC721Attr(raceAttrAddress);
        _horseRaceTokenAddress = horseRaceToken;
        return true;
    }

    function setHorseStatus(uint256 tokenId, uint256 status) public onlyProgram checkStatusValue(status) returns (bool) {
        bool result = _horseRaceAttrAddress.setValues(address(_horseRaceTokenAddress), tokenId, _horseRaceStatus, status.Uint256ToBytes());
        return result;
    }

    function setHorseStatusBatch(uint256[] memory tokenIds, uint256 status) public onlyProgram checkStatusValue(status) returns (bool) {
        require(tokenIds.length > 0 && tokenIds.length <= 256, "Cannot check 0 and must be less than 256");
        for (uint256 i = 0; i < tokenIds.length; i++) {
            _horseRaceAttrAddress.setValues(address(_horseRaceTokenAddress), tokenIds[i], _horseRaceStatus, status.Uint256ToBytes());
        }
        return true;
    }

    function setHorseCount(uint256 tokenId) public onlyProgram returns (bool) {
        bytes memory bytesInfo = _horseRaceAttrAddress.getValue(address(_horseRaceTokenAddress), tokenId, _raceCount);
        uint256 count = bytesInfo.BytesToUint256().add(1);
        bool result = _horseRaceAttrAddress.setValues(address(_horseRaceTokenAddress), tokenId, _raceCount, count.Uint256ToBytes());
        return result;
    }

    function setHeadWearId(uint256 tokenId, uint256 headWearId) public onlyProgram returns (bool) {
        bool result = _horseRaceAttrAddress.setValues(address(_horseRaceTokenAddress), tokenId, _headWearId, headWearId.Uint256ToBytes());
        return result;
    }

    function setArmorId(uint256 tokenId, uint256 armorId) public onlyProgram returns (bool) {
        bool result = _horseRaceAttrAddress.setValues(address(_horseRaceTokenAddress), tokenId, _armorId, armorId.Uint256ToBytes());
        return result;
    }

    function setPonytailId(uint256 tokenId, uint256 ponytailId) public onlyProgram returns (bool) {
        bool result = _horseRaceAttrAddress.setValues(address(_horseRaceTokenAddress), tokenId, _ponytailId, ponytailId.Uint256ToBytes());
        return result;
    }

    function setHoofId(uint256 tokenId, uint256 hoofId) public onlyProgram returns (bool) {
        bool result = _horseRaceAttrAddress.setValues(address(_horseRaceTokenAddress), tokenId, _hoofId, hoofId.Uint256ToBytes());
        return result;
    }

    function setGrade(uint256 tokenId, uint256 grade) public onlyProgram checkGradeValue(grade) returns (bool) {
        bool result = _horseRaceAttrAddress.setValues(address(_horseRaceTokenAddress), tokenId, _grade, grade.Uint256ToBytes());
        return result;
    }

    function setWinCount(uint256 tokenId) public onlyProgram returns (bool) {
        bytes memory bytesInfo = _horseRaceAttrAddress.getValue(address(_horseRaceTokenAddress), tokenId, _winCount);
        uint256 winCount = bytesInfo.BytesToUint256().add(1);
        bool result = _horseRaceAttrAddress.setValues(address(_horseRaceTokenAddress), tokenId, _winCount, winCount.Uint256ToBytes());
        return result;
    }

    function setRacePrice(uint256 tokenId, uint256 price) public onlyProgram returns (bool) {
        bool result = _horseRaceAttrAddress.setValues(address(_horseRaceTokenAddress), tokenId, _horseRacePrice, price.Uint256ToBytes());
        return result;
    }

    function setRaceDis(uint256 tokenId, uint256 discount) public onlyProgram returns (bool) {
        bool result = _horseRaceAttrAddress.setValues(address(_horseRaceTokenAddress), tokenId, _horseRaceDiscount, discount.Uint256ToBytes());
        return result;
    }

    function setRaceReward(uint256 tokenId, uint256 reward) public onlyProgram returns (bool) {
        bool result = _horseRaceAttrAddress.setValues(address(_horseRaceTokenAddress), tokenId, _horseRaceReward, reward.Uint256ToBytes());
        return result;
    }

    function setRaceCoin(uint256 tokenId, uint256 coin) public onlyProgram returns (bool) {
        bool result = _horseRaceAttrAddress.setValues(address(_horseRaceTokenAddress), tokenId, _horseRaceCoin, coin.Uint256ToBytes());
        return result;
    }

    function setSellUpdateTime(uint256 tokenId) public onlyProgram returns (bool) {
        bool result = _horseRaceAttrAddress.setValues(address(_horseRaceTokenAddress), tokenId, _sellUpdateTime, block.timestamp.Uint256ToBytes());
        return result;
    }

    function setStudUpdateTime(uint256 tokenId) public onlyProgram returns (bool) {
        bool result = _horseRaceAttrAddress.setValues(address(_horseRaceTokenAddress), tokenId, _studUpdateTime, block.timestamp.Uint256ToBytes());
        return result;
    }

    function setRaceLastOwner(uint256 tokenId, address addr) public onlyProgram returns (bool) {
        bool result = _horseRaceAttrAddress.setValues(address(_horseRaceTokenAddress), tokenId, _horseRaceLastOwner, addr.AddressToBytes());
        return result;
    }

    function setRaceLastPrice(uint256 tokenId, uint256 price) public onlyProgram returns (bool) {
        bool result = _horseRaceAttrAddress.setValues(address(_horseRaceTokenAddress), tokenId, _horseRaceLastPrice, price.Uint256ToBytes());
        return result;
    }

    function setRaceId(uint256 tokenId, uint256 raceId) public onlyProgram returns (bool) {
        bool result = _horseRaceAttrAddress.setValues(address(_horseRaceTokenAddress), tokenId, _raceId, raceId.Uint256ToBytes());
        return result;
    }

    function setRaceIdBatch(uint256[] memory tokenIds, uint256 raceId) public onlyProgram returns (bool) {
        require(tokenIds.length > 0 && tokenIds.length <= 256, "Cannot check 0 and must be less than 256");
        for (uint256 i = 0; i < tokenIds.length; i++) {
            _horseRaceAttrAddress.setValues(address(_horseRaceTokenAddress), tokenIds[i], _raceId, raceId.Uint256ToBytes());
        }
        return true;
    }

    function setRaceType(uint256 tokenId, uint256 raceType) public onlyProgram returns (bool) {
        bool result = _horseRaceAttrAddress.setValues(address(_horseRaceTokenAddress), tokenId, _raceType, raceType.Uint256ToBytes());
        return result;
    }

    function setRacecourse(uint256 tokenId, uint256 racecourse) public onlyProgram returns (bool) {
        bool result = _horseRaceAttrAddress.setValues(address(_horseRaceTokenAddress), tokenId, _racecourse, racecourse.Uint256ToBytes());
        return result;
    }

    function setDistance(uint256 tokenId, uint256 distance) public onlyProgram returns (bool) {
        bool result = _horseRaceAttrAddress.setValues(address(_horseRaceTokenAddress), tokenId, _distance, distance.Uint256ToBytes());
        return result;
    }

    function setRaceUpdateTime(uint256 tokenId, uint256 raceUpdateTime) public onlyProgram returns (bool) {
        bool result = _horseRaceAttrAddress.setValues(address(_horseRaceTokenAddress), tokenId, _raceUpdateTime, raceUpdateTime.Uint256ToBytes());
        return result;
    }
}
