// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "./Auth.sol";

interface IERC20Token {
    function decimals() external view returns (uint);

    function totalSupply() external view returns (uint);

    function balanceOf(address account) external view returns (uint);

    function transfer(address recipient, uint amount) external returns (bool);

    function allowance(address owner, address spender) external view returns (uint);

    function approve(address spender, uint amount) external returns (bool);

    function transferFrom(address sender, address recipient, uint amount) external returns (bool);
}

library SafeERC20Token {
    using SafeMath for uint256;
    using Address for address;

    function safeTransfer(IERC20Token token, address to, uint256 value) internal {
        callOptionalReturn(token, abi.encodeWithSelector(token.transfer.selector, to, value));
    }

    function safeTransferFrom(IERC20Token token, address from, address to, uint256 value) internal {
        callOptionalReturn(token, abi.encodeWithSelector(token.transferFrom.selector, from, to, value));
    }

    /**
     * @dev Imitates a Solidity high-level call (i.e. a regular function call to a contract), relaxing the requirement
     * on the return value: the return value is optional (but if data is returned, it must not be false).
     * @param token The token targeted by the call.
     * @param data The call data (encoded using abi.encode or one of its variants).
     */
    function callOptionalReturn(IERC20Token token, bytes memory data) private {
        // We need to perform a low level call here, to bypass Solidity's return data size checking mechanism, since
        // we're implementing it ourselves.

        // A Solidity high level call has three parts:
        //  1. The target address is checked to verify it contains contract code
        //  2. The call itself is made, and success asserted
        //  3. The return value is decoded, which in turn checks the size of the returned data.
        // solhint-disable-next-line max-line-length
        require(address(token).isContract(), "SafeERC20: call to non-contract");

        // solhint-disable-next-line avoid-low-level-calls
        (bool success, bytes memory returndata) = address(token).call(data);

        require(success, "SafeERC20: low-level call failed");

        if (returndata.length > 0) {// Return data is optional
            // solhint-disable-next-line max-line-length
            require(abi.decode(returndata, (bool)), "SafeERC20: ERC20 operation did not succeed");
        }
    }
}

contract Coin is Program, MinterAble {
    using SafeMath for uint256;
    using SafeERC20Token for IERC20Token;

    mapping(uint256 => uint256) public priceOf;
    mapping(uint256 => address) public addressOf;


    /**
* @dev Add supported token symbols, addresses and prices
*/
    function add(uint256[] memory _coins, address[] memory _address, uint256[] memory _price) public onlyAdmin returns (bool) {
        require(_coins.length == _address.length && _coins.length == _price.length && _coins.length <= 256, "Invalid parameters");
        for (uint256 i = 0; i < _coins.length; i++) {
            uint256 coin = _coins[i];
            addressOf[coin] = _address[i];
            priceOf[coin] = _price[i];
        }
        return true;
    }

    /**
    * @dev Del supported token symbols, addresses and prices
    */
    function del(uint256[] memory _coins) public onlyAdmin returns (bool) {
        require(_coins.length > 0 && _coins.length <= 256, "Invalid parameters");
        for (uint256 i = 0; i < _coins.length; i++) {
            uint256 coin = _coins[i];
            delete priceOf[coin];
            delete addressOf[coin];
        }
        return true;
    }

    /**
    * @dev update token prices
    */
    function setPrice(uint256[] memory _coins, uint256[] memory _price) public onlyProgram returns (bool) {
        require(_coins.length == _price.length && _coins.length <= 256, "Invalid parameters");
        for (uint256 i = 0; i < _coins.length; i++) {
            uint256 coin = _coins[i];
            if (_price[i] != 0 && priceOf[coin] != 0) {
                priceOf[coin] = _price[i];
            }
        }
        return true;
    }

    /**
    * @dev Price conversion
    */
    function convert(uint256 _coinName, uint256 _usdAmount) public view returns (uint256) {
        uint256 _decimals = 10 ** IERC20Token(addressOf[_coinName]).decimals();
        return _decimals.mul(_usdAmount).div(priceOf[_coinName]);
    }

    function convert1(uint256 _coinName, uint256 _usdAmount) public view returns (uint256) {
        uint256 _decimals = 10 ** IERC20Token(addressOf[_coinName]).decimals();
        return _decimals.mul(_usdAmount);
    }

    /**
    * @dev Safe transfer from 'from' account to 'to' account
    */
    function safeTransferFrom(uint256 _coinName, address from, address to, uint256 value) public onlyMiner {
        require(addressOf[_coinName] != address(0), "Not supported coin!");
        IERC20Token(addressOf[_coinName]).safeTransferFrom(from, to, convert(_coinName, value));
    }

    function safeTransferFrom1(uint256 _coinName, address from, address to, uint256 value) public onlyMiner {
        require(addressOf[_coinName] != address(0), "Not supported coin!");
        IERC20Token(addressOf[_coinName]).safeTransferFrom(from, to, convert1(_coinName, value));
    }

    /**
    * @dev Safe transfer from 'this' account to 'to' account
    */
    function safeTransfer(uint256 _coinName, address to, uint256 value) public onlyMiner {
        require(addressOf[_coinName] != address(0), "Not supported coin!");
        IERC20Token(addressOf[_coinName]).safeTransfer(to, convert(_coinName, value));
    }

    function safeTransfer1(uint256 _coinName, address to, uint256 value) public onlyMiner {
        require(addressOf[_coinName] != address(0), "Not supported coin!");
        IERC20Token(addressOf[_coinName]).safeTransfer(to, convert1(_coinName, value));
    }

    function safeTransferWei(uint256 _coinName, address to, uint256 value) public onlyMiner {
        require(addressOf[_coinName] != address(0), "Not supported coin!");
        IERC20Token(addressOf[_coinName]).safeTransfer(to, value);
    }

    function balanceOf(uint256 _coinName, address account) public view returns (uint256){
        require(addressOf[_coinName] != address(0), "Not supported coin!");
        uint256 balance = IERC20Token(addressOf[_coinName]).balanceOf(account);
        return balance;
    }

    function decimals(uint256 _coinName) public view returns (uint) {
        require(addressOf[_coinName] != address(0), "Not supported coin!");
        uint d = IERC20Token(addressOf[_coinName]).decimals();
        return d;
    }
}
