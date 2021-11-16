import { ethers } from "hardhat"
import { Contract } from "ethers";
import { EquitableEquityDAO } from "../../typechain";

class BlockchainClient {
    constructor() {}

    async deployContract<Type extends Contract>(
        contractName: string, 
        args: any[] | undefined = undefined
    ): Promise<Type> {
        const Contract = await ethers.getContractFactory(contractName)
        const contract = await Contract.deploy()
        return await contract.deployed() as Type;
    }
}

export class DAOClient {
    private blockchainClient: BlockchainClient

    constructor(blockchainClient: BlockchainClient) {
        this.blockchainClient = blockchainClient
    }

    async deploy(): Promise<EquitableEquityDAO> {
        return await blockchainClient.deployContract("EquitableEquityDAO")
    }
}

const blockchainClient = new BlockchainClient()

export const daoClient = new DAOClient(blockchainClient)