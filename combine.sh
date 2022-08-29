#!/bin/bash
contracts=(
Auth.sol ERC20.sol HorseArenaAttrOpera.sol HorseEquip.sol  HorseRaceAttrOpera1_1.sol HorseRaceExtra2.sol
Coin.sol ERC721.sol HorseArenaExtra.sol HorseEquipAttrOpera.sol HorseRaceAttrOpera2.sol RacecourseAttrOpera.sol
Coin721.sol ERC721Attr.sol HorseArenaExtra2.sol HorseRace.sol  HorseRaceAttrOpera2_1.sol UserLogin.sol
Constant.sol HorseArena.sol HorseArenaExtra3.sol HorseRaceAttrOpera.sol HorseRaceExtra1.sol
)
for contract in ${contracts[@]}
do
	#echo "contract is $contract"
	file="contracts/$contract"
	name=$(echo "$contract" | cut -d. -f1)
	echo "naem is $name"
	npx hardhat flatten $file > full/${name}_full.sol
done
