// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";
import "../Interface/ICoin.sol";
import "../Interface/IConstant.sol";
import "./Auth.sol";

interface IHorseRaceOpera {
    function setHorseStatusBatch(uint256[] calldata tokenId, uint256 status) external returns (bool);

    function setHorseStatus(uint256 tokenId, uint256 status) external returns (bool);

    function setRaceUpdateTime(uint256 tokenId, uint256 raceUpdateTime) external returns (bool);

    function getBirthDay(uint256 tokenId) external returns (uint256);

    function getHorseRaceStatus(uint256 tokenId) external returns (uint256);

    function getRaceUpdateTime(uint256 tokenId) external returns (uint256);

    function setRaceId(uint256 tokenId, uint256 raceId) external returns (bool);

    function setRaceIdBatch(uint256[] calldata tokenIds, uint256 raceId) external returns (bool);

    function setRaceType(uint256 tokenId, uint256 raceType) external returns (bool);

    function setRacecourse(uint256 tokenId, uint256 racecourse) external returns (bool);

    function setDistance(uint256 tokenId, uint256 distance) external returns (bool);

    function getGrade(uint256 tokenId) external returns (uint256);

    function getRacecourse(uint256 tokenId) external returns (uint256);

    function checkStatus(uint256[] calldata tokenIds, uint256 status) external returns (bool);

    function checkGameInfo(uint256[] calldata tokenIds, uint256 types, uint256 racecourseId,
        uint256 level, uint256 distance) external returns (bool);
    function getDistance(uint256 tokenId) external returns (uint256);

}

interface IERC721Token {
    function ownerOf(uint256 tokenId) external view returns (address owner);
}

interface IRacecourseOpera {
    function setHorseId(uint256 tokenId, uint256 horseId) external returns (bool);

    function getHorseId(uint256 tokenId) external returns (uint256[] memory);

    function delHorseId(uint256 tokenId) external returns (bool);
}

interface IArenaOpera {
    function getIsClose(uint256 tokenId) external returns (uint256);

    function checkGameIdIsExit(uint256 gameId) external returns (bool);

    function setGameIdUniques(uint256 gameId) external returns (bool);

    function getHorseIdCount(uint256 tokenId) external returns (uint256);

    function setHorseId(uint256 tokenId, uint256 horseId) external returns (bool);

    function delHorseIdOne(uint256 tokenId, uint256 horseId) external returns (bool);

    function checkGameId(uint256 tokenId, uint256 gameId) external returns (bool);

    function checkHorseId(uint256 tokenId, uint256 gameId) external returns (bool);

    function getRaceCount(uint256 tokenId) external returns (uint256);

    function getTotalRaceCount(uint256 tokenId) external returns (uint256);

    function getLastRaceTime(uint256 tokenId) external returns (uint256);

    function getOwnerType(uint256 tokenId) external returns (uint256);

    function setRaceCount(uint256 tokenId, uint256 count) external returns (bool);

    function setGameId(uint256 tokenId, uint256 gameId) external returns (bool);

    function uptTotalRaceCount(uint256 tokenId, uint256 count) external returns (bool);

    function setLastRaceTime(uint256 tokenId, uint256 time) external returns (bool);

}

