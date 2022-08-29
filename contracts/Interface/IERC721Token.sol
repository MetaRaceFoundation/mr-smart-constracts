// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

interface IERC721Token {

    /**
     * @dev Returns the number of NFTs in `owner`'s account.
     */
    function balanceOf(address owner) external view returns (uint256 balance);

    /**
     * @dev Returns the owner of the NFT specified by `tokenId`.
     */
    function ownerOf(uint256 tokenId) external view returns (address owner);

    /**
     * @dev Transfers a specific NFT (`tokenId`) from one account (`from`) to
     * another (`to`).
     *
     *
     *
     * Requirements:
     * - `from`, `to` cannot be zero.
     * - `tokenId` must be owned by `from`.
     * - If the caller is not `from`, it must be have been allowed to move this
     * NFT by either {approve} or {setApprovalForAll}.
     */
    function safeTransferFrom(address from, address to, uint256 tokenId) external;
    /**
     * @dev Transfers a specific NFT (`tokenId`) from one account (`from`) to
     * another (`to`).
     *
     * Requirements:
     * - If the caller is not `from`, it must be approved to move this NFT by
     * either {approve} or {setApprovalForAll}.
     */
    function transferFrom(address from, address to, uint256 tokenId) external;

    function approve(address to, uint256 tokenId) external;

    function getApproved(uint256 tokenId) external view returns (address operator);

    function setApprovalForAll(address operator, bool _approved) external;

    function isApprovedForAll(address owner, address operator) external view returns (bool);


    function safeTransferFrom(address from, address to, uint256 tokenId, bytes calldata data) external;

    function safeMint(address to) external returns (uint256);

    function safeMint(address to, uint256 tokenId) external returns (uint256);

    function exists(uint256 tokenId) external returns (bool);

    function mint(address to) external returns (uint256);
    function mint(address to, bytes memory _data) external returns (uint256);
    function mint(uint256 len, address to) external returns (uint256[] memory);
    function mint(uint256 len, address to, bytes memory _data) external returns (uint256[] memory);
    function mint(uint256 len, address to, bytes[] memory _data) external returns (uint256[] memory);
    function mint(uint256 len, address[] memory to, bytes[] memory _data) external returns (uint256[] memory);
}
