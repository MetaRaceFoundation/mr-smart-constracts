// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/math/Math.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "../Interface/IERC721Token.sol";
import "../Interface/ICoin.sol";
import "../Interface/IConstant.sol";
import "./Auth.sol";
import "../library/Bytes.sol";
import "hardhat/console.sol";


interface IHorseEquipOpera {

    function setEquipStatus(uint256 tokenId, uint256 status) external returns (bool);

    function setEquipOfHorseId(uint256 tokenId, uint256 horseId) external returns (bool);

    function getHorseEquipTypes(uint256 tokenId) external returns (uint256);

    function getHorseEquipStatus(uint256 tokenId) external returns (uint256);
}

interface IHorseRaceOpera {
    function setHorseName(uint256 tokenId, string calldata name) external returns (bool);

    function setUseTraTime(uint256 tokenId, uint256 trainingTime) external returns (bool);

    function setHorseNameUptCount(uint256 tokenId, uint256 count) external returns (bool);// 性别
    function setHorseTraValue(uint256 tokenId, uint256 trainingValue) external returns (bool);

    function setHorseTraTime(uint256 tokenId, uint256 trainingTime) external returns (bool);

    function setHeadWearId(uint256 tokenId, uint256 headWearId) external returns (bool);

    function setGrade(uint256 tokenId, uint256 grade) external returns (bool);

    function setArmorId(uint256 tokenId, uint256 armorId) external returns (bool);

    function setPonytailId(uint256 tokenId, uint256 ponytailId) external returns (bool);

    function setHoofId(uint256 tokenId, uint256 hoofId) external returns (bool);

    function getNameUptCount(uint256 tokenId) external returns (uint256);

    function getTrainingTime(uint256 tokenId) external returns (uint256);

    function getTrainingValue(uint256 tokenId) external returns (uint256);

    function getHeadWearId(uint256 tokenId) external returns (uint256);

    function getArmorId(uint256 tokenId) external returns (uint256);

    function getPonytailId(uint256 tokenId) external returns (uint256);

    function getHoofId(uint256 tokenId) external returns (uint256);

    function getUseTraTime(uint256 tokenId) external returns (uint256);

    function setHorseGripGene(uint256 tokenId, string calldata gene) external returns (bool);

    function setHorseAccGene(uint256 tokenId, string calldata gene) external returns (bool);

    function setHorseEndGene(uint256 tokenId, string calldata gene) external returns (bool);

    function setHorseSpdGene(uint256 tokenId, string calldata gene) external returns (bool);

    function setHorseTurnGene(uint256 tokenId, string calldata gene) external returns (bool);

    function setHorseContGene(uint256 tokenId, string calldata gene) external returns (bool);

    function getHorseRaceStatus(uint256 tokenId) external view returns (uint256);
}

