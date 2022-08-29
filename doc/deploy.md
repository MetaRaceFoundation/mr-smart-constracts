# 合约部署步骤
### 1. 准备管理员账户 `$ManagerAccount`，准备官方手续费地址`$FeeAccount`

### 2. 部署`Constant` 合约
* 编译部署 `Constant.sol`
* 调用**addAdmin** 函数添加合约的管理员账户,参数为`$ManagerAccount`

### 3. 部署`MetaToken`合约
* 编译部署 `ERC20.sol`, 参数 `"META", "meta", 18, '10000000000000000000000000000'`
* 调用 **addMinter** 函数添加 minter 权限，参数为 `$ManagerAccount`

### 4. 部署`RaceToken`合约
* 编译部署`ERC20.sol`, 参数`"RACE", "race", 18, '10000000000000000000000000000'`
* 调用 **addMinter** 函数添加 minter 权限，参数为 `$ManagerAccount`

### 5. 部署`USDTToken`合约
* 编译部署`ERC20.sol`, 参数`"USDT", "usdt", 10, '100000000000000000000'`
* 调用 **addMinter** 函数添加 minter 权限，参数为 `$ManagerAccount`

### 6. 部署`Coin` 合约
* 编译部署`Coin.sol`
* 调用**addAdmin** 函数添加合约的管理员账户,参数为`$ManagerAccount`
* 调用*add* 函数添加币种
    - 参数 coin: 数组[1,2,3]
    - 参数 address: 数组 [MetaTokenAddress, RaceTokenAddress, UsdtTokenAddress]
    - 参数 price: 数组[1,1,10000]

### 7. 部署`EquipNFT` 合约
* 编译部署 `ERC721.sol`, 参数 `"EQUIP", "equip"`

### 8. 部署`HorseNFT` 合约
* 编译部署`ERC721.sol`, 参数`"HORSE", "horse"`

### 9. 部署`ArenaNFT` 合约
* 编译部署`ERC721.sol`, 参数`"ARENA", "arena"`

### 10. 部署`Coin721`合约
* 编译部署`Coin721.sol`
* 调用**addAdmin** 函数添加合约的管理员账户,参数为`$ManagerAccount`
* 调用**add** 函数添加币种
    - 参数 address: 数组 [EquipNFTAddress, HorseNFTAddress, ArenaNFTAddress]

### 11. 部署`NFTAttr`合约
* 编译部署`ERC721Attr.sol`
* 调用**addAdmin** 函数添加合约的管理员账户,参数为`$ManagerAccount`
* 调用**setFiled** 函数添加 `EquipNFT`属性
    - 参数 addr: EquipNFT 合约地址
    - 参数 fields: 字符串数组 `["horseEquipTypes", "horseEquipStyle", "horseEquipStatus", "horseEquipPrice", "horseEquipOfUid", "horseEquipOfHorseId", "horseEquipDiscount", "horseEquipReward", "horseEquipCoin", "horseEquipLastOwner", "horseEquipLastPrice", "lastOperaTime"]`
    - 参数 type: 整数数组 `[1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1]`
    - 参数 auth: 整数数组 `[2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2]`

* 调用**setFiled** 函数添加 `HorseNFT` 属性
    - 参数 addr: HorseNFT 合约地址
    - 参数 fields: 字符串数组 `["horseRaceName", "nameUptCount", "birthDay", "mainGeneration", "slaveGeneration",        "generationScore", "gender", "color", "gene", "gripGene"]`
    - 参数 type: 整数数组 `[2, 1, 1, 1, 1, 1, 1, 1, 1, 1]`
    - 参数 auth: 整数数组 `[2, 2, 2, 2, 2, 2, 2, 2, 2, 2]`


* 调用**setFiled** 函数添加 `HorseNFT` 属性
    - 参数 addr: HorseNFT 合约地址
    - 参数 fields: 字符串数组 `["accGene", "endGene", "speedGene", "turnToGene", "controlGene", "trainingValue", "trainingTime", "useTraTime", "energy", "energyUpdateTime"]`
    - 参数 type: 整数数组 `[1, 1, 1, 1, 1, 1, 1, 1, 1, 1]`
    - 参数 auth: 整数数组 `[2, 2, 2, 2, 2, 2, 2, 2, 2, 2]`

