// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
pragma experimental ABIEncoderV2;

import "../library/BaseLib.sol";

interface IMysteryBox {
    function nftAddress(string memory) external view returns(address);
    function sellPrice(string memory, address) external view returns(uint256);
    function nftToken(string memory _name, uint256 idx) external view returns(uint256);
    function totalSupply(string memory) external view returns(uint256);
    function soldCount(string memory) external view returns(uint256);
    function moneyBackChance(string memory) external view returns(uint256);
    function probability(string memory, string memory) external view returns(uint256);

    function set(string[] memory _names, address[] memory _nft, uint256[] memory _moneyBackChance) external;
    function setPrice(string memory _name, address[] memory _tokens, uint256[] memory _prices) external;
    function setProbability(string memory _name, string[] memory _types, uint256[] memory _probabilities) external;
    function addToken(string memory _name, uint256 start, uint256 end) external;
    function addToken(string memory _name, uint256[] memory _tokens) external;
    function removeToken(string memory _name, uint256 count) external;
    function giveToken(string memory _name, uint256 idx) external returns(uint256);
}

contract MysteryBox is IMysteryBox, Program {
    using SafeMath for uint256;
    
    mapping(string => address) public override nftAddress;
    mapping(string => mapping(address => uint256)) public override sellPrice;
    mapping(string => uint256) public override soldCount;
    mapping(string => uint256) public override moneyBackChance;
    mapping(string => mapping(string => uint256)) public override probability;
    
    mapping(string => uint256[]) private _nftToken;

    function totalSupply(string memory _name) public view override returns(uint256) {
        return _nftToken[_name].length;
    }

    function nftToken(string memory _name, uint256 idx) public onlyProgram view override returns(uint256) {
        return idx < _nftToken[_name].length ? _nftToken[_name][idx] : 0;
    }

    function set(string[] memory _names, address[] memory _nft, uint256[] memory _moneyBackChance) public override onlyProgram 
        checkArraySize3(_names.length, _nft.length, _moneyBackChance.length) {
        for (uint256 i = 0; i < _names.length; i++) {
            string memory _name = _names[i];
            nftAddress[_name] = _nft[i];
            moneyBackChance[_name] = _moneyBackChance[i];
        }    
    }

    function setPrice(string memory _name, address[] memory _tokens, uint256[] memory _prices) public override onlyProgram 
        checkArraySize2(_tokens.length, _prices.length) {
        for (uint256 i = 0; i < _tokens.length; i++) {
            sellPrice[_name][_tokens[i]] = _prices[i];
        }    
    }

    function setProbability(string memory _name, string[] memory _types, uint256[] memory _probabilities) public override onlyProgram 
        checkArraySize2(_types.length, _probabilities.length) {
        for (uint256 i = 0; i < _types.length; i++) {
            probability[_name][_types[i]] = _probabilities[i];
        }    
    }

    function addToken(string memory _name, uint256 start, uint256 end) public override onlyProgram {
        require(end >= start && end <= start.add(BATCH_COUNT), "Too many elements in the array");
        for (uint256 i = start; i <= end; i++) {
            _nftToken[_name].push(i);
        } 
    }

    function addToken(string memory _name, uint256[] memory _tokens) public override onlyProgram checkArraySizeUint256(_tokens) {
        for (uint256 i = 0; i < _tokens.length; i++) {
            _nftToken[_name].push(_tokens[i]);
        } 
    }

    function removeToken(string memory _name, uint256 count) public override onlyProgram {
        for (uint256 i = 0; i < count; i++) {
            _nftToken[_name].pop();
        } 
    }

    function giveToken(string memory _name, uint256 idx) public override onlyProgram returns(uint256) {
        if (idx >= _nftToken[_name].length) {
            return 0;
        }
        uint256 nft_id = _nftToken[_name][idx];
        _nftToken[_name][idx] = 0;
        soldCount[_name]++;
        return nft_id;
    }
}

interface IMysteryData {
    function boxCount(address _account) external view returns(uint256);
    function nftAddress(address _account, uint256 idx) external view returns(address);
    function tokenAddress(address _account, uint256 idx) external view returns(address);
    function createdTime(address _account, uint256 idx) external view returns(uint256);
    