contract HorseRaceExtra1 is Program {
    using SafeMath for uint256;
    using Math for uint256;
    using Bytes for bytes;

    ICoin private            _coin;
    IHorseRaceOpera private _opera;
    IHorseRaceOpera private _opera1_1;
    IHorseRaceOpera private _opera2;
    IHorseRaceOpera private _opera2_1;
    IHorseEquipOpera private _equipOpera;
    IERC721Token private _horseTokenAddress;
    IERC721Token private _equipTokenAddress;
    address private _feeAccount;
    IConstant           private     _constant; // 常量合约地址

    event InitHorseGrade(uint256 horseId, uint256 grade);
    event TrainingHorses(address account, uint256 tokenId, uint256 time, uint256 value);
    event UptHorseName(uint256 tokenId, string name, uint256 count);
    event HorseDeco(address account, uint256 tokenId, uint256 types, uint256 equipId, uint256 time);
    event HorseDecoOfEquip(uint256 equipId, uint256 status, uint256 tokenId);
    event UnloadEquip(address account, uint256 tokenId, uint256 status); // 装备替换过程中卸载上一件装备
    event UnloadEquipOfHorse(address account, uint256 horseId, uint256 types, uint256 status);// 装备替换过程中卸载上一件装备
    event SetHorseGene(uint256 tokenId, string gripGene, string accGene, string endGene, string speedGene,
        string turnToGene, string controlGene);
    event HorseTransfer(address from, address to, uint256 tokenId, uint256 time);

    modifier checkOwner(uint256 tokenId) {
	console.log("check owner horse id is ", tokenId);
        require(_horseTokenAddress.ownerOf(tokenId) == msg.sender, "only owner can do it!");
        _;
    }
    modifier checkEquipOwner(uint256 equipId) {
        require(_equipTokenAddress.ownerOf(equipId) == msg.sender, "only owner can do it!");
        _;
    }
    modifier senderIsToken() {
        require(msg.sender == address(_horseTokenAddress), "only token contract can do it");
        _;
    }

    function initHorseRaceAttrAddress(
        address operaAddr, address opera1_1, address opera2,
        address opera2_1, address equipOpera, address horseToken,
        address equipToken, address constAddr, address coinAddress, address feeAccount
    ) public onlyAdmin returns (bool){
        _opera = IHorseRaceOpera(operaAddr);
        _opera1_1 = IHorseRaceOpera(opera1_1);
        _opera2 = IHorseRaceOpera(opera2);
        _opera2_1 = IHorseRaceOpera(opera2_1);
        _equipOpera = IHorseEquipOpera(equipOpera);
        _horseTokenAddress = IERC721Token(horseToken);
        _equipTokenAddress = IERC721Token(equipToken);
        _coin = ICoin(coinAddress);
        _constant = IConstant(constAddr);
        _feeAccount = feeAccount;
        return true;
    }

    function uptHorseName(uint256 tokenId, string memory name, bytes memory sign) public checkOwner(tokenId) returns (bool) {
        require(sign.Decode(name) == _constant.getAccount(), "Signature verification failure");
        uint256 count = _opera2.getNameUptCount(tokenId);
        require(count > 0, "The number of edits has been used up");
        _opera.setHorseName(tokenId, name);
        _opera.setHorseNameUptCount(tokenId, count.sub(1));
        emit UptHorseName(tokenId, name, count.sub(1));
        return true;
    }

    // 训练马匹
    function trainingHorses(uint256 tokenId) public checkOwner(tokenId) returns (bool) {
        uint256 lastTraTime = _opera2.getTrainingTime(tokenId);
        uint256 current = block.timestamp;
        uint256 spacing = current.sub(lastTraTime);
        require(spacing > _constant.getTraTime(), "Exceeded the training limit");
        _coin.safeTransferFrom1(_constant.getTraToken(), msg.sender, address(_coin), _constant.getTraTokenAmount());
        // 计算马匹当前训练值
        uint256 traingUntTime = _constant.getUntTime();
        uint256 oldValue = _opera2.getTrainingValue(tokenId);
        uint256 subValue = current.sub(lastTraTime).div(traingUntTime);
        if (oldValue <= subValue) {
            subValue = oldValue; // 最多减去当前已有的训练值，避免溢出.
        }
        oldValue = oldValue.sub(subValue);
        oldValue = oldValue.max(_constant.getMinTraValue());

        // 修改马匹训练值
        uint256 newValue = oldValue.add(_constant.getTraAddValue());
        newValue = newValue.min(_constant.getMaxTraValue());
        _opera.setHorseTraValue(tokenId, newValue);
        _opera.setHorseTraTime(tokenId, block.timestamp);
        emit TrainingHorses(msg.sender, tokenId, block.timestamp, newValue);
        return true;
    }
    
    // 马匹装饰
    function horseDeco(uint256 horseId, uint256 equipId) public checkOwner(horseId) checkEquipOwner(equipId) returns (bool){
        uint256 equipType = _equipOpera.getHorseEquipTypes(equipId);
        uint256 status = _equipOpera.getHorseEquipStatus(equipId);
        require(status == 0, "Abnormal equipment status");
        if (equipType == 1) {
            uint256 head = _opera2_1.getHeadWearId(horseId);
            console.log("deco head to horse", equipId);
            _opera1_1.setHeadWearId(horseId, equipId);
            if (head > 0) {
                _equipOpera.setEquipStatus(head, 0);
                _equipOpera.setEquipOfHorseId(head, 0);
                
                emit UnloadEquipOfHorse(msg.sender, horseId, equipType, 0);
                emit UnloadEquip(msg.sender, head, 0);
            }
        } else if (equipType == 2) {
            uint256 armor = _opera2_1.getArmorId(horseId);
            console.log("deco armor to horse", equipId);
            _opera1_1.setArmorId(horseId, equipId);
            if (armor > 0) {
                _equipOpera.setEquipStatus(armor, 0);
                _equipOpera.setEquipOfHorseId(armor, 0);
                
                emit UnloadEquipOfHorse(msg.sender, horseId, equipType, 0);
                emit UnloadEquip(msg.sender, armor, 0);
            }
        } else if (equipType == 3) {
            uint256 ponytail = _opera2_1.getPonytailId(horseId);
            console.log("deco ponytail to horse", equipId);
            _opera1_1.setPonytailId(horseId, equipId);
            if (ponytail > 0) {
                _equipOpera.setEquipStatus(ponytail, 0);
                _equipOpera.setEquipOfHorseId(ponytail, 0);
                
                emit UnloadEquipOfHorse(msg.sender, horseId, equipType, 0);
                emit UnloadEquip(msg.sender, ponytail, 0);
            }
        } else {
            uint256 hoof = _opera2_1.getHoofId(horseId);
            console.log("deco hoof to horse", equipId);
            _opera1_1.setHoofId(horseId, equipId);
            if (hoof > 0) {
                _equipOpera.setEquipStatus(hoof, 0);
                _equipOpera.setEquipOfHorseId(hoof, 0);
                
                emit UnloadEquipOfHorse(msg.sender, horseId, equipType, 0);
                emit UnloadEquip(msg.sender, hoof, 0);
            }
        }
        _equipOpera.setEquipStatus(equipId, 2);
        _equipOpera.setEquipOfHorseId(equipId, horseId);
        emit HorseDeco(msg.sender, horseId, equipType, equipId, block.timestamp);
        emit HorseDecoOfEquip(equipId, 2, horseId);
        return true;
    }

    function setHorseGene(
        uint256 horseId,
        string memory gripGene,
        string memory accGene,
        string memory endGene,
        string memory speedGene,
        string memory turnToGene,
        string memory controlGene
    ) public onlyProgram {
        _opera.setHorseGripGene(horseId, gripGene);
        _opera.setHorseAccGene(horseId, accGene);
        _opera.setHorseEndGene(horseId, endGene);
        _opera.setHorseSpdGene(horseId, speedGene);
        _opera.setHorseTurnGene(horseId, turnToGene);
        _opera.setHorseContGene(horseId, controlGene);
        emit SetHorseGene(horseId, gripGene, accGene, endGene, speedGene, turnToGene, controlGene);
    }

    // 批量初始化马匹等级
    function initHorseGrade(uint256[] memory horseId, uint256[] memory comp) public onlyProgram {
        require(horseId.length == comp.length && horseId.length < 256, "The array length should not exceed 256");
        for (uint256 i = 0; i < horseId.length; i++) {
            _setGrade(comp[i], horseId[i]);
        }
    }

    function _setGrade(uint256 score, uint256 horseId) internal returns (uint256){
	    // address owner = _horseTokenAddress.ownerOf(horseId); // check token exists.
        uint256 grade;
        if (score < 20) {
            grade = 999;
        } else if (score < 30) {
            grade = 5;
        } else if (score < 40) {
            grade = 4;
        } else if (score < 50) {
            grade = 3;
        } else if (score < 60) {
            grade = 2;
        } else {
            grade = 1;
        }
        
        _opera1_1.setGrade(horseId, grade);
        emit InitHorseGrade(horseId, grade);
        return grade;
    }

    function beforeTransfer(address from, address to, uint256 tokenId) public senderIsToken returns (bool) {
        // no need more handler.
        if (_constant.isOfficialContract(from) || _constant.isOfficialContract(to)) {
            //console.log("no need handler for equip extra contract transfer");
        } else {
            uint256 status = _opera2_1.getHorseRaceStatus(tokenId);
            uint256 resting = _constant.getResting();
            require(status == resting, "only resting horse could transfer");
            // 检查马匹装备
            uint256 horseId = tokenId;
            {
                uint256 head = _opera2_1.getHeadWearId(horseId);
                if (head > 0) {
                    console.log("unload head equip", head);
                    _equipOpera.setEquipStatus(head, 0);
                    _equipOpera.setEquipOfHorseId(head, 0);
                    
                    emit UnloadEquipOfHorse(msg.sender, horseId, 1, 0);
                    emit UnloadEquip(msg.sender, head, 0);
                }
            }
            {
                uint256 armor = _opera2_1.getArmorId(horseId);
                if (armor > 0) {
                    console.log("unload armor equip", armor);
                    _equipOpera.setEquipStatus(armor, 0);
                    _equipOpera.setEquipOfHorseId(armor, 0);
                    
                    emit UnloadEquipOfHorse(msg.sender, horseId, 2, 0);
                    emit UnloadEquip(msg.sender, armor, 0);
                }
            }
            {
                uint256 ponytail = _opera2_1.getPonytailId(horseId);
                if (ponytail > 0) {
                    console.log("unload ponytail equip", ponytail);
                    _equipOpera.setEquipStatus(ponytail, 0);
                    _equipOpera.setEquipOfHorseId(ponytail, 0);
                    
                    emit UnloadEquipOfHorse(msg.sender, horseId, 3, 0);
                    emit UnloadEquip(msg.sender, ponytail, 0);
                }
            }
            {
                uint256 hoof = _opera2_1.getHoofId(horseId);
                if (hoof > 0) {
                    console.log("unload hoof equip", hoof);
                    _equipOpera.setEquipStatus(hoof, 0);
                    _equipOpera.setEquipOfHorseId(hoof, 0);
                    
                    emit UnloadEquipOfHorse(msg.sender, horseId, 4, 0);
                    emit UnloadEquip(msg.sender, hoof, 0);
                }
            }

        }
        return true;
    }

    function afterTransfer(address from, address to, uint256 tokenId) public senderIsToken returns (bool) {
        // no need more handler.
        if (_constant.isOfficialContract(from) || _constant.isOfficialContract(to)) {
            //console.log("no need handler for equip extra contract transfer");
        } else {
            console.log("emit event horseTransfer");
            emit HorseTransfer(from, to, tokenId, block.timestamp);
        }
        return true;
    }
}