* 调用**setFiled** 函数添加 `HorseNFT` 属性
    - 参数 addr: HorseNFT 合约地址
    - 参数 fields: 字符串数组 `["gradeScore", "gradeIntegral", "gradeScoreMark", "raceScoreUpdateTime", "father", "mother", "breedCount", "breedTime", "gradeIntegralYear", "gradeIntegralYearTime"]`
    - 参数 type: 整数数组 `[1, 1, 1, 1, 1, 1, 1, 1, 1, 1]`
    - 参数 auth: 整数数组 `[2, 2, 2, 2, 2, 2, 2, 2, 2, 2]`

* 调用**setFiled** 函数添加 `HorseNFT` 属性
    - 参数 addr: HorseNFT 合约地址
    - 参数 fields: 字符串数组 `["gradeIntegralMonth", "gradeIntegralMonthTime", "gradeIntegralWeek", "gradeIntegralWeekTime"]`
    - 参数 type: 整数数组 `[1, 1, 1, 1]`
    - 参数 auth: 整数数组 `[2, 2, 2, 2]`

* 调用**setFiled** 函数添加 `HorseNFT` 属性
    - 参数 addr: HorseNFT 合约地址
    - 参数 fields: 字符串数组 `["headWearId", "armorId", "ponytailId", "hoofId", "grade", "raceCount", "winCount", "raceId", "raceType", "racecourse"]`
    - 参数 type: 整数数组 `[1, 1, 1, 1, 1, 1, 1, 1, 1, 1]`
    - 参数 auth: 整数数组 `[2, 2, 2, 2, 2, 2, 2, 2, 2, 2]`


* 调用**setFiled** 函数添加 `HorseNFT` 属性
    - 参数 addr: HorseNFT 合约地址
    - 参数 fields: 字符串数组 `["distance", "raceUpdateTime", "horseRaceStatus", "horseRaceDiscount", "horseRaceReward","horseRaceCoin", "horseRaceLastOwner", "horseRaceLastPrice", "horseRacePrice"]`
    - 参数 type: 整数数组 `[1, 1, 1, 1, 1, 1, 1, 1, 1]`
    - 参数 auth: 整数数组 `[2, 2, 2, 2, 2, 2, 2, 2, 2]`

* 调用**setFiled** 函数添加 `HorseNFT` 属性
    - 参数 addr: HorseNFT 合约地址
    - 参数 fields: 字符串数组 `["sellUpdateTime", "studUpdateTime"]`
    - 参数 type: 整数数组 `[1, 1]`
    - 参数 auth: 整数数组 `[2, 2]`

* 调用**setFiled** 函数添加 `ArenaNFT` 属性
    - 参数 addr: ArenaNFT 合约地址
    - 参数 fields: 字符串数组 `["name", "createTime", "ownerType", "isClose", "raceCount", "lastRaceTime", "totalRaceCount", "mortAmount", "gameId", "horseIds"]`
    - 参数 type: 整数数组 `[2, 1, 1, 1, 1, 1, 1, 1, 1, 1]`
    - 参数 auth: 整数数组 `[2, 2, 2, 2, 2, 2, 2, 2, 2, 2]`

### 12. 部署`EquipAttrOpera`合约
* 编译部署`HorseEquipAttrOpera.sol`
* 调用**addAdmin** 函数添加合约的管理员账户,参数为`$ManagerAccount`
* 调用**init**函数
    - 参数 factoryAttrAddress: `NFTAttr`合约地址
    - 参数 factoryToken: `EquipNFT`合约地址

### 13. 部署`ArenaAttrOpera`合约
* 编译部署`HorseArenaAttrOpera.sol`
* 调用**addAdmin** 函数添加合约的管理员账户,参数为`$ManagerAccount`
* 调用**init**函数
    - 参数 factoryAttrAddress: `NFTAttr`合约地址
    - 参数 factoryToken: `ArenaNFT`合约地址

### 14. 部署`HorseAttrOpera1`合约
* 编译部署`HorseRaceAttrOpera.sol`
* 调用**addAdmin** 函数添加合约的管理员账户,参数为`$ManagerAccount`
* 调用**init**函数
    - 参数 factoryAttrAddress: `NFTAttr`合约地址
    - 参数 factoryToken: `HorseNFT`合约地址
