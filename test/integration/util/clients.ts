import { ethers } from "hardhat";
import { Contract } from "ethers";
import { EquitableEquityDAO } from "../../../typechain/EquitableEquityDAO";
import { EquitableEquityProjectDAO } from "../../../typechain/EquitableEquityProjectDAO";

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

  async deploy(contentUri: string): Promise<EquitableEquityDAO> {
    return await blockchainClient.deployContract("EquitableEquityDAO", [
      contentUri,
    ]);
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
  ): Promise<EquitableEquityProjectDAO> {
    return await blockchainClient.deployContract("EquitableEquityProjectDAO", [
      projectName,
      foundingWalletAddress
    ]);
  }
}

const blockchainClient = new BlockchainClient();

export const daoClient = new DAOClient(blockchainClient);

export const projectDAOClient = new ProjectDAOClient(blockchainClient);
