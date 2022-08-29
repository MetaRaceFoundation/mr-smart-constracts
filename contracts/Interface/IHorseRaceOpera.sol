// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

interface IHorseRaceOpera {
    function setHorseStatus(uint256 tokenId, uint256 status) external returns (bool);

    function setHorseStatusBatch(uint256[] calldata tokenId, uint256 status) external returns (bool);

    function setHorseCount(uint256 tokenId, uint256 count) external returns (bool);

    function setHorseName(uint256 tokenId, string calldata name) external returns (bool);

    function setHorseNameUptCount(uint256 tokenId, uint256 count) external returns (bool);

    function setHorseBirthDay(uint256 tokenId, uint256 birthDay) external returns (bool);
    // horse mainGeneration
    function setHorseMGene(uint256 tokenId, uint256 mainGeneration) external returns (bool);

    function setHorseSGene(uint256 tokenId, uint256 slaveGeneration) external returns (bool);
    // 迭代系数
    function setHorseGeneSc(uint256 tokenId, uint256 generationScore) external returns (bool);
    // 性别
    function setHorseGender(uint256 tokenId, uint256 gender) external returns (bool);
    // 皮肤颜色
    function setHorseColor(uint256 tokenId, string calldata color) external returns (bool);
    //基因综合评分
    function setHorseGene(uint256 tokenId, string calldata gene) external returns (bool);
    // 设置训练值
    function setHorseTraValue(uint256 tokenId, uint256 trainingValue) external returns (bool);
    // 设置训练时间
    function setHorseTraTime(uint256 tokenId, uint256 trainingTime) external returns (bool);
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

    function setHorseFatherId(uint256 tokenId, uint256 father) external returns (bool);

    function setHorseMotherId(uint256 tokenId, uint256 mother) external returns (bool);
    // 繁殖次数
    function setHorseBreedCount(uint256 tokenId) external returns (bool);
    // 繁殖时间
    function setHorseBreedTime(uint256 tokenId, uint256 breedTime) external returns (bool);

    function setHeadWearId(uint256 tokenId, uint256 headWearId) external returns (bool);

    function setArmorId(uint256 tokenId, uint256 armorId) external returns (bool);

    function setPonytailId(uint256 tokenId, uint256 ponytailId) external returns (bool);

    function setHoofId(uint256 tokenId, uint256 hoofId) external returns (bool);

    function setGrade(uint256 tokenId, uint256 grade) external returns (bool);

    function setWinCount(uint256 tokenId, uint256 winCount) external returns (bool);

    function setRacePrice(uint256 tokenId, uint256 price) external returns (bool);

    function setRaceDis(uint256 tokenId, uint256 discount) external returns (bool);

    function setRaceReward(uint256 tokenId, uint256 reward) external returns (bool);

    function setRaceCoin(uint256 tokenId, uint256 coin) external returns (bool);

    function setSellUpdateTime(uint256 tokenId) external returns (bool);

    function setStudUpdateTime(uint256 tokenId) external returns (bool);

    function setRaceLastOwner(uint256 tokenId, address addr) external returns (bool);

    function setRaceLastPrice(uint256 tokenId, uint256 price) external returns (bool);

    function setRaceId(uint256 tokenId, uint256 raceId) external returns (bool);

    function setRaceType(uint256 tokenId, uint256 raceType) external returns (bool);

    function setRacecourse(uint256 tokenId, uint256 racecourse) external returns (bool);

    function setDistance(uint256 tokenId, uint256 distance) external returns (bool);

    function setRaceUpdateTime(uint256 tokenId, uint256 raceUpdateTime) external returns (bool);

    function getHorseName(uint256 tokenId) external returns (string memory);

    function getNameUptCount(uint256 tokenId) external returns (uint256);

    function getBirthDay(uint256 tokenId) external returns (uint256);

    function getHorseMGene(uint256 tokenId) external returns (uint256);

    function getHorseSGene(uint256 tokenId) external returns (uint256);

    function getHorseGeneSC(uint256 tokenId) external returns (uint256);