### 15. 部署`HorseAttrOpera1_1`合约
* 编译部署`HorseRaceAttrOpera1_1.sol`
* 调用**addAdmin** 函数添加合约的管理员账户,参数为`$ManagerAccount`
* 调用**init**函数
    - 参数 factoryAttrAddress: `NFTAttr`合约地址
    - 参数 factoryToken: `HorseNFT`合约地址

### 16. 部署`HorseAttrOpera2`合约
* 编译部署`HorseRaceAttrOpera2.sol`
* 调用**addAdmin** 函数添加合约的管理员账户,参数为`$ManagerAccount`
* 调用**init**函数
    - 参数 factoryAttrAddress: `NFTAttr`合约地址
    - 参数 factoryToken: `HorseNFT`合约地址
### 17. 部署`HorseAttrOpera2_1`合约
* 编译部署`HorseRaceAttrOpera2_1.sol`
* 调用**addAdmin** 函数添加合约的管理员账户,参数为`$ManagerAccount`
* 调用**init**函数
    - 参数 factoryAttrAddress: `NFTAttr`合约地址
    - 参数 factoryToken: `HorseNFT`合约地址

### 18. 部署`RaceCourseAttr`合约
* 编译部署`ERC721Attr.sol`
* 调用**addAdmin** 函数添加合约的管理员账户,参数为`$ManagerAccount`

### 19. 部署`RaceCourseAttrOpera`合约
* 编译部署`RaceCourseAttrOpera.sol`
* 调用**addAdmin** 函数添加合约的管理员账户,参数为`$ManagerAccount`
* 调用**init**函数
    - 参数 attrAddress: `RaceCourseAttr`合约地址

### 20. 部署`EquipExtra`合约
* 编译部署`HorseEquip.sol`
* 调用**addAdmin** 函数添加合约的管理员账户,参数为`$ManagerAccount`
* 调用**initHorseEquipAttrAddress**函数
    - 参数1: `Coin`合约地址
    - 参数2: `Coin721`合约地址
    - 参数3: `EquipAttrOpera`合约地址
    - 参数4: `EquipNFT`合约地址
    - 参数5: 手续费地址`$FeeAccount`
    - 参数6: `Constant`合约地址
    - 参数7: `HorseAttrOpera1_1`合约地址
* 调用`Coin721` 合约的**addMinter**函数
    - 参数 minter: `HorseEquip` 合约地址

### 21. 部署`RaceExtra`合约
* 编译部署`HorseRace.sol`
* 调用**addAdmin** 函数添加合约的管理员账户,参数为`$ManagerAccount`
* 调用**initHorseRaceAttrAddress**函数
    - 参数1: `HorseAttrOpera1`合约地址
    - 参数2: `HorseAttrOpera1_1`合约地址
    - 参数3: `HorseNFT`合约地址
    - 参数4: `HorseAttrOpera2`合约地址
    - 参数5: `HorseAttrOpera2_1`合约地址
    - 参数6: `Coin`合约地址
    - 参数7: `Constant`合约地址
    - 参数8: 手续费地址`$FeeAccount`

### 22. 部署`RaceExtra1`合约
* 编译部署`HorseRaceExtra1.sol`
* 调用**addAdmin** 函数添加合约的管理员账户,参数为`$ManagerAccount`
* 调用**initHorseRaceAttrAddress**函数
    - 参数1: `HorseAttrOpera1`合约地址
    - 参数2: `HorseAttrOpera1_1`合约地址
    - 参数3: `HorseAttrOpera2`合约地址
    - 参数4: `HorseAttrOpera2_1`合约地址
    - 参数5: `EquipAttrOpera`合约地址
    - 参数6: `HorseNFT`合约地址
    - 参数7: `EquipNFT`合约地址
    - 参数8: `Constant`合约地址
    - 参数9: `Coin`合约地址
    - 参数10: 手续费地址`$FeeAccount`

