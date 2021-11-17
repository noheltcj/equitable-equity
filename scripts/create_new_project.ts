import { ethers } from "hardhat";

async function main() {
  const EquitableEquityDAO = await ethers.getContractFactory(
    "EquitableEquityDAO"
  );

  /** Will need to be updated with the address of any newly deployed DAOs. */
  const dao = EquitableEquityDAO.attach(
    "0x0165878A594ca255338adfa4d48449f69242Eb8F"
  );

  const createdProjectDAOAddress = await dao.createProject(
    "TestProject",
    "TST",
    dao.address,
    100
  );

  await createdProjectDAOAddress.wait();

  console.log("created:", createdProjectDAOAddress.chainId);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
