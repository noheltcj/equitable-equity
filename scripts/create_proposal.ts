import { ethers } from "hardhat";
import { ProjectVoteGovernor } from "../typechain";

async function main() {
  /** My personal localhost eth address */
  const recipient = "0x02EACB83f63333d82a3985313Fd4B2117483f852";

  const DAO = await ethers.getContractFactory("DAO");

  const ProjectDAO = await ethers.getContractFactory("ProjectDAO");

  /** Will need to be updated with the address of any newly deployed DAOs. */
  //   const dao = DAO.attach("equitable-equity.eth");
  const dao = DAO.attach("0x0250aDe798e703AA0a75E5b9f72ffe9AA40134C7");

  const projects = await dao.listProjects();

  console.log("Available projects...", projects);

  const projectName = "Test Project " + projects.length;

  // Using a view function from the blockchain will let us resolve the newly created project

  const projectAddress = await dao.projectByName(projectName);

  console.log("Attaching to new project:", projectAddress);
  const projectDao = ProjectDAO.attach(projectAddress);

  console.log("Project organization name:", await projectDao.getProjectName());
  console.log(
    "Project participants (should just be the founder for now):",
    await projectDao.getParticipants()
  );

  // Insert the token address.
  const token = await ethers.getContractAt(
    "ERC20Token",
    await projectDao.getERC20Token()
  );
  const governorAddress = await projectDao.getGovernor();
  const GovernorFactory = await ethers.getContractFactory(
    "ProjectVoteGovernor"
  );
  const governor = GovernorFactory.attach(governorAddress);

  const transferCalldata = token.interface.encodeFunctionData("grantEquity", [
    recipient,
    1000,
  ]);
  await governor.propose(
    [token.address],
    [0],
    [transferCalldata],
    "Proposal #1: I want moar tokenz"
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
