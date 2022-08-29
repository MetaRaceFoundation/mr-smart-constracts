// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Admin is Ownable {
    mapping(address => bool) private _admins;

    modifier onlyAdmin() {
        require(_admins[msg.sender], "Only admin can call it");
        _;
    }

    constructor() {
        _admins[msg.sender] = true;
    }

    function addAdmin(address _admin) public onlyOwner {
        _admins[_admin] = true;
    }

    function delAdmin(address _admin) public onlyOwner {
        _admins[_admin] = false;
    }

    function isAdmin(address _addr) public view returns (bool) {
        return _admins[_addr];
    }
}

contract Program is Admin {
    mapping(address => bool) private _programs;

    modifier onlyProgram() {
        require(_programs[msg.sender], "Only program can call it");
        _;
    }

    function addProgram(address _program) public onlyOwner {
        _programs[_program] = true;
    }

    function delProgram(address _program) public onlyOwner {
        _programs[_program] = false;
    }

    function isProgram(address _program) public view returns (bool) {
        return _programs[_program];
    }
}

contract MinterAble is Ownable {
    mapping(address => bool) private minters;

    /**
     * @dev Throws if called by any account other than the owner.
     */
    modifier onlyMiner() {
        require(minters[msg.sender], "!miner");
        _;
    }

    function addMinter(address _minter) public onlyOwner {
        minters[_minter] = true;
    }

    function removeMinter(address _minter) public onlyOwner {
        minters[_minter] = false;
    }
}