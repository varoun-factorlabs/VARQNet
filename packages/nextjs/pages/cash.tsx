"use client";

import React from "react";
import { useEffect, useState } from "react";
import { Card } from "@tremor/react";
import { formatEther } from "viem";
import { useAccount } from "wagmi";
import MBirdSdk from "~~/components/mBirdTsSdk";
import { EtherInput } from "~~/components/scaffold-eth";
import { getPaymentNameByType, uuidv4 } from "~~/components/utils";
import { useScaffoldContractRead, useScaffoldContractWrite } from "~~/hooks/scaffold-eth";
import { multiplyTo1e18 } from "~~/utils/scaffold-eth/priceInWei";

export const NUMBER_REGEX = /^\.?\d+\.?\d*$/;

const CashPage = () => {
  const atmAddress = process.env.NEXT_PUBLIC_USER_ATM_ADDRESS;
  const vaultAddress = process.env.NEXT_PUBLIC_VAULT_ADDRESS;
  const [cashOutAmount, setcashOutAmount] = useState("");
  const { address } = useAccount();
  const [logs, setLogs] = useState([]);
  const [registering, setRegistering] = useState(false);
  const [cashAmount, setCashAmount] = useState(0);
  const [topUpAmount, setTopUpAmount] = useState("");
  const [cashAvail, setCashAvail] = useState("");

  const handleBttdcCashOut = (event: any, reset: boolean = false) => {
    if (reset) {
      setTopUpAmount("");
    } else {
      setTopUpAmount(event.target.value);
    }
  };

  const { data: yourBTTDCBalance } = useScaffoldContractRead({
    contractName: "Backed_bTTDC",
    functionName: "balanceOf",
    args: [address],
  });

  const { data: atmBTTDCBalance } = useScaffoldContractRead({
    contractName: "Backed_bTTDC",
    functionName: "balanceOf",
    args: [atmAddress],
  });

  interface TransactionReceipt {
    blockHash: string;
  }

  const { writeAsync: deposit_bttdc } = useScaffoldContractWrite({
    contractName: "ATMContract",
    functionName: "deposit",
    args: [BigInt(multiplyTo1e18(topUpAmount))],
    // value: parseEther(ethAmount),
    onBlockConfirmation: (txnReceipt: TransactionReceipt) => {
      _cashOut()
    },
  });

  const logNow = (...messages) => {
    const logMessage = messages.map(message => JSON.stringify(message)).join(" ");
    // @ts-ignore
    setLogs(prevLogs => [logMessage, ...prevLogs]);
  };

  const output = (msg, data, isError) => {
    // @ts-ignore
    logNow(msg, data);
    if (isError) console.error(`Error: ${msg}`);
  };

  const handleAction = actionType => {
    if (actionType === "Payment.CashBack") {
      getPaymentNameByType("cash")
        .then(function (name) {
          MBirdSdk.Payment.CashBack(window.transactionReference, name)
            .then(function (result) {
              output("Payment.CashBack " + window.transactionReference, result);
            })
            .catch(function (error) {
              output("Payment.CashBack " + window.transactionReference + " error", error, true);
            });
        })
        .catch(function (error) {
          output("Payment.CashBack " + window.transactionReference + " error", error, true);
        });
    } else if (actionType === "Payment.GetAcceptedCurrencies") {
      getPaymentNameByType("cash")
        .then(function (name) {
          MBirdSdk.Payment.GetAcceptedCurrencies(name)
            .then(function (result) {
              output("Payment.GetAcceptedCurrencies", result);
            })
            .catch(function (error) {
              output("Payment.GetAcceptedCurrencies" + " error", error, true);
            });
        })
        .catch(function (error) {
          output("Payment.GetAcceptedCurrencies" + " error", error, true);
        });
    } else if (actionType === "Payment.GetInventory") {
      getPaymentNameByType("cash")
        .then(function (name) {
          MBirdSdk.Payment.GetInventory(name)
            .then(function (result) {
              output("Payment.GetInventory", result);
            })
            .catch(function (error) {
              output("Payment.GetInventory" + " error", error, true);
            });
        })
        .catch(function (error) {
          output("Payment.GetInventory" + " error", error, true);
        });
    } else if (actionType === "Payment.StartAcceptMoney") {
      getPaymentNameByType("cash")
        .then(name => {
          output("MBIRDSDK: ", name);
          MBirdSdk.Payment.StartAcceptMoney(name)
            .then(function (result) {
              output(`Payment.StartAcceptMoney ${result}`);
            })
            .catch(function (error) {
              output("Payment.StartAcceptMoney" + " error", error, true);
            });
        })
        .catch(function (error) {
          output("Payment.StartAcceptMoney" + " error", error, true);
        });
    } else if (actionType === "Payment.EndAcceptMoney") {
      window.transactionReference = uuidv4();
      getPaymentNameByType("cash")
        .then(function (name) {
          MBirdSdk.Payment.EndAcceptMoney(parseInt(topUpAmount) * 100, name, null, window.transactionReference)
            .then(function (result) {
              output("Payment.EndAcceptMoney " + window.transactionReference, result);
              // handleAction("Payment.CashBack");
            })
            .catch(function (error) {
              output("Payment.EndAcceptMoney " + window.transactionReference + " error", error, true);
            });
        })
        .catch(function (error) {
          output("Payment.EndAcceptMoney " + window.transactionReference + " error", error, true);
        });
    } else if (actionType === "App.DeveloperTools") {
      // MBirdSdk.
      MBirdSdk.App.DeveloperTools()
        .then(function (result) {
          output(JSON.stringify(result));
        })
        .catch(function (error) {
          output("App.DeveloperTools" + " error", error, true);
        });
    }
  };

  useEffect(() => {
    let isConnected = MBirdSdk.isConnected();
    if (isConnected) {
      if (typeof window !== "undefined") {
        console.log("Initializing MBirdSdk in the browser");

        //This is SUPER important to receive real-time events from the machine environment
        window.MBirdSdk = MBirdSdk;
      }
      MBirdSdk.EventTriggers.List()
        .then(function (result) {
          output("EventTriggers.List", result);
        })
        .catch(function (error) {
          output("EventTriggers.List" + " error", error, true);
        });

      MBirdSdk.PaymentCallbacks.PayProgress(function (data) {
        setCashAmount(data.CurrentPaidAmount);
        output("Pay progress received", data);
      });
      const handleEvent = data => {
        output("Outputting DATA: ", data);
      };

      MBirdSdk.EventTriggers.List().then(events => {
        output("Checking....", events);
        setRegistering(true);
        MBirdSdk.EventTriggers.Register(events)
          .then(function (result) {
            output("EventTriggers.Register", result);
          })
          .catch(function (error) {
            output("EventTriggers.Register" + " error", error, true);
          });
      });

      let subscriptionId = MBirdSdk.EventTriggers.OnEventRaised(function (eventRaised) {
        handleEvent(eventRaised);
      });

      // Cleanup function
      return () => {
        MBirdSdk.EventTriggers.UnsubscribeCallback(subscriptionId);
      };
    }
    const _amount = localStorage.getItem("cashInAmount");
    setTopUpAmount(_amount);
  }, []); // Empty dependency array means this effect runs once on mount and cleanup on unmount

  const _cashIn = async () => {
    await handleAction("Payment.StartAcceptMoney");
  };
  const _endAcceptMoney = async () => {
    handleAction("Payment.EndAcceptMoney");
  };
  const _cashOut = async () => {
    await handleAction("Payment.CashBack");
  };

  return (
    <div className="flex items-center flex-col flex-grow pt-6 lg:pt-12">
      <Card className="max-w-sm mx-auto rounded-3xl lg:mt-0 mt-14 bg-primary">
        <div className="justify-center flex flex-col mb-4">
          <div className="ml-3 text-2xl">
            <h1>Your Balance: </h1>
            <div className="flex flex-row">
              <div className="pb-1 inline-flex items-center justify-center">
                {parseFloat(formatEther(yourBTTDCBalance || "0")).toFixed(0)} <h1 className="pl-2 pt-2">bTTDC</h1>{" "}
              </div>
            </div>
          </div>

          <div className="flex bg-secondary rounded-2xl items-left flex-col flex-grow pt-4 mt-3">
            <div className="mb-4 text-xl">
              <h1 className="mb-2 ml-3">Fiat Withdrawal</h1>
              <div className={`flex ml-2`}>
                <input
                  value={topUpAmount}
                  onChange={handleBttdcCashOut}
                  placeholder="0"
                  className="input input-ghost text-3xl focus:outline-none focus:bg-transparent h-[2.2rem] min-h-[2.2rem] px-1 border w-full font-medium placeholder:text-black"
                />
              </div>
            </div>
          </div>

          <button
            onClick={async () => {
              setCashAvail;
              deposit_bttdc();
              handleBttdcCashOut(null, true);
            }}
            className="btn btn-neutral text-lg mt-4"
          >
            Send to Atm
          </button>

          <div className="flex bg-secondary rounded-2xl items-left flex-col flex-grow pt-4 mt-12 mb-2 mt-3">
            <div className="mb-3">
              <h1 className="mb-2 ml-3 text-xl">Cash available for withdrawal</h1>
              <div className={`flex ml-2 flex flex-row items-center align-center`}>
                <h1 className="text-3xl">$</h1>
                <div className="pb-1 pl-1 text-xl inline-flex items-center justify-center">
                  {parseFloat(formatEther(atmBTTDCBalance || "0")).toFixed(0)}{" "}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-row justify-between">
            <button className="btn btn-neutral w-1/3 text-lg" onClick={_cashIn}>
              Cash In
            </button>
            <button
              className="btn btn-neutral w-1/2 text-lg"
              onClick={async () => {
                _cashOut;
              }}
            >
              Cash Out
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CashPage;
