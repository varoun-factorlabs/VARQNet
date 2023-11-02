// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.17;

import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import { IERC4626 } from "@openzeppelin/contracts/interfaces/IERC4626.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { IVaultManager } from './interface/IVaultManager.sol';
import { IFaucet } from './interface/IFaucet.sol';
import { MockERC20 } from "./Vault.sol";

contract VaultManager is Ownable, IVaultManager, IFaucet {
    uint256 private constant FAUCET_COLLATERAL_MAX = 1 ether;
    // @notice The tokenized vault for the collateralized asset.
    MockERC20 public _tokenizedVault;
    // @notice The collateralized asset for the tokenized vault.
    MockERC20 public _collateralizedAsset;
    // @notice The synthetic tokenized vault for the synthetic asset. 
    MockERC20 public _assetVault;
    // @notice The synthetic asset for the synthetic tokenized vault.
    MockERC20 public _syntheticAsset;

    // @notice The mapping of collateralizable assets to their tokenized vaults.
    mapping(address => address) public _vaulted;

    constructor (address collateral_, address asset_) Ownable () {
        _collateralizedAsset = MockERC20(collateral_);
        _syntheticAsset = MockERC20(asset_);
        _vaulted[collateral_] = address(new MockERC20("Vaulted Collateral", "VART"));
        _vaulted[asset_] = address(new MockERC20("Vaulted Asset", "vTTDC"));
        initialize();
    }

    function initialize () internal onlyOwner {
        // @note Mint the initial supply of ERC20 assets for the faucet
    }

    /**
     * @notice Exchange assets, this function is used to exchange collateral
     * for the synthetic asset, leveraging an existing pool for the synthetic
     * asset and underlying collateralized synthetic asset.
     * @param asset0 The address of the asset to deposit.
     * @param asset1 The address of the asset to withdraw.
     * @param amount0 The amount of the asset to deposit.
     */
    function exchange (address asset0, address asset1, uint256 amount0) external override returns (address, uint256) {
        return (asset0, amount0);
    }

    

    /**
     * @notice Tap the faucet in order to mint synthetic assets, this function 
     * is only meant to mint the collateralizable assets and will not mint 
     * the underlying synthetic assets.
     * @param asset0 The address of the asset to deposit.
     * @param amount0 The amount of the asset to deposit.
     */
    function tap (address asset0, uint256 amount0) external override returns (bool) {
        require(MockERC20(asset0).balanceOf(msg.sender) + amount0 <= FAUCET_COLLATERAL_MAX, "Insufficient Balance");
        return MockERC20(asset0).transfer(msg.sender, amount0);
    }
}