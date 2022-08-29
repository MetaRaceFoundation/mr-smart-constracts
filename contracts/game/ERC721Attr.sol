// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "../library/Bytes.sol";
import "./Auth.sol";
import "../Interface/BaseInterface.sol";

contract ERC721Attr is Program {
    using SafeMath for uint256;
    using Bytes for bytes;

    IERC721Token private tokenAddress;

    // key => field => value.
    // Record the fields and values corresponding to each contract
    mapping(address => mapping(uint256 => mapping(string => bytes))) private values;
    // field => types.
    // Define fields and types
    mapping(address => mapping(string => uint256)) private fieldsType;
    // field => auth.
    // Define the modification permissions of the field.
    // 1 =>onlyAdmin,   2 => onlyProgram,    3 => owner
    mapping(address => mapping(string => uint256)) private fieldsAuth;
    // field =>  value => true.
    // Record has only required fields
    mapping(address => mapping(string => mapping(bytes => bool))) private uniques;

    // 记录数组。
    // tokenId ===> field ===> 索引
    mapping(uint256 => mapping(string => uint256)) private index;
    // tokenId ===> field ===> 索引 ===> 值
    mapping(uint256 => mapping(string => mapping(uint256 => bytes))) private arrayValue;

    modifier checkAuth(string memory fields, address addr, uint256 tokenId) {
        uint256 auth = fieldsAuth[addr][fields];
        if (auth == 1) {
            require(isAdmin(msg.sender), "only admin");
        } else if (auth == 2) {
            require(isProgram(msg.sender), "only program");
        } else if (auth == 3) {
            tokenAddress = IERC721Token(addr);
            require(tokenAddress.ownerOf(tokenId) == msg.sender, "only owner");
        } else if (auth == 0) {
            require(false, "Invalid field");
        }
        _;
    }

    // 初始化参数，参数名称、参数类型、参数修改权限（1 admin，2 program，3 拥有者）
    function setFiled(address addr, string[] memory field, uint256[] memory types, uint256[] memory auth) public onlyAdmin returns (bool) {
        require(field.length > 0 && field.length <= 256, "Invalid parameters");
        require(field.length == types.length && field.length == auth.length, "Invalid parameters");
        for (uint256 i = 0; i < field.length; i++) {
            bool result = _setFiled(addr, field[i], types[i], auth[i]);
            require(result, "setFiled error");
        }
        return true;
    }

    function setValues(address addr, uint256 tokenId, string memory field, bytes memory value) public checkAuth(field, addr, tokenId) returns (bool) {
        bool result = _setValue(addr, tokenId, field, value);
        return result;
    }

    function setUniques(address addr, string memory field, bytes memory value) public onlyProgram returns (bool) {
        require(!uniques[addr][field][value], "Uniqueness verification failed");
        bool result = _setUniques(addr, field, value, true);
        return result;
    }

    function clearUniques(address addr, string memory field, bytes memory value) public onlyProgram returns (bool) {
        require(uniques[addr][field][value], "Uniqueness verification failed");
        bool result = _setUniques(addr, field, value, false);
        delete uniques[addr][field][value];
        return result;
    }

    function delFiled(address addr, string memory field) public onlyAdmin returns (bool) {
        bool result = _delFiled(addr, field);
        return result;
    }

    function delValues(address addr, uint256 tokenId, string memory field) public checkAuth(field, addr, tokenId) returns (bool) {
        bool result = _delValue(addr, tokenId, field);
        return result;
    }

    //    function delUniques(address addr, string memory field) public onlyProgram returns (bool) {
    //        _delUniques(field);
    //        return true;
    //    }

    function _setValue(address addr, uint256 tokenId, string memory field, bytes memory value) internal returns (bool){
        values[addr][tokenId][field] = value;
        return true;
    }

    function _setUniques(address addr, string memory field, bytes memory value, bool b) internal returns (bool){
        uniques[addr][field][value] = b;
        return true;
    }

    function _setFiled(address addr, string memory field, uint256 types, uint256 auth) internal returns (bool){
        fieldsType[addr][field] = types;
        fieldsAuth[addr][field] = auth;
        return true;
    }

    function _delFiled(address addr, string memory field) internal returns (bool){
        delete fieldsType[addr][field];
        delete fieldsAuth[addr][field];
        return true;
    }

    function _delValue(address addr, uint256 tokenId, string memory field) internal returns (bool){
        delete values[addr][tokenId][field];
        return true;
    }

    function getValue(address addr, uint256 tokenId, string memory field) public view returns (bytes memory result){
        return values[addr][tokenId][field];
    }

    function getAuth(address addr, string memory field) public view returns (uint256){
        return fieldsAuth[addr][field];
    }

    function getType(address addr, string memory field) public view returns (uint256){
        return fieldsType[addr][field];
    }

    function getUniques(address addr, string memory field, bytes memory value) public view returns (bool){
        return uniques[addr][field][value];
    }

    function setArrayValue(uint256 tokenId, string memory field, bytes memory value) public onlyProgram returns (bool){
        uint256 count = index[tokenId][field];
        arrayValue[tokenId][field][count] = value;
        index[tokenId][field] = count.add(1);
        return true;
    }

    function delArrayValue(uint256 tokenId, string memory field) public onlyProgram returns (bool){
        uint256 count = index[tokenId][field];
        for (uint256 i = 0; i < count; i++) {
            delete arrayValue[tokenId][field][i];
        }
        delete index[tokenId][field];
        return true;
    }

    function removeArrayValue(uint256 tokenId, string memory field, bytes memory value) public onlyProgram returns (bool){
        uint256 count = index[tokenId][field];
        bool isOn;
        for (uint256 i = 0; i < count; i++) {
            if (keccak256(value) == keccak256(arrayValue[tokenId][field][i])) {
                isOn = true;
                continue;
            }
            if (isOn) {
                bytes memory oldValue = arrayValue[tokenId][field][i];
                arrayValue[tokenId][field][i.sub(1)] = oldValue;
            }
        }
        if (isOn) {
            index[tokenId][field] = count.sub(1);
        }
        return true;
    }

    function checkArrayValue(uint256 tokenId, string memory field, bytes memory value) public view onlyProgram returns (bool){
        uint256 count = index[tokenId][field];
        for (uint256 i = 0; i < count; i++) {
            if (keccak256(value) == keccak256(arrayValue[tokenId][field][i])) {
                return true;
            }
        }
        return false;
    }

    function getArrayValue(uint256 tokenId, string memory field) public view returns (uint256[] memory){
        uint256 count = index[tokenId][field];
        uint256[] memory arr = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            bytes memory id = arrayValue[tokenId][field][i];
            arr[i] = id.BytesToUint256();
        }
        return arr;
    }

    function getArrayCount(uint256 tokenId, string memory field) public view returns (uint256){
        return index[tokenId][field];
    }
}
