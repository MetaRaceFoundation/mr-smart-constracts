// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "../library/Bytes.sol";
import "../library/Uint256.sol";
import "../library/String.sol";
import "./Auth.sol";
import "../Interface/IERC721Token.sol";
import "../Interface/IERC721Attr.sol";

contract HorseRaceAttrOpera1 is Program {

    using Uint256 for uint256;
    using String for string;
    using Bytes for bytes;
    using SafeMath for uint256;

    IERC721Attr private _horseRaceAttrAddress;
    IERC721Token private _horseRaceTokenAddress;

    string  public   _horseRaceName = "horseRaceName";//昵称 string
    string  public   _nameUptCount = "nameUptCount";//剩余改名次数 uint256
    string  public   _birthDay = "birthDay";//出生日期 uint256
    string  public   _mainGeneration = "mainGeneration"; // 主代 uint256
    string  public   _slaveGeneration = "slaveGeneration";//从代 uint256
    string  public   _generationScore = "generationScore";//迭代系数 uint256
    string  public   _gender = "gender";//性别 uint256
    string  public   _color = "color";//皮肤颜色 uint256
    string  public   _gene = "gene";//基因综合评分 uint256
    string  public   _gripGene = "gripGene";//抓地基因
    string  public   _accGene = "accGene";//加速基因
    string  public   _endGene = "endGene";//耐力基因
    string  public   _speedGene = "speedGene";//速度基因
    string  public   _turnToGene = "turnToGene";//转向基因
    string  public   _controlGene = "controlGene";//操控基因
    string  public   _trainingValue = "trainingValue";//训练值 uint256
    string  public   _trainingTime = "trainingTime";//训练时间 uint256
    string  public   _useTraTime = "useTraTime";//扣除训练值时间 uint256
    string  public   _energy = "energy";//能量 uint256
    string  public   _energyUpdateTime = "energyUpdateTime";//能量恢复时间 uint256
    string  public   _gradeScore = "gradeScore";//评分，参加比赛得到 uint256
    string  public   _gradeScoreMark = "gradeScoreMark";// 评分正负标记。1 正， 2负 uint256
    string  public   _gradeIntegral = "gradeIntegral";//积分，参加大奖赛得到 uint256
    string  public   _raceScoreUpdateTime = "raceScoreUpdateTime"; //积分最后一次更新时间 uint256
    string  public   _father = "father"; //父资产唯一id uint256
    string  public   _mother = "mother"; //母资产唯一id uint256
    string  public   _breedCount = "breedCount"; //繁殖总次数 uint256
    string  public   _breedTime = "breedTime"; //最近一次繁殖时间 uint256

    string  public   _gradeIntegralYear         = "gradeIntegralYear"; // 本年度增涨的积分数量
    string  public   _gradeIntegralYearTime     = "gradeIntegralYearTime"; // 当前记录年度时间
    string  public   _gradeIntegralMonth        = "gradeIntegralMonth"; // 本月增涨的积分数量
    string  public   _gradeIntegralMonthTime    = "gradeIntegralMonthTime"; // 当前记录月度时间
    string  public   _gradeIntegralWeek         = "gradeIntegralWeek"; // 本周增涨的积分数量
    string  public   _gradeIntegralWeekTime     = "gradeIntegralWeekTime"; // 当前记录周时间

    modifier checkGenderValue(uint256 gender) {
        if (gender == 0 || gender == 1) {
            require(true, "Legal field value");
        } else {
            require(false, "Invalid field value");
        }
        _;
    }
    modifier checkStatusValue(uint256 status) {
        if (status == 1 || status == 2 || status == 3 || status == 4 || status == 0) {
            require(true, "Legal field value");
        } else {
            require(false, "Invalid field value");
        }
        _;
    }

    function init(address raceAttrAddress, address horseRaceToken) public onlyAdmin returns (bool) {
        _horseRaceAttrAddress = IERC721Attr(raceAttrAddress);
        _horseRaceTokenAddress = IERC721Token(horseRaceToken);
        return true;
    }

    function setHorseName(uint256 tokenId, string memory name) public onlyProgram returns (bool) {
        bytes memory nameBytes = name.StringToBytes();
        bool boo = _horseRaceAttrAddress.getUniques(address(_horseRaceTokenAddress), _horseRaceName, nameBytes);
        require(!boo, "Name already used");
        bool result = _horseRaceAttrAddress.setValues(address(_horseRaceTokenAddress), tokenId, _horseRaceName, nameBytes);
        _horseRaceAttrAddress.setUniques(address(_horseRaceTokenAddress), _horseRaceName, nameBytes);
        return result;
    }

    function setHorseNameUptCount(uint256 tokenId, uint256 count) public onlyProgram returns (bool) {
        bool result = _horseRaceAttrAddress.setValues(address(_horseRaceTokenAddress), tokenId, _nameUptCount, count.Uint256ToBytes());
        return result;
    }

    function setHorseBirthDay(uint256 tokenId, uint256 birthDay) public onlyProgram returns (bool) {
        bool result = _horseRaceAttrAddress.setValues(address(_horseRaceTokenAddress), tokenId, _birthDay, birthDay.Uint256ToBytes());
        return result;
    }
    // horse mainGeneration
    function setHorseMGene(uint256 tokenId, uint256 mainGeneration) public onlyProgram returns (bool) {
        bool result = _horseRaceAttrAddress.setValues(address(_horseRaceTokenAddress), tokenId, _mainGeneration, mainGeneration.Uint256ToBytes());
        return result;
    }

    function setHorseSGene(uint256 tokenId, uint256 slaveGeneration) public onlyProgram returns (bool) {
        bool result = _horseRaceAttrAddress.setValues(address(_horseRaceTokenAddress), tokenId, _slaveGeneration, slaveGeneration.Uint256ToBytes());
        return result;
    }
    // 迭代系数
    function setHorseGeneSc(uint256 tokenId, uint256 generationScore) public onlyProgram returns (bool) {
        bool result = _horseRaceAttrAddress.setValues(address(_horseRaceTokenAddress), tokenId, _generationScore, generationScore.Uint256ToBytes());
        return result;
    }
    // 性别
    function setHorseGender(uint256 tokenId, uint256 gender) public onlyProgram checkGenderValue(gender) returns (bool) {
        bool result = _horseRaceAttrAddress.setValues(address(_horseRaceTokenAddress), tokenId, _gender, gender.Uint256ToBytes());
        return result;
    }
    // 皮肤颜色
    function setHorseColor(uint256 tokenId, string memory color) public onlyProgram returns (bool) {
        bool result = _horseRaceAttrAddress.setValues(address(_horseRaceTokenAddress), tokenId, _color, bytes(color));
        return result;
    }
    //基因综合评分
    function setHorseGene(uint256 tokenId, string memory gene) public onlyProgram returns (bool) {
        bool result = _horseRaceAttrAddress.setValues(address(_horseRaceTokenAddress), tokenId, _gene, bytes(gene));
        return result;
    }

    function setHorseGripGene(uint256 tokenId, string memory gene) public onlyProgram returns (bool) {
        bool result = _horseRaceAttrAddress.setValues(address(_horseRaceTokenAddress), tokenId, _gripGene, bytes(gene));
        return result;
    }

    function setHorseAccGene(uint256 tokenId, string memory gene) public onlyProgram returns (bool) {
        bool result = _horseRaceAttrAddress.setValues(address(_horseRaceTokenAddress), tokenId, _accGene, bytes(gene));
        return result;
    }

    function setHorseEndGene(uint256 tokenId, string memory gene) public onlyProgram returns (bool) {
        bool result = _horseRaceAttrAddress.setValues(address(_horseRaceTokenAddress), tokenId, _endGene, bytes(gene));
        return result;
    }

    function setHorseSpdGene(uint256 tokenId, string memory gene) public onlyProgram returns (bool) {
        bool result = _horseRaceAttrAddress.setValues(address(_horseRaceTokenAddress), tokenId, _speedGene, bytes(gene));
        return result;
    }

    function setHorseTurnGene(uint256 tokenId, string memory gene) public onlyProgram returns (bool) {
        bool result = _horseRaceAttrAddress.setValues(address(_horseRaceTokenAddress), tokenId, _turnToGene, bytes(gene));
        return result;
    }

    function setHorseContGene(uint256 tokenId, string memory gene) public onlyProgram returns (bool) {
        bool result = _horseRaceAttrAddress.setValues(address(_horseRaceTokenAddress), tokenId, _controlGene, bytes(gene));
        return result;
    }
    // 设置训练值
    function setHorseTraValue(uint256 tokenId, uint256 trainingValue) public onlyProgram returns (bool) {
        bool result = _horseRaceAttrAddress.setValues(address(_horseRaceTokenAddress), tokenId, _trainingValue, trainingValue.Uint256ToBytes());
        return result;
    }
    // 设置训练时间
    function setHorseTraTime(uint256 tokenId, uint256 trainingTime) public onlyProgram returns (bool) {
        bool result = _horseRaceAttrAddress.setValues(address(_horseRaceTokenAddress), tokenId, _trainingTime, trainingTime.Uint256ToBytes());
        return result;
    }
    // 设置扣除训练值时间
    function setUseTraTime(uint256 tokenId, uint256 trainingTime) public onlyProgram returns (bool) {
        bool result = _horseRaceAttrAddress.setValues(address(_horseRaceTokenAddress), tokenId, _useTraTime, trainingTime.Uint256ToBytes());
        return result;
    }
    // 设置能量
    function setHorseEnergy(uint256 tokenId, uint256 energy) public onlyProgram returns (bool) {
        bool result = _horseRaceAttrAddress.setValues(address(_horseRaceTokenAddress), tokenId, _energy, energy.Uint256ToBytes());
        return result;
    }
    // 能量恢复时间
    function setHorseEngTime(uint256 tokenId, uint256 energyUpdateTime) public onlyProgram returns (bool) {
        bool result = _horseRaceAttrAddress.setValues(address(_horseRaceTokenAddress), tokenId, _energyUpdateTime, energyUpdateTime.Uint256ToBytes());
        return result;
    }
    // 马匹评分
    function setHorseGradeSc(uint256 tokenId, uint256 gradeScore) public onlyProgram returns (bool) {
        bool result = _horseRaceAttrAddress.setValues(address(_horseRaceTokenAddress), tokenId, _gradeScore, gradeScore.Uint256ToBytes());
        return result;
    }
    // 马匹积分
    function setHorseIntegral(uint256 tokenId, uint256 integral) public onlyProgram returns (bool) {
        bool result = _horseRaceAttrAddress.setValues(address(_horseRaceTokenAddress), tokenId, _gradeIntegral, integral.Uint256ToBytes());
        return result;
    }
    // 马匹评分正负值标记
    function setHorseScoreMark(uint256 tokenId, uint256 gradeScoreMark) public onlyProgram returns (bool) {
        bool result = _horseRaceAttrAddress.setValues(address(_horseRaceTokenAddress), tokenId, _gradeScoreMark, gradeScoreMark.Uint256ToBytes());
        return result;
    }
    //积分最后一次更新时间
    function setHorseScUptTime(uint256 tokenId, uint256 raceScoreUpdateTime) public onlyProgram returns (bool) {
        bool result = _horseRaceAttrAddress.setValues(address(_horseRaceTokenAddress), tokenId, _raceScoreUpdateTime, raceScoreUpdateTime.Uint256ToBytes());
        return result;
    }

    function setHorseFatherId(uint256 tokenId, uint256 father) public onlyProgram returns (bool) {
        bool result = _horseRaceAttrAddress.setValues(address(_horseRaceTokenAddress), tokenId, _father, father.Uint256ToBytes());
        return result;
    }

    function setHorseMotherId(uint256 tokenId, uint256 mother) public onlyProgram returns (bool) {
        bool result = _horseRaceAttrAddress.setValues(address(_horseRaceTokenAddress), tokenId, _mother, mother.Uint256ToBytes());
        return result;
    }
    // 繁殖次数
    function setHorseBreedCount(uint256 tokenId) public onlyProgram returns (bool) {
        bytes memory bytesInfo = _horseRaceAttrAddress.getValue(address(_horseRaceTokenAddress), tokenId, _breedCount);
        uint256 count = bytesInfo.BytesToUint256().add(1);
        bool result = _horseRaceAttrAddress.setValues(address(_horseRaceTokenAddress), tokenId, _breedCount, count.Uint256ToBytes());
        return result;
    }
    // 繁殖时间
    function setHorseBreedTime(uint256 tokenId, uint256 breedTime) public onlyProgram returns (bool) {
        bool result = _horseRaceAttrAddress.setValues(address(_horseRaceTokenAddress), tokenId, _breedTime, breedTime.Uint256ToBytes());
        return result;
    }

    // 设置
    function setHorseDetailIntegral(uint256 tokenId, uint256 totalIntegral, uint256 integralYear, uint256 integralMonth, uint256 integralWeek) public onlyProgram returns (bool) {
        bool r = _horseRaceAttrAddress.setValues(address(_horseRaceTokenAddress), tokenId, _gradeIntegral, totalIntegral.Uint256ToBytes());
        require(r,"set value failed");
        r = _horseRaceAttrAddress.setValues(address(_horseRaceTokenAddress), tokenId, _gradeIntegralYear, integralYear.Uint256ToBytes());
        require(r,"set value failed");
        r = _horseRaceAttrAddress.setValues(address(_horseRaceTokenAddress), tokenId, _gradeIntegralMonth, integralMonth.Uint256ToBytes());
        require(r,"set value failed");
        r = _horseRaceAttrAddress.setValues(address(_horseRaceTokenAddress), tokenId, _gradeIntegralWeek, integralWeek.Uint256ToBytes());
        require(r,"set value failed");

        return r;
    }
    function setHorseIntegralDate(uint256 tokenId, uint256 year, uint256 month, uint256 week) public onlyProgram returns (bool) {
        bool result = _horseRaceAttrAddress.setValues(address(_horseRaceTokenAddress), tokenId, _gradeIntegralYearTime, year.Uint256ToBytes());
        result = _horseRaceAttrAddress.setValues(address(_horseRaceTokenAddress), tokenId, _gradeIntegralMonthTime, month.Uint256ToBytes());
        result = _horseRaceAttrAddress.setValues(address(_horseRaceTokenAddress), tokenId, _gradeIntegralWeekTime, week.Uint256ToBytes());
        return result;
    }
}
