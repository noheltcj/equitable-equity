import { ethers } from "hardhat";
import { Contract } from "ethers";
import { DAO } from "../../../typechain/DAO";
import { ProjectDAO } from "../../../typechain/ProjectDAO";

class BlockchainClient {
  constructor() {}

  async deployContract<Type extends Contract>(
    contractName: string,
    args: any[] | undefined = undefined
  ): Promise<Type> {
    const Type_ = await ethers.getContractFactory(contractName);

    let contract;
    if (args != undefined) {
      contract = await Type_.deploy.apply(Type_, args);
    } else {
      contract = await Type_.deploy();
    }

    return (await contract.deployed()) as Type;
  }
}

export class DAOClient {
  private blockchainClient: BlockchainClient;

  constructor(blockchainClient: BlockchainClient) {
    this.blockchainClient = blockchainClient;
  }

  async deploy(): Promise<DAO> {
    return await blockchainClient.deployContract("DAO", []);
  }
}

export class ProjectDAOClient {
  private blockchainClient: BlockchainClient;

  constructor(blockchainClient: BlockchainClient) {
    this.blockchainClient = blockchainClient;
  }

  async deploy(
    projectName: string,
    foundingWalletAddress: string
  ): Promise<ProjectDAO> {
    return await blockchainClient.deployContract("ProjectDAO", [
      projectName,
      foundingWalletAddress,
    ]);
  }
}

const blockchainClient = new BlockchainClient();

export const daoClient = new DAOClient(blockchainClient);

export const projectDAOClient = new ProjectDAOClient(blockchainClient);
