import {
  computeTransferOutput,
  mintFee,
  applyFee,
  applyRenVMMintFee,
} from "zero-protocol/lib/badger";
import { ethers } from "ethers";
import fixtures from "zero-protocol/lib/fixtures";

function formatOutput(output) {
  return ethers.utils.formatUnits(output, 8);
}

export async function getFeeBreakdown({ token, amount }) {
  const baseFee = applyRenVMMintFee(ethers.utils.parseUnits(amount, 8));
  var fees = await applyFee(baseFee, mintFee, 0);
  console.log("AFTER SUB: " + baseFee.sub(fees.totalFees));
  const tokenAddress =
    token === "ETH" ? ethers.constants.AddressZero : fixtures.ETHEREUM[token];

  switch (tokenAddress) {
    default:
      fees.gasFee = formatOutput(fees.gasFee);
      fees.mintFee = formatOutput(fees.mintFee);
      fees.totalFees = formatOutput(fees.totalFees);
      console.log("THEORY TOTAL FEE: " + fees.totalFees);
      return fees;
  }
}

export async function getTransferOutput({ token, amount }) {
  const input = {
    module:
      token === "ETH" ? ethers.constants.AddressZero : fixtures.ETHEREUM[token],
    amount: ethers.utils.parseUnits(amount, 8),
  };
  let output = await computeTransferOutput(input);
  output = formatOutput(output, token);
  return output;
}
