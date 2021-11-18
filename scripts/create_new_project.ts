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
    "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9"
  );

  const projects = await dao.listProjects()

  console.log("Available projects...", projects);

  const projectName = "Test Project " + projects.length + 1

  // Returns a transaction instead of the object we want since it mutates storage.
  await dao.createProject(
    projectName,
    "TEST" + projects.length + 1,
    "0xaDE9673b775B34c0EC2101d1Ac60fBBBCaB3FBc7", // My personal localhost eth address
    100
  );

  // Using a view function from the blockchain will let us resolve the newly created project
  const projectAddress = await dao.projectByName(projectName)

  console.log("Attaching to new project:", projectAddress);
  const projectDao = EquitableEquityProjectDAO.attach(projectAddress);

  console.log("Project organization name:", await projectDao.organizationName());
  // console.log("Project participants (should just be the founder for now):", await projectDao.participants())
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
