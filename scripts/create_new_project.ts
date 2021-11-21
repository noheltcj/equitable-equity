import { ethers } from "hardhat";

async function main() {
  /** My personal localhost eth address */
  const founderAddress = "0xaDE9673b775B34c0EC2101d1Ac60fBBBCaB3FBc7";

  const DAO = await ethers.getContractFactory(
    "DAO"
  );

  const ProjectDAO = await ethers.getContractFactory(
    "ProjectDAO"
  );


  // const dao = DAO.attach("equitable-equity.eth");
  const dao = DAO.attach("0x0250aDe798e703AA0a75E5b9f72ffe9AA40134C7");

  const projects = await dao.listProjects();

  console.log("Available projects...", projects);

  const projectName = "Test Project " + (projects.length + 1);

  // Returns a transaction instead of the object we want since it mutates storage.
  await dao.createProject(
    projectName,
    projectName + " Token",
    "TST" + projects.length + 1,
    founderAddress,
    500
  );

  // Using a view function from the blockchain will let us resolve the newly created project

  const projectAddress = await dao.projectByName(projectName);

  console.log("Attaching to new project:", projectAddress);

  const projectDao = ProjectDAO.attach(projectAddress);

  console.log("Project organization name:", await projectDao.getProjectName());
  console.log(
    "Project participants (should just be the founder for now):",
    await projectDao.getParticipants()
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
