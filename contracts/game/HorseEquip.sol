// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";
import "../Interface/IERC721Token.sol";
import "../Interface/IERC721Attr.sol";
import "../Interface/ICoin.sol";
import "../Interface/ICoin721.sol";
import "../Interface/IHorseEquipOpera.sol";
import "../Interface/IConstant.sol";
import "./Auth.sol";
import "hardhat/console.sol";

interface IHorseRaceOpera {
    function setHeadWearId(uint256 tokenId, uint256 headWearId) external returns (bool);

    function setArmorId(uint256 tokenId, uint256 armorId) external returns (bool);

    function setPonytailId(uint256 tokenId, uint256 ponytailId) external returns (bool);

    function setHoofId(uint256 tokenId, uint256 hoofId) external returns (bool);
}

contract HorseEquipContract is Admin {
    using SafeMath for uint256;
    using Math for uint256;

    ICoin private            _coin;
    ICoin721 private            _coin721;
    IHorseEquipOpera private _opera;
    IHorseRaceOpera private _opera1_1;
    IERC721Token private _horseEquipToken;
    address private _feeAccount;
    IConstant           private     _constant; // 常量合约地址

    event MintEquip(address account, uint256 tokenId, uint256 time, address to, uint256 types, uint256 style, uint256 status);
    event Sell(address account, uint256 tokenId, uint256 kind, uint256 coin, uint256 price, uint256 time);
    event CancelSell(address account, uint256 tokenId, uint256 status, uint256 time);

    event Buy(address account, uint256 tokenId, uint256 status);
    event UnloadEquip(address account, uint256 tokenId, uint256 status);
    event UnloadEquipOfHorse(address account, uint256 horseId, uint256 types, uint256 status);

    event EquipTransfer(address from, address to, uint256 tokenId, uint256 time);

    modifier checkSellAuth(uint256 tokenId) {
        require(_horseEquipToken.ownerOf(tokenId) == msg.sender, "only owner can do it!");
        _;
    }
    modifier senderIsToken() {
        require(msg.sender == address(_horseEquipToken), "only token contract can do it");
        _;
    }

    function initHorseEquipAttrAddress(address coinAddr, address coin721Addr, address operaAddr, address horseEquipToken,
        address feeAccount, address constAddr, address opera1_1) public onlyAdmin returns (bool){
        _coin = ICoin(coinAddr);
        _coin721 = ICoin721(coin721Addr);
        _opera = IHorseEquipOpera(operaAddr);
        _opera1_1 = IHorseRaceOpera(opera1_1);
        _horseEquipToken = IERC721Token(horseEquipToken);
        _constant = IConstant(constAddr);
        _feeAccount = feeAccount;
        return true;
    }

    function batchMintEquip(address[] memory to, uint256[] memory equip_types, uint256[] memory equip_style) public onlyAdmin {
        require(to.length == equip_types.length && to.length == equip_style.length, "invalid param length");
        require(to.length <= 100, "param length need little than 100");
        for(uint i = 0; i < to.length; i++) {
            mintEquip(to[i], equip_types[i], equip_style[i]);
        }
    }

    function mintEquip(address to, uint256 equip_types, uint256 equip_style) public onlyAdmin returns (uint256) {
        uint256 tokenId = _horseEquipToken.mint(to);
        _opera.setEquipTypes(tokenId, equip_types);
        _opera.setEquipStyle(tokenId, equip_style);
        _opera.setEquipStatus(tokenId, 0);
        emit MintEquip(msg.sender, tokenId, block.timestamp, to, equip_types, equip_style, 0);
        return tokenId;
    }

    function buy(uint256 coin, uint256 tokenId) public {
        address owner = _opera.getHorseEquipLastOwner(tokenId);
        require(owner != msg.sender, "Not allowed to purchase own orders!");
        uint256 status = _opera.getHorseEquipStatus(tokenId);
        require(status == 1, "This token is not selling!");
        uint256 coinType = _opera.getHorseEquipCoin(tokenId);
        require(coinType == coin, "This coin is not selling!");

        uint256 price = _opera.getHorseEquipPrice(tokenId);
        uint256 discount = _opera.getHorseEquipDiscount(tokenId);
        uint256 real_dis = discount.max(_constant.getMinDiscountOfEquip());
        uint256 real_price = price.mul(real_dis).div(10000);
        // 购买者转给coin合约
        _coin.safeTransferFrom(coinType, msg.sender, address(_coin), real_price);
        _buy(tokenId, coin, owner, msg.sender, real_price);
        _opera.setEquipLastPrice(tokenId, price);
        _opera.setEquipStatus(tokenId, 0);
        emit Buy(msg.sender, tokenId, 0);
    }

    function batchSellEquip(uint256[] memory tokenId, uint256[] memory coin, uint256[] memory price) public {
        require(coin.length == price.length && coin.length == tokenId.length, "invalid param length");
        require(tokenId.length < 100, "param length need little than 100");
        for(uint i = 0; i < tokenId.length; i++) {
            sellOne(coin[i], price[i], tokenId[i]);
        }
    }

    function batchSellEquipOnePrice(uint256[] memory tokenId, uint256 coin, uint256 price) public {
        require(tokenId.length < 100, "param length need little than 100");
        for(uint i = 0; i < tokenId.length; i++) {
            sellOne(coin, price, tokenId[i]);
        }
    }

    function sellOne(
        uint256 coin,
        uint256 price,
        uint256 tokenId
    ) public checkSellAuth(tokenId) {
        uint256 status = _opera.getHorseEquipStatus(tokenId);
        require(status == 0, "Equipment must be in a backpack to be sold");
        uint256 lastOperaTime = _opera.getLastOperaTime(tokenId);
        uint256 spacing = block.timestamp.sub(lastOperaTime);
        require(spacing >= _constant.getMinSpacing(), "The minimum interval is not met, please operate later");
        _sellOne(msg.sender, _constant.getOnSell(), coin, price, _constant.getMinDiscountOfEquip(), _constant.getMaxRewardOfEquip(), tokenId);
    }

    function cancelSell(uint256 tokenId) public returns (bool) {
        uint256 status = _opera.getHorseEquipStatus(tokenId);
        require(status == 1, "Equipment not for sale");
        uint256 lastOperaTime = _opera.getLastOperaTime(tokenId);
        uint256 spacing = block.timestamp.sub(lastOperaTime);
        require(spacing >= _constant.getMinSpacing(), "The minimum interval is not met, please operate later");
        address lastOwner = _opera.getHorseEquipLastOwner(tokenId);
        require(lastOwner == msg.sender, "Only owner can do it!");
        _coin721.safeTransferFrom(address(_horseEquipToken),address(_coin721), lastOwner, tokenId);
        //出售价格设置为0
        _opera.setEquipPrice(tokenId, 0);
        _opera.setEquipStatus(tokenId, 0);
        emit CancelSell(msg.sender, tokenId, 0, block.timestamp);
        return true;
    }

    function _sellOne(
        address from,
        uint256 status,
        uint256 coin,
        uint256 price,
        uint256 discount,
        uint256 reward,
        uint256 tokenId
    ) internal {
        _horseEquipToken.safeTransferFrom(from, address(_coin721), tokenId);
        _opera.setEquipPrice(tokenId, price);
        _opera.setEquipStatus(tokenId, status);
        _opera.setEquipDis(tokenId, discount);
        _opera.setEquipReward(tokenId, reward);
        _opera.setEquipCoin(tokenId, coin);
        _opera.setEquipLastOwner(tokenId, from);
        _opera.setLastOperaTime2(tokenId);
        emit Sell(from, tokenId, status, coin, price, block.timestamp);

    }

    function _buy(
        uint256 tokenId,
        uint256 coin,
        address from, // 这里是出售者地址
        address to,
        uint256 real_price
    ) internal {
        uint256 fee_to_pay = real_price.mul(_constant.getFeeRateOfEquip()).div(10000);

        // transfer the handling fee to the set handling fee account
        _coin.safeTransfer(coin, _feeAccount, fee_to_pay);
        // transfer the benefits to the account of the transaction initiator
        _coin.safeTransfer(coin, from, real_price.sub(fee_to_pay));
        _coin721.safeTransferFrom(address(_horseEquipToken), address(_coin721), to, tokenId);
    }

    function _unloadEquip(uint256 tokenid, uint256 horseid) internal returns (bool) {
        uint256 equipType = _opera.getHorseEquipTypes(tokenid);
        
        bool result = false;
        if (equipType == 1) {
            result = true;
            _opera1_1.setHeadWearId(horseid, 0);
            emit UnloadEquipOfHorse(msg.sender, horseid, 1, 0);
        } else if (equipType == 2) {
            result = true;
            _opera1_1.setArmorId(horseid, 0);
            emit UnloadEquipOfHorse(msg.sender, horseid, 2, 0);
        } else if (equipType == 3) {
            result = true;
            _opera1_1.setPonytailId(horseid, 0);
            emit UnloadEquipOfHorse(msg.sender, horseid, 3, 0);
        } else {
            result = true;
            _opera1_1.setHoofId(horseid, 0);
            emit UnloadEquipOfHorse(msg.sender, horseid, 4, 0);
        }
        return result;
    }

    // 一键卸载装备
    function unloadEquip(uint256[] memory tokenIds, uint256 horseId) public returns (bool) {
        require(tokenIds.length <= 256, "Invalid parameters");
        for (uint256 i = 0; i < tokenIds.length; i++) {
            require(_horseEquipToken.ownerOf(tokenIds[i]) == msg.sender, "only owner can do it!");
            uint256 status = _opera.getHorseEquipStatus(tokenIds[i]);
            require(status == 2, "Abnormal equipment status");
            uint256 hId = _opera.getEquipOfHorseId(tokenIds[i]);
            require(hId == horseId, "Horses and decorations are an unusual match");

            _unloadEquip(tokenIds[i], horseId);
            
            emit UnloadEquip(msg.sender, tokenIds[i], 0);
        }
        _opera.setEquipStatusBatch(tokenIds, 0);
        return true;
    }

    function beforeTransfer(address from, address to, uint256 tokenId) public senderIsToken returns (bool) {
        // no need more handler.
        if (_constant.isOfficialContract(from) || _constant.isOfficialContract(to)) {
            //console.log("no need handler for equip extra contract transfer");
        } else {
            uint256 status = _opera.getHorseEquipStatus(tokenId);
            if (status == 2) {
                // 在装备中，卸载装备
                uint256 hId = _opera.getEquipOfHorseId(tokenId);
                _unloadEquip(tokenId, hId);
            }
        }
        return true;
    }

    function afterTransfer(address from, address to, uint256 tokenId) public senderIsToken returns (bool) {
        // no need more handler.
        // no need more handler.
        if (_constant.isOfficialContract(from) || _constant.isOfficialContract(to)) {
            //console.log("no need handler for equip extra contract transfer");
        } else {
            console.log("emit event equiptransfer");
            emit EquipTransfer(from, to, tokenId,block.timestamp);
        }
        return true;
    }

}
