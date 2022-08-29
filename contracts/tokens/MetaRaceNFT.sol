// SPDX-License-Identifier: MIT
// Created by MetaRace.io
pragma solidity ^0.8.13;


/**
 * @dev Interface of the ERC165 standard, as defined in the
 * https://eips.ethereum.org/EIPS/eip-165[EIP].
 *
 * Implementers can declare support of contract interfaces, which can then be
 * queried by others ({ERC165Checker}).
 *
 * For an implementation, see {ERC165}.
 */
interface IERC165 {
    /**
     * @dev Returns true if this contract implements the interface defined by
     * `interfaceId`. See the corresponding
     * https://eips.ethereum.org/EIPS/eip-165#how-interfaces-are-identified[EIP section]
     * to learn more about how these ids are created.
     *
     * This function call must use less than 30 000 gas.
     */
    function supportsInterface(bytes4 interfaceId) external view returns (bool);
}

interface IERC721Metadata {
    function name() external view returns (string memory);
    function symbol() external view returns (string memory);
    function tokenURI(uint256 tokenId) external view returns (string memory);
}
interface IERC721 is IERC165 {
    function balanceOf(address owner) external view returns (uint256 balance);
    function ownerOf(uint256 tokenId) external view returns (address owner);
    function safeTransferFrom(address from, address to, uint256 tokenId) external;
    function transferFrom(address from, address to, uint256 tokenId) external;
    function approve(address to, uint256 tokenId) external;
    function getApproved(uint256 tokenId) external view returns (address operator);
    function setApprovalForAll(address operator, bool _approved) external;
    function isApprovedForAll(address owner, address operator) external view returns (bool);
    function safeTransferFrom(address from, address to, uint256 tokenId, bytes calldata data) external;
    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);
    event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId);
    event ApprovalForAll(address indexed owner, address indexed operator, bool approved);
}
interface IERC721Token is IERC721, IERC721Metadata {
}

/**
 * @title ERC721 token receiver interface
 * @dev Interface for any contract that wants to support safeTransfers
 * from ERC721 asset contracts.
 */
interface IERC721Receiver {
    function onERC721Received(address operator, address from, uint256 tokenId, bytes calldata data) external returns (bytes4);
}

interface IERC721TokenMinable is IERC721Token {
    function mint(address to) external returns (uint256);
    function mint(address to, bytes memory _data) external returns (uint256);
    function mint(uint256 len, address to) external returns (uint256[] memory);
    function mint(uint256 len, address to, bytes memory _data) external returns (uint256[] memory);
    function mint(uint256 len, address to, bytes[] memory _data) external returns (uint256[] memory);
    function mint(uint256 len, address[] memory to, bytes[] memory _data) external returns (uint256[] memory);
}

interface IERC721BeforeTransfer {
    function beforeTransfer(address from, address to, uint256 tokenId) external returns (bool);
}

interface IERC721AfterTransfer {
    function afterTransfer(address from, address to, uint256 tokenId) external returns (bool);
}

/**
 * @title Counters
 * @author Matt Condon (@shrugs)
 * @dev Provides counters that can only be incremented, decremented or reset. This can be used e.g. to track the number
 * of elements in a mapping, issuing ERC721 ids, or counting request ids.
 *
 * Include with `using Counters for Counters.Counter;`
 */
library Counters {
    struct Counter {
        // This variable should never be directly accessed by users of the library: interactions must be restricted to
        // the library's function. As of Solidity v0.5.2, this cannot be enforced, though there is a proposal to add
        // this feature: see https://github.com/ethereum/solidity/issues/4637
        uint256 _value; // default: 0
    }

    function current(Counter storage counter) internal view returns (uint256) {
        return counter._value;
    }

    function increment(Counter storage counter) internal {
        unchecked {
            counter._value += 1;
        }
    }

    function decrement(Counter storage counter) internal {
        uint256 value = counter._value;
        require(value > 0, "Counter: decrement overflow");
        unchecked {
            counter._value = value - 1;
        }
    }

    function reset(Counter storage counter) internal {
        counter._value = 0;
    }
}

// OpenZeppelin/utils/Strings.sol
/**
 * @dev String operations.
 */
