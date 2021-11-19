import { ethers } from "hardhat";

async function main() {
  /** My personal localhost eth address */
  const founderAddress = "0xaDE9673b775B34c0EC2101d1Ac60fBBBCaB3FBc7";

  const EquitableEquityDAO = await ethers.getContractFactory(
    "EquitableEquityDAO"
  );

  const EquitableEquityProjectDAO = await ethers.getContractFactory(
    "EquitableEquityProjectDAO"
  );

  /** Will need to be updated with the address of any newly deployed DAOs. */
  const dao = EquitableEquityDAO.attach(
    "0xD24705Df5d145A34067cAdf462590A5A4C515EC6"
  );

  const projects = await dao.listProjects();

  console.log("Available projects...", projects);

  const projectName = "Test Project " + projects.length;

  // Using a view function from the blockchain will let us resolve the newly created project
  const projectAddress = await dao.projectByName(projectName);

  console.log("Attaching to new project:", projectAddress);
  const projectDao = EquitableEquityProjectDAO.attach(projectAddress);

  console.log("Project organization name:", await projectDao.getProjectName());
  console.log(
    "Project participants (should just be the founder for now):",
    await projectDao.getParticipants()
  );

  await projectDao.requestEquityGrant(founderAddress, 100);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
