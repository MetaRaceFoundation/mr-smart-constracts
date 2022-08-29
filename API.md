## Token Types
```
ERC20: Meta, Race
ERC721: Horse, Equip, Arena
```
## 币种类型
```
0 : 无限制
1 : Meta
2 : Race
3 : Usdt
```

## Equip (装备)
#### 1. 生成装备(管理员权限)

```
// 参数：装备类型和款式
// 装备类型
1 马头饰
2 马护甲
3 马尾饰
4 马蹄饰(暂未使用)

// 装备款式
1-5
1、 圣诞 套装
2、 庄重 套装
3、 淡雅 套装
4、 华丽 套装
5、 喜庆 套装

mintEquip(address to, uint256 equip_types, uint256 equip_style);

// 批量生成
batchMintEquip(address[] memory to, uint256[] memory equip_types, uint256[] memory equip_style);
```

#### 2. 购买和售卖
```
// 售卖：参数 接受币种，以及价格
sellOne(uint256 coin, uint256 price, uint256 tokenId);

// 取消售卖
cancelSell(uint256 tokenId)；

// 购买：参数 购买使用的币种 和 装备id.
buy(uint256 coin, uint256 tokenId);
```

#### 3. 卸载装备
```
// 一键卸载装备：参数 装备id， 马匹id.
unloadEquip(uint256[] memory tokenIds, uint256 horseId);
```

## Horse(马匹)
#### 1. 生成马匹
```
// 批量生成马匹
batchMintHorse(string[] memory name,
        uint256 [] memory mainGeneration,
        uint256 [] memory slaveGeneration,
        uint256 [] memory generationScore,
        uint256 [] memory gender,
        string [] memory color,
        string [] memory gene,
        address [] memory to
    ) public onlyAdmin

// 生成单个马匹
mintHorse(
        string memory name,
        uint256 mainGeneration,
        uint256 slaveGeneration,
        uint256 generationScore,
        uint256 gender,
        string memory color,
        string memory gene,
        address to
    ) public onlyAdmin
```

#### 2. 训练
```
// 训练马匹
// 每天训练值有上限
trainingHorses(uint256 tokenId) public checkOwner(tokenId)

// todo: 不对外.
// 更新马匹训练值
uptTraValue(uint256 tokenId) public onlyProgram

```

#### 3. 修饰马匹属性
```
// 增加装备
// 每个装备位只能加一件装备
horseDeco(uint256 horseId, uint256 equipId) public checkOwner(horseId) checkEquipOwner(equipId)

// 修改马匹名称
uptHorseName(uint256 tokenId, string memory name, bytes memory sign) public checkOwner

// 修改马匹基因
setHorseGene(
        uint256 horseId,
        string memory gripGene,
        string memory accGene,
        string memory endGene,
        string memory speedGene,
        string memory turnToGene,
        string memory controlGene
    ) public onlyProgram

// 初始化马匹等级
initHorseGrade(uint256[] memory horseId, uint256[] memory comp) public onlyProgram
```
#### 4. 买卖
```
// 批量出售同一价格
batchSellHorseOnePrice(uint256 [] memory horseId, uint256 price, uint256 coin) 

// 批量出售
batchSellHorse(uint256 [] memory horseId, uint256 [] memory price, uint256 [] memory coin) 
// 批量取消出售
batchCancelSellHorse(uint256 [] memory horseId)

// 单匹出售
sellHorse(uint256 horseId, uint256 price, uint256 coin) public checkOwner(horseId)
// 取消出售
cancelSellHorse(uint256 horseId)

// 购买马匹
buy(uint256 coin, uint256 horseId)

```

#### 5. 繁殖
```
// 马匹放入育马场: 这里必须是公马
sireHorse(uint256 horseId, uint256 price, uint256 coin) public checkOwner(horseId)
// 从育马场取出马匹
cancelSireHorse(uint256 horseId)；
// 繁殖： horseId 为用户的母马， stallId 为育马场中的公马
breeding(uint256 horseId, uint256 stallId, uint256 coinType, string memory name, bytes memory sign);
```

## HorseArena（马场）

#### 1. 生成和关闭(HorseArena)
```
//生成马场 参数：马场名称 签名
mintArena(string memory name, bytes memory sign)

//关闭马场 参数：tokenId
closeArena(uint256 tokenId)
```


#### 2. 结束比赛（HorseArenaExtra）
```
// 大奖赛结束比赛 参数：arenaId gameId rank是horseId的排序 得分 comp综合评分
endGrandGame(uint256 arenaId, uint256 gameId, uint256[] memory rank, uint256[] memory score, uint256[] memory comp)

// 积分赛结束比赛 参数：tokenId gameId rank是horseId的排序 得分 comp综合评分
endPointGame(uint256 tokenId, uint256 gameId, uint256[] memory rank, uint256[] memory score, uint256[] memory comp)

```

#### 3. 报名与取消报名、排名（HorseArenaExtra2）

```
// 报名比赛 参数：arenaId 马匹ID 比赛类型 赛程 等级
applyGame(uint256 arenaId , uint256 horseId, uint256 raceType, uint256 distance, uint256 level)

// 取消报名 参数：马匹ID
cancelApplyGame(uint256 horseId)

// 周排名 参数：马匹ID 总分 账户 排名
weekRank(uint256[] memory horseIds, uint256[] memory totalScores, address[] memory accounts, uint256[] memory rank)

// 月排名 参数：马匹ID 总分 账户 排名
monthRank(uint256[] memory horseIds, uint256[] memory totalScores, address[] memory accounts, uint256[] memory rank)

// 年排名 参数：马匹ID 总分 账户 排名
yearsRank(uint256[] memory horseIds, uint256[] memory totalScores, address[] memory accounts, uint256[] memory rank)

```

#### 4. 开始与取消比赛（HorseArenaExtra3）
```
// 开始比赛 参数：tokenId 比赛ID 马匹ID 类型 等级 赛程
startGame(uint256 tokenId, uint256 gameId, uint256[] memory horseId, uint256 types, uint256 level, uint256 distance)

// 批量取消比赛 参数：tokenId 比赛ID
cancelGame(uint256 tokenId, uint256 [] memory gameIds)

```
