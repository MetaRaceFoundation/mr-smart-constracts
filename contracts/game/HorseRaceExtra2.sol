// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/math/Math.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "../Interface/ICoin.sol";
import "../Interface/ICoin721.sol";
import "./Auth.sol";

interface IERC721Token {
    function ownerOf(uint256 tokenId) external view returns (address owner);

    function safeTransferFrom(address from, address to, uint256 tokenId) external;

    function safeMint(address to) external returns (uint256);
}

interface IConstant {

    function getFeeRateOfHorse() external returns (uint256);

    function getOnSale() external returns (uint256);

    function getResting() external returns (uint256);
    
    function getBreeding() external returns (uint256);

    function getMinDiscountOfHorse() external returns (uint256);

    function getMaxRewardOfHorse() external returns (uint256);

    function getMinSellUptTime() external returns (uint256);

    function getMinMatureTime() external returns (uint256);

    function getMinStudUptTime() external returns (uint256);

    function getModifyNameTimes() external returns (uint256);
}

interface IHorseRaceOpera {
    function setHorseStatus(uint256 tokenId, uint256 status) external returns (bool);

    function setGrade(uint256 tokenId, uint256 grade) external returns (bool);

    function setHorseNameUptCount(uint256 tokenId, uint256 count) external returns (bool);

    function setRacePrice(uint256 tokenId, uint256 price) external returns (bool);

    function setRaceDis(uint256 tokenId, uint256 discount) external returns (bool);

    function setRaceReward(uint256 tokenId, uint256 reward) external returns (bool);

    function setRaceCoin(uint256 tokenId, uint256 coin) external returns (bool);

    function setSellUpdateTime(uint256 tokenId) external returns (bool);

    function setStudUpdateTime(uint256 tokenId) external returns (bool);

    function setRaceLastOwner(uint256 tokenId, address addr) external returns (bool);

    function setRaceLastPrice(uint256 tokenId, uint256 price) external returns (bool);

    function getBirthDay(uint256 tokenId) external returns (uint256);

    function getNameUptCount(uint256 tokenId) external returns (uint256);

    function getHeadWearId(uint256 tokenId) external returns (uint256);

    function getArmorId(uint256 tokenId) external returns (uint256);

    function getPonytailId(uint256 tokenId) external returns (uint256);

    function getHoofId(uint256 tokenId) external returns (uint256);

    function getHorseGender(uint256 tokenId) external returns (uint256);

    function getHorseRaceLastOwner(uint256 tokenId) external returns (address);

    function getHorseRaceStatus(uint256 tokenId) external returns (uint256);

    function getHorseRaceCoin(uint256 tokenId) external returns (uint256);

    function getHorseRacePrice(uint256 tokenId) external returns (uint256);

    function getHorseRaceDiscount(uint256 tokenId) external returns (uint256);

    function getHorseRaceReward(uint256 tokenId) external returns (uint256);

    function getSellUpdateTime(uint256 tokenId) external returns (uint256);

    function getStudUpdateTime(uint256 tokenId) external returns (uint256);
}

