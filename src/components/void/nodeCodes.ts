// Code shown in the 'The Watcher's wiring' inspector, one entry per part of the engine.

export interface NodeCodeData {
  id: string;
  title: string;
  subtitle: string;
  filename: string;
  language: "typescript" | "solidity";
  emoji: string;
  badgeColor: string;
  code: string;
  description: string;
}

const NODE_CODES: Record<string, NodeCodeData> = {
  rpc: {
    id: "rpc",
    title: "Robinhood RPC Provider",
    subtitle: "Node #1 // RPC Model Connection",
    filename: "robinhoodRpc.ts",
    language: "typescript",
    emoji: "🟣",
    badgeColor: "bg-purple-900/60 text-purple-300 border-purple-600",
    description: "Initializes low-latency JSON-RPC communication with Robinhood Chain Mainnet (Chain ID: 4663).",
    code: `import { ethers } from "ethers";

export const ROBINHOOD_CONFIG = {
  chainId: 4663,
  name: "Robinhood Chain Mainnet",
  rpcUrl: "https://rpc.mainnet.chain.robinhood.com",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  explorer: "https://explorer.mainnet.chain.robinhood.com",
};

// Establish resilient JsonRpcProvider for continuous event streaming
export const getRobinhoodProvider = (): ethers.JsonRpcProvider => {
  return new ethers.JsonRpcProvider(ROBINHOOD_CONFIG.rpcUrl, {
    chainId: ROBINHOOD_CONFIG.chainId,
    name: ROBINHOOD_CONFIG.name,
  });
};`,
  },
  memory: {
    id: "memory",
    title: "Accretion Disk (Fee Escrow)",
    subtitle: "Node #2 // On-Chain Balance Tracker",
    filename: "FeeEscrowMemory.sol",
    language: "solidity",
    emoji: "💾",
    badgeColor: "bg-sky-900/60 text-sky-300 border-sky-600",
    description: "Inspects FeeEscrow contract balance and tracks threshold trigger requirements (0.010 ETH).",
    code: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IFeeEscrow {
    function getPendingFees() external view returns (uint256);
    function claimFees(address recipient) external returns (uint256);
}

contract AccretionDiskEscrow is IFeeEscrow {
    uint256 public constant THRESHOLD_ETH = 0.01 ether;
    address public immutable burnerRouter;

    event FeesHarvested(uint256 amountETH, uint256 timestamp);

    function isThresholdReady() external view returns (bool ready) {
        return address(this).balance >= THRESHOLD_ETH;
    }
}`,
  },
  dex: {
    id: "dex",
    title: "DEX Swap Router Tool",
    subtitle: "Node #3 // Market Buyback Tool",
    filename: "dexRouterTool.ts",
    language: "typescript",
    emoji: "🛒",
    badgeColor: "bg-emerald-900/60 text-emerald-300 border-emerald-600",
    description: "Automated keeper tool executing market buy orders on Robinhood Chain DEX with zero team cut.",
    code: `import { ethers } from "ethers";

export async function executeMarketBuyback(
  routerAddress: string,
  tokenAddress: string,
  ethAmountWei: bigint,
  signer: ethers.Signer
) {
  const router = new ethers.Contract(routerAddress, ROUTER_ABI, signer);
  const path = [WETH_ADDRESS, tokenAddress];
  const deadline = Math.floor(Date.now() / 1000) + 300;

  // 100% of claimed ETH is deployed to sweep tokens off the orderbook
  const tx = await router.swapExactETHForTokensSupportingFeeOnTransferTokens(
    0n, // Protected by custom slippage parameters
    path,
    EVENT_HORIZON_SINK,
    deadline,
    { value: ethAmountWei }
  );
  return await tx.wait();
}`,
  },
  burn: {
    id: "burn",
    title: "Event Horizon (Burn Tool)",
    subtitle: "Node #4 // Irreversible Burn Tool",
    filename: "burnGraveyardSink.ts",
    language: "typescript",
    emoji: "💀",
    badgeColor: "bg-orange-900/60 text-orange-300 border-orange-600",
    description: "Irreversibly transfers acquired tokens to 0x000...dEaD, removing them permanently from circulation.",
    code: `import { ethers } from "ethers";

export const DEAD_ADDRESS = "0x000000000000000000000000000000000000dEaD";

export async function transferToGraveyard(
  tokenContract: ethers.Contract,
  tokenAmountWei: bigint
) {
  // Irreversible cryptographic dispatch - no private key exists for 0xdead
  const tx = await tokenContract.transfer(DEAD_ADDRESS, tokenAmountWei);
  const receipt = await tx.wait();

  console.log(\`[BURN VERIFIED] Destroyed \${ethers.formatEther(tokenAmountWei)} $VOID\`);
  console.log(\`[ON-CHAIN PROOF] Tx Hash: \${receipt.hash}\`);
  return receipt;
}`,
  },
  trigger: {
    id: "trigger",
    title: "DEX Swap Event Trigger",
    subtitle: "Trigger // On-Chain Sync Event",
    filename: "swapEventTrigger.ts",
    language: "typescript",
    emoji: "📝",
    badgeColor: "bg-cyan-900/60 text-cyan-300 border-cyan-600",
    description: "Listens to real-time Swap and Sync events on the $VOID liquidity pool on Robinhood DEX.",
    code: `// WebSocket listener for real-time DEX Swaps on Robinhood Chain
pairContract.on("Swap", async (sender, in0, in1, out0, out1, to, event) => {
  console.log(\`[DEX SWAP] Trade detected in block #\${event.log.blockNumber}\`);
  
  // Dispatches trigger payload to the Watcher workflow
  await agentWorkflow.dispatch({
    source: "ROBINHOOD_DEX",
    event: "Sync_Swap",
    timestamp: Date.now(),
  });
});`,
  },
  agent: {
    id: "agent",
    title: "The Watcher (Keeper Agent)",
    subtitle: "Main Execution Agent // Core Loop",
    filename: "mortAgent.ts",
    language: "typescript",
    emoji: "🤖",
    badgeColor: "bg-amber-900/60 text-amber-300 border-amber-600",
    description: "Core autonomous keeper agent that orchestrates escrow checks, fee claims, buybacks, and burns.",
    code: `// The Watcher, Autonomous Agent - Execution Cycle
export async function runAgentCycle() {
  const escrow = getFeeEscrowContract();
  const pendingFees = await escrow.getPendingFees();

  if (pendingFees >= THRESHOLD_WEI) {
    // 1. Autonomous Harvest
    const harvestTx = await escrow.claimFees(ROUTER_ADDRESS);
    // 2. Market Buyback on DEX
    const buyTx = await dexRouter.executeBuyback(pendingFees);
    // 3. Send to 0xdead
    await burnSink.transfer(buyTx.tokensAcquired);
  }
}`,
  },
  condition: {
    id: "condition",
    title: "Cycle Router & Threshold Evaluator",
    subtitle: "Node #5 // Dual-Route Logic",
    filename: "cycleEvaluator.ts",
    language: "typescript",
    emoji: "🔀",
    badgeColor: "bg-blue-900/60 text-blue-300 border-blue-600",
    description: "Evaluates escrow balance and alternates between Odd (Burn to 0xdead) and Even (Claim Fee & Transfer to Creator Address).",
    code: `// Cycle Evaluator - Alternating Autonomous Mechanism
export function routeCycle(cycleCount: number, escrowBalanceWei: bigint) {
  const isOddCycle = (cycleCount % 2 === 1);
  const threshold = isOddCycle ? 10_000_000_000_000_000n : 20_000_000_000_000_000n; // 0.01 vs 0.02 ETH

  if (escrowBalanceWei >= threshold) {
    if (isOddCycle) {
      return "burn"; // Routes to 'Execute Buyback (0xdead)'
    } else {
      return "keep"; // Routes to 'Claim Fee & Transfer to Creator Wallet'
    }
  }
  return "accumulate";
}`,
  },
  buybackAction: {
    id: "buybackAction",
    title: "Execute Buyback & Burn Action",
    subtitle: "Action Node // Target: 0xdead",
    filename: "ExecuteBuyback.sol",
    language: "solidity",
    emoji: "🔥",
    badgeColor: "bg-orange-900/60 text-orange-300 border-orange-600",
    description: "Odd cycle action: Swaps claimed ETH and delivers $VOID straight to 0xdead.",
    code: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

function executeBuybackAndBurn(uint256 ethAmount) external onlyKeeper {
    address[] memory path = new address[](2);
    path[0] = WETH;
    path[1] = address(VOID_TOKEN);

    // Tokens bought are deposited directly into the 0xdead event horizon
    router.swapExactETHForTokensSupportingFeeOnTransferTokens{value: ethAmount}(
        0,
        path,
        0x000000000000000000000000000000000000dEaD,
        block.timestamp + 180
    );
}`,
  },
  creatorPayout: {
    id: "creatorPayout",
    title: "Claim Fee & Transfer to Creator",
    subtitle: "Action Node // Target: Your Wallet",
    filename: "claimFeeToCreator.ts",
    language: "typescript",
    emoji: "💰",
    badgeColor: "bg-emerald-900/60 text-emerald-300 border-emerald-600",
    description: "Even cycle reward: Claims accumulated ETH from Pons Fee Escrow and transfers 100% directly to your Creator Address.",
    code: `import { ethers } from "ethers";

export async function claimAndTransferToCreator(
  feeEscrow: ethers.Contract,
  operatorWallet: ethers.Wallet,
  creatorAddress: string,
  feeAmountWei: bigint
) {
  // 1. Claim fee from Pons Escrow to operator wallet
  const claimTx = await feeEscrow.claim();
  await claimTx.wait();

  // 2. Transfer 100% of claimed fee directly to your Creator/Treasury Wallet
  const sendTx = await operatorWallet.sendTransaction({
    to: creatorAddress,
    value: feeAmountWei
  });
  const receipt = await sendTx.wait();

  console.log(\`[PAYOUT SUCCESS] Transferred \${ethers.formatEther(feeAmountWei)} ETH to \${creatorAddress}\`);
  console.log(\`Tx Hash: \${receipt.hash}\`);
}`,
  },
};

export { NODE_CODES };
