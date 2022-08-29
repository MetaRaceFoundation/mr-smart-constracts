// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
pragma experimental ABIEncoderV2;

import "../library/BaseLib.sol";

contract RaceBonusDistribute is IRaceBonusDistribute, Program {
    using SafeMath for uint256;
    using SafeERC20Token for IERC20TokenMinable;

    IERC721Token public         bonusNFT;
    uint256 public              rewardPercentOfRaceCourse;
    uint256[] public            rewardPercentOfWinners;
    address[] public            rewardAddressOfOthers;
    uint256[] public            rewardPercentOfOthers;
    IRaceBonusPool[] public     bonusPool;

    event Distribute(address indexed _raceCourse, uint256[] _tokenIds, uint256 _money);

    function setSettings(uint256 _rewardPercentOfRaceCourse, uint256[] memory _rewardPercentOfWinners, 
        address[] memory _rewardAddressOfOthers, uint256[] memory _rewardPercentOfOthers, IRaceBonusPool[] memory _bonusPool, address nfttoken) public onlyAdmin {
        rewardPercentOfRaceCourse = _rewardPercentOfRaceCourse;
        rewardPercentOfWinners = _rewardPercentOfWinners;
        rewardAddressOfOthers = _rewardAddressOfOthers;
        rewardPercentOfOthers = _rewardPercentOfOthers;
        bonusPool = _bonusPool;  
	    bonusNFT = IERC721Token(nfttoken);
	}

    function distribute(address _raceCourse, uint256[] memory _tokenIds, uint256 _money) public override onlyProgram checkArraySizeUint256(_tokenIds)  returns (uint256, address[] memory, uint256[] memory) {
        uint256 len = _tokenIds.length.add(rewardAddressOfOthers.length).add(1);
        address[] memory lstAddress = new address[](len);
        uint256[] memory lstAmount = new uint256[](len);
        uint256 count = 0;
        
        lstAddress[count] = _raceCourse;
        lstAmount[count] = _money.mul(rewardPercentOfRaceCourse).div(10000);
        count++;
        //bonusToken.safeTransferFrom(tokenAccount, _raceCourse, _money.mul(rewardPercentOfRaceCourse).div(10000));
        for (uint256 k = 0; k < _tokenIds.length; k++) {
		    uint256 percent = rewardPercentOfWinners[k];
            if (percent > 0) {
                lstAddress[count] = bonusNFT.ownerOf(_tokenIds[k]);
                lstAmount[count] = _money.mul(percent).div(10000);
                count++;
                //bonusToken.safeTransferFrom(tokenAccount, bonusNFT.ownerOf(_tokenIds[k]), _money.mul(percent).div(10000));
            }
        }
        for (uint256 i = 0; i < rewardAddressOfOthers.length; i++) {
            uint256 percent = rewardPercentOfOthers[i];
            if (percent > 0) {
                lstAddress[count] = rewardAddressOfOthers[i];
                lstAmount[count] = _money.mul(percent).div(10000);
                count++;
                //bonusToken.safeTransferFrom(tokenAccount, rewardAddressOfOthers[i], _money.mul(percent).div(10000));
            }
        }

        for (uint256 i = 0; i < bonusPool.length; i++) {
            bonusPool[i].distribute(_raceCourse, _tokenIds, _money, count, lstAddress, lstAmount);
        }
        emit Distribute(_raceCourse, _tokenIds, _money);
        return (count, lstAddress, lstAmount);
    }
}
