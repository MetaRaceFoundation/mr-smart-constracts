// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
pragma experimental ABIEncoderV2;

import "../library/ERC721Token.sol";

abstract contract BaseERC721TokenMinable is ERC721TokenMinable {
    IERC721BeforeTransfer private _beforeTransfer;
    IERC721AfterTransfer private _afterTransfer;

    constructor(string memory name_, string memory symbol_) ERC721TokenMinable(name_, symbol_) {}

    function registerTransferHandler(address beforehandler, address afterhandler) public onlyAdmin {
        _beforeTransfer = IERC721BeforeTransfer(beforehandler);
        _afterTransfer = IERC721AfterTransfer(afterhandler);
    }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId)
        internal
        override(ERC721Token)
    {
        if (address(_beforeTransfer) != address(0) )
        {
            require(_beforeTransfer.beforeTransfer(from, to, tokenId), "stop transfer before ttransfer check failed");
        }
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function _afterTokenTransfer(address from, address to, uint256 tokenId)
        internal
        override(ERC721Token)
    {
        super._afterTokenTransfer(from, to, tokenId);
        if (address(_afterTransfer) != address(0) )
        {
            require(_afterTransfer.afterTransfer(from, to, tokenId), "stop transfer after transfer check failed");
        }
    }
}

contract HorseToken is BaseERC721TokenMinable {
    constructor() BaseERC721TokenMinable("t1.HORSE", "t1.HORSE") {}
}

contract EquipToken is BaseERC721TokenMinable {
    constructor() BaseERC721TokenMinable("t1.EQUIP", "t1.EQUIP") {}
}

contract ArenaToken is BaseERC721TokenMinable {
    constructor() BaseERC721TokenMinable("t1.Arena", "t1.Arena") {}
}