### 23. 部署`RaceExtra2`合约
* 编译部署`HorseRaceExtra2.sol`
* 调用**addAdmin** 函数添加合约的管理员账户,参数为`$ManagerAccount`
* 调用**initHorseRaceAttrAddress**函数
    - 参数1: `HorseAttrOpera1`合约地址
    - 参数2: `HorseAttrOpera1_1`合约地址
    - 参数3: `HorseAttrOpera2`合约地址
    - 参数4: `HorseAttrOpera2_1`合约地址
    - 参数5: `Coin`合约地址
    - 参数6: `Coin721`合约地址
    - 参数7: `HorseNFT`合约地址
    - 参数8: `Constant`合约地址
    - 参数9: 手续费地址`$FeeAccount`
* 调用`Coin721`合约的**addMinter**函数
    - 参数: `RaceExtra2`合约地址

### 24. 部署`ArenaExtra`合约
* 编译部署`HorseArena.sol`
* 调用**addAdmin** 函数添加合约的管理员账户,参数为`$ManagerAccount`
* 调用**init** 函数
    - 参数1: `ArenaAttrOpera`合约地址
    - 参数2: `ArenaNFT`合约地址
    - 参数3: `Coin`合约地址
    - 参数4: `Constant`合约地址

### 25. 部署`ArenaExtra1`合约
* 编译部署`HorseArenaExtra.sol`
* 调用**addAdmin** 函数添加合约的管理员账户,参数为`$ManagerAccount`
* 调用**init** 函数
    - 参数1: `ArenaAttrOpera`合约地址
    - 参数2: `Coin`合约地址
    - 参数3: `RaceCourseAttrOpera`合约地址
    - 参数4: `HorseAttrOpera1`合约地址
    - 参数5: `HorseAttrOpera1_1`合约地址
    - 参数6: `HorseAttrOpera2`合约地址
    - 参数7: `HorseAttrOpera2_1`合约地址
    - 参数8: `HorseNFT`合约地址
    - 参数9: `ArenaNFT`合约地址
    - 参数10: `Constant`合约地址
    - 参数11: `MetaToken`合约地址
    - 参数12: `RaceToken`合约地址


### 26. 部署`ArenaExtra2`合约
* 编译部署`HorseArenaExtra2.sol`
* 调用**addAdmin** 函数添加合约的管理员账户,参数为`$ManagerAccount`
* 调用**init** 函数
    - 参数1: `ArenaAttrOpera`合约地址
    - 参数2: `Coin`合约地址
    - 参数3: `HorseNFT`合约地址
    - 参数4: `HorseAttrOpera1_1`合约地址
    - 参数5: `HorseAttrOpera2`合约地址
    - 参数6: `HorseAttrOpera2_1`合约地址
    - 参数7: `Constant`合约地址

### 27. 部署`ArenaExtra3`合约
* 编译部署`HorseArenaExtra3.sol`
* 调用**addAdmin** 函数添加合约的管理员账户,参数为`$ManagerAccount`
* 调用*init* 函数
    - 参数1: `ArenaAttrOpera`合约地址
    - 参数2: `RaceCourseAttrOpera`合约地址
    - 参数3: `HorseAttrOpera1_1`合约地址
    - 参数4: `HorseAttrOpera2_1`合约地址
    - 参数5: `Constant`合约地址

### 28. 设置Minter权限
* 调用`Coin`合约的**addMinter**函数
    - 参数`EquipExtra`合约地址
* 调用`Coin`合约的**addMinter**函数
    - 参数`RaceExtra`合约地址
* 调用`Coin`合约的**addMinter**函数
    - 参数`RaceExtra1`合约地址
* 调用`Coin`合约的**addMinter**函数
    - 参数`RaceExtra2`合约地址
* 调用`Coin`合约的**addMinter**函数
    - 参数`ArenaExtra`合约地址
* 调用`Coin`合约的**addMinter**函数
    - 参数`ArenaExtra1`合约地址
* 调用`Coin`合约的**addMinter**函数
    - 参数`ArenaExtra2`合约地址
* 调用`Coin`合约的**addMinter**函数
    - 参数`ArenaExtra3`合约地址
* 调用`MetaToken`合约的**addMinter**函数
    - 参数`ArenaExtra1`合约地址
* 调用`RaceToken`合约的**addMinter**函数
    - 参数`ArenaExtra1`合约地址


### 29. 设置Admin权限
* 调用`EquipNFT`合约的**addAdmin**函数
    - 参数`EquipExtra`合约地址