library Strings {
    bytes16 private constant _HEX_SYMBOLS = "0123456789abcdef";

    /**
     * @dev Converts a `uint256` to its ASCII `string` decimal representation.
     */
    function toString(uint256 value) internal pure returns (string memory) {
        // Inspired by OraclizeAPI's implementation - MIT licence
        // https://github.com/oraclize/ethereum-api/blob/b42146b063c7d6ee1358846c198246239e9360e8/oraclizeAPI_0.4.25.sol

        if (value == 0) {
            return "0";
        }
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }

    /**
     * @dev Converts a `uint256` to its ASCII `string` hexadecimal representation.
     */
    function toHexString(uint256 value) internal pure returns (string memory) {
        if (value == 0) {
            return "0x00";
        }
        uint256 temp = value;
        uint256 length = 0;
        while (temp != 0) {
            length++;
            temp >>= 8;
        }
        return toHexString(value, length);
    }

    /**
     * @dev Converts a `uint256` to its ASCII `string` hexadecimal representation with fixed length.
     */
    function toHexString(uint256 value, uint256 length) internal pure returns (string memory) {
        bytes memory buffer = new bytes(2 * length + 2);
        buffer[0] = "0";
        buffer[1] = "x";
        for (uint256 i = 2 * length + 1; i > 1; --i) {
            buffer[i] = _HEX_SYMBOLS[value & 0xf];
            value >>= 4;
        }
        require(value == 0, "Strings: hex length insufficient");
        return string(buffer);
    }
}

// OpenZeppelin/utils/Address.sol
/**
 * @dev Collection of functions related to the address type
 */
library Address {
    /**
     * @dev Returns true if `account` is a contract.
     *
     * [IMPORTANT]
     * ====
     * It is unsafe to assume that an address for which this function returns
     * false is an externally-owned account (EOA) and not a contract.
     *
     * Among others, `isContract` will return false for the following
     * types of addresses:
     *
     *  - an externally-owned account
     *  - a contract in construction
     *  - an address where a contract will be created
     *  - an address where a contract lived, but was destroyed
     * ====
     *
     * [IMPORTANT]
     * ====
     * You shouldn't rely on `isContract` to protect against flash loan attacks!
     *
     * Preventing calls from contracts is highly discouraged. It breaks composability, breaks support for smart wallets
     * like Gnosis Safe, and does not provide security since it can be circumvented by calling from a contract
     * constructor.
     * ====
     */
    function isContract(address account) internal view returns (bool) {
        // This method relies on extcodesize/address.code.length, which returns 0
        // for contracts in construction, since the code is only stored at the end
        // of the constructor execution.

        return account.code.length > 0;
    }
}


// OpenZeppelin/utils/Context.sol
/**
 * @dev Provides information about the current execution context, including the
 * sender of the transaction and its data. While these are generally available
 * via msg.sender and msg.data, they should not be accessed in such a direct
 * manner, since when dealing with meta-transactions the account sending and
 * paying for execution may not be the actual sender (as far as an application
 * is concerned).
 *
 * This contract is only required for intermediate, library-like contracts.
 */
abstract contract Context {
    function _msgSender() internal view virtual returns (address) {
        return msg.sender;
    }

    function _msgData() internal view virtual returns (bytes calldata) {
        return msg.data;
    }
}

/**
 * @dev Contract module which provides a basic access control mechanism, where
 * there is an account (an owner) that can be granted exclusive access to
 * specific functions.
 *
 * By default, the owner account will be the one that deploys the contract. This
 * can later be changed with {transferOwnership}.
 *
 * This module is used through inheritance. It will make available the modifier
 * `onlyOwner`, which can be applied to your functions to restrict their use to
 * the owner.
 */
