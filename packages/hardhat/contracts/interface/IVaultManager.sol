pragma solidity ^0.8.17;

import { IERC4626} from "@openzeppelin/contracts/interfaces/IERC4626.sol";
interface IVaultManager{
    // @notice This function executes a trade between the collateralized asset and the synthetic asset.
    function exchange (address asset_, uint256 amount_) external payable returns (bool);
}