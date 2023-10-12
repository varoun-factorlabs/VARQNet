// // SPDX-License-Identifier: MIT
// pragma solidity ^0.8.17;

// contract ContractRegistry {
//     mapping(string => address) private contracts;

//     // Events
//     event ContractAddressUpdated(string name, address indexed contractAddress);

//     // Constructor for initial addresses setup
//     constructor(
//         address _mock_USDC,
//         address _backed_bTTDC,
//         address _usdcFaucet,
//         address _bttdcFaucet,
//         address _vaulted_vTTDC,
//         address _vart,
//         address _vault
//     ) {
//         contracts["Mock_USDC"] = _mock_USDC;
//         contracts["ERC20_USDC_Faucet"] = _usdcFaucet;
//         contracts["ERC20_bTTDC_Faucet"] = _bttdcFaucet;
//         contracts["Backed_bTTDC"] = _backed_bTTDC;
//         contracts["Vaulted_vTTDC"] = _vaulted_vTTDC;
//         contracts["VART"] = _vart;
//         contracts["Vault"] = _vault;
//     }

//     // Functions to update individual addresses
//     function updateMock_USDC(address _address) external {
//         contracts["Mock_USDC"] = _address;
//         emit ContractAddressUpdated("Mock_USDC", _address);
//     }

//     function updateERC20_USDC_Faucet(address _address) external {
//         contracts["ERC20_USDC_Faucet"] = _address;
//         emit ContractAddressUpdated("ERC20_USDC_Faucet", _address);
//     }

//     function updateERC20_bTTDC_Faucet(address _address) external {
//         contracts["ERC20_bTTDC_Faucet"] = _address;
//         emit ContractAddressUpdated("ERC20_bTTDC_Faucet", _address);
//     }

//     function updateBacked_bTTDC(address _address) external {
//         contracts["Backed_bTTDC"] = _address;
//         emit ContractAddressUpdated("Backed_bTTDC", _address);
//     }

//     function updateVaulted_vTTDC(address _address) external {
//         contracts["Vaulted_vTTDC"] = _address;
//         emit ContractAddressUpdated("Vaulted_vTTDC", _address);
//     }

//     function updateVART(address _address) external {
//         contracts["VART"] = _address;
//         emit ContractAddressUpdated("VART", _address);
//     }

//     function updateVault(address _address) external {
//         contracts["Vault"] = _address;
//         emit ContractAddressUpdated("Vault", _address);
//     }

//     // Bulk update for all addresses
//     function bulkUpdateAddresses(
//         address _mock_USDC,
//         address _usdcFaucet,
//         address _bttdcFaucet,
//         address _backed_bTTDC,
//         address _vaulted_vTTDC,
//         address _vart,
//         address _vault
//     ) external {
//         contracts["Mock_USDC"] = _mock_USDC;
//         contracts["ERC20_USDC_Faucet"] = _usdcFaucet;
//         contracts["ERC20_bTTDC_Faucet"] = _bttdcFaucet;
//         contracts["Backed_bTTDC"] = _backed_bTTDC;
//         contracts["Vaulted_vTTDC"] = _vaulted_vTTDC;
//         contracts["VART"] = _vart;
//         contracts["Vault"] = _vault;

//         emit ContractAddressUpdated("Mock_USDC", _mock_USDC);
//         emit ContractAddressUpdated("ERC20_USDC_Faucet", _usdcFaucet);
//         emit ContractAddressUpdated("ERC20_bTTDC_Faucet", _bttdcFaucet);
//         emit ContractAddressUpdated("Backed_bTTDC", _backed_bTTDC);
//         emit ContractAddressUpdated("Vaulted_vTTDC", _vaulted_vTTDC);
//         emit ContractAddressUpdated("VART", _vart);
//         emit ContractAddressUpdated("Vault", _vault);
//     }

//     // Functions to retrieve the addresses
//     function getMock_USDC() external view returns (address) {
//         return contracts["Mock_USDC"];
//     }

//     function getERC20_USDC_Faucet() external view returns (address) {
//         return contracts["ERC20_USDC_Faucet"];
//     }

//     function getERC20_bTTDC_Faucet() external view returns (address) {
//         return contracts["ERC20_bTTDC_Faucet"];
//     }

//     function getBacked_bTTDC() external view returns (address) {
//         return contracts["Backed_bTTDC"];
//     }

//     function getVaulted_vTTDC() external view returns (address) {
//         return contracts["Vaulted_vTTDC"];
//     }

//     function getVART() external view returns (address) {
//         return contracts["VART"];
//     }

//     function getVault() external view returns (address) {
//         return contracts["Vault"];
//     }
// }
