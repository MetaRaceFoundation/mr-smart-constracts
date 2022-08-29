// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

interface IHorseEquipOpera {

    function setEquipStatus(uint256 tokenId, uint256 status) external returns (bool);

    function setEquipStatusBatch(uint256[] calldata tokenIds, uint256 status) external returns (bool);

    function setEquipTypes(uint256 tokenId, uint256 types) external returns (bool);

    function setEquipStyle(uint256 tokenId, uint256 style) external returns (bool);

    function setEquipPrice(uint256 tokenId, uint256 price) external returns (bool);

    function setEquipOfHorseId(uint256 tokenId, uint256 horseId) external returns (bool);

    function setEquipDis(uint256 tokenId, uint256 discount) external returns (bool);

    function setEquipReward(uint256 tokenId, uint256 reward) external returns (bool);

    function setEquipCoin(uint256 tokenId, uint256 coin) external returns (bool);

    function setLastOperaTime1(uint256 tokenId, uint256 operaTime) external returns (bool);

    function setLastOperaTime2(uint256 tokenId) external returns (bool);

    function setEquipLastOwner(uint256 tokenId, address addr) external returns (bool);

    function setEquipLastPrice(uint256 tokenId, uint256 price) external returns (bool);

    function getLastOperaTime(uint256 tokenId) external returns (uint256);

    function getHorseEquipLastOwner(uint256 tokenId) external returns (address);

    function getHorseEquipStatus(uint256 tokenId) external returns (uint256);

    function getHorseEquipCoin(uint256 tokenId) external returns (uint256);

    function getHorseEquipPrice(uint256 tokenId) external returns (uint256);

    function getHorseEquipDiscount(uint256 tokenId) external returns (uint256);

    function getHorseEquipReward(uint256 tokenId) external returns (uint256);

    function getHorseEquipTypes(uint256 tokenId) external returns (uint256);

    function getHorseEquipStyle(uint256 tokenId) external returns (uint256);

    function getHorseEquipLastPrice(uint256 tokenId) external returns (uint256);

    function getEquipOfHorseId(uint256 tokenId) external returns (uint256);
}
