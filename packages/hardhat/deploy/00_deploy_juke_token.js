// deploy/00_deploy_juke_token.js

const { ethers } = require("hardhat");

const localChainId = "31337";

// const sleep = (ms) =>
//   new Promise((r) =>
//     setTimeout(() => {
//       console.log(`waited for ${(ms / 1000).toFixed(3)} seconds`);
//       r();
//     }, ms)
//   );

module.exports = async ({ getNamedAccounts, deployments, getChainId }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = await getChainId();

  await deploy("Juke", {
    from: deployer,
    args: [ deployer ],
    log: true,
  });

  // Uncomment this to transfer ownership to a different address
  // const Juke = await ethers.getContract("Juke", deployer);
  /*
    await Juke.transferOwnership(
      "ADDRESS_HERE"
    );
  */

  // Verify from the command line by running `yarn verify`.

  // You can also Verify your contracts with Etherscan here.
  // You don't want to verify on localhost
  // try {
  //   if (chainId !== localChainId) {
  //     await run("verify:verify", {
  //       address: Juke.address,
  //       contract: "contracts/Juke.sol:Juke",
  //       constructorArguments: [],
  //     });
  //   }
  // } catch (error) {
  //   console.error(error);
  // }
};

module.exports.tags = ["Juke"];
