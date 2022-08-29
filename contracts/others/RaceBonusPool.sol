// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
pragma experimental ABIEncoderV2;

import "../library/BaseLib.sol";

interface IRaceBonusData {
    function totalMoney(address,uint256) external returns(uint256);
    function activityCount(address,uint256,uint256) external returns(uint256);
    function isUnclaim(address,uint256,uint256) external returns(bool);
    function isReward(address,uint256,uint256) external returns(bool);
    function rewardCount(address,uint256) external returns(uint256);
    function addActivity(address _nftAddr, uint256 _year, uint256[] memory _tokenIds, uint256 _money) external;
    function claim(address _nftAddr, uint256 _year, uint256 _tokenId) external;
    function sync(address _nftAddr, uint256 _year, uint256 _tokenId) external;
}

contract RaceBonusData is IRaceBonusData, Program {
    using SafeMath for uint256;
    mapping(address => mapping(uint256 => uint256)) public override totalMoney;
    mapping(address => mapping(uint256 => mapping(uint256 => uint256))) public override activityCount;
    mapping(address => mapping(uint256 => mapping(uint256 => bool))) public override isReward;
    mapping(address => mapping(uint256 => mapping(uint256 => bool))) public override isUnclaim;
    mapping(address => mapping(uint256 => uint256)) public override rewardCount;

    uint256 public ACTIVITY_LIMIT = 300;

    function setSettings(uint256 _activityLimit) public onlyAdmin {
        ACTIVITY_LIMIT = _activityLimit;
    }
    
    function addActivity(address _nftAddr, uint256 _year, uint256[] memory _tokenIds, uint256 _money) public override onlyProgram checkArraySizeUint256(_tokenIds) {
        totalMoney[_nftAddr][_year] = totalMoney[_nftAddr][_year].add(_money);
        for (uint256 i = 0; i < _tokenIds.length; i++) {
            uint256 _tokenId = _tokenIds[i];
            activityCount[_nftAddr][_year][_tokenId] = activityCount[_nftAddr][_year][_tokenId].add(1);
            sync(_nftAddr, _year, _tokenId);
        }
    }

    function claim(address _nftAddr, uint256 _year, uint256 _tokenId) public override onlyProgram {
        isUnclaim[_nftAddr][_year][_tokenId] = false;
    }

    function sync(address _nftAddr, uint256 _year, uint256 _tokenId) public override onlyProgram {
        bool needReward = (activityCount[_nftAddr][_year][_tokenId] >= ACTIVITY_LIMIT);

        if (isReward[_nftAddr][_year][_tokenId] != needReward) {
            isReward[_nftAddr][_year][_tokenId] = needReward;
            isUnclaim[_nftAddr][_year][_tokenId] = needReward;
            if (needReward) {
                rewardCount[_nftAddr][_year] = rewardCount[_nftAddr][_year].add(1);
            } else {
                rewardCount[_nftAddr][_year] = rewardCount[_nftAddr][_year].sub(1);    
            }
        }
    }
}

contract RaceBonusPool is IRaceBonusPool, Program {
    using SafeMath for uint256;
    using SafeERC20Token for IERC20TokenMinable;

    IRaceBonusData private      bonusData;
    IERC20TokenMinable public   bonusToken;
    IERC721Token public         bonusNFT;
    address public              tokenAccount;
    
    uint256 public              startTime = 0;
    uint256 public              durationUnit = 1 days;
    uint256 public              durationBonus = 365.25 days;
    
    event Distribute(address indexed _raceCourse, uint256[] _tokenIds, uint256 _money);
    event Claim(address indexed account, uint256 amount);

    function setSettings(uint256 _durationUnit, uint256 _durationBonus) public onlyAdmin {
        durationUnit = _durationUnit;
        durationBonus = _durationBonus * durationUnit;
    }

    function setContracts(address _bonusData, address _bonusToken, address _bonusNFT, 
        address _tokenAccount) public onlyAdmin {
        bonusData = IRaceBonusData(_bonusData);
        bonusToken = IERC20TokenMinable(_bonusToken);
        bonusNFT = IERC721Token(_bonusNFT);
        
        tokenAccount = _tokenAccount;
    }
    
    function distribute(address _raceCourse, uint256[] memory _tokenIds, uint256 _money, uint256, address[] memory, uint256[] memory) public override onlyProgram checkArraySizeUint256(_tokenIds) {
        if (startTime == 0) {
            startTime = block.timestamp.div(durationUnit).mul(durationUnit);
        }
        uint256 _year = _getYear(block.timestamp);
        bonusData.addActivity(address(bonusNFT), _year, _tokenIds, _money);
        emit Distribute(_raceCourse, _tokenIds, _money);
    }

    function claim(uint256 nft_id) public override {
        require(bonusNFT.ownerOf(nft_id) == msg.sender, "You must be the owner of the NFT");
        uint256 _year = _getYear(block.timestamp);
        bonusData.sync(address(bonusNFT), _year, nft_id);

        for (uint i = 0; i < _year; i++) {
            bonusData.sync(address(bonusNFT), i, nft_id);
            uint256 yearMoney = bonusData.totalMoney(address(bonusNFT), i);
            uint256 yearCount = bonusData.rewardCount(address(bonusNFT), i);
            
            if (bonusData.isUnclaim(address(bonusNFT), i, nft_id) && yearMoney > 0 && yearCount > 0) {
                uint256 rewardAmount = yearMoney.div(yearCount);
                bonusToken.safeTransferFrom(tokenAccount, msg.sender, rewardAmount);
                bonusToken.mint(msg.sender, rewardAmount);
                bonusData.claim(address(bonusNFT), i, nft_id);
            }
        }
    }

    function _getYear(uint256 t) public view returns(uint256) {
        if (t <= startTime) {
            return 0;
        }
        return t.div(durationUnit).mul(durationUnit).sub(startTime) / durationBonus;
    }
}
