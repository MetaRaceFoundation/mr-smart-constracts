// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;
pragma experimental ABIEncoderV2;

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

interface IERC20 {
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address to, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
}

interface IERC20Metadata {
    function name() external view returns (string memory);
    function symbol() external view returns (string memory);
    function decimals() external view returns (uint8);
}

interface IERC20Token is IERC20, IERC20Metadata {
    
}

interface IERC20TokenMinable is IERC20Token {
    function mint(address recipient, uint amount) external returns (bool);
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

interface IRaceBonusDistribute {
    function distribute(address _raceCourse, uint256[] memory _tokenIds, uint256 _money) external returns (uint256,address[] memory, uint256[] memory);
}

interface IRaceBonusPool {
    function distribute(address _raceCourse, uint256[] memory _tokenIds, uint256 _money, uint256 count, address[] memory lstAddress, uint256[] memory lstAmount) external;
    function claim(uint256 nft_id) external;
}