contract HorseRaceExtra2 is Program {
    using SafeMath for uint256;
    using Math for uint256;

    ICoin private            _coin;
    ICoin721 private         _coin721;
    IHorseRaceOpera private _opera1;
    IHorseRaceOpera private _opera1_1;
    IHorseRaceOpera private _opera2;
    IHorseRaceOpera private _opera2_1;
    IERC721Token private _horseTokenAddress;
    address private _feeAccount;
    IConstant           private     _constant; // 常量合约地址

    event SellHorse(address account, uint256 tokenId, uint256 coin, uint256 price, uint256 time, uint256 status);
    event SireHorse(address account, uint256 tokenId, uint256 coin, uint256 price, uint256 time, uint256 status);
    event CancelSellHorse(address account, uint256 tokenId, uint256 time, uint256 status);
    event CancelSireHorse(address account, uint256 tokenId, uint256 time, uint256 status);
    event BuyHorse(address account, uint256 tokenId, uint256 coin, uint256 price, uint256 status, uint256 remainUptNameCount);

    modifier checkOwner(uint256 tokenId) {
        require(_horseTokenAddress.ownerOf(tokenId) == msg.sender, "only owner can do it!");
        _;
    }

    function initHorseRaceAttrAddress(
        address opera1, address opera1_1, address opera2, address opera2_1,
        address coinAddress, address coin721Addr, address tokenAddr, address constAddr, address feeAccount
    ) public onlyAdmin returns (bool){
        _opera1 = IHorseRaceOpera(opera1);
        _opera1_1 = IHorseRaceOpera(opera1_1);
        _opera2 = IHorseRaceOpera(opera2);
        _opera2_1 = IHorseRaceOpera(opera2_1);
        _horseTokenAddress = IERC721Token(tokenAddr);
        _coin = ICoin(coinAddress);
        _coin721 = ICoin721(coin721Addr);
        _constant = IConstant(constAddr);
        _feeAccount = feeAccount;
        return true;
    }

    function batchSellHorse(uint256 [] memory horseId, uint256 [] memory price, uint256 [] memory coin) public {
        require(horseId.length == price.length && horseId.length == coin.length, "batch sell horse param length not equal");
        require(horseId.length < 100, "params length should little than 100");
        for(uint i = 0; i < horseId.length; i++) {
            sellHorse(horseId[i], price[i], coin[i]);
        }
    }

    function batchSellHorseOnePrice(uint256 [] memory horseId, uint256 price, uint256 coin) public {
        require(horseId.length < 100, "params length should little than 100");
        for(uint i = 0; i < horseId.length; i++) {
            sellHorse(horseId[i], price, coin);
        }
    }

    // 马匹出售
    function sellHorse(uint256 horseId, uint256 price, uint256 coin) public checkOwner(horseId) {
        require(_opera2_1.getHorseRaceStatus(horseId) == 0, "Horses that must be at rest can be sold");
        require(_opera2_1.getHeadWearId(horseId) == 0 && _opera2_1.getArmorId(horseId) == 0
        && _opera2_1.getPonytailId(horseId) == 0 && _opera2_1.getHoofId(horseId) == 0, "Can't bring equipment to sell together");
        uint256 current = block.timestamp;
        uint256 sellUptTime = _opera2_1.getSellUpdateTime(horseId);
        uint256 spacing = current.sub(sellUptTime);
        require(spacing > _constant.getMinSellUptTime(), "Operation too fast");
        _horseTokenAddress.safeTransferFrom(msg.sender, address(_coin721), horseId);
        _opera1_1.setHorseStatus(horseId, _constant.getOnSale());
        _opera1_1.setRaceDis(horseId, _constant.getMinDiscountOfHorse());
        _opera1_1.setRaceReward(horseId, _constant.getMaxRewardOfHorse());
        _opera1_1.setRaceCoin(horseId, coin);
        _opera1_1.setRaceLastOwner(horseId, msg.sender);
        _opera1_1.setRacePrice(horseId, price);
        _opera1_1.setSellUpdateTime(horseId);
        emit SellHorse(msg.sender, horseId, coin, price, block.timestamp, _constant.getOnSale());
    }

    function batchCancelSellHorse(uint256 [] memory horseId) public {
        for(uint i = 0; i < horseId.length; i++) {
            cancelSellHorse(horseId[i]);
        }
    }

    // 马匹取消出售
    function cancelSellHorse(uint256 horseId) public {
        require(_opera2_1.getHorseRaceStatus(horseId) == 1, "The asset status is abnormal");
        uint256 current = block.timestamp;
        uint256 sellUptTime = _opera2_1.getSellUpdateTime(horseId);
        uint256 spacing = current.sub(sellUptTime);
        require(spacing > _constant.getMinSellUptTime(), "Operation too fast");
        address owner = _opera2_1.getHorseRaceLastOwner(horseId);
        require(owner == msg.sender, "Can only cancel own order");

        _coin721.safeTransferFrom(address(_horseTokenAddress), address(_coin721), msg.sender, horseId);
        _opera1_1.setHorseStatus(horseId, _constant.getResting());
        _opera1_1.setSellUpdateTime(horseId);
        emit CancelSellHorse(msg.sender, horseId, block.timestamp, _constant.getResting());
    }

    // 马匹放入育马场
    function sireHorse(uint256 horseId, uint256 price, uint256 coin) public checkOwner(horseId) {
        require(_opera2.getHorseGender(horseId) == 1, "The horse must be a stallion");
        require(_opera2_1.getHorseRaceStatus(horseId) == 0, "Horses that must be at rest can be sold");
        require(_opera2_1.getHeadWearId(horseId) == 0 && _opera2_1.getArmorId(horseId) == 0
        && _opera2_1.getPonytailId(horseId) == 0 && _opera2_1.getHoofId(horseId) == 0, "Can't bring equipment to sell together");
        uint256 current = block.timestamp;
        uint256 studUptTime = _opera2_1.getStudUpdateTime(horseId);
        uint256 birthDay = _opera2.getBirthDay(horseId);
        uint256 spacing = current.sub(studUptTime);
        uint256 growthTime = current.sub(birthDay);
        require(spacing > _constant.getMinStudUptTime(), "Operation too fast");
        require(growthTime > _constant.getMinMatureTime(), "The horse is immature");

        _horseTokenAddress.safeTransferFrom(msg.sender, address(_coin721), horseId);

        _opera1_1.setHorseStatus(horseId, 2);
        _opera1_1.setRaceLastOwner(horseId, msg.sender);
        _opera1_1.setStudUpdateTime(horseId);
        _opera1_1.setRaceCoin(horseId, coin);
        _opera1_1.setRacePrice(horseId, price);
        emit SireHorse(msg.sender, horseId, coin, price, block.timestamp, _constant.getBreeding());
    }

    // 马匹育马场取出
    function cancelSireHorse(uint256 horseId) public {
        require(_opera2_1.getHorseRaceStatus(horseId) == 2, "Horses that must be at rest can be sold");
        uint256 current = block.timestamp;
        uint256 studUptTime = _opera2_1.getStudUpdateTime(horseId);
        uint256 spacing = current.sub(studUptTime);
        require(spacing > _constant.getMinStudUptTime(), "Operation too fast");
        address owner = _opera2_1.getHorseRaceLastOwner(horseId);
        require(owner == msg.sender, "Can only cancel own order");
        _coin721.safeTransferFrom(address(_horseTokenAddress), address(_coin721), msg.sender, horseId);
        _opera1_1.setHorseStatus(horseId, _constant.getResting());
        _opera1_1.setStudUpdateTime(horseId);
        emit CancelSireHorse(msg.sender, horseId, block.timestamp, _constant.getResting());
    }

    // 购买马匹
    function buy(uint256 coin, uint256 horseId) public {
        address owner = _opera2_1.getHorseRaceLastOwner(horseId);
        require(owner != msg.sender, "Not allowed to purchase own orders!");
        uint256 status = _opera2_1.getHorseRaceStatus(horseId);
        require(status == 1, "This token is not selling!");
        uint256 coinType = _opera2_1.getHorseRaceCoin(horseId);
        require(coinType == coin, "This coin is not selling!");

        uint256 price = _opera2_1.getHorseRacePrice(horseId);
        uint256 discount = _opera2_1.getHorseRaceDiscount(horseId);
        uint256 real_dis = discount.max(_constant.getMinDiscountOfHorse());
        uint256 real_price = price.mul(real_dis).div(10000);
        // 购买者转给coin合约
        _coin.safeTransferFrom(coinType, msg.sender, address(_coin), real_price);
        _buy(horseId, coin, owner, msg.sender, real_price);
        _opera1_1.setRaceLastPrice(horseId, price);
        _opera1_1.setHorseStatus(horseId, _constant.getResting());
        _opera1_1.setRaceLastOwner(horseId, msg.sender);
        _opera1.setHorseNameUptCount(horseId, _constant.getModifyNameTimes());
        emit BuyHorse(msg.sender, horseId, coin, real_price, _constant.getResting(), _constant.getModifyNameTimes());
    }

    function _buy(
        uint256 tokenId,
        uint256 coin,
        address from, // 这里是出售者地址
        address to,
    //        uint256 price,
        uint256 real_price
    ) internal {
        //        uint256 reward = _opera.getHorseEquipReward(tokenId);
        //        uint256 real_reward = reward.min(_maxReward);
        //        uint256 rewardDiscount = price.mul(real_reward).div(10000);
        uint256 fee_to_pay = real_price.mul(_constant.getFeeRateOfHorse()).div(10000);

        // transfer the handling fee to the set handling fee account
        _coin.safeTransfer(coin, _feeAccount, fee_to_pay);
        // transfer the benefits to the account of the transaction initiator
        _coin.safeTransfer(coin, from, real_price.sub(fee_to_pay));

        //        if (rewardDiscount > 0) {
        //            _coin.safeTransferFrom(_rewardCoin, owner, to, rewardDiscount);
        //        }
        _coin721.safeTransferFrom(address(_horseTokenAddress), address(_coin721), to, tokenId);
    }

}
