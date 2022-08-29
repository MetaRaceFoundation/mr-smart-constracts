// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

interface IConstant {

    function getMortAmount() external view returns (uint256);

    function getMortToken() external view returns (uint256);

    function getMinMortTime() external view returns (uint256);

    function getGameCountLimit() external view returns (uint256);

    function getMaxSpacing() external view returns (uint256);

    function getApplyGameToken() external view returns (uint256);

    function getApplyGameAmount() external view returns (uint256);

    function getMinRaceUptTime() external view returns (uint256);

    function getAwardToken() external view returns (uint256);

    function getAwardAmount() external view returns (uint256);

    function getExtraAwardToken() external view returns (uint256);

    function getExtraAwardAmount() external view returns (uint256);

    function getMaxScore() external view returns (uint256);

    function getUseEnergy() external view returns (uint256);

    function getResting() external view returns (uint256);

    function getOnSale() external view returns (uint256);

    function getBreeding() external view returns (uint256);

    function getSigning() external view returns (uint256);

    function getInGame() external view returns (uint256);

    function getOnHold() external view returns (uint256);

    function getOnSell() external view returns (uint256);

    function getEquipped() external view returns (uint256);

    function getFeeRateOfHorse() external view returns (uint256);

    function getMinDiscountOfHorse() external view returns (uint256);

    function getMaxRewardOfHorse() external view returns (uint256);

    function getMinSellUptTime() external view returns (uint256);

    function getFeeRateOfEquip() external view returns (uint256);

    function getMinDiscountOfEquip() external view returns (uint256);

    function getMaxRewardOfEquip() external view returns (uint256);

    function getMinSpacing() external view returns (uint256);

    function getMinTraValue() external view returns (uint256);

    function getMaxTraValue() external view returns (uint256);

    function getTraAddValue() external view returns (uint256);

    function getTraTime() external view returns (uint256);

    function getUntTime() external view returns (uint256);

    function getTraToken() external view returns (uint256);

    function getTraTokenAmount() external view returns (uint256);

    function getBreDiscount() external view returns (uint256);

    function getBreCoefficient() external view returns (uint256);

    function getMinMareBrSpaTime() external view returns (uint256);

    function getMinStaBrSpaTime() external view returns (uint256);

    function getMinMatureTime() external view returns (uint256);

    function getMinStudUptTime() external view returns (uint256);

    function getBreCoin1() external view returns (uint256);

    function getBreCoin1Amount() external view returns (uint256);

    function getBreCoin2() external view returns (uint256);

    function getBreCoin2Amount() external view returns (uint256);

    function getWeekRankCount() external view returns (uint256);

    function getMonthRankCount() external view returns (uint256);

    function getYearRankCount() external view returns (uint256);
    
    function getDate() external returns (uint32, uint32, uint32);

    function isOfficialContract(address addr) external view returns (bool);

    function getAccount() external view returns (address);

    function getApplyGameAmountByDistance(uint256 distance) external view returns (uint256);
    function getAwardAmountByDistance(uint256 distance) external view returns (uint256);
    function getMaxApplyCount() external view returns (uint256);
    function getTrackNumber() external view returns (uint256);
    function getInitColorsCount() external view returns (uint32);
    function getInitColors(uint8 index) external view returns (string memory);
    function getInitGrade() external view returns (uint256);
    function getInitIntegral() external view returns (uint256);
    function getMaxEnergy() external view returns (uint256);
    function getModifyNameTimes() external view returns (uint256);
    function getEnergyRecoverCD() external view returns (uint256);
}
