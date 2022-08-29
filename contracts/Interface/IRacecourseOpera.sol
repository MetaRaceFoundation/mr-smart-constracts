// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

interface IRacecourseOpera {

    function setCreateTime(uint256 tokenId, uint256 time) external returns (bool);

    function setLever(uint256 tokenId, uint256 lever) external returns (bool);

    function setRaceType(uint256 tokenId, uint256 raceType) external returns (bool);

    function setDistance(uint256 tokenId, uint256 distance) external returns (bool);

    function setStatus(uint256 tokenId, uint256 status) external returns (bool);

    function getCreateTime(uint256 tokenId) external returns (uint256);

    function getLever(uint256 tokenId) external returns (uint256);

    function getRaceType(uint256 tokenId) external returns (uint256);

    function getDistance(uint256 tokenId) external returns (uint256);

    function getStatus(uint256 tokenId) external returns (uint256);

    function delHorseId(uint256 tokenId) external returns (bool);

    function delHorseIdBatch(uint256[] calldata tokenIds) external returns (bool);

    function getHorseId(uint256 tokenId) external returns (uint256[] memory);

    function checkHorseId(uint256 tokenId, uint256 horseId) external returns (bool);
}
