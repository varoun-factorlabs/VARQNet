// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import { ERC20 } from '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import { IERC20 } from '@openzeppelin/contracts/interfaces/IERC20.sol';
import { ERC4626 } from '@openzeppelin/contracts/token/ERC20/extensions/ERC4626.sol';
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import '@openzeppelin/contracts/utils/math/Math.sol';

contract MockERC20 is ERC20, Ownable {
    constructor(string memory name_, string memory symbol_) ERC20(name_, symbol_) {
        _mint(msg.sender, 10 ether);
    }

    function mint(address to, uint256 amount) external onlyOwner{
        _mint(to, amount);
    }

    function burnFrom (address account, uint256 amount) external onlyOwner {
        _burn(account, amount);
    }
}