abstract contract Ownable is Context {
    address private _owner;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    /**
     * @dev Initializes the contract setting the deployer as the initial owner.
     */
    constructor() {
        _transferOwnership(_msgSender());
    }

    /**
     * @dev Returns the address of the current owner.
     */
    function owner() public view virtual returns (address) {
        return _owner;
    }

    /**
     * @dev Throws if called by any account other than the owner.
     */
    modifier onlyOwner() {
        require(owner() == _msgSender(), "Ownable: caller is not the owner");
        _;
    }

    /**
     * @dev Leaves the contract without owner. It will not be possible to call
     * `onlyOwner` functions anymore. Can only be called by the current owner.
     *
     * NOTE: Renouncing ownership will leave the contract without an owner,
     * thereby removing any functionality that is only available to the owner.
     */
    function renounceOwnership() public virtual onlyOwner {
        _transferOwnership(address(0));
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     * Can only be called by the current owner.
     */
    function transferOwnership(address newOwner) public virtual onlyOwner {
        require(newOwner != address(0), "Ownable: new owner is the zero address");
        _transferOwnership(newOwner);
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     * Internal function without access restriction.
     */
    function _transferOwnership(address newOwner) internal virtual {
        address oldOwner = _owner;
        _owner = newOwner;
        emit OwnershipTransferred(oldOwner, newOwner);
    }
}

contract ArrayCheck {

    uint256 internal BATCH_COUNT = 256;

    modifier checkArraySizeUint256(uint256[] memory x) {
        require(x.length > 0 && x.length <= BATCH_COUNT, "Too many elements in the array");
        _;
    }

    modifier checkArraySizeAddress(address[] memory x) {
        require(x.length > 0 && x.length <= BATCH_COUNT, "Too many elements in the array");
        _;
    }

    modifier checkArraySizeString(string[] memory x) {
        require(x.length > 0 && x.length <= BATCH_COUNT, "Too many elements in the array");
        _;
    }

    modifier checkArraySize1(uint256 len1) {
        require(len1 > 0 && len1 <= BATCH_COUNT, "The size of These Arrays must be equal");
        _;
    }

    modifier checkArraySize2(uint256 len1, uint256 len2) {
        require(len1 > 0 && len1 <= BATCH_COUNT && len1 == len2, "The size of These Arrays must be equal");
        _;
    }

    modifier checkArraySize3(uint256 len1, uint256 len2, uint256 len3) {
        require(len1 > 0 && len1 <= BATCH_COUNT && len1 == len2 && len2 == len3, "The size of These Arrays must be equal");
        _;
    }

    modifier checkArraySize4(uint256 len1, uint256 len2, uint256 len3, uint256 len4) {
        require(len1 > 0 && len1 <= BATCH_COUNT && len1 == len2 && len2 == len3 && len3 == len4, "The size of These Arrays must be equal");
        _;
    }

    modifier checkArraySize5(uint256 len1, uint256 len2, uint256 len3, uint256 len4, uint256 len5) {
        require(len1 > 0 && len1 <= BATCH_COUNT && len1 == len2 && len2 == len3 && len3 == len4 && len4 == len5, "The size of These Arrays must be equal");
        _;
    }

    modifier checkArraySize6(uint256 len1, uint256 len2, uint256 len3, uint256 len4, uint256 len5, uint256 len6) {
        require(len1 > 0 && len1 <= BATCH_COUNT && len1 == len2 && len2 == len3 && len3 == len4 && len4 == len5 && len5 == len6, "The size of These Arrays must be equal");
        _;
    }

    modifier checkArraySize7(uint256 len1, uint256 len2, uint256 len3, uint256 len4, uint256 len5, uint256 len6, uint256 len7) {
        require(len1 > 0 && len1 <= BATCH_COUNT && len1 == len2 && len2 == len3 && len3 == len4 && len4 == len5 && len5 == len6 && len6 == len7, "The size of These Arrays must be equal");
        _;
    }
}

contract Admin is Ownable, ArrayCheck {
    mapping(address => bool) private _admins;

    modifier onlyAdmin() {
        /*
        if (!_admins[msg.sender]) {
            console.log("onlyAdmin", address(this), msg.sender);
        }
        */
        require(_admins[msg.sender], "Only admin can call it");
        _;
    }
    
    constructor(){
        _admins[msg.sender] = true;
        // console.log("addAdmin", address(this), msg.sender);
    }

    function addAdmins(address[] memory admins_) public onlyOwner checkArraySizeAddress(admins_) {
        for (uint256 i = 0; i < admins_.length; i++) {
            addAdmin(admins_[i]);
        }
    }

    function delAdmins(address[] memory admins_) public onlyOwner checkArraySizeAddress(admins_) {
        for (uint256 i = 0; i < admins_.length; i++) {
            delAdmin(admins_[i]);
        }
    }

    function addAdmin(address admin_) public onlyOwner {
        _admins[admin_] = true;
        // console.log("addAdmin", address(this), _admin);
    }

    function delAdmin(address admin_) public onlyOwner {
        _admins[admin_] = false;
        // console.log("delAdmin", address(this), _admin);
    }

    function isAdmin(address _addr) public view returns (bool) {
        return _admins[_addr];
    }
}

contract Program is Admin {
    mapping(address => bool) private _programs;

    modifier onlyProgram() {
        require(_programs[msg.sender], "Only program can call it");
        _;
    }

    function addPrograms(address[] memory programs_) public onlyOwner checkArraySizeAddress(programs_) {
        for (uint256 i = 0; i < programs_.length; i++) {
            addProgram(programs_[i]);
        }
    }

    function delPrograms(address[] memory programs_) public onlyOwner checkArraySizeAddress(programs_) {
        for (uint256 i = 0; i < programs_.length; i++) {
            delProgram(programs_[i]);
        }
    }

    function addProgram(address _program) public onlyOwner {
        _programs[_program] = true;
    }

    function delProgram(address program_) public onlyOwner {
        _programs[program_] = false;
    }

    function isProgram(address program_) public view returns (bool) {
        return _programs[program_];
    }
}

contract Minable is Ownable, ArrayCheck {
    mapping(address => bool) private _minters;

    /**
     * @dev Throws if called by any account other than the owner.
     */
    modifier onlyMiner() {
        require(_minters[msg.sender], "!miner");
        _;
    }

    function addMinters(address[] memory minters_) public onlyOwner checkArraySizeAddress(minters_) {
        for (uint256 i = 0; i < minters_.length; i++) {
            addMinter(minters_[i]);
        }
    }

    function delMinters(address[] memory minters_) public onlyOwner checkArraySizeAddress(minters_) {
        for (uint256 i = 0; i < minters_.length; i++) {
            removeMinter(minters_[i]);
        }
    }

    function addMinter(address minter_) public onlyOwner {
        _minters[minter_] = true;
    }

    function removeMinter(address minter_) public onlyOwner {
        _minters[minter_] = false;
    }
}

/**
 * @dev Implementation of the {IERC165} interface.
 *
 * Contracts that want to implement ERC165 should inherit from this contract and override {supportsInterface} to check
 * for the additional interface id that will be supported. For example:
 *
 * ```solidity
 * function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool) {
 *     return interfaceId == type(MyInterface).interfaceId || super.supportsInterface(interfaceId);
 * }
 * ```
 *
 * Alternatively, {ERC165Storage} provides an easier to use but more expensive implementation.
 */
abstract contract ERC165 is IERC165 {
    /**
     * @dev See {IERC165-supportsInterface}.
     */
    function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool) {
        return interfaceId == type(IERC165).interfaceId;
    }
}

/**
 * @dev Implementation of https://eips.ethereum.org/EIPS/eip-721[ERC721] Non-Fungible Token Standard, including
 * the Metadata extension, but not including the Enumerable extension, which is available separately as
 * {ERC721Enumerable}.
 */
contract ERC721Token is Context, ERC165, IERC721, IERC721Metadata {
	using Strings for uint256;
	using Address for address;
	using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;
    
    // Token name
    string private _name;
    
    // Token symbol
    string private _symbol;
    
    // Mapping from token ID to owner address
    mapping(uint256 => address) private _owners;
    
    // Mapping from token ID to URI
    mapping(uint256 => bytes) private _uris;
    
    // Mapping owner address to token count
    mapping(address => uint256) private _balances;
    
    // Mapping from token ID to approved address
    mapping(uint256 => address) private _tokenApprovals;
    
    // Mapping from owner to operator approvals
    mapping(address => mapping(address => bool)) private _operatorApprovals;
    
    /**
    * @dev Initializes the contract by setting a `name` and a `symbol` to the token collection.
    */
    constructor(string memory name_, string memory symbol_) {
    	_name = name_;
    	_symbol = symbol_;
    }
    
    /**
    * @dev See {IERC165-supportsInterface}.
    */
    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC165, IERC165) returns (bool) {
    	return
    	interfaceId == type(IERC721).interfaceId ||
    		interfaceId == type(IERC721Metadata).interfaceId ||
    		super.supportsInterface(interfaceId);
    }
    
    /**
    * @dev See {IERC721-balanceOf}.
    */
    function balanceOf(address owner) public view virtual override returns (uint256) {
    	require(owner != address(0), "ERC721: balance query for the zero address");
    	return _balances[owner];
    }
    
    /**
    * @dev See {IERC721-ownerOf}.
    */
    function ownerOf(uint256 tokenId) public view virtual override returns (address) {
    	address owner = _owners[tokenId];
    	require(owner != address(0), "ERC721: owner query for nonexistent token");
    	return owner;
    }
    
    /**
    * @dev See {IERC721Metadata-name}.
    */
    function name() public view virtual override returns (string memory) {
    	return _name;
    }
    
    /**
    * @dev See {IERC721Metadata-symbol}.
    */
    function symbol() public view virtual override returns (string memory) {
    	return _symbol;
    }
    
    /**
    * @dev See {IERC721Metadata-name}.
    */
    function totalSupply() public view returns (uint256) {
    	return _tokenIdCounter.current();
    }
    
    function uri(uint256 tokenId) public view returns (string memory) {
        return string(_uris[tokenId]);
    }
    
    /**
    * @dev See {IERC721Metadata-tokenURI}.
    */
    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
    	require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");
    
    	string memory baseURI = _baseURI();
    	string memory _uri = uri(tokenId);
    	return bytes(baseURI).length > 0 ? string(abi.encodePacked(baseURI, tokenId.toString(), ".json?", _uri)) : _uri;
    }
    
    /**
    * @dev Base URI for computing {tokenURI}. If set, the resulting URI for each
    * token will be the concatenation of the `baseURI` and the `tokenId`. Empty
    * by default, can be overridden in child contracts.
    */
    function _baseURI() internal view virtual returns (string memory) {
    	return "";
    }
    
    /**
    * @dev See {IERC721-approve}.
    */
    function approve(address to, uint256 tokenId) public virtual override {
    	address owner = ownerOf(tokenId);
    	require(to != owner, "ERC721: approval to current owner");
    
    	require(
    		_msgSender() == owner || isApprovedForAll(owner, _msgSender()),
    		"ERC721: approve caller is not owner nor approved for all"
    	);
    
    	_approve(to, tokenId);
    }
    
    /**
    * @dev See {IERC721-getApproved}.
    */
    function getApproved(uint256 tokenId) public view virtual override returns (address) {
    	require(_exists(tokenId), "ERC721: approved query for nonexistent token");
    
    	return _tokenApprovals[tokenId];
    }
    
    /**
    * @dev See {IERC721-setApprovalForAll}.
    */
    function setApprovalForAll(address operator, bool approved) public virtual override {
    	_setApprovalForAll(_msgSender(), operator, approved);
    }
    
    /**
    * @dev See {IERC721-isApprovedForAll}.
    */
    function isApprovedForAll(address owner, address operator) public view virtual override returns (bool) {
    	return _operatorApprovals[owner][operator];
    }
    
    /**
    * @dev See {IERC721-transferFrom}.
    */
    function transferFrom(
    	address from,
    	address to,
    	uint256 tokenId
    ) public virtual override {
    	//solhint-disable-next-line max-line-length
    	require(_isApprovedOrOwner(_msgSender(), tokenId), "ERC721: transfer caller is not owner nor approved");
    
    	_transfer(from, to, tokenId);
    }
    
    /**
    * @dev See {IERC721-safeTransferFrom}.
    */
    function safeTransferFrom(
    	address from,
    	address to,
    	uint256 tokenId
    ) public virtual override {
    	safeTransferFrom(from, to, tokenId, "");
    }
    
    /**
    * @dev See {IERC721-safeTransferFrom}.
    */
    function safeTransferFrom(
    	address from,
    	address to,
    	uint256 tokenId,
    	bytes memory _data
    ) public virtual override {
    	require(_isApprovedOrOwner(_msgSender(), tokenId), "ERC721: transfer caller is not owner nor approved");
    	_safeTransfer(from, to, tokenId, _data);
    }
    
    /**
    * @dev Safely transfers `tokenId` token from `from` to `to`, checking first that contract recipients
    * are aware of the ERC721 protocol to prevent tokens from being forever locked.
    *
    * `_data` is additional data, it has no specified format and it is sent in call to `to`.
    *
    * This internal function is equivalent to {safeTransferFrom}, and can be used to e.g.
    * implement alternative mechanisms to perform token transfer, such as signature-based.
    *
    * Requirements:
    *
    * - `from` cannot be the zero address.
    * - `to` cannot be the zero address.
    * - `tokenId` token must exist and be owned by `from`.
    * - If `to` refers to a smart contract, it must implement {IERC721Receiver-onERC721Received}, which is called upon a safe transfer.
    *
    * Emits a {Transfer} event.
    */
    function _safeTransfer(
    	address from,
    	address to,
    	uint256 tokenId,
    	bytes memory _data
    ) internal virtual {
    	_transfer(from, to, tokenId);
    	require(_checkOnERC721Received(from, to, tokenId, _data), "ERC721: transfer to non ERC721Receiver implementer");
    }
    
    /**
    * @dev Returns whether `tokenId` exists.
    *
    * Tokens can be managed by their owner or approved accounts via {approve} or {setApprovalForAll}.
    *
    * Tokens start existing when they are minted (`_mint`),
    * and stop existing when they are burned (`_burn`).
    */
    function _exists(uint256 tokenId) internal view virtual returns (bool) {
    	return _owners[tokenId] != address(0);
    }
    
    /**
    * @dev Returns whether `spender` is allowed to manage `tokenId`.
    *
    * Requirements:
    *
    * - `tokenId` must exist.
    */
    function _isApprovedOrOwner(address spender, uint256 tokenId) internal view virtual returns (bool) {
    	require(_exists(tokenId), "ERC721: operator query for nonexistent token");
    	address owner = ownerOf(tokenId);
    	return (spender == owner || getApproved(tokenId) == spender || isApprovedForAll(owner, spender));
    }
    
    function _safeMint(address to) internal virtual returns (uint256) {
    	return _safeMint(to, "");
    }
    
    function _safeMint(address to, bytes memory _data) internal virtual returns (uint256) {
    	_tokenIdCounter.increment();
    	uint256 tokenId = _tokenIdCounter.current();
    	_safeMint(to, tokenId, _data);
    	return tokenId;
    }
    
    /**
    * @dev Safely mints `tokenId` and transfers it to `to`.
    *
    * Requirements:
    *
    * - `tokenId` must not exist.
    * - If `to` refers to a smart contract, it must implement {IERC721Receiver-onERC721Received}, which is called upon a safe transfer.
    *
    * Emits a {Transfer} event.
    */
    function _safeMint(address to, uint256 tokenId) internal virtual {
    	_safeMint(to, tokenId, "");
    }
    
    /**
    * @dev Same as {xref-ERC721-_safeMint-address-uint256-}[`_safeMint`], with an additional `data` parameter which is
    * forwarded in {IERC721Receiver-onERC721Received} to contract recipients.
    */
    function _safeMint(
    	address to,
    	uint256 tokenId,
    	bytes memory _data
    ) internal virtual {
    	_mint(to, tokenId, _data);
    	require(
    		_checkOnERC721Received(address(0), to, tokenId, _data),
    		"ERC721: transfer to non ERC721Receiver implementer"
    	);
    }
    
    /**
    * @dev Mints `tokenId` and transfers it to `to`.
    *
    * WARNING: Usage of this method is discouraged, use {_safeMint} whenever possible
    *
    * Requirements:
    *
    * - `tokenId` must not exist.
    * - `to` cannot be the zero address.
    *
    * Emits a {Transfer} event.
    */
    function _mint(address to, uint256 tokenId, bytes memory _data) internal virtual {
    	require(to != address(0), "ERC721: mint to the zero address");
    	require(!_exists(tokenId), "ERC721: token already minted");
    
    	_beforeTokenTransfer(address(0), to, tokenId);
    
    	_balances[to] += 1;
    	_owners[tokenId] = to;
    	_uris[tokenId] = _data;
    
    	emit Transfer(address(0), to, tokenId);
    
    	_afterTokenTransfer(address(0), to, tokenId);
    }
    
    /**
    * @dev Destroys `tokenId`.
    * The approval is cleared when the token is burned.
    *
    * Requirements:
    *
    * - `tokenId` must exist.
    *
    * Emits a {Transfer} event.
    */
    function _burn(uint256 tokenId) internal virtual {
    	address owner = ownerOf(tokenId);
    
    	_beforeTokenTransfer(owner, address(0), tokenId);
    
    	// Clear approvals
    	_approve(address(0), tokenId);
    
    	_balances[owner] -= 1;
    	delete _owners[tokenId];
    
    	emit Transfer(owner, address(0), tokenId);
    
    	_afterTokenTransfer(owner, address(0), tokenId);
    }
    
    /**
    * @dev Transfers `tokenId` from `from` to `to`.
    *  As opposed to {transferFrom}, this imposes no restrictions on msg.sender.
    *
    * Requirements:
    *
    * - `to` cannot be the zero address.
    * - `tokenId` token must be owned by `from`.
    *
    * Emits a {Transfer} event.
    */
    function _transfer(
    	address from,
    	address to,
    	uint256 tokenId
    ) internal virtual {
    	require(ownerOf(tokenId) == from, "ERC721: transfer from incorrect owner");
    	require(to != address(0), "ERC721: transfer to the zero address");
    
    	_beforeTokenTransfer(from, to, tokenId);
    
    	// Clear approvals from the previous owner
    	_approve(address(0), tokenId);
    
    	_balances[from] -= 1;
    	_balances[to] += 1;
    	_owners[tokenId] = to;
    
    	emit Transfer(from, to, tokenId);
    
    	_afterTokenTransfer(from, to, tokenId);
    }
    
    /**
    * @dev Approve `to` to operate on `tokenId`
    *
    * Emits a {Approval} event.
    */
    function _approve(address to, uint256 tokenId) internal virtual {
    	_tokenApprovals[tokenId] = to;
    	emit Approval(ownerOf(tokenId), to, tokenId);
    }
    
    /**
    * @dev Approve `operator` to operate on all of `owner` tokens
    *
    * Emits a {ApprovalForAll} event.
    */
    function _setApprovalForAll(
    	address owner,
    	address operator,
    	bool approved
    ) internal virtual {
    	require(owner != operator, "ERC721: approve to caller");
    	_operatorApprovals[owner][operator] = approved;
    	emit ApprovalForAll(owner, operator, approved);
    }
    
    /**
    * @dev Internal function to invoke {IERC721Receiver-onERC721Received} on a target address.
    * The call is not executed if the target address is not a contract.
    *
    * @param from address representing the previous owner of the given token ID
    * @param to target address that will receive the tokens
    * @param tokenId uint256 ID of the token to be transferred
    * @param _data bytes optional data to send along with the call
    * @return bool whether the call correctly returned the expected magic value
    */
    function _checkOnERC721Received(
    	address from,
    	address to,
    	uint256 tokenId,
    	bytes memory _data
    ) private returns (bool) {
    	if (to.isContract()) {
    		try IERC721Receiver(to).onERC721Received(_msgSender(), from, tokenId, _data) returns (bytes4 retval) {
    			return retval == IERC721Receiver.onERC721Received.selector;
    		} catch (bytes memory reason) {
    			if (reason.length == 0) {
    				revert("ERC721: transfer to non ERC721Receiver implementer");
    			} else {
    				assembly {
    					revert(add(32, reason), mload(reason))
    				}
    			}
    		}
    	} else {
    		return true;
    	}
    }
    
    /**
    * @dev Hook that is called before any token transfer. This includes minting
    * and burning.
    *
    * Calling conditions:
    *
    * - When `from` and `to` are both non-zero, ``from``'s `tokenId` will be
    * transferred to `to`.
    * - When `from` is zero, `tokenId` will be minted for `to`.
    * - When `to` is zero, ``from``'s `tokenId` will be burned.
    * - `from` and `to` are never both zero.
    *
    * To learn more about hooks, head to xref:ROOT:extending-contracts.adoc#using-hooks[Using Hooks].
    */
    function _beforeTokenTransfer(
    	address from,
    	address to,
    	uint256 tokenId
    ) internal virtual {}
    
    /**
    * @dev Hook that is called after any transfer of tokens. This includes
    * minting and burning.
    	*
    	* Calling conditions:
    	*
    	* - when `from` and `to` are both non-zero.
    	* - `from` and `to` are never both zero.
    	*
    	* To learn more about hooks, head to xref:ROOT:extending-contracts.adoc#using-hooks[Using Hooks].
    	*/
    function _afterTokenTransfer(
    	address from,
    	address to,
    	uint256 tokenId
    ) internal virtual {}
}

