import { ethers } from "hardhat";

async function main() {
  const EquitableEquityDAO = await ethers.getContractFactory(
    "EquitableEquityDAO"
  );

  const EquitableEquityProjectDAO = await ethers.getContractFactory(
    "EquitableEquityProjectDAO"
  );

  /** Will need to be updated with the address of any newly deployed DAOs. */
  const dao = EquitableEquityDAO.attach(
    "0x5FbDB2315678afecb367f032d93F642f64180aa3"
  );

  const createdProjectDAOAddress = await dao.createProject(
    "Test Project 5",
    "TST7",
    "0xaDE9673b775B34c0EC2101d1Ac60fBBBCaB3FBc7",
    100
  );

  const receipt = await createdProjectDAOAddress.wait();

  const projects = await dao.listProjects();
  console.log("Projects...", projects);
  console.log("Using address...", receipt.contractAddress);
  const projectDao = EquitableEquityProjectDAO.attach(receipt.contractAddress);
  console.log("ORG NAME:", projectDao.organizationName);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
