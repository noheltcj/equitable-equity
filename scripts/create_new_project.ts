// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";

async function main() {
  // We get the contract to deploy

  const EquitableEquityDAO = await ethers.getContractFactory("EquitableEquityDAO");
  const dao = await EquitableEquityDAO.attach("0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9");

  const createdProjectTokenAddress = await dao.createProject(
    "TestProject",
    "TST",
    dao.address,
    100
  )

  const fetchedProjectTokenAddress = await dao.getAddressOfProjectToken("TestProject")

  console.log("created:", createdProjectTokenAddress, "\nfetched:", fetchedProjectTokenAddress)
}

/**
function createProject(
        string memory projectName,
        string memory tokenSymbol,
        address founderWallet,
        uint64 initialGrant
    ) public {
        console.log("Creating a new project");

        projectTokenMap[projectName] = address(new EquitableEquityToken(projectName, tokenSymbol));
    }
    **/

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});