abstract contract ERC721TokenMinable is IERC721TokenMinable, ERC721Token, Minable, Program {
	constructor (string memory name, string memory symbol) ERC721Token(name, symbol) {
	}

	function mint(address to, bytes memory _data) public override onlyMiner returns (uint256) {
		return _safeMint(to, _data);
	}

	function mint(uint256 len, address to) public override onlyMiner returns (uint256[] memory) {
		return mint(len, to, bytes(""));
	}

	function mint(address to) public override onlyMiner returns (uint256) {
		return mint(to, bytes(""));
	}

	function mint(uint256 len, address to, string memory _data) public onlyMiner returns (uint256[] memory) {
		return mint(len, to, bytes(_data));
	}

	function mint(address to, string memory _data) public onlyMiner returns (uint256) {
		return mint(to, bytes(_data));
	}

	function mint(uint256 len, address to, bytes[] memory _data) public override onlyMiner checkArraySize1(_data.length) returns (uint256[] memory) {
		uint256[] memory ids = new uint256[](len);
		for (uint256 i = 0; i < len; i++) {
			ids[i] = mint(to, _data[i]);
		}
		return ids;
	}

	function mint(uint256 len, address[] memory to, bytes[] memory _data) public override onlyMiner checkArraySize2(to.length, _data.length) returns (uint256[] memory) {
		uint256[] memory ids = new uint256[](len);
		for (uint256 i = 0; i < len; i++) {
			ids[i] = mint(to[i], _data[i]);
		}
		return ids;
	}

	function mint(uint256 len, address to, bytes memory _data) public override onlyMiner returns (uint256[] memory) {
		uint256[] memory ids = new uint256[](len);
		for (uint256 i = 0; i < len; i++) {
			ids[i] = mint(to, _data);
		}
		return ids;
	}

	function mint(uint256 len, address to, string[] memory _data) public onlyMiner checkArraySize1(_data.length) returns (uint256[] memory) {
		uint256[] memory ids = new uint256[](len);
		for (uint256 i = 0; i < len; i++) {
			ids[i] = mint(to, _data[i]);
		}
		return ids;
	}

	function mint(uint256 len, address[] memory to, string[] memory _data) public onlyMiner checkArraySize2(to.length, _data.length) returns (uint256[] memory) {
		uint256[] memory ids = new uint256[](len);
		for (uint256 i = 0; i < len; i++) {
			ids[i] = mint(to[i], _data[i]);
		}
		return ids;
	}
}

