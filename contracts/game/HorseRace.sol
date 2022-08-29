// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/utils/math/Math.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "../Interface/BaseInterface.sol";
import "../Interface/ICoin.sol";
import "../Interface/IConstant.sol";
import "../Interface/IHorseRaceOpera.sol";
import "./Auth.sol";
import "../library/Bytes.sol";
import "hardhat/console.sol";

contract HorseRelation is Program {

    IHorseRaceOpera private _op;

    function getHorseOp() internal virtual view returns(IHorseRaceOpera) {
        return _op;
    }

    function setHorseOp(IHorseRaceOpera op_) public onlyAdmin {
        _op = op_;
    }

    function getAncestors(uint256 childId, uint256[] memory ancestors, uint256 level) public view returns (uint256[] memory) {
        uint256 fatherId = getHorseOp().getFather(childId);
        uint256 motherId = getHorseOp().getMother(childId);
        uint256 len = ancestors.length;
        if (fatherId > 0) {
            len++;
        }
        if (motherId > 0) {
            len++;
        }

        uint256[] memory lst = new uint256[](len);
        uint256 i = 0;
        for (; i < ancestors.length; i++) {
            lst[i] = ancestors[i];
        }
        if (fatherId > 0) {
            lst[i++] = fatherId;
        }
        if (motherId > 0) {
            lst[i++] = motherId;
        }
        
        if (fatherId > 0 && level > 1) {
            lst = getAncestors(fatherId, lst, level - 1);
        }
        if (motherId > 0 && level > 1) {
            lst = getAncestors(motherId, lst, level - 1);
        }
        return lst;
    }

    function isKinship(uint256 horseId, uint256 stallId) public view returns(bool) {
        uint256[] memory lst = new uint256[](0);
        uint256[] memory lstMare = getAncestors(horseId, lst, 2);
        uint256[] memory lstStall = getAncestors(stallId, lst, 2);
        for (uint256 i = 0; i < lstMare.length; i++) {
            if (lstMare[i] == stallId) {
                return true;
            }
            for (uint256 j = 0; j < lstStall.length; j++) {
                if (lstStall[j] == lstMare[i]) {
                    return true;
                }
            }
        }
        for (uint256 i = 0; i < lstStall.length; i++) {
            if (lstStall[i] == horseId) {
                return true;
            }
        }
        return false;
    }
}