contract HorseArenaExtra2 is Program {

    using SafeMath for uint256;
    using Math for uint256;
    ICoin               private     _coin; // 抵押token合约地址
    IArenaOpera         private     _opera;
    IHorseRaceOpera     private     _horseOpera1_1;
    IHorseRaceOpera     private     _horseOpera2;
    IHorseRaceOpera     private     _horseOpera2_1;
    IConstant           private     _constant; // 常量合约地址
    IERC721Token        private     _horseTokenAddress;

    event ApplyGame(address account, uint256 horseId, uint256 arenaId, uint256 raceType, uint256 distance,
        uint256 time, uint256 status);
    event CancelApplyGame(address account, uint256 horseId, uint256 status, uint256 time, uint256 arenaId, uint256 gameId,
        uint256 raceType, uint256 distance);
    event WeekScoreRank(uint256[] horseId, uint256[] totalScore, address[] accounts, uint256[] rank);
    event MonthScoreRank(uint256[] horseId, uint256[] totalScore, address[] accounts, uint256[] rank);
    event YearsScoreRank(uint256[] horseId, uint256[] totalScore, address[] accounts, uint256[] rank);
    modifier checkAuth(uint256 tokenId) {
        require(_horseTokenAddress.ownerOf(tokenId) == msg.sender, "only owner can do it!");
        _;
    }

    function init(address operaAddr, address coinAddr, address horseTokenAddress,
        address horseOpera1_1, address horseOpera2, address horseOpera2_1, address consAddr) public onlyAdmin returns (bool){
        _opera = IArenaOpera(operaAddr);
        _coin = ICoin(coinAddr);
        _horseOpera1_1 = IHorseRaceOpera(horseOpera1_1);
        _horseOpera2 = IHorseRaceOpera(horseOpera2);
        _horseOpera2_1 = IHorseRaceOpera(horseOpera2_1);
        _constant = IConstant(consAddr);
        _horseTokenAddress = IERC721Token(horseTokenAddress);
        return true;
    }

    // 报名比赛。
    function applyGame(uint256 tokenId, uint256 horseId,
        uint256 raceType, uint256 distance, uint256 level) public checkAuth(horseId) {
        require(_opera.getIsClose(tokenId) == 1, "The stadium is closed");
        require(_horseOpera2_1.getHorseRaceStatus(horseId) == _constant.getResting(), "Abnormal state");
        require(_horseOpera2_1.getGrade(horseId) == level, "Level mismatch");
        require(_opera.getHorseIdCount(tokenId) <= _constant.getMaxApplyCount(), "The maximum number of entries is exceeded");
        require(level == 999 ? distance == 1200 : true, "The maximum number of entries is exceeded");

        // 成长时间
        uint256 spacing = block.timestamp.sub(_horseOpera2.getBirthDay(horseId));
        require(spacing > _constant.getMinMatureTime(), "Immature horses");
        // 多次操作冷却时间
        uint256 raceSpacing = block.timestamp.sub(_horseOpera2_1.getRaceUpdateTime(horseId));
        require(raceSpacing > _constant.getMinRaceUptTime(), "Cooling time");
        // 大奖赛需要报名费
        if (level != 999) {
            _coin.safeTransferFrom1(_constant.getApplyGameToken(), msg.sender, address(_coin), _constant.getApplyGameAmountByDistance(distance));
        }
        _opera.setHorseId(tokenId, horseId);
        // 修改马匹状态为报名中,记录马匹报名信息
        _horseOpera1_1.setHorseStatus(horseId, _constant.getSigning());
        _horseOpera1_1.setRaceType(horseId, raceType);
        _horseOpera1_1.setRacecourse(horseId, tokenId);
        _horseOpera1_1.setDistance(horseId, distance);
        _horseOpera1_1.setRaceUpdateTime(horseId, block.timestamp);
        emit ApplyGame(msg.sender, horseId, tokenId, raceType, distance, block.timestamp, _constant.getSigning());
    }

    // 取消报名
    function cancelApplyGame(uint256 horseId) public checkAuth(horseId) {
        require(_horseOpera2_1.getHorseRaceStatus(horseId) == 3, "Abnormal state");
        // 多次操作冷却时间
        uint256 raceSpacing = block.timestamp.sub(_horseOpera2_1.getRaceUpdateTime(horseId));
        require(raceSpacing > _constant.getMinRaceUptTime(), "Cooling time");
        // 大奖赛需要退还报名费
        uint256 level = _horseOpera2_1.getGrade(horseId);
        if (level != 999) {
	        uint256 distance = _horseOpera2_1.getDistance(horseId);
            _coin.safeTransfer1(_constant.getApplyGameToken(), msg.sender, _constant.getApplyGameAmountByDistance(distance));
        }
        // 修改马匹状态为休息中,记录马匹报名信息，逻辑删除
        _opera.delHorseIdOne(_horseOpera2_1.getRacecourse(horseId), horseId);
        _horseOpera1_1.setHorseStatus(horseId, _constant.getResting());
        _horseOpera1_1.setRaceId(horseId, 0);
        _horseOpera1_1.setRaceType(horseId, 0);
        _horseOpera1_1.setRacecourse(horseId, 0);
        _horseOpera1_1.setDistance(horseId, 0);
        _horseOpera1_1.setRaceUpdateTime(horseId, block.timestamp);
        emit CancelApplyGame(msg.sender, horseId, _constant.getResting(), block.timestamp, 0, 0, 0, 0);
    }

    function _check(uint256 tokenId, uint256[] memory horseId) internal {
        for (uint256 i = 0; i < horseId.length; i++) {
            require(_opera.checkHorseId(tokenId, horseId[i]), "Abnormal state");
        }
    }

    function weekRank(
        uint256[] memory horseIds,
        uint256[] memory totalScores,
        address[] memory accounts,
        uint256[] memory rank) public onlyProgram {
        require(horseIds.length == totalScores.length || horseIds.length == accounts.length ||
        horseIds.length == rank.length, "The parameter length is inconsistent");
        emit WeekScoreRank(horseIds, totalScores, accounts, rank);
    }

    function monthRank(
        uint256[] memory horseIds,
        uint256[] memory totalScores,
        address[] memory accounts,
        uint256[] memory rank) public onlyProgram {
        require(horseIds.length == totalScores.length || horseIds.length == accounts.length ||
        horseIds.length == rank.length, "The parameter length is inconsistent");
        emit MonthScoreRank(horseIds, totalScores, accounts, rank);
    }

    function yearsRank(
        uint256[] memory horseIds,
        uint256[] memory totalScores,
        address[] memory accounts,
        uint256[] memory rank) public onlyProgram {
        require(horseIds.length == totalScores.length || horseIds.length == accounts.length ||
        horseIds.length == rank.length, "The parameter length is inconsistent");
        emit YearsScoreRank(horseIds, totalScores, accounts, rank);
    }
}