abstract contract MetaRaceERC721TokenMinable is ERC721TokenMinable {
    IERC721BeforeTransfer private _beforeTransfer;
    IERC721AfterTransfer private _afterTransfer;
    
    string private baseURI_ = "https://metarace.io/ipfs/"; 

    constructor(string memory name_, string memory symbol_) ERC721TokenMinable(name_, symbol_) {}

    function registerTransferHandler(address beforehandler, address afterhandler) public onlyAdmin {
        _beforeTransfer = IERC721BeforeTransfer(beforehandler);
        _afterTransfer = IERC721AfterTransfer(afterhandler);
    }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId)
        internal
        override(ERC721Token)
    {
        if (address(_beforeTransfer) != address(0))
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
    
    /**
    * @dev Base URI for computing {tokenURI}. If set, the resulting URI for each
    * token will be the concatenation of the `baseURI` and the `tokenId`. Empty
    * by default, can be overridden in child contracts.
    */
    function _baseURI() internal view override(ERC721Token) returns (string memory) {
    	return baseURI_;
    }
    
    function baseURI() public view returns (string memory) {
    	return _baseURI();
    }
    
    // Because the NFT list and NFT MetaData can't be confirmed at first, so we need to set ipfs baseURI later.
    function setBaseURI(string memory uri) public onlyAdmin {
        baseURI_ = uri;
    }
}

contract MetaRaceHorseNFT is MetaRaceERC721TokenMinable {
    constructor() MetaRaceERC721TokenMinable("MetaRace Horse NFT", "HORSE") {}
}