    function getHorseGender(uint256 tokenId) external returns (uint256);

    function getHorseColor(uint256 tokenId) external returns (string memory);

    function getHorseGene(uint256 tokenId) external returns (string memory);

    function getTrainingTime(uint256 tokenId) external returns (uint256);

    function getTrainingValue(uint256 tokenId) external returns (uint256);

    function getEnergy(uint256 tokenId) external returns (uint256);

    function getEnergyUpdateTime(uint256 tokenId) external returns (uint256);

    function getGradeScore(uint256 tokenId) external returns (uint256);

    function getGradeScoreMark(uint256 tokenId) external returns (uint256);

    function getScoreUpdateTime(uint256 tokenId) external returns (uint256);

    function getFather(uint256 tokenId) external view returns (uint256);

    function getMother(uint256 tokenId) external view returns (uint256);

    function getBreedCount(uint256 tokenId) external returns (uint256);

    function getBreedTime(uint256 tokenId) external returns (uint256);

    function getHeadWearId(uint256 tokenId) external returns (uint256);

    function getArmorId(uint256 tokenId) external returns (uint256);

    function getPonytailId(uint256 tokenId) external returns (uint256);

    function getHoofId(uint256 tokenId) external returns (uint256);

    function getGrade(uint256 tokenId) external returns (uint256);

    function getRaceCount(uint256 tokenId) external returns (uint256);

    function getWinCount(uint256 tokenId) external returns (uint256);

    function getHorseRaceLastOwner(uint256 tokenId) external returns (address);

    function getHorseRaceStatus(uint256 tokenId) external returns (uint256);

    function getHorseRaceCoin(uint256 tokenId) external returns (uint256);

    function getHorseRacePrice(uint256 tokenId) external returns (uint256);

    function getHorseRaceDiscount(uint256 tokenId) external returns (uint256);

    function getHorseRaceReward(uint256 tokenId) external returns (uint256);

    function getHorseRaceLastPrice(uint256 tokenId) external returns (uint256);

    function getSellUpdateTime(uint256 tokenId) external returns (uint256);

    function getStudUpdateTime(uint256 tokenId) external returns (uint256);

    function getRaceId(uint256 tokenId) external returns (uint256);

    function getRaceType(uint256 tokenId) external returns (uint256);

    function getRacecourse(uint256 tokenId) external returns (uint256);

    function getDistance(uint256 tokenId) external returns (uint256);

    function getRaceUpdateTime(uint256 tokenId) external returns (uint256);

    function checkStatus(uint256[] calldata tokenIds, uint256 status) external returns (bool);

    function checkGameInfo(uint256[] calldata tokenIds, uint256 types, uint256 raceId, uint256 racecourseId,
        uint256 level, uint256 distance) external returns (bool);

    function getUseTraTime(uint256 tokenId) external returns (uint256);

    function setUseTraTime(uint256 tokenId, uint256 trainingTime) external returns (bool);

    function setHorseGripGene(uint256 tokenId, string calldata gene) external returns (bool);

    function setHorseAccGene(uint256 tokenId, string calldata gene) external returns (bool);

    function setHorseEndGene(uint256 tokenId, string calldata gene) external returns (bool);

    function setHorseSpdGene(uint256 tokenId, string calldata gene) external returns (bool);

    function setHorseTurnGene(uint256 tokenId, string calldata gene) external returns (bool);

    function setHorseContGene(uint256 tokenId, string calldata gene) external returns (bool);

    function getHorseGripGene(uint256 tokenId) external returns (string memory);

    function getHorseAccGene(uint256 tokenId) external returns (string memory);

    function getHorseEndGene(uint256 tokenId) external returns (string memory);

    function getHorseSpdGene(uint256 tokenId) external returns (string memory);

    function getHorseTurnGene(uint256 tokenId) external returns (string memory);

    function getHorseContGene(uint256 tokenId) external returns (string memory);

    function getIntegral(uint256 tokenId) external returns (uint256);
}
