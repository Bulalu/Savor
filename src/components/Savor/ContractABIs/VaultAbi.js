const VaultAbi = () => {

  return (

    [
      {
      "inputs": [{
        "internalType": "contract ERC20",
        "name": "_UNDERLYING",
        "type": "address",
      }, { "internalType": "address", "name": "_bridgerton", "type": "address" }],
      "stateMutability": "nonpayable",
      "type": "constructor",
    }, {
      "anonymous": false,
      "inputs": [{ "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, {
        "indexed": true,
        "internalType": "address",
        "name": "spender",
        "type": "address",
      }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }],
      "name": "Approval",
      "type": "event",
    }, {
      "anonymous": false,
      "inputs": [{ "indexed": true, "internalType": "address", "name": "caller", "type": "address" }, {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address",
      }, { "indexed": false, "internalType": "uint256", "name": "assets", "type": "uint256" }, {
        "indexed": false,
        "internalType": "uint256",
        "name": "shares",
        "type": "uint256",
      }],
      "name": "Deposit",
      "type": "event",
    }, {
      "anonymous": false,
      "inputs": [{ "indexed": true, "internalType": "address", "name": "user", "type": "address" }, {
        "indexed": false,
        "internalType": "uint256",
        "name": "newFeePercent",
        "type": "uint256",
      }],
      "name": "FeePercentUpdated",
      "type": "event",
    }, {
      "anonymous": false,
      "inputs": [{ "indexed": true, "internalType": "address", "name": "user", "type": "address" }, {
        "indexed": false,
        "internalType": "uint256",
        "name": "rvTokenAmount",
        "type": "uint256",
      }],
      "name": "FeesClaimed",
      "type": "event",
    }, {
      "anonymous": false,
      "inputs": [{
        "indexed": false,
        "internalType": "uint256",
        "name": "chainId",
        "type": "uint256",
      }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }],
      "name": "FundsSwapped",
      "type": "event",
    }, {
      "anonymous": false,
      "inputs": [{ "indexed": true, "internalType": "address", "name": "user", "type": "address" }, {
        "indexed": false,
        "internalType": "contract Strategy[]",
        "name": "strategies",
        "type": "address[]",
      }],
      "name": "Harvest",
      "type": "event",
    }, {
      "anonymous": false,
      "inputs": [{ "indexed": true, "internalType": "address", "name": "user", "type": "address" }, {
        "indexed": false,
        "internalType": "uint64",
        "name": "newHarvestDelay",
        "type": "uint64",
      }],
      "name": "HarvestDelayUpdateScheduled",
      "type": "event",
    }, {
      "anonymous": false,
      "inputs": [{ "indexed": true, "internalType": "address", "name": "user", "type": "address" }, {
        "indexed": false,
        "internalType": "uint64",
        "name": "newHarvestDelay",
        "type": "uint64",
      }],
      "name": "HarvestDelayUpdated",
      "type": "event",
    }, {
      "anonymous": false,
      "inputs": [{ "indexed": true, "internalType": "address", "name": "user", "type": "address" }, {
        "indexed": false,
        "internalType": "uint128",
        "name": "newHarvestWindow",
        "type": "uint128",
      }],
      "name": "HarvestWindowUpdated",
      "type": "event",
    }, {
      "anonymous": false,
      "inputs": [{ "indexed": true, "internalType": "address", "name": "user", "type": "address" }],
      "name": "Initialized",
      "type": "event",
    }, {
      "anonymous": false,
      "inputs": [{ "indexed": false, "internalType": "address", "name": "_keeper", "type": "address" }],
      "name": "KeeperUpdated",
      "type": "event",
    }, {
      "anonymous": false,
      "inputs": [{
        "indexed": true,
        "internalType": "address",
        "name": "previousOwner",
        "type": "address",
      }, { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" }],
      "name": "OwnershipTransferred",
      "type": "event",
    }, { "anonymous": false, "inputs": [], "name": "PendingWithdrawalsPayed", "type": "event" }, {
      "anonymous": false,
      "inputs": [{ "indexed": true, "internalType": "address", "name": "user", "type": "address" }, {
        "indexed": true,
        "internalType": "contract Strategy",
        "name": "strategy",
        "type": "address",
      }, { "indexed": false, "internalType": "uint256", "name": "underlyingAmount", "type": "uint256" }],
      "name": "StrategyDeposit",
      "type": "event",
    }, {
      "anonymous": false,
      "inputs": [{ "indexed": true, "internalType": "address", "name": "user", "type": "address" }, {
        "indexed": true,
        "internalType": "contract Strategy",
        "name": "strategy",
        "type": "address",
      }],
      "name": "StrategyDistrusted",
      "type": "event",
    }, {
      "anonymous": false,
      "inputs": [{ "indexed": true, "internalType": "address", "name": "user", "type": "address" }, {
        "indexed": true,
        "internalType": "contract Strategy",
        "name": "strategy",
        "type": "address",
      }],
      "name": "StrategyTrusted",
      "type": "event",
    }, {
      "anonymous": false,
      "inputs": [{ "indexed": true, "internalType": "address", "name": "user", "type": "address" }, {
        "indexed": true,
        "internalType": "contract Strategy",
        "name": "strategy",
        "type": "address",
      }, { "indexed": false, "internalType": "uint256", "name": "underlyingAmount", "type": "uint256" }],
      "name": "StrategyWithdrawal",
      "type": "event",
    }, {
      "anonymous": false,
      "inputs": [{ "indexed": true, "internalType": "address", "name": "user", "type": "address" }, {
        "indexed": false,
        "internalType": "uint256",
        "name": "newTargetFloat",
        "type": "uint256",
      }],
      "name": "TargetFloatUpdated",
      "type": "event",
    }, {
      "anonymous": false,
      "inputs": [{ "indexed": true, "internalType": "address", "name": "from", "type": "address" }, {
        "indexed": true,
        "internalType": "address",
        "name": "to",
        "type": "address",
      }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }],
      "name": "Transfer",
      "type": "event",
    }, {
      "anonymous": false,
      "inputs": [{ "indexed": false, "internalType": "uint256", "name": "newVirtualPrice", "type": "uint256" }],
      "name": "VirtualPriceUpdated",
      "type": "event",
    }, {
      "anonymous": false,
      "inputs": [{ "indexed": true, "internalType": "address", "name": "caller", "type": "address" }, {
        "indexed": true,
        "internalType": "address",
        "name": "receiver",
        "type": "address",
      }, { "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, {
        "indexed": false,
        "internalType": "uint256",
        "name": "assets",
        "type": "uint256",
      }, { "indexed": false, "internalType": "uint256", "name": "shares", "type": "uint256" }],
      "name": "Withdraw",
      "type": "event",
    }, {
      "anonymous": false,
      "inputs": [{ "indexed": true, "internalType": "address", "name": "user", "type": "address" }, {
        "indexed": false,
        "internalType": "uint256",
        "name": "index",
        "type": "uint256",
      }, {
        "indexed": true,
        "internalType": "contract Strategy",
        "name": "replacedStrategy",
        "type": "address",
      }, { "indexed": true, "internalType": "contract Strategy", "name": "replacementStrategy", "type": "address" }],
      "name": "WithdrawalStackIndexReplaced",
      "type": "event",
    }, {
      "anonymous": false,
      "inputs": [{ "indexed": true, "internalType": "address", "name": "user", "type": "address" }, {
        "indexed": false,
        "internalType": "uint256",
        "name": "index",
        "type": "uint256",
      }, {
        "indexed": true,
        "internalType": "contract Strategy",
        "name": "replacedStrategy",
        "type": "address",
      }, { "indexed": true, "internalType": "contract Strategy", "name": "previousTipStrategy", "type": "address" }],
      "name": "WithdrawalStackIndexReplacedWithTip",
      "type": "event",
    }, {
      "anonymous": false,
      "inputs": [{ "indexed": true, "internalType": "address", "name": "user", "type": "address" }, {
        "indexed": false,
        "internalType": "uint256",
        "name": "index1",
        "type": "uint256",
      }, { "indexed": false, "internalType": "uint256", "name": "index2", "type": "uint256" }, {
        "indexed": true,
        "internalType": "contract Strategy",
        "name": "newStrategy1",
        "type": "address",
      }, { "indexed": true, "internalType": "contract Strategy", "name": "newStrategy2", "type": "address" }],
      "name": "WithdrawalStackIndexesSwapped",
      "type": "event",
    }, {
      "anonymous": false,
      "inputs": [{ "indexed": true, "internalType": "address", "name": "user", "type": "address" }, {
        "indexed": true,
        "internalType": "contract Strategy",
        "name": "poppedStrategy",
        "type": "address",
      }],
      "name": "WithdrawalStackPopped",
      "type": "event",
    }, {
      "anonymous": false,
      "inputs": [{ "indexed": true, "internalType": "address", "name": "user", "type": "address" }, {
        "indexed": true,
        "internalType": "contract Strategy",
        "name": "pushedStrategy",
        "type": "address",
      }],
      "name": "WithdrawalStackPushed",
      "type": "event",
    }, {
      "anonymous": false,
      "inputs": [{ "indexed": true, "internalType": "address", "name": "user", "type": "address" }, {
        "indexed": false,
        "internalType": "contract Strategy[]",
        "name": "replacedWithdrawalStack",
        "type": "address[]",
      }],
      "name": "WithdrawalStackSet",
      "type": "event",
    }, {
      "anonymous": false,
      "inputs": [{
        "indexed": false,
        "internalType": "uint16",
        "name": "_chainId",
        "type": "uint16",
      }, { "indexed": false, "internalType": "bytes", "name": "_srcAddress", "type": "bytes" }, {
        "indexed": false,
        "internalType": "address",
        "name": "_token",
        "type": "address",
      }, { "indexed": false, "internalType": "uint256", "name": "amountLD", "type": "uint256" }],
      "name": "sgReceived",
      "type": "event",
    }, {
      "inputs": [],
      "name": "DOMAIN_SEPARATOR",
      "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }],
      "stateMutability": "view",
      "type": "function",
    }, {
      "inputs": [],
      "name": "PERMIT_TYPEHASH",
      "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }],
      "stateMutability": "view",
      "type": "function",
    }, {
      "inputs": [],
      "name": "UNDERLYING",
      "outputs": [{ "internalType": "contract ERC20", "name": "", "type": "address" }],
      "stateMutability": "view",
      "type": "function",
    }, {
      "inputs": [],
      "name": "_totalSupply",
      "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
      "stateMutability": "view",
      "type": "function",
    }, {
      "inputs": [{ "internalType": "address", "name": "", "type": "address" }, {
        "internalType": "address",
        "name": "",
        "type": "address",
      }],
      "name": "allowance",
      "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
      "stateMutability": "view",
      "type": "function",
    }, {
      "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256",
      }],
      "name": "approve",
      "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
      "stateMutability": "nonpayable",
      "type": "function",
    }, {
      "inputs": [],
      "name": "asset",
      "outputs": [{ "internalType": "contract ERC20", "name": "", "type": "address" }],
      "stateMutability": "view",
      "type": "function",
    }, {
      "inputs": [{ "internalType": "address", "name": "", "type": "address" }],
      "name": "balanceOf",
      "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
      "stateMutability": "view",
      "type": "function",
    }, {
      "inputs": [{ "internalType": "uint256", "name": "rvTokenAmount", "type": "uint256" }],
      "name": "claimFees",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
    }, {
      "inputs": [{ "internalType": "uint256", "name": "shares", "type": "uint256" }],
      "name": "convertToAssets",
      "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
      "stateMutability": "view",
      "type": "function",
    }, {
      "inputs": [{ "internalType": "uint256", "name": "assets", "type": "uint256" }],
      "name": "convertToShares",
      "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
      "stateMutability": "view",
      "type": "function",
    }, {
      "inputs": [],
      "name": "decimals",
      "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }],
      "stateMutability": "view",
      "type": "function",
    }, {
      "inputs": [{ "internalType": "uint256", "name": "assets", "type": "uint256" }, {
        "internalType": "address",
        "name": "receiver",
        "type": "address",
      }],
      "name": "deposit",
      "outputs": [{ "internalType": "uint256", "name": "shares", "type": "uint256" }],
      "stateMutability": "nonpayable",
      "type": "function",
    }, {
      "inputs": [{
        "internalType": "contract Strategy",
        "name": "strategy",
        "type": "address",
      }, { "internalType": "uint256", "name": "underlyingAmount", "type": "uint256" }],
      "name": "depositIntoStrategy",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
    }, {
      "inputs": [],
      "name": "destroy",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
    }, {
      "inputs": [{ "internalType": "contract Strategy", "name": "strategy", "type": "address" }],
      "name": "distrustStrategy",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
    }, {
      "inputs": [],
      "name": "feePercent",
      "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
      "stateMutability": "view",
      "type": "function",
    }, {
      "inputs": [{ "internalType": "contract Strategy", "name": "", "type": "address" }],
      "name": "getStrategyData",
      "outputs": [{ "internalType": "bool", "name": "trusted", "type": "bool" }, {
        "internalType": "uint248",
        "name": "balance",
        "type": "uint248",
      }],
      "stateMutability": "view",
      "type": "function",
    }, {
      "inputs": [],
      "name": "getWithdrawalStack",
      "outputs": [{ "internalType": "contract Strategy[]", "name": "", "type": "address[]" }],
      "stateMutability": "view",
      "type": "function",
    }, {
      "inputs": [],
      "name": "harvestDelay",
      "outputs": [{ "internalType": "uint64", "name": "", "type": "uint64" }],
      "stateMutability": "view",
      "type": "function",
    }, {
      "inputs": [],
      "name": "harvestWindow",
      "outputs": [{ "internalType": "uint128", "name": "", "type": "uint128" }],
      "stateMutability": "view",
      "type": "function",
    }, {
      "inputs": [],
      "name": "initialize",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
    }, {
      "inputs": [],
      "name": "isInitialized",
      "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
      "stateMutability": "view",
      "type": "function",
    }, {
      "inputs": [],
      "name": "keeper",
      "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
      "stateMutability": "view",
      "type": "function",
    }, {
      "inputs": [],
      "name": "lastHarvest",
      "outputs": [{ "internalType": "uint64", "name": "", "type": "uint64" }],
      "stateMutability": "view",
      "type": "function",
    }, {
      "inputs": [],
      "name": "lastHarvestWindowStart",
      "outputs": [{ "internalType": "uint64", "name": "", "type": "uint64" }],
      "stateMutability": "view",
      "type": "function",
    }, {
      "inputs": [],
      "name": "lockedProfit",
      "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
      "stateMutability": "view",
      "type": "function",
    }, {
      "inputs": [{ "internalType": "address", "name": "", "type": "address" }],
      "name": "maxDeposit",
      "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
      "stateMutability": "view",
      "type": "function",
    }, {
      "inputs": [],
      "name": "maxLockedProfit",
      "outputs": [{ "internalType": "uint128", "name": "", "type": "uint128" }],
      "stateMutability": "view",
      "type": "function",
    }, {
      "inputs": [{ "internalType": "address", "name": "", "type": "address" }],
      "name": "maxMint",
      "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
      "stateMutability": "view",
      "type": "function",
    }, {
      "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }],
      "name": "maxRedeem",
      "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
      "stateMutability": "view",
      "type": "function",
    }, {
      "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }],
      "name": "maxWithdraw",
      "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
      "stateMutability": "view",
      "type": "function",
    }, {
      "inputs": [{ "internalType": "uint256", "name": "shares", "type": "uint256" }, {
        "internalType": "address",
        "name": "receiver",
        "type": "address",
      }],
      "name": "mint",
      "outputs": [{ "internalType": "uint256", "name": "assets", "type": "uint256" }],
      "stateMutability": "nonpayable",
      "type": "function",
    }, {
      "inputs": [],
      "name": "name",
      "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
      "stateMutability": "view",
      "type": "function",
    }, {
      "inputs": [],
      "name": "nextHarvestDelay",
      "outputs": [{ "internalType": "uint64", "name": "", "type": "uint64" }],
      "stateMutability": "view",
      "type": "function",
    }, {
      "inputs": [{ "internalType": "address", "name": "", "type": "address" }],
      "name": "nonces",
      "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
      "stateMutability": "view",
      "type": "function",
    }, {
      "inputs": [],
      "name": "owner",
      "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
      "stateMutability": "view",
      "type": "function",
    }, {
      "inputs": [],
      "name": "pendingWithdrawals",
      "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
      "stateMutability": "view",
      "type": "function",
    }, {
      "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }, {
        "internalType": "address",
        "name": "spender",
        "type": "address",
      }, { "internalType": "uint256", "name": "value", "type": "uint256" }, {
        "internalType": "uint256",
        "name": "deadline",
        "type": "uint256",
      }, { "internalType": "uint8", "name": "v", "type": "uint8" }, {
        "internalType": "bytes32",
        "name": "r",
        "type": "bytes32",
      }, { "internalType": "bytes32", "name": "s", "type": "bytes32" }],
      "name": "permit",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
    }, {
      "inputs": [],
      "name": "popFromWithdrawalStack",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
    }, {
      "inputs": [{ "internalType": "uint256", "name": "assets", "type": "uint256" }],
      "name": "previewDeposit",
      "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
      "stateMutability": "view",
      "type": "function",
    }, {
      "inputs": [{ "internalType": "uint256", "name": "shares", "type": "uint256" }],
      "name": "previewMint",
      "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
      "stateMutability": "view",
      "type": "function",
    }, {
      "inputs": [{ "internalType": "uint256", "name": "shares", "type": "uint256" }],
      "name": "previewRedeem",
      "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
      "stateMutability": "view",
      "type": "function",
    }, {
      "inputs": [{ "internalType": "uint256", "name": "assets", "type": "uint256" }],
      "name": "previewWithdraw",
      "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
      "stateMutability": "view",
      "type": "function",
    }, {
      "inputs": [{ "internalType": "contract Strategy", "name": "strategy", "type": "address" }],
      "name": "pushToWithdrawalStack",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
    }, {
      "inputs": [{ "internalType": "uint256", "name": "shares", "type": "uint256" }, {
        "internalType": "address",
        "name": "receiver",
        "type": "address",
      }, { "internalType": "address", "name": "owner", "type": "address" }],
      "name": "redeem",
      "outputs": [{ "internalType": "uint256", "name": "assets", "type": "uint256" }],
      "stateMutability": "nonpayable",
      "type": "function",
    }, {
      "inputs": [],
      "name": "renounceOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
    }, {
      "inputs": [{
        "internalType": "uint256",
        "name": "index",
        "type": "uint256",
      }, { "internalType": "contract Strategy", "name": "replacementStrategy", "type": "address" }],
      "name": "replaceWithdrawalStackIndex",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
    }, {
      "inputs": [{ "internalType": "uint256", "name": "index", "type": "uint256" }],
      "name": "replaceWithdrawalStackIndexWithTip",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
    }, {
      "inputs": [{ "internalType": "uint256", "name": "toWithdraw", "type": "uint256" }, {
        "internalType": "uint256",
        "name": "toDeposit",
        "type": "uint256",
      }, { "internalType": "uint256", "name": "newFloat", "type": "uint256" }],
      "name": "runHarvest",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
    }, {
      "inputs": [{ "internalType": "address", "name": "_bridgerton", "type": "address" }],
      "name": "setBridgerton",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
    }, {
      "inputs": [{ "internalType": "uint256", "name": "newFeePercent", "type": "uint256" }],
      "name": "setFeePercent",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
    }, {
      "inputs": [{ "internalType": "uint64", "name": "newHarvestDelay", "type": "uint64" }],
      "name": "setHarvestDelay",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
    }, {
      "inputs": [{ "internalType": "uint128", "name": "newHarvestWindow", "type": "uint128" }],
      "name": "setHarvestWindow",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
    }, {
      "inputs": [{ "internalType": "address", "name": "_newKeeper", "type": "address" }],
      "name": "setNewKeeper",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
    }, {
      "inputs": [{ "internalType": "uint256", "name": "newTargetFloat", "type": "uint256" }],
      "name": "setTargetFloat",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
    }, {
      "inputs": [{ "internalType": "contract Strategy[]", "name": "newStack", "type": "address[]" }],
      "name": "setWithdrawalStack",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
    }, {
      "inputs": [{ "internalType": "uint16", "name": "_chainId", "type": "uint16" }, {
        "internalType": "bytes",
        "name": "_srcAddress",
        "type": "bytes",
      }, { "internalType": "uint256", "name": "_nonce", "type": "uint256" }, {
        "internalType": "address",
        "name": "_token",
        "type": "address",
      }, { "internalType": "uint256", "name": "amountLD", "type": "uint256" }, {
        "internalType": "bytes",
        "name": "payload",
        "type": "bytes",
      }], "name": "sgReceive", "outputs": [], "stateMutability": "nonpayable", "type": "function",
    }, {
      "inputs": [{ "internalType": "address", "name": "", "type": "address" }],
      "name": "sharesPending",
      "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
      "stateMutability": "view",
      "type": "function",
    }, {
      "inputs": [{ "internalType": "uint16", "name": "chainId", "type": "uint16" }, {
        "internalType": "uint256",
        "name": "_amount",
        "type": "uint256",
      }, { "internalType": "address", "name": "_vaultTo", "type": "address" }],
      "name": "swap",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function",
    }, {
      "inputs": [{ "internalType": "uint256", "name": "index1", "type": "uint256" }, {
        "internalType": "uint256",
        "name": "index2",
        "type": "uint256",
      }], "name": "swapWithdrawalStackIndexes", "outputs": [], "stateMutability": "nonpayable", "type": "function",
    }, {
      "inputs": [],
      "name": "symbol",
      "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
      "stateMutability": "view",
      "type": "function",
    }, {
      "inputs": [],
      "name": "targetFloat",
      "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
      "stateMutability": "view",
      "type": "function",
    }, {
      "inputs": [],
      "name": "thisVaultsHoldings",
      "outputs": [{ "internalType": "uint256", "name": "underlyingHeld", "type": "uint256" }],
      "stateMutability": "view",
      "type": "function",
    }, {
      "inputs": [],
      "name": "thisVaultsSupply",
      "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
      "stateMutability": "view",
      "type": "function",
    }, {
      "inputs": [],
      "name": "totalAssets",
      "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
      "stateMutability": "view",
      "type": "function",
    }, {
      "inputs": [],
      "name": "totalFloat",
      "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
      "stateMutability": "view",
      "type": "function",
    }, {
      "inputs": [],
      "name": "totalStrategyHoldings",
      "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
      "stateMutability": "view",
      "type": "function",
    }, {
      "inputs": [],
      "name": "totalSupply",
      "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
      "stateMutability": "view",
      "type": "function",
    }, {
      "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }],
      "name": "totalUserBalance",
      "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
      "stateMutability": "view",
      "type": "function",
    }, {
      "inputs": [{ "internalType": "address", "name": "to", "type": "address" }, {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256",
      }],
      "name": "transfer",
      "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
      "stateMutability": "nonpayable",
      "type": "function",
    }, {
      "inputs": [{ "internalType": "address", "name": "from", "type": "address" }, {
        "internalType": "address",
        "name": "to",
        "type": "address",
      }, { "internalType": "uint256", "name": "amount", "type": "uint256" }],
      "name": "transferFrom",
      "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
      "stateMutability": "nonpayable",
      "type": "function",
    }, {
      "inputs": [{ "internalType": "address", "name": "newOwner", "type": "address" }],
      "name": "transferOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
    }, {
      "inputs": [{ "internalType": "contract Strategy", "name": "strategy", "type": "address" }],
      "name": "trustStrategy",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
    }, {
      "inputs": [{ "internalType": "uint256", "name": "_virtualPrice", "type": "uint256" }],
      "name": "updateVirtualPrice",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
    }, {
      "inputs": [],
      "name": "virtualPrice",
      "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
      "stateMutability": "view",
      "type": "function",
    }, {
      "inputs": [{ "internalType": "uint256", "name": "assets", "type": "uint256" }, {
        "internalType": "address",
        "name": "receiver",
        "type": "address",
      }, { "internalType": "address", "name": "owner", "type": "address" }],
      "name": "withdraw",
      "outputs": [{ "internalType": "uint256", "name": "shares", "type": "uint256" }],
      "stateMutability": "nonpayable",
      "type": "function",
    }, {
      "inputs": [{
        "internalType": "contract Strategy",
        "name": "strategy",
        "type": "address",
      }, { "internalType": "uint256", "name": "underlyingAmount", "type": "uint256" }],
      "name": "withdrawFromStrategy",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function",
    }, {
      "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
      "name": "withdrawalStack",
      "outputs": [{ "internalType": "contract Strategy", "name": "", "type": "address" }],
      "stateMutability": "view",
      "type": "function",
    }, { "stateMutability": "payable", "type": "receive" }
    ]
  );
};

export default VaultAbi;
