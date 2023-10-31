// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import { ERC20 } from '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import { IERC20 } from '@openzeppelin/contracts/interfaces/IERC20.sol';
import { ERC4626 } from '@openzeppelin/contracts/token/ERC20/extensions/ERC4626.sol';

contract Vault is ERC4626 {

    constructor (IERC20 asset_) ERC4626(asset_)  ERC20("Vault Access Reserve Token", "VART") {
        _mint(msg.sender, 1 ether);
    }

    function convertToShares(uint256 assets) public view virtual override returns (uint256) {
        return assets;
    }
}

contract VaultedTTD is ERC4626 {

    constructor (IERC20 asset_) ERC4626(asset_)  ERC20("Vaulted TTD", "vTTDC") {
        _mint(msg.sender, 1 ether);
    }

    function convertToShares(uint256 assets) public view virtual override returns (uint256) {
        return assets;
    }
} 