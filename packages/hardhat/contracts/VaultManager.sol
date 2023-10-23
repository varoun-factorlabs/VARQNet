// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.17;

import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { IERC20 } from "@openzeppelin/contracts/interfaces/IERC20.sol";
import { IERC4626 } from "@openzeppelin/contracts/interfaces/IERC4626.sol";
import { IVaultManager } from './interface/IVaultManager.sol';
import { Vault } from './Vault.sol';

contract VaultManager is IVaultManager, Ownable {
    // @notice The tokenized vault for the collateralized asset.
    IERC4626 public _tokenizedVault;
    // @notice The collateralized asset for the tokenized vault.
    IERC20 public _collateralizedAsset;

    // @notice The synthetic tokenized vault for the synthetic asset. 
    IERC4626 public _assetVault;
    // @notice The synthetic asset for the synthetic tokenized vault.
    IERC20 public _syntheticAsset;

    // @notice The mapping of collateralizable assets to their tokenized vaults.
    mapping(address => address) public _vaults;

    constructor (address collateral_, address asset_) Ownable () {
        _collateralizedAsset = new Vault(IERC20(collateral_));
        _syntheticAsset = new Vault(IERC20(asset_));
    }

    /**
     * @notice Exchange assets 
     * @param asset_ The address of the asset to withdraw.
     * @param amount_ The amount of the asset to withdraw.
     */
    function exchange (address asset_, uint256 amount_) public payable returns (bool) {
        // @todo Get the vault for the asset.
        // @todo Get the share price of the collateral vault
        // @todo Get the share price fo the synthetic vault
        // @todo Transfer from the sender to the collateral vault
        // @todo Transfer from the sender to the synthetic vault
    }
}