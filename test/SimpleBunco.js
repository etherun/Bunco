const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SimpleBunco", function () {
  let simpleBunco;
  let owner;
  let otherAccount;

  beforeEach(async function () {
    [owner, otherAccount] = await ethers.getSigners();
    simpleBunco = await ethers.deployContract("SimpleBunco");
  });

  describe("investment logic", function () {
    xit("should allow initial investment", async function () {
      const initialInvestment = 100;
      await simpleBunco
        .connect(otherAccount)
        .invest({ value: initialInvestment });

      expect(await simpleBunco.currentInvest()).to.equal(initialInvestment);
      expect(await simpleBunco.currentInvestor()).to.equal(
        otherAccount.address
      );
      expect(await simpleBunco.owner()).to.equal(owner.address);
    });

    xit("should enforce minimum investment requirement", async function () {
      const initialInvestment = 100;
      await simpleBunco
        .connect(otherAccount)
        .invest({ value: initialInvestment });

      const insufficientAmount = (initialInvestment * 11) / 10 - 1;
      await expect(
        simpleBunco.connect(owner).invest({ value: insufficientAmount })
      ).to.be.revertedWith("Investment must be greater than current invests");
    });

    it("should correctly transfer funds to previous investor", async function () {
      console.log(
        otherAccount.address,
        "otherAccount balance:",
        await ethers.provider.getBalance(otherAccount.address)
      );
      const initialInvestment = 100;
      await simpleBunco
        .connect(otherAccount)
        .invest({ value: initialInvestment });
      expect(await simpleBunco.currentInvestor()).to.equal(
        otherAccount.address
      );

      const secondInvestment = 120;
      const initialInvestorBalanceBefore = await ethers.provider.getBalance(
        otherAccount.address
      );
      await simpleBunco.connect(owner).invest({ value: secondInvestment });

      const initialInvestorBalanceAfter = await ethers.provider.getBalance(
        otherAccount.address
      );

      expect(
        initialInvestorBalanceAfter - initialInvestorBalanceBefore
      ).to.equal(secondInvestment);
    });
  });
});
