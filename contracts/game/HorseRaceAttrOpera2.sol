// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "../library/Bytes.sol";
import "./Auth.sol";
import "../Interface/IERC721Token.sol";
import "../Interface/IERC721Attr.sol";

contract HorseRaceAttrOpera2 is Program {

    using Bytes for bytes;

    IERC721Attr private _horseRaceAttrAddress;
    address private _horseRaceTokenAddress;

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


    function init(address raceAttrAddress, address horseRaceToken) public onlyAdmin returns (bool) {
        _horseRaceAttrAddress = IERC721Attr(raceAttrAddress);
        _horseRaceTokenAddress = horseRaceToken;
        return true;
    }

    function getHorseName(uint256 tokenId) public view returns (string memory){
        bytes memory nameBytes = _horseRaceAttrAddress.getValue(address(_horseRaceTokenAddress), tokenId, _horseRaceName);
        return nameBytes.BytesToString();
    }

    function getNameUptCount(uint256 tokenId) public view returns (uint256){
        bytes memory bytesInfo = _horseRaceAttrAddress.getValue(address(_horseRaceTokenAddress), tokenId, _nameUptCount);
        return bytesInfo.BytesToUint256();
    }

    function getBirthDay(uint256 tokenId) public view returns (uint256){
        bytes memory bytesInfo = _horseRaceAttrAddress.getValue(address(_horseRaceTokenAddress), tokenId, _birthDay);
        return bytesInfo.BytesToUint256();
    }

    function getHorseMGene(uint256 tokenId) public view returns (uint256){
        bytes memory bytesInfo = _horseRaceAttrAddress.getValue(address(_horseRaceTokenAddress), tokenId, _mainGeneration);
        return bytesInfo.BytesToUint256();
    }

    function getHorseSGene(uint256 tokenId) public view returns (uint256){
        bytes memory bytesInfo = _horseRaceAttrAddress.getValue(address(_horseRaceTokenAddress), tokenId, _slaveGeneration);
        return bytesInfo.BytesToUint256();
    }

    function getHorseGeneSC(uint256 tokenId) public view returns (uint256){
        bytes memory bytesInfo = _horseRaceAttrAddress.getValue(address(_horseRaceTokenAddress), tokenId, _generationScore);
        return bytesInfo.BytesToUint256();
    }

    function getHorseGender(uint256 tokenId) public view returns (uint256){
        bytes memory bytesInfo = _horseRaceAttrAddress.getValue(address(_horseRaceTokenAddress), tokenId, _gender);
        return bytesInfo.BytesToUint256();
    }

    function getHorseColor(uint256 tokenId) public view returns (string memory){
        bytes memory bytesInfo = _horseRaceAttrAddress.getValue(address(_horseRaceTokenAddress), tokenId, _color);
        return string(bytesInfo);
    }

    function getHorseGene(uint256 tokenId) public view returns (string memory){
        bytes memory bytesInfo = _horseRaceAttrAddress.getValue(address(_horseRaceTokenAddress), tokenId, _gene);
        return string(bytesInfo);
    }

    function getHorseGripGene(uint256 tokenId) public view returns (string memory){
        bytes memory bytesInfo = _horseRaceAttrAddress.getValue(address(_horseRaceTokenAddress), tokenId, _gripGene);
        return string(bytesInfo);
    }

    function getHorseAccGene(uint256 tokenId) public view returns (string memory){
        bytes memory bytesInfo = _horseRaceAttrAddress.getValue(address(_horseRaceTokenAddress), tokenId, _accGene);
        return string(bytesInfo);
    }

    function getHorseEndGene(uint256 tokenId) public view returns (string memory){
        bytes memory bytesInfo = _horseRaceAttrAddress.getValue(address(_horseRaceTokenAddress), tokenId, _endGene);
        return string(bytesInfo);
    }

    function getHorseSpdGene(uint256 tokenId) public view returns (string memory){
        bytes memory bytesInfo = _horseRaceAttrAddress.getValue(address(_horseRaceTokenAddress), tokenId, _speedGene);
        return string(bytesInfo);
    }

    function getHorseTurnGene(uint256 tokenId) public view returns (string memory){
        bytes memory bytesInfo = _horseRaceAttrAddress.getValue(address(_horseRaceTokenAddress), tokenId, _turnToGene);
        return string(bytesInfo);
    }

    function getHorseContGene(uint256 tokenId) public view returns (string memory){
        bytes memory bytesInfo = _horseRaceAttrAddress.getValue(address(_horseRaceTokenAddress), tokenId, _controlGene);
        return string(bytesInfo);
    }

    function getTrainingTime(uint256 tokenId) public view returns (uint256){
        bytes memory bytesInfo = _horseRaceAttrAddress.getValue(address(_horseRaceTokenAddress), tokenId, _trainingTime);
        return bytesInfo.BytesToUint256();
    }

    function getUseTraTime(uint256 tokenId) public view returns (uint256){
        bytes memory bytesInfo = _horseRaceAttrAddress.getValue(address(_horseRaceTokenAddress), tokenId, _useTraTime);
        return bytesInfo.BytesToUint256();
    }

    function getTrainingValue(uint256 tokenId) public view returns (uint256){
        bytes memory bytesInfo = _horseRaceAttrAddress.getValue(address(_horseRaceTokenAddress), tokenId, _trainingValue);
        return bytesInfo.BytesToUint256();
    }

    function getEnergy(uint256 tokenId) public view returns (uint256){
        bytes memory bytesInfo = _horseRaceAttrAddress.getValue(address(_horseRaceTokenAddress), tokenId, _energy);
        return bytesInfo.BytesToUint256();
    }

    function getEnergyUpdateTime(uint256 tokenId) public view returns (uint256){
        bytes memory bytesInfo = _horseRaceAttrAddress.getValue(address(_horseRaceTokenAddress), tokenId, _energyUpdateTime);
        return bytesInfo.BytesToUint256();
    }

    function getGradeScore(uint256 tokenId) public view returns (uint256){
        bytes memory bytesInfo = _horseRaceAttrAddress.getValue(address(_horseRaceTokenAddress), tokenId, _gradeScore);
        return bytesInfo.BytesToUint256();
    }

    function getIntegral(uint256 tokenId) public view returns (uint256){
        bytes memory bytesInfo = _horseRaceAttrAddress.getValue(address(_horseRaceTokenAddress), tokenId, _gradeIntegral);
        return bytesInfo.BytesToUint256();
    }

    function getGradeScoreMark(uint256 tokenId) public view returns (uint256){
        bytes memory bytesInfo = _horseRaceAttrAddress.getValue(address(_horseRaceTokenAddress), tokenId, _gradeScoreMark);
        return bytesInfo.BytesToUint256();
    }

    function getScoreUpdateTime(uint256 tokenId) public view returns (uint256){
        bytes memory bytesInfo = _horseRaceAttrAddress.getValue(address(_horseRaceTokenAddress), tokenId, _raceScoreUpdateTime);
        return bytesInfo.BytesToUint256();
    }

    function getFather(uint256 tokenId) public view returns (uint256){
        bytes memory bytesInfo = _horseRaceAttrAddress.getValue(address(_horseRaceTokenAddress), tokenId, _father);
        return bytesInfo.BytesToUint256();
    }

    function getMother(uint256 tokenId) public view returns (uint256){
        bytes memory bytesInfo = _horseRaceAttrAddress.getValue(address(_horseRaceTokenAddress), tokenId, _mother);
        return bytesInfo.BytesToUint256();
    }

    function getBreedCount(uint256 tokenId) public view returns (uint256){
        bytes memory bytesInfo = _horseRaceAttrAddress.getValue(address(_horseRaceTokenAddress), tokenId, _breedCount);
        return bytesInfo.BytesToUint256();
    }

    function getBreedTime(uint256 tokenId) public view returns (uint256){
        bytes memory bytesInfo = _horseRaceAttrAddress.getValue(address(_horseRaceTokenAddress), tokenId, _breedTime);
        return bytesInfo.BytesToUint256();
    }

    function getIntegralYear(uint256 tokenId) public view returns (uint256) {
        bytes memory bytesInfo = _horseRaceAttrAddress.getValue(address(_horseRaceTokenAddress), tokenId, _gradeIntegralYear);
        return bytesInfo.BytesToUint256();
    }

    function getIntegralMonth(uint256 tokenId) public view returns (uint256) {
        bytes memory bytesInfo = _horseRaceAttrAddress.getValue(address(_horseRaceTokenAddress), tokenId, _gradeIntegralMonth);
        return bytesInfo.BytesToUint256();
    }

    function getIntegralWeek(uint256 tokenId) public view returns (uint256) {
        bytes memory bytesInfo = _horseRaceAttrAddress.getValue(address(_horseRaceTokenAddress), tokenId, _gradeIntegralWeek);
        return bytesInfo.BytesToUint256();
    }

    function getIntegralDate(uint256 tokenId) public view returns (uint256, uint256, uint256) {
        bytes memory bytesInfoY = _horseRaceAttrAddress.getValue(address(_horseRaceTokenAddress), tokenId, _gradeIntegralYearTime);
        uint256 year =  bytesInfoY.BytesToUint256();

        bytes memory bytesInfoM = _horseRaceAttrAddress.getValue(address(_horseRaceTokenAddress), tokenId, _gradeIntegralMonthTime);
        uint256 month= bytesInfoM.BytesToUint256();

        bytes memory bytesInfoW = _horseRaceAttrAddress.getValue(address(_horseRaceTokenAddress), tokenId, _gradeIntegralWeekTime);
        uint256 week = bytesInfoW.BytesToUint256();
        return (year, month, week);
    }

    function getDetailIntegral(uint256 tokenId) public view returns (uint256, uint256, uint256, uint256) {
        uint256 total = getIntegral(tokenId);
        uint256 integralYear = getIntegralYear(tokenId);
        uint256 integralMonth = getIntegralMonth(tokenId);
        uint256 integralWeek = getIntegralWeek(tokenId);
        return (total, integralYear, integralMonth, integralWeek);
    }
}
