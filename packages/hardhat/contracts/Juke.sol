// contracts/Juke.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Juke is ERC20, Ownable {
    using SafeERC20 for IERC20;

    constructor(address _owner) ERC20("Juke", "JUKE") {
        transferOwnership(_owner);
        // mint some tokens for testing
        _mint(_owner, 1000000000000000000000000);
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    function burn(address from, uint256 amount) public onlyOwner {
        _burn(from, amount);
    }
}
