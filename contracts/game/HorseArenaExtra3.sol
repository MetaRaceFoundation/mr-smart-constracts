// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";
import "../Interface/ICoin.sol";
import "./Auth.sol";
import "hardhat/console.sol";

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

}

interface IERC721Token {
    function ownerOf(uint256 tokenId) external view returns (address owner);
}

interface IConstant {
    function getApplyGameToken() external returns (uint256);

    function getMaxApplyCount() external returns (uint256);

    function getTrackNumber() external returns (uint256);

    function getApplyGameAmount() external returns (uint256);

    function getMinRaceUptTime() external returns (uint256);

    function getMinMatureTime() external returns (uint256);

    function getSigning() external returns (uint256);

    function getResting() external returns (uint256);

    function getInGame() external returns (uint256);

    function getGameCountLimit() external returns (uint256);

    function getMaxSpacing() external returns (uint256);
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

    function clearGameIdUniques(uint256 gameId) external returns (bool);

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

contract HorseArenaExtra3 is Program {

    using SafeMath for uint256;
    using Math for uint256;
    IArenaOpera         private     _opera;
    IRacecourseOpera    private     _racecourseOpera;
    IHorseRaceOpera     private     _horseOpera1_1;
    IHorseRaceOpera     private     _horseOpera2_1;
    IConstant           private     _constant; // 常量合约地址

    event StartGame(uint256[] horseIds, uint256 status, uint256 time, uint256 gameId);
    event StartGameOfRace(uint256 gameId, uint256 status, uint256 time);
    event CancelGame(uint256[] gameId, uint256 status, uint256 time);
    event CancelGameOfHorse(uint256[] horseIds, uint256 status, uint256 time, uint256 gameId);
    event CancelGameOfArena(address account, uint256 tokenId, uint256[] gameId, uint256 time, uint256 count, uint256 totalCount);
    event UptArena(address account, uint256 tokenId, uint256 gameId, uint256 time, uint256 count, uint256 totalCount);
    event CreateGame(address account, uint256 gameId, uint256 time, uint256 level, uint256 raceType, uint256 distance, uint256 status);

    event TraceLog(uint256 line);

    function init(address operaAddr, address racecourseOpera,
        address horseOpera1_1, address horseOpera2_1, address consAddr) public onlyAdmin returns (bool){
        _opera = IArenaOpera(operaAddr);
        _racecourseOpera = IRacecourseOpera(racecourseOpera);
        _horseOpera1_1 = IHorseRaceOpera(horseOpera1_1);
        _horseOpera2_1 = IHorseRaceOpera(horseOpera2_1);
        _constant = IConstant(consAddr);
        return true;
    }

    // 开始比赛
    function startGame(
        uint256 tokenId,
        uint256 gameId,
        uint256[] memory horseId,
        uint256 types,
        uint256 level,
        uint256 distance
    ) public onlyProgram returns (bool){
        require(_opera.getIsClose(tokenId) == 1, "The stadium is closed"); emit TraceLog(154);
        require(horseId.length == _constant.getTrackNumber(), "Track limit exceeded"); emit TraceLog(155);
        require(_horseOpera2_1.checkStatus(horseId, _constant.getSigning()), "Abnormal state"); emit TraceLog(156);
        require(_horseOpera2_1.checkGameInfo(horseId, types, tokenId, level, distance), "Horse registration information does not match"); emit TraceLog(157);
        require(!_opera.checkGameIdIsExit(gameId), "GameId already used"); emit TraceLog(158);
        _opera.setGameIdUniques(gameId); emit TraceLog(159);
        _check(tokenId, horseId); emit TraceLog(160);
        uint256 gameCount = _opera.getRaceCount(tokenId); emit TraceLog(161);
        uint256 lastRaceTime = _opera.getLastRaceTime(tokenId); emit TraceLog(162);
        uint256 ownerType = _opera.getOwnerType(tokenId); emit TraceLog(163);
        
        uint256 gameCountLimit = _constant.getGameCountLimit(); emit TraceLog(165);
        uint256 maxSpacing = _constant.getMaxSpacing(); emit TraceLog(166);// 每 maxspaceing 时间可最多开启 gameCountLimit 次比赛.

        if (ownerType == 1) {
            uint256 currentUnit = block.timestamp.div(maxSpacing); emit TraceLog(167);
            uint256 lastUnit = lastRaceTime.div(maxSpacing); emit TraceLog(168);
            if (currentUnit == lastUnit && gameCount > gameCountLimit) {
                require(false, "execeed max game count limit"); emit TraceLog(169);
            } else if (currentUnit != lastUnit) {
                gameCount = 0; emit TraceLog(170);
                _opera.setLastRaceTime(tokenId, block.timestamp); emit TraceLog(171);
            }
        }

        gameCount = gameCount.add(1); emit TraceLog(172);

        _opera.setRaceCount(tokenId, gameCount); emit TraceLog(173);
        _opera.setGameId(tokenId, gameId); emit TraceLog(174);
        uint256 totalGameCount = _opera.getTotalRaceCount(tokenId); emit TraceLog(175);
        _opera.uptTotalRaceCount(tokenId, totalGameCount.add(1)); emit TraceLog(176);
        
        _uptHorseInfo(horseId, gameId); emit TraceLog(177);
        emit CreateGame(msg.sender, gameId, block.timestamp, level, types, distance, 1);
        emit UptArena(msg.sender, tokenId, gameId, block.timestamp, gameCount, totalGameCount.add(1));
        return true;
    }
    // 修改马匹状态为比赛中
    function _uptHorseInfo(uint256[] memory horseId, uint256 gameId) internal {
        for (uint256 i = 0; i < horseId.length; i++) {
            _racecourseOpera.setHorseId(gameId, horseId[i]);
        }
        _horseOpera1_1.setRaceIdBatch(horseId, gameId);
        _horseOpera1_1.setHorseStatusBatch(horseId, _constant.getInGame());
        emit StartGame(horseId, _constant.getInGame(), block.timestamp, gameId);
        emit StartGameOfRace(gameId, _constant.getInGame(), block.timestamp);
    }

    // 批量取消比赛-用于比赛过程中服务器宕机，回退可以重新开始比赛
    function cancelGame(uint256 tokenId, uint256 [] memory gameIds) public onlyProgram returns (bool){
        require(gameIds.length > 0 && gameIds.length <= 256, "Cannot opera 0 and must be less than 256");
        for (uint256 i = 0; i < gameIds.length; i++) {
            require(_opera.checkGameId(tokenId, gameIds[i]), "The field and the records don't match");
            uint256[] memory horseIds = _racecourseOpera.getHorseId(gameIds[i]);
            if (horseIds.length > 0) {
                // 批量修改马匹状态为报名中
                _horseOpera1_1.setHorseStatusBatch(horseIds, _constant.getSigning());
                _horseOpera1_1.setRaceIdBatch(horseIds, 0);
                emit CancelGameOfHorse(horseIds, _constant.getSigning(), block.timestamp, 0);
            }
            _racecourseOpera.delHorseId(gameIds[i]);
            _opera.clearGameIdUniques(gameIds[i]);
        
        }
        emit CancelGame(gameIds, 1, block.timestamp);
        uint256 gameCount = _opera.getRaceCount(tokenId);
        _opera.setRaceCount(tokenId, gameCount.sub(1));
        uint256 totalGameCount = _opera.getTotalRaceCount(tokenId);
        _opera.uptTotalRaceCount(tokenId, totalGameCount.sub(1));
        emit CancelGameOfArena(msg.sender, tokenId, gameIds, block.timestamp, gameCount.sub(1), totalGameCount.sub(1));
        return true;
    }

    function _check(uint256 tokenId, uint256[] memory horseId) internal {
        for (uint256 i = 0; i < horseId.length; i++) {
            require(_opera.checkHorseId(tokenId, horseId[i]), "Abnormal state");
        }
    }
}
