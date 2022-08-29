// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";
import "../Interface/IERC721Attr.sol";
import "../Interface/ICoin.sol";
import "../Interface/IConstant.sol";
import "../Interface/BaseInterface.sol";
import "./Auth.sol";
import "hardhat/console.sol";

interface IHorseRaceOpera {
    function setHorseStatusBatch(uint256[] calldata tokenId, uint256 status) external returns (bool);
    // 设置能量
    function setHorseEnergy(uint256 tokenId, uint256 energy) external returns (bool);
    // 能量恢复时间
    function setHorseEngTime(uint256 tokenId, uint256 energyUpdateTime) external returns (bool);
    // 马匹评分
    function setHorseGradeSc(uint256 tokenId, uint256 gradeScore) external returns (bool);
    // 马匹积分
    function setHorseIntegral(uint256 tokenId, uint256 integral) external returns (bool);
    // 马匹积分正负值标记
    function setHorseIntMark(uint256 tokenId, uint256 gradeScoreMark) external returns (bool);
    //积分最后一次更新时间
    function setHorseScUptTime(uint256 tokenId, uint256 raceScoreUpdateTime) external returns (bool);

    function setRaceId(uint256 tokenId, uint256 raceId) external returns (bool);

    function setHorseCount(uint256 tokenId) external returns (bool);

    function setWinCount(uint256 tokenId) external returns (bool);

    function setGrade(uint256 tokenId, uint256 grade) external returns (bool);

    function setRaceType(uint256 tokenId, uint256 raceType) external returns (bool);

    function setRacecourse(uint256 tokenId, uint256 racecourse) external returns (bool);

    function setDistance(uint256 tokenId, uint256 distance) external returns (bool);
    function setHorseDetailIntegral(uint256 tokenId, uint256 totalIntegral, uint256 integralYear, uint256 integralMonth, uint256 integralWeek) external returns (bool);
    function setHorseIntegralDate(uint256 tokenId, uint256 year, uint256 month, uint256 week) external returns (bool);

    function getEnergy(uint256 tokenId) external view returns (uint256);
    function getEnergyUpdateTime(uint256 tokenId) external view returns (uint256);
    function getTrainingValue(uint256 tokenId) external view returns (uint256);
    function getTrainingTime(uint256 tokenId) external view returns (uint256);

    function getGradeScoreMark(uint256 tokenId) external returns (uint256);

    function getGradeScore(uint256 tokenId) external returns (uint256);

    function getGrade(uint256 tokenId) external returns (uint256);

    function getIntegral(uint256 tokenId) external returns (uint256);

    function getWinCount(uint256 tokenId) external returns (uint256);

    function getRaceCount(uint256 tokenId) external returns (uint256);

    function getDistance(uint256 tokenId) external returns (uint256);

    function getDetailIntegral(uint256 tokenId) external returns (uint256, uint256, uint256, uint256);

    function getIntegralDate(uint256 tokenId) external returns (uint256, uint256, uint256);
}

interface IERC20Mint is IERC20Token {
    function mint(address recipient, uint amount) external;
}

interface IRacecourseOpera {

    function getHorseId(uint256 tokenId) external returns (uint256[] memory);

    function checkHorseId(uint256 tokenId, uint256 horseId) external returns (bool);
}

interface IArenaOpera {
    function getIsClose(uint256 tokenId) external returns (uint256);

    function checkGameId(uint256 tokenId, uint256 gameId) external returns (bool);
}