    function nftToken(address _account, uint256 idx) external view returns(uint256);
    function amountMoneyBack(address _account, uint256 idx) external view returns(uint256);
    
    function add(address _account, address tokenAddr, address nftAddr, uint256 token_id, uint256 amount) external;
    function remove(address _account) external returns(address, address, uint256, uint256, uint256);
}

contract MysteryData is IMysteryData, Program {
    using SafeMath for uint256;
    
    mapping(address => address[]) public override nftAddress;
    mapping(address => address[]) public override tokenAddress;
    mapping(address => uint256[]) public override createdTime;
    
    mapping(address => uint256[]) private _nftToken;
    mapping(address => uint256[]) private _amountMoneyBack;
    
    function boxCount(address _account) public view override returns(uint256) {
        return _nftToken[_account].length;
    }

    function nftToken(address _account, uint256 idx) public onlyProgram view override returns(uint256) {
        return idx < _nftToken[_account].length ? _nftToken[_account][idx] : 0;
    }

    function amountMoneyBack(address _account, uint256 idx) public onlyProgram view override returns(uint256) {
        return idx < _amountMoneyBack[_account].length ? _amountMoneyBack[_account][idx] : 0;
    }

    function add(address _account, address tokenAddr, address nftAddr, uint256 token_id, uint256 amount) public override onlyProgram {
        nftAddress[_account].push(nftAddr);
        tokenAddress[_account].push(tokenAddr);
        _nftToken[_account].push(token_id);
        _amountMoneyBack[_account].push(amount);
        createdTime[_account].push(block.timestamp);
    }

    function remove(address _account) public override onlyProgram returns(address, address, uint256, uint256, uint256) {
        require(_nftToken[_account].length > 0, "No mystery data can be removed");
        uint256 idx = _nftToken[_account].length - 1;
        address nftAddr = nftAddress[_account][idx];
        address tokenAddr = tokenAddress[_account][idx];
        uint256 token_id = _nftToken[_account][idx];
        uint256 amount = _amountMoneyBack[_account][idx];
        uint256 time = createdTime[_account][idx];
        
        nftAddress[_account].pop();
        tokenAddress[_account].pop();
        createdTime[_account].pop();
        _nftToken[_account].pop();
        _amountMoneyBack[_account].pop();

        return (nftAddr, tokenAddr, token_id, amount, time);
    }
}

interface IWhitelist {
    function enable() external view returns(bool);
    function inList(address _account) external view returns(uint256);
    function usedCount(address _account) external view returns(uint256);
    function used(address _account) external;
}

contract Whitelist is IWhitelist, Program {
    mapping(address => uint256) private _whitelist;
    mapping(address => uint256) private _usedInList;
    mapping(address => uint256) private _usedOutList;
    bool private _enable;

    function enable() public onlyProgram view override returns(bool) {
        return _enable;
    }

    function enable(bool b) public onlyAdmin {
        _enable = b;
    }

    function add(address[] memory _accounts, uint256[] memory v) public onlyAdmin checkArraySize2(_accounts.length, v.length) {
        for (uint256 i = 0; i < _accounts.length; i++) {
            _whitelist[_accounts[i]] = v[i];
        }
    }

    function add(address[] memory _accounts, uint256 v) public onlyAdmin checkArraySizeAddress(_accounts) {
        for (uint256 i = 0; i < _accounts.length; i++) {
            _whitelist[_accounts[i]] = v;
        }
    }

    function remove(address[] memory _accounts) public onlyAdmin checkArraySizeAddress(_accounts) {
        for (uint256 i = 0; i < _accounts.length; i++) {
            _whitelist[_accounts[i]] = 0;
        }
    }

    function inList(address _account) public onlyProgram view override returns(uint256) {
        return _whitelist[_account];
    }

    function usedCount(address _account) public onlyProgram view override returns(uint256) {
        return _enable && inList(_account) > 0 ? _usedInList[_account] : _usedOutList[_account];
    }

    function used(address _account) public onlyProgram override {
        if (_enable && inList(_account) > 0) {
            _usedInList[_account]++;
        } else {
            _usedOutList[_account]++;
        }
    }
}

