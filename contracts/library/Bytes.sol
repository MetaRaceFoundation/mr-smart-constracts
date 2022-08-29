// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

library Bytes {
    function BytesToUint256(bytes memory b) internal pure returns (uint256){
        uint256 number;
        for (uint i = 0; i < b.length; i++) {
            number = number + uint8(b[i]) * (2 ** (8 * (b.length - (i + 1))));
        }
        return number;
    }

    function BytesToString(bytes memory source) internal pure returns (string memory result) {
        return string(source);
    }

    function BytesToAddress(bytes memory bys) internal pure returns (address addr){
        assembly {
            addr := mload(add(bys, 20))
        }
    }

    function Decode(bytes memory signedString, string memory d) public pure returns (address){
        bytes32 r = bytesToBytes32(slice(signedString, 0, 32));
        bytes32 s = bytesToBytes32(slice(signedString, 32, 32));
        uint8 v = uint8(signedString[64]);
        bytes32 dd = keccak256(abi.encodePacked(d));
        return ecrecoverDecode(r, s, v, dd);
    }

    function slice(bytes memory data, uint start, uint len) internal pure returns (bytes memory){
        bytes memory b = new bytes(len);
        for (uint i = 0; i < len; i++) {
            b[i] = data[i + start];
        }
        return b;
    }

    function ecrecoverDecode(bytes32 r, bytes32 s, uint8 v1, bytes32 d) internal pure returns (address addr){
        uint8 v = uint8(v1);
        if (v == 0 || v == 1) {
            v = v+27;
        }
        addr = ecrecover(d, v, r, s);
    }

    function bytesToBytes32(bytes memory source) internal pure returns (bytes32 result){
        assembly{
            result := mload(add(source, 32))
        }
    }
}
