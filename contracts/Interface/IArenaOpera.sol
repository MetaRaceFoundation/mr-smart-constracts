// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

interface IArenaOpera {

    function setHorseFactName(uint256 tokenId, string calldata name) external returns (bool);

    function setCreateTime(uint256 tokenId, uint256 time) external returns (bool);

    function setHorseFactTypes(uint256 tokenId, uint256 types) external returns (bool);

    function setFactoryStatus(uint256 tokenId, uint256 status) external returns (bool);

    function setRaceCount(uint256 tokenId, uint256 count) external returns (bool);

    function uptTotalRaceCount(uint256 tokenId) external returns (bool);

    function setLastRaceTime(uint256 tokenId, uint256 time) external returns (bool);

    function setMortAmount(uint256 tokenId, uint256 amount) external returns (bool);

    function getFactoryName(uint256 tokenId) external returns (string memory);

    function getCreateTime(uint256 tokenId) external returns (uint256);

    function getOwnerType(uint256 tokenId) external returns (uint256);

    function getIsClose(uint256 tokenId) external returns (uint256);

    function getRaceCount(uint256 tokenId) external returns (uint256);

    function getLastRaceTime(uint256 tokenId) external returns (uint256);

    function getTotalRaceCount(uint256 tokenId) external returns (uint256);

    function getMortAmount(uint256 tokenId) external returns (uint256);

    function setGameId(uint256 tokenId, uint256 gameId) external returns (bool);

    function checkGameId(uint256 tokenId, uint256 gameId) external returns (bool);
}
