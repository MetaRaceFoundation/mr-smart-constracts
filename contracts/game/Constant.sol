// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./Auth.sol";

contract Constant is Program {

    // 抵押开设赛场相关
    uint256 public           _mortAmount = 200000;// 抵押开设马场资产的数量，待定
    uint256 public           _mortToken = 1;// 抵押资产的token, meta
    uint256 public           _minMortTime = 10 days;// 抵押时间
    uint256 public           _gameCountLimit = 30;// 每天可创建比赛场次
    uint256 public           _maxSpacing = 1 days;// 创建场次达到最大后的冷却时间
    uint256 public           _distApplyFee = 1000;// 报名费分配比例,10%,分配给赛场.

    //锦标赛相关
    uint256 public           _applyGameToken = 1;// 报名锦标赛的token, meta
    mapping (uint256=>uint256) public _applyGameAmount; // 报名比赛的费用, 不同的distance 费用不同.
    mapping (uint256=>uint256) public _awardGameAmount; // 报名比赛的费用, 不同的distance 费用不同.
    uint256 public           _minRaceUptTime = 10;// 取消报名多久可以再次报名，10秒
    uint256 public           _awardToken = 2;//  参赛马匹获得奖励的token，race, race 由增发产出.
    uint256 public           _awardAmount = 20;// 参赛马匹获得奖励, 数量待定
    uint256 public           _extraAwardToken = 1;//  参赛马匹前三名获得额外奖励token, meta, meta不增发,从报名费中给出.
    uint256 public           _extraAwardAmount = 40;//  参赛马匹前三名获得额外奖励最高40，依次减半，数量待定.
    uint256 public           _maxScore = 10;//锦标赛奖励最高评分
    uint256 public           _useEnergy = 10;// 每1200米消耗10能量
    
    uint256 public           _energyRecoverCD = 12*60;// 每恢复一点能量需要多久, 12分钟，1天恢复满

    // 马匹状态.0 休息、1出售中（在拍卖行）、2在繁殖场、3报名参赛、4比赛中
    uint256 constant         _resting = 0;
    uint256 constant         _onSale = 1;
    uint256 constant         _breeding = 2;
    uint256 constant         _signing = 3;
    uint256 constant         _inGame = 4;
    // 装饰状态.0 持有、1出售中（在拍卖行）、2装备中
    uint256 constant        _onHold = 0;
    uint256 constant        _onSell = 1;
    uint256 constant        _equipped = 2;

    //马匹交易相关
    uint256 public       _feeRateOfHorse = 1500;// 购买时所需的手续费
    uint256 public       _minDiscountOfHorse = 10000; // 购买马匹的折扣
    uint256 public       _maxRewardOfHorse = 0;     // 暂时没用到
    uint256 public       _minSellUptTime = 20;//出售、取消出售最小空闲时间

    //装饰交易相关
    uint256 public       _feeRateOfEquip = 1500;// 购买时所需的手续费
    uint256 public       _minDiscountOfEquip = 10000; // 购买装饰的折扣
    uint256 public       _maxRewardOfEquip = 0;      // 暂时没用到
    uint256 public       _minSpacing = 10;//装备出售CD时间

    // 马匹训练相关
    uint256 public       _minTraValue = 100;// 训练值最小值
    uint256 public       _maxTraValue = 120;// 训练值最大值
    uint256 public       _traAddValue = 1;// 每次训练增加训练值
    uint256 public       _traTime = 1 days;// 训练时间间隔，每24小时训练一次, CD
    uint256 public       _untTime = 2 days;// 多久未训练，训练值减少1。
    uint256 public       _traToken = 2;// 训练所需token, race.
    uint256 public       _traTokenAmount = 10;// 训练所需token数量,暂定

    // 繁殖相关
    uint256 public       _breDiscount = 8500;//繁殖时系统扣费，给平台15%
    uint256 public       _breCoefficient = 9500;//繁殖系数
    uint256 public       _minMareBrSpaTime = 30 days;// 母马繁殖CD
    uint256 public       _minStaBrSpaTime = 10 days;// 种马繁殖CD
    uint256 public       _minMatureTime = 28 days;// 马匹成长时间
    uint256 public       _minStudUptTime = 20;//繁殖、取消繁殖最小空闲时间,CD

    // 繁殖增发小马所需两种费用
    uint256 public       _breCoin1 = 1;     // meta
    uint256 public       _breCoin1Amount = 100; // 待定
    uint256 public       _breCoin2 = 2;     // race
    uint256 public       _breCoin2Amount = 500; // 待定

    //马匹获得后改名机会次数
    uint256 public       _modifyNameTimes = 1;  // 购买马匹之后的改名次数.
    uint256 public       _maxEnergy = 100;// 能量最大值
    uint256 public       _initScore = 0;// 马匹初始评分, 评分不能为0
    uint256 public       _initGrade = 999;// 马匹初始等级
    uint256 public       _maxApplyCount = 360;// 一个赛场一天可报名的最大数
    uint256 public       _trackNumber = 12;// 一场比赛的赛道数

    uint256 public       _weekRankCount = 100;  // 周排名数量，待定
    uint256 public       _monthRankCount = 300; // 月奖励数量，待定
    uint256 public       _yearRankCount = 1000; // 年奖励数量，待定

    // golbal param
    uint32 public       _dateYear = 0; // current date Year
    uint32 public       _dateMonth = 0; // current date Month
    uint32 public       _dateWeek = 0; // current date Week
    bytes[50] public     _initHorseColors; // init horse colors
    address[100] public  _officialContracts; // all official extra contract's addresses

    // 签名SDK账户
    address _account = 0x9f8fb0488dE145E7467FDeD872098e1115d6ea4C;

    function getConstant() public view returns (
        uint256, uint256, uint256, uint256, uint256, uint256, uint256, uint256, uint256, uint256, uint256, uint256, uint256){
        return (_feeRateOfHorse, _modifyNameTimes, _minSellUptTime, _minSellUptTime, _minMatureTime,
        _minStudUptTime, _minStudUptTime, _minMareBrSpaTime, _minStaBrSpaTime, _breCoin1, _breCoin1Amount,
        _breCoin2, _breCoin2Amount);
    }

    function getConstant2() public view returns (
        uint256, uint256, uint256, uint256, uint256, uint256, uint256, uint256, uint256, uint256, uint256, uint256, uint256){
        return (_minTraValue, _maxTraValue, _traAddValue, _traTime,
        _untTime, _traAddValue, _traToken, _traTokenAmount, _gameCountLimit, _minRaceUptTime, _minRaceUptTime,
        _applyGameToken, _applyGameAmount[0]);
    }

    function getConstant3() public view returns (uint256, uint256, uint256, uint256, uint256){
        return (_breDiscount, 0, _useEnergy, _energyRecoverCD, _minMortTime);
    }

    function getConstant4() public view returns (uint256, uint256, uint256, uint256, uint256,
        uint256, uint256, uint256, uint256, uint256,
        uint256, uint256) {
        return (_weekRankCount, _monthRankCount, _yearRankCount, _maxEnergy, _initScore,
         _initGrade, _maxApplyCount, _trackNumber, _breCoefficient, _minDiscountOfHorse,
         _maxRewardOfHorse, _mortAmount);
    }

    function getConstant5() public view returns (uint256, uint256, uint256, uint256, uint256,
        uint256, uint256, uint256, uint256, uint256,
        uint256, uint256) {
        return (_mortToken, _maxSpacing, _distApplyFee, _awardToken, _awardAmount, 
        _extraAwardToken, _extraAwardAmount, _maxScore, _feeRateOfEquip, _minDiscountOfEquip, 
        _maxRewardOfEquip,_minSpacing);
    }

    function getConstant6() public pure returns (uint256, uint256, uint256, uint256, uint256, uint256, uint256, uint256) {
        return (_resting, _onSale, _breeding, _signing, _inGame, _onHold, _onSell, _equipped);
    }

    // 开设马场抵押资产
    function setMortConst(uint256 mortToken, uint256 mortAmount, uint256 minMortTime, uint256 gameCountLimit,
        uint256 maxSpacing, uint256 distApplyFee) public onlyAdmin returns (bool){
        _mortAmount = mortAmount;
        _mortToken = mortToken;
        _minMortTime = minMortTime;
        _gameCountLimit = gameCountLimit;
        _maxSpacing = maxSpacing;
        _distApplyFee = distApplyFee;
        return true;
    }
    // 参加锦标赛相关
    function setGameConst(
        uint256 applyGameToken,
        uint256 applyGameAmount,
        uint256 minRaceUptTime,
        uint256 awardToken,
        uint256 awardAmount,
        uint256 extraAwardToken,
        uint256 extraAwardAmount,
        uint256 maxScore,
        uint256 useEnergy
    ) public onlyAdmin returns (bool){
        _applyGameToken = applyGameToken;
        _applyGameAmount[0] = applyGameAmount;
        _minRaceUptTime = minRaceUptTime;
        _awardToken = awardToken;
        _awardAmount = awardAmount;
        _extraAwardToken = extraAwardToken;
        _extraAwardAmount = extraAwardAmount;
        _maxScore = maxScore;
        _useEnergy = useEnergy;
        return true;
    }

    //马匹交易相关
    function setHorseTxConst(uint256 feeRateOfHorse, uint256 minDiscountOfHorse, uint256 maxRewardOfHorse, uint256 minSellUptTime) public onlyAdmin returns (bool){
        _feeRateOfHorse = feeRateOfHorse;
        _minDiscountOfHorse = minDiscountOfHorse;
        _maxRewardOfHorse = maxRewardOfHorse;
        _minSellUptTime = minSellUptTime;
        return true;
    }
    //装饰交易相关
    function setEquipTxConst(uint256 feeRateOfEquip, uint256 minDiscountOfEquip, uint256 maxRewardOfEquip, uint256 minSpacing) public onlyAdmin returns (bool){
        _feeRateOfEquip = feeRateOfEquip;
        _minDiscountOfEquip = minDiscountOfEquip;
        _maxRewardOfEquip = maxRewardOfEquip;
        _minSpacing = minSpacing;
        return true;
    }

    // 马匹训练相关
    function setTraConst(
        uint256 minTraValue,
        uint256 maxTraValue,
        uint256 traAddValue,
        uint256 traTime,
        uint256 untTime,
        uint256 traToken,
        uint256 traTokenAmount
    ) public onlyAdmin returns (bool){
        _minTraValue = minTraValue;
        _maxTraValue = maxTraValue;
        _traAddValue = traAddValue;
        _traTime = traTime;
        _untTime = untTime;
        _traToken = traToken;
        _traTokenAmount = traTokenAmount;
        return true;
    }

    // 马匹繁殖相关
    function setBreConst(
        uint256 breDiscount,
        uint256 breCoefficient,
        uint256 minMareBrSpaTime,
        uint256 minStaBrSpaTime,
        uint256 minMatureTime,
        uint256 minStudUptTime
    ) public onlyAdmin returns (bool){
        _breDiscount = breDiscount;
        _breCoefficient = breCoefficient;
        _minMareBrSpaTime = minMareBrSpaTime;
        _minStaBrSpaTime = minStaBrSpaTime;
        _minMatureTime = minMatureTime;
        _minStudUptTime = minStudUptTime;
        return true;
    }
    // 繁殖增发小马所需两种费用
    function setBreCostConst(uint256 breCoin1, uint256 breCoin1Amount, uint256 breCoin2, uint256 breCoin2Amount) public onlyAdmin returns (bool){
        _breCoin1 = breCoin1;
        _breCoin1Amount = breCoin1Amount;
        _breCoin2 = breCoin2;
        _breCoin2Amount = breCoin2Amount;
        return true;
    }

    // 繁殖增发小马所需两种费用
    function setModifyNameTimes(uint256 modifyNameTimes) public onlyAdmin returns (bool){
        _modifyNameTimes = modifyNameTimes;
        return true;
    }

    // 马匹能量最大值
    function setMaxEnergy(uint256 maxEnergy) public onlyAdmin returns (bool){
        _maxEnergy = maxEnergy;
        return true;
    }

    // 马匹初始评分
    function setInitScore(uint256 initScore) public onlyAdmin returns (bool){
        _initScore = initScore;
        return true;
    }
    // 马匹初始等级
    function setInitGrade(uint256 initGrade) public onlyAdmin returns (bool){
        _initGrade = initGrade;
        return true;
    }
    // 赛场每天最大可报名次数
    function setMaxApplyCount(uint256 maxApplyCount) public onlyAdmin returns (bool){
        _maxApplyCount = maxApplyCount;
        return true;
    }

    function setTrackNumber(uint256 trackNumber) public onlyAdmin returns (bool){
        _trackNumber = trackNumber;
        return true;
    }

    // 报名费个人赛场获得比例
    function setEnergyRecoverCD(uint256 energyRecoverCD) public onlyAdmin returns (bool){
        _energyRecoverCD = energyRecoverCD;
        return true;
    }

    function setAccount(address account) public onlyAdmin returns (bool){
        _account = account;
        return true;
    }

    function setWeekRankCount(uint256 weekRankCount) public onlyAdmin returns (bool) {
        _weekRankCount = weekRankCount;
        return true;
    }

    function setMonthRankCount(uint256 monthRankCount) public onlyAdmin returns (bool) {
        _monthRankCount = monthRankCount;
        return true;
    }

    function setYearRankCount(uint256 yearRankCount) public onlyAdmin returns (bool) {
        _yearRankCount = yearRankCount;
        return true;
    }

    function setDate(uint32 year, uint32 month, uint32 week) public onlyAdmin {
        _dateYear = year;
        _dateMonth = month;
        _dateWeek = week;
    }

    function setApplyGameAmount(uint256 distance, uint256 amount) public onlyAdmin {
        _applyGameAmount[distance] = amount;
    }

    function setAwardGameAmount(uint256 distance, uint256 amount) public onlyAdmin {
        _awardGameAmount[distance] = amount;
    }

    function rmColor(bytes memory color) public onlyAdmin {
        for (uint i = 0; i < _initHorseColors.length; i++) {
            if (_initHorseColors[i].length == 0) {
                continue;
            }
            if (keccak256(color) == keccak256(_initHorseColors[i])) {
                _initHorseColors[i] = new bytes(0);
                break;
            }
        }
    }

    function addColor(string memory color) public onlyAdmin {
        for (uint i = 0; i < _initHorseColors.length; i++) {
            if (_initHorseColors[i].length == 0) {
                _initHorseColors[i] = bytes(color);
                break;
            }
        }
    }

    function addOfficialContract(address addr) public onlyAdmin {
        for (uint i = 0; i < _officialContracts.length; i++) {
            if (_officialContracts[i] == address(0)) {
                _officialContracts[i] = addr;
                break;
            }
        }
    }

    function delOfficialContract(address addr) public onlyAdmin {
        for (uint i = 0; i < _officialContracts.length; i++) {
            if (_officialContracts[i] == address(0)) {
                continue;
            }
            if (_officialContracts[i] == addr) {
                _officialContracts[i] = address(0);
                break;
            }
        }
    }

    function getAccount() public view returns (address){
        return _account;
    }

    function getEnergyRecoverCD() public view returns (uint256){
        return _energyRecoverCD;
    }

    function getModifyNameTimes() public view returns (uint256){
        return _modifyNameTimes;
    }

    function getMaxEnergy() public view returns (uint256){
        return _maxEnergy;
    }

    function getInitIntegral() public view returns (uint256){
        return _initScore;
    }

    function getInitGrade() public view returns (uint256){
        return _initGrade;
    }

    function getMaxApplyCount() public view returns (uint256){
        return _maxApplyCount;
    }

    function getTrackNumber() public view returns (uint256){
        return _trackNumber;
    }

    function getMortAmount() public view returns (uint256){
        return _mortAmount;
    }

    function getMortToken() public view returns (uint256){
        return _mortToken;
    }

    function getMinMortTime() public view returns (uint256){
        return _minMortTime;
    }

    function getGameCountLimit() public view returns (uint256){
        return _gameCountLimit;
    }

    function getMaxSpacing() public view returns (uint256){
        return _maxSpacing;
    }

    function getDistApplyFee() public view returns (uint256){
        return _distApplyFee;
    }

    function getApplyGameToken() public view returns (uint256){
        return _applyGameToken;
    }

    function getApplyGameAmount() public view returns (uint256){
        return _applyGameAmount[0];
    }

    function getApplyGameAmountByDistance(uint256 distance) public view returns (uint256) {
        return _applyGameAmount[distance];
    }

    function getAwardAmountByDistance(uint256 distance) public view returns (uint256) {
        return _awardGameAmount[distance];
    }

    function getMinRaceUptTime() public view returns (uint256){
        return _minRaceUptTime;
    }

    function getAwardToken() public view returns (uint256){
        return _awardToken;
    }

    function getAwardAmount() public view returns (uint256){
        return _awardAmount;
    }

    function getExtraAwardToken() public view returns (uint256){
        return _extraAwardToken;
    }

    function getExtraAwardAmount() public view returns (uint256){
        return _extraAwardAmount;
    }

    function getMaxScore() public view returns (uint256){
        return _maxScore;
    }

    function getUseEnergy() public view returns (uint256){
        return _useEnergy;
    }

    function getResting() public pure returns (uint256){
        return _resting;
    }

    function getOnSale() public pure returns (uint256){
        return _onSale;
    }

    function getBreeding() public pure returns (uint256){
        return _breeding;
    }

    function getSigning() public pure returns (uint256){
        return _signing;
    }

    function getInGame() public pure returns (uint256){
        return _inGame;
    }

    function getOnHold() public pure returns (uint256){
        return _onHold;
    }

    function getOnSell() public pure returns (uint256){
        return _onSell;
    }

    function getEquipped() public pure returns (uint256){
        return _equipped;
    }

    function getFeeRateOfHorse() public view returns (uint256){
        return _feeRateOfHorse;
    }

    function getMinDiscountOfHorse() public view returns (uint256){
        return _minDiscountOfHorse;
    }

    function getMaxRewardOfHorse() public view returns (uint256){
        return _maxRewardOfHorse;
    }

    function getMinSellUptTime() public view returns (uint256){
        return _minSellUptTime;
    }

    function getFeeRateOfEquip() public view returns (uint256){
        return _feeRateOfEquip;
    }

    function getMinDiscountOfEquip() public view returns (uint256){
        return _minDiscountOfEquip;
    }

    function getMaxRewardOfEquip() public view returns (uint256){
        return _maxRewardOfEquip;
    }

    function getMinSpacing() public view returns (uint256){
        return _minSpacing;
    }

    function getMinTraValue() public view returns (uint256){
        return _minTraValue;
    }

    function getMaxTraValue() public view returns (uint256){
        return _maxTraValue;
    }

    function getTraAddValue() public view returns (uint256){
        return _traAddValue;
    }

    function getTraTime() public view returns (uint256){
        return _traTime;
    }

    function getUntTime() public view returns (uint256){
        return _untTime;
    }

    function getTraToken() public view returns (uint256){
        return _traToken;
    }

    function getTraTokenAmount() public view returns (uint256){
        return _traTokenAmount;
    }

    function getBreDiscount() public view returns (uint256){
        return _breDiscount;
    }

    function getBreCoefficient() public view returns (uint256){
        return _breCoefficient;
    }

    function getMinMareBrSpaTime() public view returns (uint256){
        return _minMareBrSpaTime;
    }

    function getMinStaBrSpaTime() public view returns (uint256){
        return _minStaBrSpaTime;
    }

    function getMinMatureTime() public view returns (uint256){
        return _minMatureTime;
    }

    function getMinStudUptTime() public view returns (uint256){
        return _minStudUptTime;
    }

    function getBreCoin1() public view returns (uint256){
        return _breCoin1;
    }

    function getBreCoin1Amount() public view returns (uint256){
        return _breCoin1Amount;
    }

    function getBreCoin2() public view returns (uint256){
        return _breCoin2;
    }

    function getBreCoin2Amount() public view returns (uint256){
        return _breCoin2Amount;
    }

    function getWeekRankCount() public view returns (uint256) {
        return _weekRankCount;
    }

    function getMonthRankCount() public view returns (uint256) {
        return _monthRankCount;
    }

    function getYearRankCount() public view returns (uint256) {
        return _yearRankCount;
    }

    function getDate() public view returns (uint32, uint32, uint32) {
        return (_dateYear, _dateMonth, _dateWeek);
    }

    function getInitColorsCount() public view returns (uint32) {
        uint32 count = 0; 
        for (uint i = 0; i < _initHorseColors.length; i++) {
            if (_initHorseColors[i].length > 0) {
                count++;
            }
        }
        return count;
    }

    function getInitColors(uint8 index) public view returns (string memory) {
        require(index < _initHorseColors.length, "over flow horseColors index");
        return string(_initHorseColors[index]);
    }

    function isOfficialContract(address addr) public view returns (bool) {
        for (uint i = 0; i < _officialContracts.length; i++) {
            if (_officialContracts[i] == addr) {
                return true;
            }
        }
        return false;
    }
}