contract HorseRaceContract is HorseRelation {
    using SafeMath for uint256;
    using Math for uint256;
    using Bytes for bytes;
    ICoin private            _coin;
    IHorseRaceOpera private _opera1;
    IHorseRaceOpera private _opera1_1;
    IHorseRaceOpera private _opera2_1;
    IHorseRaceOpera private _opera2;
    IERC721TokenMinable private _horseTokenAddress;
    address private _feeAccount;
    IConstant           private     _constant; // 常量合约地址

    event Breeding(address account, uint256 tokenId, uint256 stallId, uint256 newHorseId, string name,
        uint256 generationScore, uint256 gender, uint256 integralTime, uint256 energyTime, uint256 status);
    event Breeding1(uint256 newHorseId, uint256 time, string color, string gene,
        uint256 mGene, uint256 sGene, uint256 traValue, uint256 energy, uint256 grade, uint256 integral);
    event BreedingOfHorse(uint256 horseId, uint256 time, uint256 count);
    modifier checkOwner(uint256 tokenId) {
        require(_horseTokenAddress.ownerOf(tokenId) == msg.sender, "only owner can do it!");
        _;
    }
    modifier checkSign(string memory name, bytes memory sign) {
        require(sign.Decode(name) == _constant.getAccount(), "Signature verification failure");
        _;
    }

    function getHorseOp() internal override view returns(IHorseRaceOpera) {
        return _opera2;
    }

    function initHorseRaceAttrAddress(
        address operaAddr1, address operaAddr1_1, address tokenAddr,
        address operaAddr2, address operaAddr2_1,
        address coinAddress, address constantAddr, address feeAccount) public onlyAdmin returns (bool){
        _opera1 = IHorseRaceOpera(operaAddr1);
        _opera1_1 = IHorseRaceOpera(operaAddr1_1);
        _opera2 = IHorseRaceOpera(operaAddr2);
        _opera2_1 = IHorseRaceOpera(operaAddr2_1);
        _horseTokenAddress = IERC721TokenMinable(tokenAddr);
        _coin = ICoin(coinAddress);
        _constant = IConstant(constantAddr);
        _feeAccount = feeAccount;
        return true;
    }

    function _makeProperty(string memory name, string memory style, string memory gene, string memory color, uint256 gender) internal pure returns (string memory) {
        if(gender == 0) {
            return string(abi.encodePacked(name, ",", style, ",", gene, ",", color, ",", "0"));
        }
        return string(abi.encodePacked(name, ",", style, ",", gene, ",", color, ",", "1"));
    } 
    // 繁殖
    function breeding(uint256 horseId, uint256 stallId, uint256 coinType, string memory name, bytes memory sign) public
        checkOwner(horseId) checkSign(name, sign) {
        require(_opera2_1.getHorseRaceStatus(horseId) == 0, "Horses must be idle!");
        require(_opera2.getHorseGender(horseId) == 0, "Horse must be a mare!");
        require(!isKinship(horseId, stallId), "Horse and stall can't be kinship!");

        uint256 status = _opera2_1.getHorseRaceStatus(stallId);
        if (status == 0) {
            require(_horseTokenAddress.ownerOf(stallId) == msg.sender, "only owner can do it!");
            require(_opera2.getHorseGender(stallId) == 1, "The horse must be a stallion");
        } else {
            require(_opera2_1.getHorseRaceStatus(stallId) == 2, "Horses must be in breeding condition!");
        }
        _checkBreedTime(horseId, stallId);

        // 繁殖费用
        _breCost(stallId, coinType, status);
        
        string memory newGene;
        {
            // 基因遗传
            string memory motherGene = _opera2.getHorseGene(horseId);
            string memory fatherGene = _opera2.getHorseGene(stallId);
            newGene = _geneBreeding(bytes(motherGene), bytes(fatherGene));
        }

        string memory newColor = _colorRandom();
        uint256 gender = _genderRandom();
        uint256 newHorseId;
        {
            string memory property = _makeProperty(name, "BRED_HORSE", newGene, newColor, gender);
            newHorseId = _horseTokenAddress.mint(msg.sender, bytes(property));
        }

	    _initHorse(horseId, stallId, newHorseId, name, newGene, newColor, gender);
    }

    function _checkBreedTime(uint256 horseId, uint256 stallId) internal {
        uint256 current = block.timestamp;
        uint256 birthDay = _opera2.getBirthDay(horseId);
        uint256 growthTime = current.sub(birthDay);
        require(growthTime > _constant.getMinMatureTime(), "The horse is immature");
        uint256 staGrowthTime = current.sub(_opera2.getBirthDay(stallId));
        require(staGrowthTime > _constant.getMinMatureTime(), "The horse is immature");
        uint256 mareBrTime = _opera2.getBreedTime(horseId);
        uint256 staBreedTime = _opera2.getBreedTime(stallId);
        uint256 mareBrSpaTime = current.sub(mareBrTime);
        uint256 staBrSpaTime = current.sub(staBreedTime);
        require(mareBrSpaTime > _constant.getMinMareBrSpaTime() && staBrSpaTime > _constant.getMinStaBrSpaTime(), "Breeding cooldown time cannot breed multiple times");
    }

    function _breCost(uint256 stallId, uint256 coin, uint256 status) internal returns (bool){
        if (status == 2) {
            uint256 price = _opera2_1.getHorseRacePrice(stallId);
            uint256 coinType = _opera2_1.getHorseRaceCoin(stallId);
            require(coin == coinType, "CoinType is not what users need");
            address owner = _opera2_1.getHorseRaceLastOwner(stallId);
            uint256 real_price = price.mul(_constant.getBreDiscount()).div(10000);
            // 种马费用
            _coin.safeTransferFrom(coinType, msg.sender, address(_coin), price);
            _coin.safeTransfer(coinType, owner, real_price);
        }
        // 额外支付费用
        _coin.safeTransferFrom1(_constant.getBreCoin1(), msg.sender, address(_coin), _constant.getBreCoin1Amount());
        _coin.safeTransferFrom1(_constant.getBreCoin2(), msg.sender, address(_coin), _constant.getBreCoin2Amount());
        return true;
    }
    // 基因算法、颜色
    function _initHorse(uint256 horseId, uint256 stallId, uint256 newHorseId, string memory name,
        string memory newGene, string memory newColor, uint256 gender) internal {
        uint256 current = block.timestamp;

        _opera1.setHorseName(newHorseId, name);
        _opera1.setHorseGender(newHorseId, gender);       // 性别
        _opera1.setHorseFatherId(newHorseId, stallId); 
        _opera1.setHorseMotherId(newHorseId, horseId);
        uint256 mGene = _opera2.getHorseMGene(horseId).max(_opera2.getHorseMGene(stallId)); // 主代
        mGene = mGene.add(1);

        uint256 sGene = _opera2.getHorseMGene(horseId).min(_opera2.getHorseMGene(stallId)); // 从代


        {
		uint256 geneSc1 = _opera2.getHorseGeneSC(horseId);  // 迭代系数
		uint256 geneSc2 = _opera2.getHorseGeneSC(stallId);
            uint256 geneSc = geneSc1.mul(_constant.getBreCoefficient()).div(10000).average(geneSc2.mul(_constant.getBreCoefficient()).div(10000));
            _opera1.setHorseGeneSc(newHorseId, geneSc);
            _opera1.setHorseBreedTime(horseId, current);
            _opera1.setHorseBreedTime(stallId, current);
            _opera1.setHorseBreedCount(horseId);
            _opera1.setHorseBreedCount(stallId);
            emit Breeding(msg.sender, horseId, stallId, newHorseId, name, geneSc, gender, current, current, _constant.getResting());
        }
        
        _initGrade(horseId, stallId, newHorseId, mGene, sGene, current, newGene, newColor);
        emit BreedingOfHorse(horseId, current, _opera2.getBreedCount(horseId));
        emit BreedingOfHorse(stallId, current, _opera2.getBreedCount(stallId));
    }

    function _geneRandom(uint256 offset) internal view returns (uint8) {
        bytes32 _hash = blockhash(block.number);
        uint8 index = uint8(_hash[offset]) % 4;
        return index;
    }

    function _genderRandom() internal view returns (uint256){
        uint256 gender = block.number.mod(2);
        return gender;
    }

    function _colorRandom() internal view returns (string memory) {
        // 马匹颜色遗传
        string memory newColor = "FFFFFFFF";
        {
            // 初始颜色值 随机选择，链上增加。
            uint32 count = _constant.getInitColorsCount();
            if (count > 0) {
                bytes32 _hash = blockhash(block.number);
                uint8 index = uint8(_hash[0]) % uint8(count);
                newColor = _constant.getInitColors(index);
            }
        }
        return newColor;
    }

    function _geneBreeding(bytes memory mother, bytes memory father) internal view returns (string memory ) {
        require(bytes(mother).length == bytes(father).length, "gene length must equal");
        uint256 offset = 0;
        bytes memory newgene = new bytes(mother.length);
        for(offset = 0; offset < mother.length; offset+=2) {
            uint8 random = _geneRandom(offset);
            if (random == 0) {
                newgene[offset] = mother[offset];
                newgene[offset+1] = father[offset];
            } else if (random == 1) {
                newgene[offset] = mother[offset + 1 ];
                newgene[offset+1] = father[offset];
            } else if (random == 2) {
                newgene[offset] = mother[offset ];
                newgene[offset+1] = father[offset + 1];
            } else if (random == 3) {
                newgene[offset] = mother[offset + 1 ];
                newgene[offset+1] = father[offset + 1];
            }
            if (newgene[offset] < newgene[offset+1]) {
                bytes1 p = newgene[offset];
                newgene[offset] = newgene[offset+1];
                newgene[offset+1] = p;
            }
        }
        return string(newgene);
    }

    function _initGrade(uint256, uint256, uint256 newHorseId, uint256 mGene, uint256 sGene, 
            uint256 current, string memory newGene, string memory newColor) internal {

        uint256 grade = _constant.getInitGrade(); // 设置为初始值
        uint256 integral = _constant.getInitIntegral(); // 设置为初始值
        _opera1_1.setGrade(newHorseId, grade);
        _opera1.setHorseGradeSc(newHorseId, integral);
        _opera1.setHorseBirthDay(newHorseId, current);
        _opera1.setHorseMGene(newHorseId, mGene);
        _opera1.setHorseSGene(newHorseId, sGene);
        _opera1.setHorseTraValue(newHorseId, _constant.getMinTraValue());
        _opera1.setHorseEnergy(newHorseId, _constant.getMaxEnergy());
        _opera1.setHorseGene(newHorseId, newGene);        
        _opera1.setHorseColor(newHorseId, newColor);
        
        emit Breeding1(newHorseId, current, newColor, newGene, mGene, sGene, _constant.getMinTraValue(),
            _constant.getMaxEnergy(), grade, integral);
    }

    function batchMintHorse(
        string[] memory name,
        string[] memory style,
        uint256 [] memory mainGeneration,
        uint256 [] memory slaveGeneration,
        uint256 [] memory generationScore,
        uint256 [] memory gender,
        string [] memory color,
        string [] memory gene,
        address [] memory to
    ) public onlyAdmin returns (uint256[] memory){
        require(name.length == style.length && name.length == mainGeneration.length && name.length == slaveGeneration.length &&
        name.length == generationScore.length && name.length == gender.length && name.length == color.length &&
        name.length == gene.length && name.length == to.length);
        uint256[] memory newids = new uint256[](name.length);

        for(uint j = 0; j < name.length; j++) {
            string memory property = _makeProperty(name[j], style[j], gene[j], color[j], gender[j]);
            uint256 horseId = _horseTokenAddress.mint(to[j], bytes(property));
            _mintOne(name[j], mainGeneration[j], slaveGeneration[j], generationScore[j], gender[j], color[j],
             gene[j], horseId, to[j]);
            
            newids[j] = horseId;
        }
        return newids;
    }

    function mintHorse(
        string memory name,
        string memory style,
        uint256 mainGeneration,
        uint256 slaveGeneration,
        uint256 generationScore,
        uint256 gender,
        string memory color,
        string memory gene,
        address to
    ) public onlyAdmin returns (uint256){
        string memory property = _makeProperty(name, style, gene, color, gender);
        uint256 horseId = _horseTokenAddress.mint(to, bytes(property));
        _mintOne(name, mainGeneration, slaveGeneration, generationScore, gender, color, gene, horseId, to);
        console.log("mint horse with id :", horseId);
        return horseId;
    }

    function _mintOne(
        string memory name,
        uint256 mainGeneration,
        uint256 slaveGeneration,
        uint256 generationScore,
        uint256 gender,
        string memory color,
        string memory gene,
        uint256 horseId,
        address to) internal {
        uint256 current = block.timestamp;
        _opera1.setHorseName(horseId, name);
        _opera1.setHorseMGene(horseId, mainGeneration);
        _opera1.setHorseSGene(horseId, slaveGeneration);
        _opera1.setHorseGeneSc(horseId, generationScore);
        _opera1.setHorseGender(horseId, gender);
        _opera1.setHorseColor(horseId, color);
        _opera1.setHorseGene(horseId, gene);
        _opera1.setHorseBirthDay(horseId, current);
        _opera1.setHorseTraValue(horseId, _constant.getMinTraValue());
        _opera1.setHorseGradeSc(horseId, _constant.getInitIntegral());
        _opera1_1.setGrade(horseId, _constant.getInitGrade());
        _opera1.setHorseEnergy(horseId, _constant.getMaxEnergy());
        _opera1.setHorseNameUptCount(horseId, _constant.getModifyNameTimes());
        emit Breeding(to, 0, 0, horseId, name, generationScore, gender, current, current, _constant.getResting());
        emit Breeding1(horseId, current, color, gene, mainGeneration, slaveGeneration, _constant.getMinTraValue(),
            _constant.getMaxEnergy(), _constant.getInitGrade(), _constant.getInitIntegral());
    }
}
