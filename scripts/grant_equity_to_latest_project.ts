import { ethers } from "hardhat";

async function main() {
  /** My personal localhost eth address */
  const founderAddress = "0x02EACB83f63333d82a3985313Fd4B2117483f852";

  const EquitableEquityDAO = await ethers.getContractFactory(
    "EquitableEquityDAO"
  );

  const EquitableEquityProjectDAO = await ethers.getContractFactory(
    "EquitableEquityProjectDAO"
  );

  /** Will need to be updated with the address of any newly deployed DAOs. */
  const dao = EquitableEquityDAO.attach(
    "equitable-equity.eth"
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
