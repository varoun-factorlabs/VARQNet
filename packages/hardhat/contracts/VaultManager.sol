// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.17;

import { IERC20 } from "@openzeppelin/contracts/interfaces/IERC20.sol";
import { IERC4626 } from "@openzeppelin/contracts/interfaces/IERC4626.sol";
import { IVaultManager } from './interface/IVaultManager.sol';
import { Vault } from './Vault.sol';
import { IFaucet } from './interface/IFaucet.sol';
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";

contract VaultManager is Ownable, IVaultManager, IFaucet {
    uint256 private constant FAUCET_COLLATERAL_MAX = 1 ether;
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
        _vaults[collateral_] = address(_collateralizedAsset);
        _vaults[asset_] = address(_syntheticAsset);
    }

    function initialize () internal onlyOwner {
        // @note Mint the initial supply of ERC20 assets for the faucet
        _collateralizedAsset.transferFrom(msg.sender, address(this), FAUCET_COLLATERAL_MAX);
        _syntheticAsset.transferFrom(msg.sender, address(this), FAUCET_COLLATERAL_MAX);
    }

    /**
     * @notice Exchange assets, this function is used to exchange collateral
     * for the synthetic asset, leveraging an existing pool for the synthetic
     * asset and underlying collateralized synthetic asset.
     * @param asset0 The address of the asset to deposit.
     * @param asset1 The address of the asset to withdraw.
     * @param amount0 The amount of the asset to deposit.
     */
    function exchange (address asset0, address asset1, uint256 amount0) external payable override returns (address, uint256) {
        // @note Get the vault for the asset.
        // @note Get the share price of the collateral vault
        uint256 asset1Balance = IERC20(asset1).balanceOf(msg.sender);
        uint256 amount1 = Vault(_vaults[asset0]).convertToShares(amount0);
        // @note Get the share price fo the synthetic vault
        Vault(_vaults[asset1]).convertToShares(amount0);
        // @note Transfer from the sender to the collateral vault
        IERC20(asset0).transferFrom(msg.sender, _vaults[asset0], amount0);
        Vault(_vaults[asset0]).mint(amount1, msg.sender);
        Vault(_vaults[asset1]).mint(amount1 * 7, msg.sender);
        // @note Validate that the sender has received the correct amount of synthetic assets.
        require(IERC20(asset1).balanceOf(msg.sender) - asset1Balance == amount0 * 7, "Transaction Error");
        // @todo Perform a swap between vaulted assets 
        return (asset0, amount0);
    }

    /**
     * @notice Deposit assets into the vault, this function is used to exchange 
     * collateral for the synthetic asset and the underlying collateralized synthetic
     * asset. E.g. USDC -> (Vart, vTTDC)
     * @param asset0 The address of the asset to deposit.
     * @param amount0 The amount of the asset to deposit.
     */
    function deposit (address asset0, uint256 amount0) external payable override returns (address, uint256, address, uint256) {
        // @todo Get the vault for the asset.
        // @todo Get the share price of the collateral vault
        // @todo Transfer from the sender to the collateral vault
        return (asset0, amount0, asset0, amount0);
    }

    /**
     * @notice Tap the faucet in order to mint synthetic assets, this function 
     * is only meant to mint the collateralizable assets and will not mint 
     * the underlying synthetic assets.
     * @param asset0 The address of the asset to deposit.
     * @param amount0 The amount of the asset to deposit.
     */
    function tap (address asset0, uint256 amount0) external override returns (bool) {
        require(IERC20(asset0).balanceOf(msg.sender) + amount0 <= FAUCET_COLLATERAL_MAX, "Insufficient Balance");
        return IERC20(asset0).transferFrom(address(this), msg.sender, amount0);
    }
}