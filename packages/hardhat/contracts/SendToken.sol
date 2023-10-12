

// interface IERC20 {
//     function transfer(address recipient, uint256 amount) external returns (bool);
//     function balanceOf(address account) external view returns (uint256);
// }

// contract SendToken {
//     address public designatedAddress_mUSDC;
//     address public designatedAddress_bTTDC;
//     IERC20 public mUSDC;
//     IERC20 public bTTDC;
//     address public owner;
//     bool public isInitialized = false;

//     constructor(address _owner) {
//         owner = _owner;
//     }

//     modifier onlyOwner() {
//         require(msg.sender == owner, "Not the contract owner");
//         _;
//     }

//     modifier notInitialized() {
//         require(!isInitialized, "Contract is already initialized");
//         _;
//     }

//     function initialize(
//         address _designatedAddress_mUSDC, 
//         address _designatedAddress_bTTDC, 
//         address _mUSDC, 
//         address _bTTDC
//     ) external onlyOwner notInitialized {
//         designatedAddress_mUSDC = _designatedAddress_mUSDC;
//         designatedAddress_bTTDC = _designatedAddress_bTTDC;
//         mUSDC = IERC20(_mUSDC);
//         bTTDC = IERC20(_bTTDC);
//         isInitialized = true;
//     }

//     function disperseFunds() external {
//         require(isInitialized, "Contract is not initialized");

//         // Send mUSDC
//         uint256 balance_mUSDC = mUSDC.balanceOf(address(this));
//         if (balance_mUSDC > 0) {
//             require(mUSDC.transfer(designatedAddress_mUSDC, balance_mUSDC), "mUSDC transfer failed");
//         }

//         // Send bTTDC
//         uint256 balance_bTTDC = bTTDC.balanceOf(address(this));
//         if (balance_bTTDC > 0) {
//             require(bTTDC.transfer(designatedAddress_bTTDC, balance_bTTDC), "bTTDC transfer failed");
//         }
//     }
// }

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

