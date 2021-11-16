import { expect } from "chai";
import { randomUUID } from "crypto";
import { ethers } from "hardhat";
import { EquitableEquityDAO } from "../../typechain";
import { daoClient } from "./clients"

describe("EquitableEquityDAO", function () {
    var dao: EquitableEquityDAO

    beforeEach(async function () {
        dao = await daoClient.deploy()
    })

    describe("#listProjects", function() {
        describe("when no projects have been created", function() {
            it("should have no projects available", async function () {
                expect(await dao.listProjects()).to.be.empty
            })
        })
        

        describe("when a project has been created", function() {
            let founderAddress: string
            let fakeProjectName: string

            beforeEach(async function() {
                founderAddress = ethers.Wallet.createRandom().address
                fakeProjectName = randomUUID()

                const token = await dao.createProject(fakeProjectName, "symbol", founderAddress, 0)
                await token.wait()
            })

            it("should return the newly created project name", async function() {
                const results = await dao.listProjects()

                expect(results.length).to.equal(1)
                expect(results).to.contain(fakeProjectName)
            })
        })
    })

    describe("#listMyProjects", function() {
        let notFounderAddress: string

        beforeEach(function() {
            notFounderAddress = ethers.Wallet.createRandom().address
        })

        describe("when no projects have been created", function() {
            it("should not return any projects", async function () {
                expect(await dao.listProjects()).to.be.empty
            })
        })
        

        describe("when a project has been created", function() {
            let founderAddress: string
            let fakeProjectName: string

            beforeEach(async function() {
                founderAddress = ethers.Wallet.createRandom().address
                fakeProjectName = randomUUID()

                const token = await dao.createProject(fakeProjectName, "symbol", founderAddress, 0)
                await token.wait()
            })

            describe("when the requested user is not the founder", function() {
                it("should not return any projects", async function () {
                    expect(await dao.listMyProjects(notFounderAddress)).to.be.empty
                })
            })

            describe("when the requested user is the founder", function() {
                it("should return the newly created project name", async function() {
                    const results = await dao.listMyProjects(founderAddress)
     
                    expect(results.length).to.equal(1)
                    expect(results).to.contain(fakeProjectName)
                })
            })
        })
    })
});