contract HorseArenaExtra is Program {

    using SafeMath for uint256;
    using Math for uint256;
    ICoin               private     _coin; // 抵押token合约地址
    IERC20Token         private     _metaToken; // meta token
    IERC20Mint         private     _raceToken; // race token
    IArenaOpera         private     _opera;
    IRacecourseOpera    private     _racecourseOpera;
    IHorseRaceOpera     private     _horseOpera;
    IHorseRaceOpera     private     _horseOpera1_1;
    IHorseRaceOpera     private     _horseOpera2;
    IHorseRaceOpera     private     _horseOpera2_1;
    IERC721Token        private     _horseTokenAddress; // 比赛合约地址
    IERC721Token        private     _arenaTokenAddress; // 赛场资产地址
    IConstant           private     _constant; // 常量合约地址
    IRaceBonusDistribute       private     _bonusPool; // 奖池合约

    event EndGame(uint256 gameId, uint256 status, uint256 time);
    event SetHorseIntegral(uint256 horseId, uint256 count, uint256 time, uint256 integralYear, uint256 integralMonth, uint256 integralWeek);
    event SetHorseGradeSc(uint256 horseId, uint256 count, uint256 mark, uint256 time, uint256 grade);
    event EndGameOfHorse(uint256 horseId, uint256 status, uint256 time, int256 arenaId,
        uint256 gameId, uint256 raceType, uint256 distance, uint256 energy, uint256 raceCount, uint256 winCount, uint256 grade);


    function init(address operaAddr, address coinAddr, address racecourseOpera,
        address horseOpera, address horseOpera1_1, address horseOpera2, address horseOpera2_1,
        address horseTokenAddress, address arenaTokenAddress, address consAddr, address metaCoin, address raceCoin) public onlyAdmin returns (bool){
        _opera = IArenaOpera(operaAddr);
        _coin = ICoin(coinAddr);
        _racecourseOpera = IRacecourseOpera(racecourseOpera);
        _horseOpera = IHorseRaceOpera(horseOpera);
        _horseOpera1_1 = IHorseRaceOpera(horseOpera1_1);
        _horseOpera2 = IHorseRaceOpera(horseOpera2);
        _horseOpera2_1 = IHorseRaceOpera(horseOpera2_1);
        _horseTokenAddress = IERC721Token(horseTokenAddress);
        _arenaTokenAddress = IERC721Token(arenaTokenAddress);
        _constant = IConstant(consAddr);
        _metaToken = IERC20Token(metaCoin);
        _raceToken = IERC20Mint(raceCoin);
        return true;
    }

    function setDistribute(address distribute) public onlyAdmin returns (bool) {
        _bonusPool = IRaceBonusDistribute(distribute);
        return true;
    }

    function calcIntegral(uint256 horseId, uint256 newIntegral) public returns (uint256, uint256, uint256, uint256) {
        uint256 totalIntegral;
        uint256 yearIntegral;
        uint256 monthIntegral;
        uint256 weekIntegral;
        (totalIntegral, yearIntegral, monthIntegral, weekIntegral) = _horseOpera2.getDetailIntegral(horseId);
        uint256 lastYear;
        uint256 lastMonth;
        uint256 lastWeek ;
        (lastYear, lastMonth, lastWeek) = _horseOpera2.getIntegralDate(horseId);
        uint32 nowYear;
        uint32 nowMonth;
        uint32 nowWeek ;
        (nowYear, nowMonth, nowWeek) = _constant.getDate();
        if (nowWeek != lastWeek) {
            weekIntegral = 0;
        }
        if (nowMonth != lastMonth) {
            monthIntegral = 0;
        }
        if (nowYear != lastYear) {
            yearIntegral = 0;
        }
        totalIntegral += newIntegral;
        weekIntegral  += newIntegral;
        monthIntegral += newIntegral;
        yearIntegral  += newIntegral;

        return (totalIntegral, yearIntegral, monthIntegral, weekIntegral);
        
    }

    function getHorseEnergy(uint256 horseId) public view returns(uint256) {
        uint256 energy = _horseOpera2.getEnergy(horseId);
        uint256 lastTime = _horseOpera2.getEnergyUpdateTime(horseId);
        uint256 recover = _constant.getEnergyRecoverCD();
        uint256 maxEnergy = _constant.getMaxEnergy();
        if (block.timestamp > lastTime) {
            energy = energy.add(block.timestamp.sub(lastTime).div(recover));
        }
        return (energy > maxEnergy) ? maxEnergy : energy;
    }

    function getHorseTraingValue(uint256 horseId) public view returns(uint256) {
        uint256 lastTraTime = _horseOpera2.getTrainingTime(horseId);
        uint256 current = block.timestamp;
        // 计算马匹当前训练值
        uint256 traingUntTime = _constant.getUntTime();
        uint256 traingValue = _horseOpera2.getTrainingValue(horseId);
        uint256 subValue = current.sub(lastTraTime).div(traingUntTime);
        if (traingValue <= subValue) {
            subValue = traingValue; // 最多减去当前已有的训练值，避免溢出.
        }
        traingValue = traingValue.sub(subValue);
        traingValue = traingValue.max(_constant.getMinTraValue());
        return traingValue;
    }

    function updateHorseEnergy(uint256 distance, uint256 horseId) internal returns(uint256) {
        uint256 useEnergy = distance.div(1200).mul(_constant.getUseEnergy());
        uint256 energy = getHorseEnergy(horseId);
        if (useEnergy > energy) {
            energy = 0;
        } else {
            energy = energy.sub(useEnergy);
        }
        _horseOpera.setHorseEnergy(horseId, energy);
        _horseOpera.setHorseEngTime(horseId, block.timestamp);
        return energy;
    }

    // 大奖赛结束比赛.rank是horseId排序
    function endGrandGame(uint256 tokenId, uint256 gameId, uint256[] memory rank,
        uint256[] memory score, uint256[] memory comp) public onlyProgram returns (bool){
        require(_opera.getIsClose(tokenId) == 1, "The stadium is closed");
        require(_opera.checkGameId(tokenId, gameId), "The field and the game do not match");
        require(rank.length == score.length && rank.length == comp.length && rank.length == _constant.getTrackNumber(), "Track limit exceeded");
        require(_checkScore(rank, score), "Score check failure");

        uint256[] memory horseIds = _racecourseOpera.getHorseId(gameId);
        uint256 distance = _horseOpera2_1.getDistance(rank[0]);
        // 批量修改马匹状态为休息中
        _horseOpera1_1.setHorseStatusBatch(horseIds, _constant.getResting());
        for (uint256 i = 0; i < rank.length; i++) {
            require(_racecourseOpera.checkHorseId(gameId, rank[i]), "The field does not match the horses");
            require(_check(horseIds, rank[i]), "Horse information does not match");
            uint256 level = _horseOpera2_1.getGrade(rank[i]);

            uint256 energy = updateHorseEnergy(distance, rank[i]);
            if (i < 3) {
                // 前三名
                _horseOpera1_1.setWinCount(rank[i]);
                {
                    uint256 totalIntegral;
                    uint256 integralYear;
                    uint256 integralMonth;
                    uint256 integralWeek;                
                    uint256 newIntegral = _constant.getMaxScore().sub(i).sub(level).add(1);
                    (totalIntegral, integralYear, integralMonth, integralWeek) = calcIntegral(rank[i], newIntegral);
                    
                    _horseOpera.setHorseDetailIntegral(rank[i], totalIntegral, integralYear, integralMonth, integralWeek);
                    emit SetHorseIntegral(rank[i], totalIntegral, block.timestamp, integralYear, integralMonth, integralWeek);
                }
                {
                    uint256 nowYear;
                    uint256 nowMonth; 
                    uint256 nowWeek;
                    (nowYear,nowMonth,nowWeek) = _constant.getDate();
                    _horseOpera.setHorseIntegralDate(rank[i], nowYear, nowMonth, nowWeek);
                }                
            }
            if (i < 4 || i > 7) {
                _horseOpera.setHorseGradeSc(rank[i], score[i]);
                _horseOpera.setHorseScUptTime(rank[i], block.timestamp);
                uint256 _grade = _setGrade(comp[i], rank[i]);
                emit SetHorseGradeSc(rank[i], score[i], _horseOpera2.getGradeScoreMark(rank[i]), block.timestamp, _grade);
            }
            // 马匹参赛信息，逻辑删除
            _horseOpera1_1.setHorseCount(rank[i]);
            _horseOpera1_1.setRaceId(rank[i], 0);
            _horseOpera1_1.setRaceType(rank[i], 0);
            _horseOpera1_1.setRacecourse(rank[i], 0);
            _horseOpera1_1.setDistance(rank[i], 0);
            
            uint256 raceCount = _horseOpera2_1.getRaceCount(rank[i]);
            uint256 winCount = _horseOpera2_1.getWinCount(rank[i]);
            uint256 grade    = _horseOpera2_1.getGrade(rank[i]);
            emit EndGameOfHorse(rank[i], _constant.getResting(), block.timestamp, 0, 0, 0, 0,
                energy, raceCount, winCount, grade);
        }
        _raceAward(rank, distance);
        _distApplyFee(tokenId, rank, distance);
        emit EndGame(tokenId, 0, block.timestamp);
        return true;
    }
    // 积分赛结束比赛.rank是horseId排序
    function endPointGame(uint256 tokenId, uint256 gameId, uint256[] memory rank,
        uint256[] memory score, uint256[] memory comp) public onlyProgram returns (bool){
        require(_opera.getIsClose(tokenId) == 1, "The stadium is closed");
        require(_opera.checkGameId(tokenId, gameId), "The field and the game do not match");
        require(rank.length == score.length && rank.length == _constant.getTrackNumber(), "Track limit exceeded");
        require(_checkScore(rank, score), "Score check failure");
        uint256[] memory horseIds = _racecourseOpera.getHorseId(gameId);
        uint256 distance = _horseOpera2_1.getDistance(rank[0]);
        // 批量修改马匹状态为休息中
        _horseOpera1_1.setHorseStatusBatch(horseIds, _constant.getResting());
        for (uint256 i = 0; i < rank.length; i++) {
            require(_racecourseOpera.checkHorseId(gameId, rank[i]), "The field does not match the horses");
            require(_check(horseIds, rank[i]), "Horse information does not match");

            uint256 energy = updateHorseEnergy(distance, rank[i]);
            if (i < 3) {
                _horseOpera1_1.setWinCount(rank[i]);
            }
            if (i < 4 || i > 7) {
                _horseOpera.setHorseGradeSc(rank[i], score[i]);
                _horseOpera.setHorseScUptTime(rank[i], block.timestamp);
                uint256 _grade = _setGrade(comp[i], rank[i]);
                emit SetHorseGradeSc(rank[i], score[i], _horseOpera2.getGradeScoreMark(rank[i]), block.timestamp, _grade);
            }
            // 马匹参赛信息，逻辑删除
            _horseOpera1_1.setHorseCount(rank[i]);
            _horseOpera1_1.setRaceId(rank[i], 0);
            _horseOpera1_1.setRaceType(rank[i], 0);
            _horseOpera1_1.setRacecourse(rank[i], 0);
            _horseOpera1_1.setDistance(rank[i], 0);
            
            // uint256 useEnergy = _horseOpera2_1.getDistance(rank[i]).div(1200).mul(_constant.getUseEnergy());
            // 修改马匹能量值
            uint256 raceCount = _horseOpera2_1.getRaceCount(rank[i]);
            uint256 winCount = _horseOpera2_1.getWinCount(rank[i]);
            uint256 grade = _horseOpera2_1.getGrade(rank[i]);
            emit EndGameOfHorse(rank[i], _constant.getResting(), block.timestamp, 0, 0, 0, 0,
                energy, raceCount, winCount, grade);
        }
        emit EndGame(gameId, 0, block.timestamp);
        return true;
    }
    // 根据综合评分设置马匹等级
    function _setGrade(uint256 score, uint256 horseId) internal returns (uint256){
        uint256 grade;
        if (score < 20) {
            grade = 999;
        } else if (score < 30) {
            grade = 5;
        } else if (score < 40) {
            grade = 4;
        } else if (score < 50) {
            grade = 3;
        } else if (score < 60) {
            grade = 2;
        } else {
            grade = 1;
        }
        _horseOpera1_1.setGrade(horseId, grade);
        return grade;
    }
    // 验证马匹评分.
    function _checkScore(uint256[] memory rank, uint256[] memory score) internal returns (bool){
        // 第一名增加的评分，然后递减
        uint256 integral = 4;
        for (uint256 i = 0; i < rank.length; i++) {
            uint256 horseScore = _horseOpera2.getGradeScore(rank[i]);
            uint256 newInt;
            if (3 < i && i < 8) {
                newInt = horseScore;
            }
            if (i < 4) {
                newInt = horseScore.add(integral);
                integral = integral.sub(1);
            }
            if (i > 7) {
                // 分数不能为负.
                integral = integral.add(1);
                if (horseScore >= integral) {
                    newInt = horseScore.sub(integral);
                } else if (horseScore < integral) {
                    newInt = 0;
                }
            }
            if (newInt != score[i]) {
                return false;
            }
        }
        return true;
    }

    function _raceAward(uint256 []memory rank, uint256 distance) internal {
        uint256 maxAward = _constant.getAwardAmountByDistance(distance);
        for (uint256 i = 0; i < rank.length; i++) {
            address owner = _horseTokenAddress.ownerOf(rank[i]);
            {
                uint decimal = _raceToken.decimals();
                uint256 award = maxAward * 10 ** decimal;
                console.log("award owner", owner);
                console.log("award race", award);
                _raceToken.mint(owner, award);
                
            }
        }
    }

    function _distApplyFee(uint256 tokenId, uint256 []memory rank, uint256 distance) internal {
        uint256 applyAmount = _constant.getApplyGameAmountByDistance(distance);
        uint256 total = rank.length * applyAmount;
        address owner = _arenaTokenAddress.ownerOf(tokenId);

        uint decimal = _coin.decimals(_constant.getApplyGameToken());
        total = total * 10 ** decimal;

        uint256 leng;
        address [] memory addresses;
        uint256[] memory money;

        (leng, addresses, money) = _bonusPool.distribute(owner, rank, total);
	    console.log("get distribute length is ", leng);
        for(uint256 i=0; i < leng; i++) {
            console.log("distribute fee to user ", addresses[i]);
            console.log("distribute fee to user amount ", money[i]);
            _coin.safeTransferWei(_constant.getApplyGameToken(), addresses[i], money[i]);
        }
    }

    function _check(uint256[] memory horseIds, uint256 horseId) internal pure returns (bool){
        for (uint256 a = 0; a < horseIds.length; a++) {
            if (horseIds[a] == horseId) {
                return true;
            }
        }
        return false;
    }
}
