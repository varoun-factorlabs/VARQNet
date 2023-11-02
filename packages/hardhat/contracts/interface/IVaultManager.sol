// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

interface IVaultManager {
    // @notice This function executes a trade between the collateralized asset and the synthetic asset using price premium.
    function exchange (address asset0, address asset1, uint256 amount0) external returns (address, uint256);

    // @notice This fucntion executes a trade between the collateralized assets the the two synethetic assets.
    function deposit (address asset0, uint256 amount0) external returns (address, uint256, address, uint256);

    function withdraw (address asset0, address asset1, uint256 amount0, uint256 amount1) external returns (address, uint256);


    function depositPrimary(uint256 amount) external (address, uint256, address, uint256);
    function withdrawPrimary(uint256 amount) external ();

    function depositSecondary(uint256 amount) external;
    function withdrawSecondary(uint256 amount) external;
}