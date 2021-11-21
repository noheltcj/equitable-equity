import { expect } from "chai";
import { randomUUID } from "crypto";
import { ethers } from "hardhat";
import { EquitableEquityDAO } from "../../typechain";
import { daoClient } from "./util/clients";

describe("EquitableEquityDAO - integration tests", function () {
  let dao: EquitableEquityDAO;

  beforeEach(async function () {
    dao = await daoClient.deploy("fake_content_uri");
  });

  describe("given no projects have been created", function () {
    it("should have no projects available", async function () {
      expect(await dao.listProjects()).to.be.empty;
    });
  });

  describe("given a project has been created", function () {
    let fakeProjectName: string;
    let fakeTokenName: string;
    let fakeTokenSymbol: string;
    let fakeFounderAddress: string;

    beforeEach(async function () {
      fakeFounderAddress = ethers.Wallet.createRandom().address;
      fakeProjectName = randomUUID();
      fakeTokenName = randomUUID();
      fakeTokenSymbol = randomUUID();

      await dao.createProject(fakeProjectName, fakeTokenName, fakeTokenSymbol, fakeFounderAddress);
    });

    it("should return the newly created project from #listProjects", async function () {
      const results = await dao.listProjects();

      expect(results.length).to.equal(1);
    });

    describe("when a subsequent project is created", async function () {
      let subsequentFounderAddress: string;
      let subsequentProjectName: string;
      let subsequentTokenName: string;
      let subsequentTokenSymbol: string;

      beforeEach(async function () {
        subsequentFounderAddress = ethers.Wallet.createRandom().address;
        subsequentProjectName = randomUUID();
        subsequentTokenName = randomUUID();
        subsequentTokenSymbol = randomUUID();
      });

      it("should return the newly created project from #listProjects", async function () {
        await dao.createProject(
          subsequentProjectName,
          subsequentTokenName,
          subsequentTokenSymbol,
          subsequentFounderAddress
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
            subsequentTokenName,
            subsequentTokenSymbol,
            subsequentFounderAddress
          );
        } catch (error) {
          errorResult = error as Error;
        }
        expect(errorResult?.message).to.not.equal(undefined);
      });

      it("should not allow an already used token name", async function () {
        let errorResult: Error | undefined;
        try {
          await dao.createProject(
            subsequentProjectName,
            /** From the previous context */
            fakeTokenName,
            subsequentTokenSymbol,
            subsequentFounderAddress
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
            subsequentTokenName,
            /** From the previous context */
            fakeTokenSymbol,
            subsequentFounderAddress
          );
        } catch (error) {
          errorResult = error as Error;
        }
        expect(errorResult?.message).to.not.equal(undefined);
      });
    });
  });
});
