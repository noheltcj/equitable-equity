import { ethers } from "hardhat";

async function main() {
  const EquitableEquityDAO = await ethers.getContractFactory(
    "EquitableEquityDAO"
  );
  const dao = await EquitableEquityDAO.deploy();

  await dao.deployed();

  console.log("EquitableEquityDAO deployed to:", dao.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
