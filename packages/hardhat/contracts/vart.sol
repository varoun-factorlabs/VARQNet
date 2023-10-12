// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

// Mock USDC Token for Testing
contract Mock_USDC is ERC20 {
    constructor(address _all_reserves) ERC20("Mock USDC", "mUSDC") {
        _mint(_all_reserves, 100_000_000 * 10**18); // 100 million tokens with 18 decimals
    }
}

// bTTDC Token Represents a TTD backed by a dollar in a Bank
contract Backed_bTTDC is ERC20 {
    constructor(address _all_reserves) ERC20("Backed TTDC Token", "bTTDC") {
        _mint(_all_reserves, 100_000_000 * 10**18); // 100 million tokens with 18 decimals
    }
}

// USDC Faucet for testing

contract ERC20_USDC_Faucet {
    IERC20 public token;
    address public owner;
    uint256 public amountToDispense = 1000 * 10**18; // Assuming 18 decimals in your ERC20 token

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    constructor(address _tokenAddress, address _owner) {
        token = IERC20(_tokenAddress);
        owner = _owner;
    }

    function depositTokens(uint256 amount) external onlyOwner {
        require(token.transferFrom(msg.sender, address(this), amount), "Transfer failed");
    }

    function claimTokens() external {
        uint256 balance = token.balanceOf(address(this));
        require(balance >= amountToDispense, "Not enough tokens in the faucet");

        require(token.transfer(msg.sender, amountToDispense), "Transfer failed");
    }

    function updateAmountToDispense(uint256 newAmount) external onlyOwner {
        amountToDispense = newAmount;
    }

    function withdrawLeftoverTokens(uint256 amount) external onlyOwner {
        uint256 balance = token.balanceOf(address(this));
        require(balance >= amount, "Not enough tokens");

        require(token.transfer(msg.sender, amount), "Transfer failed");
    }
}


contract ERC20_bTTDC_Faucet {
    IERC20 public token;
    address public owner;
    uint256 public amountToDispense = 1000 * 10**18; // Assuming 18 decimals in your ERC20 token

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    constructor(address _tokenAddress, address _owner) {
        token = IERC20(_tokenAddress);
        owner = msg.sender;
    }

    function depositTokens(uint256 amount) external onlyOwner {
        require(token.transferFrom(msg.sender, address(this), amount), "Transfer failed");
    }

    function claimTokens() external {
        uint256 balance = token.balanceOf(address(this));
        require(balance >= amountToDispense, "Not enough tokens in the faucet");

        require(token.transfer(msg.sender, amountToDispense), "Transfer failed");
    }

    function updateAmountToDispense(uint256 newAmount) external onlyOwner {
        amountToDispense = newAmount;
    }

    function withdrawLeftoverTokens(uint256 amount) external onlyOwner {
        uint256 balance = token.balanceOf(address(this));
        require(balance >= amount, "Not enough tokens");

        require(token.transfer(msg.sender, amount), "Transfer failed");
    }
}


// vTTDC Contract
contract Vaulted_vTTDC is ERC20 {
    address public vault;

    constructor() ERC20("Vaulted TTDC Token", "vTTDC") {}

    function setVault(address _vault) external {
        require(vault == address(0), "Vault is already set");
        vault = _vault;
    }

    function mint(address account, uint256 amount) external onlyVault {
        _mint(account, amount);
    }

    function burnFrom(address account, uint256 amount) external onlyVault {
        _burn(account, amount);
    }

    modifier onlyVault {
        require(msg.sender == vault, "Only Vault can mint/burn");
        _;
    }
}

// VART Contract
contract VART is ERC20 {
    address public vault;

    constructor() ERC20("VART Token", "VART") {}

    function setVault(address _vault) external {
        require(vault == address(0), "Vault is already set");
        vault = _vault;
    }

    function mint(address account, uint256 amount) external onlyVault {
        _mint(account, amount);
    }

    function burnFrom(address account, uint256 amount) external onlyVault {
        _burn(account, amount);
    }

    modifier onlyVault {
        require(msg.sender == vault, "Only Vault can mint/burn");
        _;
    }
}

contract Vault {
    IERC20 public usdc;
    IERC20 public bTTDC;
    Vaulted_vTTDC public vTTDC;
    VART public vart;
    address public owner;

    uint256 public constant vTTDC_PER_USDC = 7;
    uint256 public constant VART_PER_USDC = 1;

    constructor(
        address _owner,
        address _usdc,
        address _bTTDC,
        address _vTTDC,
        address _vart
    ) {
        owner = _owner;
        usdc = IERC20(_usdc);
        bTTDC = IERC20(_bTTDC);
        vTTDC = Vaulted_vTTDC(_vTTDC);
        vart = VART(_vart);

        // Set the Vault contract as the vault for vTTDC and VART
        vTTDC.setVault(address(this));
        vart.setVault(address(this));
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the contract owner");
        _;
    }

    function deposit_USDC(uint256 amount) external {
        require(usdc.transferFrom(msg.sender, address(this), amount), "Transfer failed");
        vTTDC.mint(msg.sender, amount * vTTDC_PER_USDC);
        vart.mint(msg.sender, amount * VART_PER_USDC);
    }

    function deposit_bTTDC(uint256 amount) external {
        require(bTTDC.transferFrom(msg.sender, address(this), amount), "Transfer failed");
        vTTDC.mint(msg.sender, amount); // 1:1 minting for bTTDC to vTTDC
    }

    function withdraw_USDC(uint256 amount) external {
        require(vTTDC.balanceOf(msg.sender) >= amount, "Insufficient vTTDC");
        require(vart.balanceOf(msg.sender) >= amount * VART_PER_USDC, "Insufficient VART");

        vTTDC.burnFrom(msg.sender, amount);
        vart.burnFrom(msg.sender, amount * VART_PER_USDC);

        require(usdc.transfer(msg.sender, amount), "Transfer failed");
    }

    function withdraw_bTTDC(uint256 amount) external {
        require(vTTDC.balanceOf(msg.sender) >= amount, "Insufficient vTTDC");
        vTTDC.burnFrom(msg.sender, amount);
        require(bTTDC.transfer(msg.sender, amount), "Transfer failed");
    }
}