interface IRandom {
    function rand(address _acc, uint256 _time, string memory _rand, bytes memory _sign) external returns(uint256);
}

contract Random is Program {
    using SafeMath for uint256;
    using Bytes for bytes;
    address private signAccount;
    uint256 private signExpTime = 1 minutes;
    function setSettings(address _signAccount, uint256 _signExpTime) public onlyAdmin {
        signAccount = _signAccount;
        signExpTime = _signExpTime;
    }

    function rand(address _acc, uint256 _time, string memory _rand, bytes memory _sign) public onlyProgram view returns(uint256) {
        return _randV1(_acc, _time, _rand, _sign);
    }

    function _randV1(address _acc, uint256 _time, string memory _rand, bytes memory) internal view returns(uint256) {
        return uint256(keccak256(abi.encodePacked(_acc, _time, _rand, block.coinbase, 
            block.difficulty, block.timestamp, blockhash(block.number))));
    }

    function _randV2(address _acc, uint256 _time, string memory _rand, bytes memory _sign) internal view returns(uint256) {
        require(_sign.Decode(_acc, _time, _rand) == signAccount, "Check sign error");
        require(_time.add(signExpTime) < block.timestamp, "Check sign expired");

        return uint256(keccak256(abi.encodePacked(_acc, _time, _rand, block.coinbase, 
            block.difficulty, block.timestamp, blockhash(block.number))));
    }
}

interface INFTMysteryBoxOffering {
    function totalSupply(string memory _name) external view returns(uint256);
    function soldCount(string memory _name) external view returns(uint256);
    function moneyBackChance(string memory _name) external view returns(uint256);
    function soldPrice(string memory _name, address _token) external view returns(uint256);
    function probability(string memory _name, string memory _type) external view returns(uint256);
    function discountPrice(string memory _name, address _token) external view returns(uint256);
    function getDiscount() external view returns(uint256);
    function getOpenResult(string memory _openId) external view returns(uint256[] memory, string[] memory);
    function isSoldOut(string memory _name) external view returns(bool);
    function getBoxCount(string memory _name) external view returns(uint256,uint256,uint256);
    function isWhitelistEnable() external view returns (bool);
    function inWhitelist() external view returns (bool);
    function isLimitBuy(address _account) external view returns(bool);
    function getLimitCount(address _account) external view returns(uint256,uint256,uint256);

    function buy(string memory _name, address _tokenAddr, string memory _rnd, uint256 _time, bytes memory _sign) external;
    function buy(string memory _name, address _tokenAddr) external;
    function buyAndOpen(string memory _openId, string memory _name, address _tokenAddr, string memory _rnd, uint256 _time, bytes memory _sign) external returns(uint256[] memory, string[] memory);
    function buyAndOpen(string memory _openId, string memory _name, address _tokenAddr) external returns(uint256[] memory, string[] memory);
    function openAll(string memory _openId) external returns(uint256[] memory, string[] memory);
    function openOne(string memory _openId) external returns(uint256, string memory);
}

