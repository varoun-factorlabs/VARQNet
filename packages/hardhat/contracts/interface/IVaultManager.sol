// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

interface IVaultManager {
    // @notice This function executes a trade between the collateralized asset and the synthetic asset using price premium.
    function exchange (address asset0, address asset1, uint256 amount0) external payable returns (address, uint256);

    // @notice This fucntion executes a trade between the collateralized assets the the two synethetic assets.
    function deposit (address asset0, uint256 amount0) external payable returns (address, uint256, address, uint256);
}