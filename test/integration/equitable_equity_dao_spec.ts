import { expect } from "chai";
import { randomInt, randomUUID } from "crypto";
import { ethers } from "hardhat";
import { EquitableEquityDAO } from "../../typechain";
import { daoClient } from "./util/clients";

describe("EquitableEquityDAO - integration tests", function () {
  let dao: EquitableEquityDAO;

  beforeEach(async function () {
    dao = await daoClient.deploy();
  });

  it("should assign its own address as the governance signature", async function () {
    expect(await dao.signature()).to.equal(dao.address);
  });

  describe("given no projects have been created", function () {
    it("should have no projects available", async function () {
      expect(await dao.listProjects()).to.be.empty;
    });
  });

  describe("given a project has been created", function () {
    let fakeProjectName: string;
    let fakeTokenSymbol: string;
    let fakeFounderAddress: string;
    let fakeInitialFounderGrantAmount: number;

    beforeEach(async function () {
      fakeFounderAddress = ethers.Wallet.createRandom().address;
      fakeProjectName = randomUUID();
      fakeTokenSymbol = randomUUID();
      fakeInitialFounderGrantAmount = randomInt(10000);

      await dao.createProject(
        fakeProjectName,
        fakeTokenSymbol,
        fakeFounderAddress,
        fakeInitialFounderGrantAmount
      );
    });

    it("should return the newly created project from #listProjects", async function () {
      const results = await dao.listProjects();

      expect(results.length).to.equal(1);
    });

    describe("when a subsequent project is created", async function () {
      let subsequentProjectName: string;
      let subsequentTokenSymbol: string;
      let subsequentFounderAddress: string;
      let subsequentInitialFounderGrantAmount: number;

      beforeEach(async function () {
        subsequentFounderAddress = ethers.Wallet.createRandom().address;
        subsequentProjectName = randomUUID();
        subsequentTokenSymbol = randomUUID();
        subsequentInitialFounderGrantAmount = randomInt(10000);
      });

      it("should return the newly created project from #listProjects", async function () {
        await dao.createProject(
          subsequentProjectName,
          subsequentTokenSymbol,
          subsequentFounderAddress,
          subsequentInitialFounderGrantAmount
        );

        const results = await dao.listProjects();

        expect(results.length).to.equal(2);
      });

      it("should not allow an already used project name", async function () {
        let errorResult: Error | undefined;
        try {
          await dao.createProject(
            /** From the previous context */
            fakeProjectName,
            subsequentTokenSymbol,
            subsequentTokenSymbol,
            subsequentInitialFounderGrantAmount
          );
        } catch (error) {
          errorResult = error as Error;
        }
        expect(errorResult?.message).to.not.equal(undefined);
      });

      it("should not allow an already used token symbol", async function () {
        let errorResult: Error | undefined;
        try {
          await dao.createProject(
            subsequentProjectName,
            /** From the previous context */
            fakeTokenSymbol,
            subsequentTokenSymbol,
            subsequentInitialFounderGrantAmount
          );
        } catch (error) {
          errorResult = error as Error;
        }
        expect(errorResult?.message).to.not.equal(undefined);
      });
    });
  });
});