contract NFTMysteryBoxOffering is INFTMysteryBoxOffering, Program {
    using SafeMath for uint256;
    using SafeERC20Token for IERC20Token;
    using SafeERC20Token for IERC20TokenMinable;

    IRandom private random;
    IMysteryBox private mysteryBox;
    IMysteryData private mysteryData;
    IWhitelist private whitelist;
    IERC20TokenMinable private rewardToken;
    
    address private tokenAccount;
    address private nftAccount;
    
    bool private rewardMint = false;
    uint256 private openExpiredTime = 7 days;
    uint256 private limitWhitelist = 200;
    uint256 private limitCommonUser = 300;
    uint256 private discountWhitelist = 8500;
    uint256 private discountCommonUser = 10000;
    uint256 private maxRewardAmount = 10500000 * PRICE_UNIT;
    uint256 private rewardedAmount = 0;
    uint256 private rewardPercent = 1000;
    
    mapping(address => mapping(string => uint256[])) private openedNftId;
    mapping(address => mapping(string => string[])) private openedNftUri;
    
    event Buy(address indexed nftAddress, address indexed tokenAddress, uint256 price, uint256 discount, uint256 amount, uint256 amountReward);
    event Open(address indexed nftAddress, address indexed tokenAddress, address indexed account, uint256 token_id, uint256 amountBack);

    function setSettings(uint256 rewardPercent_, uint256 maxRewardAmount_, bool rewardMint_, uint256 openExpiredTime_, uint256 limitWhitelist_, uint256 limitCommonUser_, uint256 discountWhitelist_, uint256 discountCommonUser_) public onlyAdmin {
        rewardPercent = rewardPercent_;
        maxRewardAmount = maxRewardAmount_;
        rewardMint = rewardMint_;
        openExpiredTime = openExpiredTime_;
        limitWhitelist = limitWhitelist_;
        limitCommonUser = limitCommonUser_;
        discountWhitelist = discountWhitelist_;
        discountCommonUser = discountCommonUser_;
    }
    
    function setContracts(address random_, address mysteryBox_, address mysteryData_, address whitelist_, 
        address rewardToken_) public onlyAdmin {
        random = IRandom(random_);
        mysteryBox = IMysteryBox(mysteryBox_);
        mysteryData = IMysteryData(mysteryData_);
        whitelist = IWhitelist(whitelist_);
        rewardToken = IERC20TokenMinable(rewardToken_);
    }
    
    function setAccounts(address tokenAccount_, address nftAccount_) public onlyAdmin {
        tokenAccount = tokenAccount_;
        nftAccount = nftAccount_;
    }
    
    function nftAddress(string memory _name) public onlyAdmin view returns(address) {
        return mysteryBox.nftAddress(_name);
    }
    
    function nftToken(string memory _name, uint256 idx) public onlyAdmin view returns(uint256) {
        return mysteryBox.nftToken(_name, idx);
    }
    
    function totalSupply(string memory _name) public override view returns(uint256) {
        return mysteryBox.totalSupply(_name);
    }

    function soldCount(string memory _name) public override view returns(uint256) {
        return mysteryBox.soldCount(_name);
    }

    function moneyBackChance(string memory _name) public override view returns(uint256) {
        return mysteryBox.moneyBackChance(_name);
    }

    function soldPrice(string memory _name, address _token) public override view returns(uint256) {
        return mysteryBox.sellPrice(_name, _token);
    }

    function probability(string memory _name, string memory _type) public override view returns(uint256) {
        return mysteryBox.probability(_name, _type);
    }

    function setBox(string[] memory _names, address[] memory _nft, uint256[] memory _moneyBackChance) public onlyAdmin {
        mysteryBox.set(_names, _nft, _moneyBackChance);    
    }

    function setPrice(string memory _name, address[] memory _tokens, uint256[] memory _prices) public onlyAdmin {
        mysteryBox.setPrice(_name, _tokens, _prices);
    }

    function setProbability(string memory _name, string[] memory _types, uint256[] memory _probabilities) public onlyAdmin {
        mysteryBox.setProbability(_name, _types, _probabilities);
    }

    function addToken(string memory _name, uint256 start, uint256 end) public onlyAdmin {
        mysteryBox.addToken(_name, start, end);
        IERC721Token _nft = IERC721Token(mysteryBox.nftAddress(_name));  
        for (uint256 i = start; i <= end; i++) {
            address owner = _nft.ownerOf(i);
            if (owner != address(0) && (owner != nftAccount)) {
                _nft.safeTransferFrom(owner, nftAccount, i);
            }
        }
    }

    function addToken(string memory _name, uint256[] memory _tokens) public onlyAdmin checkArraySizeUint256(_tokens) {
        mysteryBox.addToken(_name, _tokens);
        IERC721Token _nft = IERC721Token(mysteryBox.nftAddress(_name));  
        for (uint256 i = 0; i <= _tokens.length; i++) {
            uint256 NFT_id = _tokens[i];
            address owner = _nft.ownerOf(NFT_id);
            if (owner != address(0) && (owner != nftAccount)) {
                _nft.safeTransferFrom(owner, nftAccount, NFT_id);
            }
        }
    }

    function removeToken(string memory _name, uint256 count, address to) public onlyAdmin {
        uint256 len = mysteryBox.totalSupply(_name);
        IERC721Token _nft = IERC721Token(mysteryBox.nftAddress(_name));
        require(count <= len, "Remove count is error");
        for (uint256 i = 1; i <= count; i++) {
            uint256 NFT_id = mysteryBox.nftToken(_name, len.sub(i));
            if (NFT_id > 0) {
                address owner = _nft.ownerOf(NFT_id);
                if (owner != address(0) && (owner != nftAccount)) {
                    _nft.safeTransferFrom(nftAccount, to, NFT_id);
                }
            }
        } 

        mysteryBox.removeToken(_name, count);
    }

    function buy(string memory _name, address _tokenAddr, string memory _rnd, uint256 _time, bytes memory _sign) public override {
        require(!isLimitBuy(msg.sender), "It reaches max buying limit");
        uint256 rnd_num = random.rand(msg.sender, _time, _rnd, _sign);
        require(rnd_num > 0, "Rand check is error");
        uint256 total = mysteryBox.totalSupply(_name);
        uint256 sold = mysteryBox.soldCount(_name);
        require(sold < total, "The mystery which you want sold out");
        uint256 left = total.sub(sold);
        
        uint256 idx = _getNotEmptyBox(_name, rnd_num % left);
        
        _deal(_name, idx, IERC20Token(_tokenAddr), msg.sender, rnd_num);
    }
    
    function buy(string memory _name, address _tokenAddr) public override {
        buy(_name, _tokenAddr, "", block.timestamp, "");
    }

    function buyAndOpen(string memory _openId, string memory _name, address _tokenAddr, string memory _rnd, uint256 _time, bytes memory _sign) public override returns(uint256[] memory, string[] memory) {
        buy(_name, _tokenAddr, _rnd, _time, _sign);
        return openAll(_openId);
    }
    
    function buyAndOpen(string memory _openId, string memory _name, address _tokenAddr) public override returns(uint256[] memory, string[] memory) {
        return buyAndOpen(_openId, _name, _tokenAddr, "", block.timestamp, "");
    }

    function openAll(string memory _openId) public override returns(uint256[] memory, string[] memory) {
        uint256 len = mysteryData.boxCount(msg.sender);
        uint256[] memory ids = new uint256[](len);
        string[] memory uris = new string[](len);
        for (uint256 i = 0; i < len; i++) {
            (ids[i], uris[i]) = openOne(_openId);
        }
        return (ids, uris);
    }

    function openOne(string memory _openId) public override returns(uint256, string memory) {
        uint256 len = mysteryData.boxCount(msg.sender);
        if (len == 0) {
            return (0, "");
        }
        uint256 idx = len - 1;
        IERC721Token _nft = IERC721Token(mysteryData.nftAddress(msg.sender, idx));    
        IERC20Token _token = IERC20Token(mysteryData.tokenAddress(msg.sender, idx));    
        uint256 token_id = mysteryData.nftToken(msg.sender, idx);
        if (token_id > 0)
        {
            _nft.safeTransferFrom(nftAccount, msg.sender, token_id);
        }
        uint256 amountBack = mysteryData.amountMoneyBack(msg.sender, idx);
        if (amountBack > 0 && mysteryData.createdTime(msg.sender, idx).add(openExpiredTime) >= block.timestamp)
        {
            _token.safeTransferFrom(tokenAccount, msg.sender, amountBack);
        }
        mysteryData.remove(msg.sender);
        
        openedNftId[msg.sender][_openId].push(token_id);
        openedNftUri[msg.sender][_openId].push(_nft.tokenURI(token_id));
        
        emit Open(address(_nft), address(_token), msg.sender, token_id, amountBack);
        
        return (token_id, _nft.tokenURI(token_id));
    }
    
    function getOpenResult(string memory _openId) public override view returns(uint256[] memory, string[] memory) {
        return (openedNftId[msg.sender][_openId], openedNftUri[msg.sender][_openId]);
    }

    function _deal(string memory _name, uint256 idx, IERC20Token token, address _account, uint256 rnd_num) internal {
        uint256 token_id = mysteryBox.nftToken(_name, idx);
        require(token_id > 0, "NFT is not exist");
        (uint256 price,uint256 discount,uint256 amount, uint256 moneyBack) = _getPriceAmount(_name, token, rnd_num);
        mysteryData.add(_account, address(token), mysteryBox.nftAddress(_name), token_id, moneyBack);
        mysteryBox.giveToken(_name, idx);
        whitelist.used(msg.sender);
        
        require(token.balanceOf(_account) >= amount, "You have not enough money");
        token.safeTransferFrom(_account, tokenAccount, amount);

        uint256 amountReward = 0;
        if (address(rewardToken) != address(0) && (amount > moneyBack)) {
            uint256 needReward = amount.sub(moneyBack).mul(rewardPercent).div(10 ** token.decimals());
            if (rewardedAmount.add(needReward) < maxRewardAmount) {
                rewardedAmount = rewardedAmount.add(needReward);
                amountReward = needReward.mul(10 ** rewardToken.decimals()).div(PRICE_UNIT);
                if (rewardMint) {
                    rewardToken.mint(_account, amountReward);
                } else {
                    rewardToken.safeTransferFrom(tokenAccount, _account, amountReward);   
                }
            }
        }
        
        emit Buy(mysteryBox.nftAddress(_name), address(token), price, discount, amount, amountReward);
    }

    function _getPriceAmount(string memory _name, IERC20Token token, uint256 rnd_num) internal view returns(uint256,uint256,uint256,uint256) {
        uint256 price = mysteryBox.sellPrice(_name, address(token));
        require(price > 0, "Unsupported token to buy");

        uint256 discount = _getDiscount(msg.sender);
        uint256 amount = price.mul(10 ** token.decimals()).div(PRICE_UNIT).mul(discount).div(PERCENT_UNIT);
        uint256 moneyBack = rnd_num % PERCENT_UNIT <  mysteryBox.moneyBackChance(_name) ? amount : 0;
        return (price, discount, amount, moneyBack);
    }

    function _getNotEmptyBox(string memory _name, uint256 idx) internal view returns(uint256) {
        uint256 len = mysteryBox.totalSupply(_name);
        uint256 k = 0;
        for (uint256 i = 0; i < len; i++) {
            if (mysteryBox.nftToken(_name, i) > 0) {
                if (k == idx) {
                    return i;
                }
                k++;
            }
        }
        return len;
    } 
    
    function discountPrice(string memory _name, address _token) public override view returns(uint256) {
        return soldPrice(_name, _token).mul(getDiscount()).div(PERCENT_UNIT);
    }

    function getDiscount() public override view returns(uint256) {
        return _getDiscount(msg.sender);
    }

    function _getDiscount(address _account) internal view returns(uint256) {
        return whitelist.enable() ? (whitelist.inList(_account) > 0 ? discountWhitelist : PERCENT_UNIT) : discountCommonUser;
    }

    function isSoldOut(string memory _name) public override view returns(bool) {
        return soldCount(_name) >= totalSupply(_name);
    }

    function getBoxCount(string memory _name) public override view returns(uint256,uint256,uint256) {
        uint256 totalSupply_ = totalSupply(_name);
        uint256 soldCount_ = soldCount(_name);
        return (totalSupply_.sub(soldCount_), totalSupply_, soldCount_);
    }

    function isWhitelistEnable() public override view returns (bool) {
        return whitelist.enable();
    }

    function inWhitelist() public override view returns (bool) {
        return whitelist.inList(msg.sender) > 0;
    }

    function isLimitBuy(address _account) public override view returns(bool) {
        uint256 usedCount = whitelist.usedCount(_account);
        return whitelist.enable() ? (whitelist.inList(_account) > 0 ? (usedCount >= limitWhitelist) : true) : (usedCount >= limitCommonUser);
    }

    function getLimitCount(address _account) public override view returns(uint256, uint256, uint256) {
        uint256 usedCount = whitelist.usedCount(_account);
        uint256 limitCount = whitelist.inList(_account) > 0 ? limitWhitelist : limitCommonUser;
        return (limitCount.sub(usedCount), limitCount, usedCount);
    }
}