interface IERC20 {
    function transfer(address recipient, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

contract SendToken {
    address public designatedAddress_mUSDC;
    address public designatedAddress_bTTDC;
    IERC20 public mUSDC;
    IERC20 public bTTDC;
    bool public isInitialized = false;


    modifier notInitialized() {
        require(!isInitialized, "Contract is already initialized");
        _;
    }

    function initialize(
        address _designatedAddress_mUSDC, 
        address _designatedAddress_bTTDC, 
        address _mUSDC, 
        address _bTTDC
    ) external notInitialized {
        designatedAddress_mUSDC = _designatedAddress_mUSDC;
        designatedAddress_bTTDC = _designatedAddress_bTTDC;
        mUSDC = IERC20(_mUSDC);
        bTTDC = IERC20(_bTTDC);
        isInitialized = true;
    }

    function disperseFunds() external {
        require(isInitialized, "Contract is not initialized");

        // Send mUSDC
        uint256 balance_mUSDC = mUSDC.balanceOf(address(this));
        if (balance_mUSDC > 0) {
            require(mUSDC.transfer(designatedAddress_mUSDC, balance_mUSDC), "mUSDC transfer failed");
        }

        // Send bTTDC
        uint256 balance_bTTDC = bTTDC.balanceOf(address(this));
        if (balance_bTTDC > 0) {
            require(bTTDC.transfer(designatedAddress_bTTDC, balance_bTTDC), "bTTDC transfer failed");
        }
    }
}

// Assuming the SendToken contract is in the same directory
//import "./SendToken.sol";

contract ContractRegistry {
    mapping(string => address) private contracts;
    SendToken public sendTokenContract;

    // Events
    event ContractAddressUpdated(string name, address indexed contractAddress);

    // Constructor for initial addresses setup
    constructor(
        address _sendToken,
        address _mock_USDC,
        address _backed_bTTDC,
        address _usdcFaucet,
        address _bttdcFaucet,
        address _vaulted_vTTDC,
        address _vart,
        address _vault
    ) {
        contracts["Mock_USDC"] = _mock_USDC;
        contracts["ERC20_USDC_Faucet"] = _usdcFaucet;
        contracts["ERC20_bTTDC_Faucet"] = _bttdcFaucet;
        contracts["Backed_bTTDC"] = _backed_bTTDC;
        contracts["Vaulted_vTTDC"] = _vaulted_vTTDC;
        contracts["VART"] = _vart;
        contracts["Vault"] = _vault;

        // Use the provided SendToken contract address
        sendTokenContract = SendToken(_sendToken);

        // Initialize SendToken contract
        sendTokenContract.initialize(
            _usdcFaucet,
            _bttdcFaucet,
            _mock_USDC,
            _backed_bTTDC
        );

        // Call disperseFunds of SendToken contract
        sendTokenContract.disperseFunds();
    }

    // ... [previous code for ContractRegistry]

    // Functions to update individual addresses
    function updateMock_USDC(address _address) external {
        contracts["Mock_USDC"] = _address;
        emit ContractAddressUpdated("Mock_USDC", _address);
    }

    function updateERC20_USDC_Faucet(address _address) external {
        contracts["ERC20_USDC_Faucet"] = _address;
        emit ContractAddressUpdated("ERC20_USDC_Faucet", _address);
    }

    function updateERC20_bTTDC_Faucet(address _address) external {
        contracts["ERC20_bTTDC_Faucet"] = _address;
        emit ContractAddressUpdated("ERC20_bTTDC_Faucet", _address);
    }

    function updateBacked_bTTDC(address _address) external {
        contracts["Backed_bTTDC"] = _address;
        emit ContractAddressUpdated("Backed_bTTDC", _address);
    }

    function updateVaulted_vTTDC(address _address) external {
        contracts["Vaulted_vTTDC"] = _address;
        emit ContractAddressUpdated("Vaulted_vTTDC", _address);
    }

    function updateVART(address _address) external {
        contracts["VART"] = _address;
        emit ContractAddressUpdated("VART", _address);
    }

    function updateVault(address _address) external {
        contracts["Vault"] = _address;
        emit ContractAddressUpdated("Vault", _address);
    }

    // Bulk update for all addresses
    function bulkUpdateAddresses(
        address _mock_USDC,
        address _usdcFaucet,
        address _bttdcFaucet,
        address _backed_bTTDC,
        address _vaulted_vTTDC,
        address _vart,
        address _vault
    ) external {
        contracts["Mock_USDC"] = _mock_USDC;
        contracts["ERC20_USDC_Faucet"] = _usdcFaucet;
        contracts["ERC20_bTTDC_Faucet"] = _bttdcFaucet;
        contracts["Backed_bTTDC"] = _backed_bTTDC;
        contracts["Vaulted_vTTDC"] = _vaulted_vTTDC;
        contracts["VART"] = _vart;
        contracts["Vault"] = _vault;

        emit ContractAddressUpdated("Mock_USDC", _mock_USDC);
        emit ContractAddressUpdated("ERC20_USDC_Faucet", _usdcFaucet);
        emit ContractAddressUpdated("ERC20_bTTDC_Faucet", _bttdcFaucet);
        emit ContractAddressUpdated("Backed_bTTDC", _backed_bTTDC);
        emit ContractAddressUpdated("Vaulted_vTTDC", _vaulted_vTTDC);
        emit ContractAddressUpdated("VART", _vart);
        emit ContractAddressUpdated("Vault", _vault);
    }

    // Functions to retrieve the addresses
    function getMock_USDC() external view returns (address) {
        return contracts["Mock_USDC"];
    }

    function getERC20_USDC_Faucet() external view returns (address) {
        return contracts["ERC20_USDC_Faucet"];
    }

    function getERC20_bTTDC_Faucet() external view returns (address) {
        return contracts["ERC20_bTTDC_Faucet"];
    }

    function getBacked_bTTDC() external view returns (address) {
        return contracts["Backed_bTTDC"];
    }

    function getVaulted_vTTDC() external view returns (address) {
        return contracts["Vaulted_vTTDC"];
    }

    function getVART() external view returns (address) {
        return contracts["VART"];
    }

    function getVault() external view returns (address) {
        return contracts["Vault"];
    }

}
