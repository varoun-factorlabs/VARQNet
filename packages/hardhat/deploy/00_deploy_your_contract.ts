import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import dotenv from "dotenv";
dotenv.config();
/**
 * Deploys a contract named "YourContract" using the deployer account and
 * constructor arguments set to the deployer address
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployYourContract: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  /*
    On localhost, the deployer account is the one that comes with Hardhat, which is already funded.

    When deploying to live networks (e.g `yarn deploy --network goerli`), the deployer account
    should have sufficient balance to pay for the gas fees for contract creation.

    You can generate a random account with `yarn generate` which will fill DEPLOYER_PRIVATE_KEY
    with a random private key in the .env file (then used on hardhat.config.ts)
    You can run the `yarn account` command to check your balance in every network.
  */
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;
  const wallet = process.env.HARDHAT_USER_WALLET_ADDRESS as string;
  const usdc_token: string = "0xD87Ba7A50B2E7E660f678A895E4B72E7CB4CCd9C";
  const atm_address: string = "0x525f4c7F123f63b9e2e323912556e69F126d610B";

  const SendToken = await deploy("SendToken", {
    from: deployer,
    // Contract constructor arguments
    args: [], //[deployer],
    log: true,
    // autoMine: can be passed to the deploy function to make the deployment process faster on local networks by
    // automatically mining the contract deployment transaction. There is no effect on live networks.
    autoMine: true,
  });

  const Mock_USDC = await deploy("Mock_USDC", {
    from: deployer,
    // Contract constructor arguments

    args: [SendToken.address], //[deployer],
    // args: [usdc_token], //[deployer],
    log: true,
    // autoMine: can be passed to the deploy function to make the deployment process faster on local networks by
    // automatically mining the contract deployment transaction. There is no effect on live networks.
    autoMine: true,
  });

  const Backed_bTTDC = await deploy("Backed_bTTDC", {
    from: deployer,
    // Contract constructor arguments
    args: [SendToken.address], //[deployer],
    log: true,
    // autoMine: can be passed to the deploy function to make the deployment process faster on local networks by
    // automatically mining the contract deployment transaction. There is no effect on live networks.
    autoMine: true,
  });

  const ERC20_USDC_Faucet = await deploy("ERC20_USDC_Faucet", {
    from: deployer,
    // Contract constructor arguments
    args: [Mock_USDC.address, wallet], //[deployer],
    log: true,
    // autoMine: can be passed to the deploy function to make the deployment process faster on local networks by
    // automatically mining the contract deployment transaction. There is no effect on live networks.
    autoMine: true,
  });

  const ERC20_bTTDC_Faucet = await deploy("ERC20_bTTDC_Faucet", {
    from: deployer,
    // Contract constructor arguments
    args: [Backed_bTTDC.address, wallet], //[deployer],
    log: true,
    // autoMine: can be passed to the deploy function to make the deployment process faster on local networks by
    // automatically mining the contract deployment transaction. There is no effect on live networks.
    autoMine: true,
  });

  const Vaulted_vTTDC = await deploy("Vaulted_vTTDC", {
    from: deployer,
    // Contract constructor arguments
    args: [], //[deployer],
    log: true,
    // autoMine: can be passed to the deploy function to make the deployment process faster on local networks by
    // automatically mining the contract deployment transaction. There is no effect on live networks.
    autoMine: true,
  });

  const VART = await deploy("VART", {
    from: deployer,
    // Contract constructor arguments
    args: [], //[deployer],
    log: true,
    // autoMine: can be passed to the deploy function to make the deployment process faster on local networks by
    // automatically mining the contract deployment transaction. There is no effect on live networks.
    autoMine: true,
  });

  // address _owner,
  // address _usdc,
  // address _bTTDC,
  // address _vTTDC,
  // address _vart

  const Vault = await deploy("Vault", {
    from: deployer,
    // Contract constructor arguments
    args: [wallet, Mock_USDC.address, Backed_bTTDC.address, Vaulted_vTTDC.address, VART.address], //[deployer],
    log: true,
    // autoMine: can be passed to the deploy function to make the deployment process faster on local networks by
    // automatically mining the contract deployment transaction. There is no effect on live networks.
    autoMine: true,
  });

  const ATMContract = await deploy("ATMContract", {
    from: deployer,
    // Contract constructor arguments
    args: [atm_address, Backed_bTTDC.address], //[deployer],
    log: true,
    // autoMine: can be passed to the deploy function to make the deployment process faster on local networks by
    // automatically mining the contract deployment transaction. There is no effect on live networks.
    autoMine: true,
  });

  // address _mock_USDC,
  // address _backed_bTTDC,
  // address _usdcFaucet,
  // address _bttdcFaucet,
  // address _vaulted_vTTDC,
  // address _vart,
  // address _vault

  const ContractRegistry = await deploy("ContractRegistry", {
    from: deployer,
    // Contract constructor arguments
    args: [
      SendToken.address,
      Mock_USDC.address,
      Backed_bTTDC.address,
      ERC20_USDC_Faucet.address,
      ERC20_bTTDC_Faucet.address,
      Vaulted_vTTDC.address,
      VART.address,
      Vault.address,
    ], //[deployer],
    log: true,
    // autoMine: can be passed to the deploy function to make the deployment process faster on local networks by
    // automatically mining the contract deployment transaction. There is no effect on live networks.
    autoMine: true,
  });

  // Get the deployed contract
  // const yourContract = await hre.ethers.getContract("YourContract", deployer);
};

export default deployYourContract;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags YourContract
//deployYourContract.tags = ["Mock_USDC"];
