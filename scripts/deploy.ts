import { ethers } from "hardhat";

async function main() {
  const EquitableEquityDAO = await ethers.getContractFactory("DAO");
  const dao = await EquitableEquityDAO.deploy();

  await dao.deployed();

  console.log("DAO deployed to:", dao.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
