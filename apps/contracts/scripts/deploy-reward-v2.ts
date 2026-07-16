import hre from "hardhat";

async function main() {
  const { ethers } = hre;
  const [deployer] = await ethers.getSigners();

  const signerAddress =
    process.env.SIGNER_ADDRESS ?? (await deployer.getAddress());

  console.log("Deployer:", await deployer.getAddress());
  console.log("Claim signer:", signerAddress);

  const Factory = await ethers.getContractFactory("RewardDistributorV2");
  const contract = await Factory.deploy(signerAddress);
  await contract.waitForDeployment();
  const address = await contract.getAddress();

  console.log("RewardDistributorV2 deployed:", address);

  const fundValue = process.env.FUND_VALUE;
  if (fundValue) {
    const tx = await deployer.sendTransaction({
      to: address,
      value: ethers.parseEther(fundValue),
    });
    await tx.wait();
    console.log(`Funded with ${fundValue} MON`);
  }

  console.log("\nSet in .env:");
  console.log(`NEXT_PUBLIC_REWARD_CONTRACT_ADDRESS=${address}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
