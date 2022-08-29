// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
pragma experimental ABIEncoderV2;

interface IERC721Attr {
    function setValues(address addr, uint256 tokenId, string calldata field, bytes calldata value) external returns (bool);

    function getValue(address addr, uint256 tokenId, string calldata field) external view returns (bytes memory result);

    function setFiled(address addr, string[] calldata field, uint256[] calldata types, uint256[] calldata auth) external returns (bool);

    function setUniques(address addr, string calldata field, bytes calldata value) external returns (bool);

    function delFiled(address addr, string calldata field) external returns (bool);

    function delValues(address addr, uint256 tokenId, string calldata field) external returns (bool);

    function getAuth(address addr, string calldata field) external view returns (uint256);

    function getType(address addr, string calldata field) external view returns (uint256);

    function getUniques(address addr, string calldata field, bytes calldata value) external view returns (bool);

    function setArrayValue(uint256 tokenId, string calldata field, bytes calldata value) external returns (bool);

    function checkArrayValue(uint256 tokenId, string calldata field, bytes calldata value) external view returns (bool);

    function delArrayValue(uint256 tokenId, string calldata field) external returns (bool);

    function removeArrayValue(uint256 tokenId, string calldata field, bytes calldata value) external returns (bool);

    function getArrayValue(uint256 tokenId, string calldata field) external view returns (uint256[] memory);

    function getArrayCount(uint256 tokenId, string calldata field) external view returns (uint256);
}
