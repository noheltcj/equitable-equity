import { ethers } from "hardhat";
import { Contract } from "ethers";
import { EquitableEquityDAO } from "../../../typechain/EquitableEquityDAO";
import { EquitableEquityProjectDAO } from "../../../typechain/EquitableEquityProjectDAO";
import { NetworkGovernor } from "../../../typechain/NetworkGovernor";

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
    return await blockchainClient.deployContract("EquitableEquityDAO", [contentUri]);
  }
}

export class ProjectDAOClient {
  private blockchainClient: BlockchainClient;

  constructor(blockchainClient: BlockchainClient) {
    this.blockchainClient = blockchainClient;
  }

  async deploy(
    projectName: string,
    tokenSymbol: string,
    foundingWalletAddress: string,
    initialGrantAmount: number,
    networkGovernor: NetworkGovernor
  ): Promise<EquitableEquityProjectDAO> {
    return await blockchainClient.deployContract("EquitableEquityProjectDAO", [
      projectName,
      tokenSymbol,
      foundingWalletAddress,
      initialGrantAmount,
      networkGovernor,
    ]);
  }
}

const blockchainClient = new BlockchainClient();

export const daoClient = new DAOClient(blockchainClient);

export const projectDAOClient = new ProjectDAOClient(blockchainClient);
