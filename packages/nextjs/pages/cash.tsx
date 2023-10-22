"use client"
import MBirdSdk from "~~/components/mBirdTsSdk";
import React from "react";
import { useState, useEffect } from "react";
import { formatEther } from "viem";
import { useAccount } from "wagmi";
import { EtherInput } from "~~/components/scaffold-eth";
import { useScaffoldContractRead, useScaffoldContractWrite } from "~~/hooks/scaffold-eth";
import { multiplyTo1e18 } from "~~/utils/scaffold-eth/priceInWei";
import {getPaymentNameByType, uuidv4} from "~~/components/utils";

const CashPage = () => {
  const vaultAddress = process.env.NEXT_PUBLIC_VAULT_ADDRESS;
  const [cashOutAmount, setcashOutAmount] = useState("");
  const { address } = useAccount();
    const [logs, setLogs] = useState([]);
    const [registering, setRegistering] = useState(false);
    const [cashAmount, setCashAmount] = useState(0);
    const [topUpAmount, setTopUpAmount] = useState(0);

    const logNow = (...messages) => {
        const logMessage = messages.map(message => JSON.stringify(message)).join(' ');
        // @ts-ignore
        setLogs(prevLogs => [logMessage, ...prevLogs]);
    };

    const output = (msg, data, isError) => {
        // @ts-ignore
        logNow(msg, data);
        if (isError) console.error(`Error: ${msg}`);
    }

    const handleAction = (actionType) => {
        if (actionType === "Payment.CashBack") {
            getPaymentNameByType("cash")
                .then(function (name) {
                    MBirdSdk
                        .Payment.CashBack(window.transactionReference, name)
                        .then(function (result) {
                            output("Payment.CashBack " + window.transactionReference, result);
                        }).catch(function (error) {
                        output("Payment.CashBack " + window.transactionReference + " error", error, true);
                    });
                })
                .catch(function (error) {
                    output("Payment.CashBack " + window.transactionReference + " error", error, true);
                });
        } else if (actionType === "Payment.GetAcceptedCurrencies") {
            getPaymentNameByType("cash")
                .then(function (name) {
                    MBirdSdk
                        .Payment.GetAcceptedCurrencies(name)
                        .then(function (result) {
                            output("Payment.GetAcceptedCurrencies", result);
                        }).catch(function (error) {
                        output("Payment.GetAcceptedCurrencies" + " error", error, true);
                    });
                })
                .catch(function (error) {
                    output("Payment.GetAcceptedCurrencies" + " error", error, true);
                });
        } else if (actionType === "Payment.GetInventory") {
            getPaymentNameByType("cash")
                .then(function (name) {
                    MBirdSdk
                        .Payment.GetInventory(name)
                        .then(function (result) {
                            output("Payment.GetInventory", result);
                        }).catch(function (error) {
                        output("Payment.GetInventory" + " error", error, true);
                    });
                })
                .catch(function (error) {
                    output("Payment.GetInventory" + " error", error, true);
                });
        } else if (actionType === "Payment.StartAcceptMoney") {
            getPaymentNameByType("cash")
                .then((name) => {
                    output("MBIRDSDK: ", name)
                    MBirdSdk
                        .Payment.StartAcceptMoney(name)
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
                    MBirdSdk
                        .Payment.EndAcceptMoney(topUpAmount, name, null, window.transactionReference)
                        .then(function (result) {
                            output("Payment.EndAcceptMoney " + window.transactionReference, result);
                            handleAction("Payment.CashBack");
                        }).catch(function (error) {
                        output("Payment.EndAcceptMoney " + window.transactionReference + " error", error, true);
                    });
                })
                .catch(function (error) {
                    output("Payment.EndAcceptMoney " + window.transactionReference + " error", error, true);
                });
        } else if (actionType === "App.DeveloperTools") {
            // MBirdSdk.
            MBirdSdk
                .App.DeveloperTools()
                .then(function (result) {
                    output(JSON.stringify(result))
                })
                .catch(function (error) {
                    output("App.DeveloperTools" + " error", error, true);
                });

        }
    }

    useEffect(() => {
        let isConnected = MBirdSdk.isConnected()
        if (isConnected) {
            if (typeof window !== "undefined") {
                console.log('Initializing MBirdSdk in the browser')

                //This is SUPER important to receive real-time events from the machine environment
                window.MBirdSdk = MBirdSdk;
            }
            MBirdSdk
                .EventTriggers.List()
                .then(function (result) {
                    output("EventTriggers.List", result);
                }).catch(function (error) {
                output("EventTriggers.List" + " error", error, true);
            });

            MBirdSdk.PaymentCallbacks.PayProgress(function (data) {
                setCashAmount(data.CurrentPaidAmount)
                output("Pay progress received", data);
            });
            const handleEvent = (data) => {
                output("Outputting DATA: ", data);
            };


            MBirdSdk.EventTriggers.List().then((events) => {
                output("Checking....", events)
                setRegistering(true)
                MBirdSdk
                    .EventTriggers.Register(events)
                    .then(function (result) {
                        output("EventTriggers.Register", result);
                    }).catch(function (error) {
                    output("EventTriggers.Register" + " error", error, true);
                });
            });

            let subscriptionId = MBirdSdk.EventTriggers.OnEventRaised(function (eventRaised) {
                handleEvent(eventRaised)
            })


            // Cleanup function
            return () => {
                MBirdSdk.EventTriggers.UnsubscribeCallback(subscriptionId)
            };
        }
        const _amount = localStorage.getItem('cashInAmount')
        setTopUpAmount(_amount)


    }, []); // Empty dependency array means this effect runs once on mount and cleanup on unmount

   const _cashIn = async () => {
        await handleAction("Payment.StartAcceptMoney")
    }
    const _endAcceptMoney = async () => {
        handleAction("Payment.EndAcceptMoney");
   }
    const _cashOut = async () => {
        await handleAction("Payment.CashBack")
    }

    return (
    <div className="flex items-center flex-col flex-grow pt-2 mt-36">
      <EtherInput value={topUpAmount} onChange={amount => setTopUpAmount(amount)} />
      <div>
        <button onClick={_cashIn} className="btn btn-secondary mt-4">Cash In</button>
        <button onClick={_cashOut} className="btn btn-secondary mt-4">Cash Out</button>
        <button onClick={_endAcceptMoney} className="btn btn-secondary mt-4">End Accept Money</button>
      </div>
    </div>
  );
};

export default CashPage;