* 调用`HorseNFT`合约的**addAdmin**函数
    - 参数`RaceExtra`合约地址
* 调用`ArenaNFT`合约的**addAdmin**函数
    - 参数`ArenaExtra`合约地址

* 调用`RaceExtra1`合约的**addAdmin**函数
    - 参数：管理员账户地址`$ManagerAccount`

### 30. 设置Program权限
* 调用`EquipAttrOpera`合约的**addProgram**函数
    - 参数`EquipExtra`合约地址
* 调用`EquipAttrOpera`合约的**addProgram**函数
    - 参数`RaceExtra1`合约地址

* 调用`HorseAttrOpera1`合约的**addProgram**函数
    - 参数`ArenaExtra1`合约地址
* 调用`HorseAttrOpera1`合约的**addProgram**函数
    - 参数`RaceExtra`合约地址
* 调用`HorseAttrOpera1`合约的**addProgram**函数
    - 参数`RaceExtra1`合约地址
* 调用`HorseAttrOpera1`合约的**addProgram**函数
    - 参数`RaceExtra2`合约地址

* 调用`HorseAttrOpera1_1`合约的**addProgram**函数
    - 参数`EquipExtra`合约地址
* 调用`HorseAttrOpera1_1`合约的**addProgram**函数
    - 参数`RaceExtra`合约地址
* 调用`HorseAttrOpera1_1`合约的**addProgram**函数
    - 参数`RaceExtra1`合约地址
* 调用`HorseAttrOpera1_1`合约的**addProgram**函数
    - 参数`RaceExtra2`合约地址
* 调用`HorseAttrOpera1_1`合约的**addProgram**函数
    - 参数`ArenaExtra`合约地址
* 调用`HorseAttrOpera1_1`合约的**addProgram**函数
    - 参数`ArenaExtra1`合约地址
* 调用`HorseAttrOpera1_1`合约的**addProgram**函数
    - 参数`ArenaExtra2`合约地址
* 调用`HorseAttrOpera1_1`合约的**addProgram**函数
    - 参数`ArenaExtra3`合约地址

* 调用`ArenaAttrOpera`合约的**addProgram**函数
    - 参数`ArenaExtra`合约地址
* 调用`ArenaAttrOpera`合约的**addProgram**函数
    - 参数`ArenaExtra1`合约地址
* 调用`ArenaAttrOpera`合约的**addProgram**函数
    - 参数`ArenaExtra2`合约地址
* 调用`ArenaAttrOpera`合约的**addProgram**函数
    - 参数`ArenaExtra3`合约地址

* 调用`ERC721Attr`合约的**addProgram**函数
    - 参数`EquipAttrOpera`合约地址
* 调用`ERC721Attr`合约的**addProgram**函数
    - 参数`HorseAttrOpera1`合约地址
* 调用`ERC721Attr`合约的**addProgram**函数
    - 参数`HorseAttrOpera1_1`合约地址
* 调用`ERC721Attr`合约的**addProgram**函数
    - 参数`ArenaAttrOpera`合约地址

* 调用`ArenaExtra`合约的**addProgram**函数
    - 参数：管理员账户地址`$ManagerAccount`
* 调用`ArenaExtra1`合约的**addProgram**函数
    - 参数：管理员账户地址`$ManagerAccount`
* 调用`ArenaExtra2`合约的**addProgram**函数
    - 参数：管理员账户地址`$ManagerAccount`
* 调用`ArenaExtra3`合约的**addProgram**函数
    - 参数：管理员账户地址`$ManagerAccount`
* 调用`RaceCourseAttr`合约的**addProgram**函数
    - 参数：管理员账户地址`$ManagerAccount`
* 调用`RaceCourseAttrOpera`合约的**addProgram**函数
    - 参数：管理员账户地址`$ManagerAccount`
* 调用`RaceExtra1`合约的**addProgram**函数
    - 参数：管理员账户地址`$ManagerAccount`

* 调用`RaceCourseAttr`合约的**addProgram**函数
    - 参数：`ArenaExtra3`合约地址
* 调用`RaceCourseAttr`合约的**addProgram**函数
    - 参数：`RaceCourseAttrOpera`合约地址
* 调用`RaceCourseAttrOpera`合约的**addProgram**函数
    - 参数：`ArenaExtra3`合约地址

