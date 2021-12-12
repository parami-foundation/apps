import dayjs from "dayjs";
import type { DepositRecord, TransferDetails } from "@/reducers/TransfersReducer";
import type { BigNumberish } from "ethers";
import { BigNumber, ethers } from "ethers";

export const formatTransferDate = (transferDate: number | undefined) => {
    return transferDate ? dayjs(transferDate * 1000).format("MMM D, h:mmA") : "";
};

export const formatAmount = (amount: BigNumberish) => {
    return ethers.utils.formatUnits(amount);
}

export const computeAndFormatAmount = (amount: string) => {
    const amountParsed = parseInt(amount);
    const toBigInt = BigInt(amountParsed);
    const toBigNumber = BigNumber.from(toBigInt);
    return formatAmount(toBigNumber);
};

export const selectChains = (
    chains: (Bridge.EvmBridgeConfig | Bridge.SubstrateBridgeConfig)[],
    fromDomainId: number,
    toDomainId: number
) => {
    const fromChain = chains.find((chain) => chain.domainId === fromDomainId);
    const toChain = chains.find((chain) => chain.domainId === toDomainId);

    return { fromChain, toChain };
};

export const getColorSchemaTransferStatus = (status: number | undefined) => {
    switch (status) {
        case 1:
        case 2:
            return {
                borderColor: "#69C0FF",
                background: "#E6F7FF",
            };
        case 3:
            return {
                borderColor: "#389E0D",
                background: "#D9F7BE",
            };
        case 0:
        case 4:
            return {
                borderColor: "#FF4D4F",
                background: "#ff9a9b",
            };
        default:
            return {
                borderColor: "#548CA8",
                background: "#EEEEEE",
            };
    }
};

const formatDateTimeline = (date: number) => {
    return dayjs(date).format("h:mma");
};

export const computeTransferDetails = (
    txDetails: DepositRecord,
    chains: (Bridge.EvmBridgeConfig | Bridge.SubstrateBridgeConfig)[]
): TransferDetails => {
    const {
        timestamp,
        fromAddress,
        proposalEvents,
        amount,
        fromNetworkName,
        toNetworkName,
        depositTransactionHash,
        fromDomainId,
        toDomainId,
        status: proposalStatus,
        voteEvents,
        id,
    } = txDetails;

    const { fromChain, toChain } = selectChains(
        chains,
        fromDomainId!,
        toDomainId!
    );

    const formatedTransferDate = formatTransferDate(timestamp);

    const formatedAmount = computeAndFormatAmount(amount!);

    const pillColorStatus = getColorSchemaTransferStatus(proposalStatus);

    let timelineMessages: any = [];

    if (!proposalEvents.length && !voteEvents.length) {
        timelineMessages = [
            {
                message: "Deposit submitted",
                time: formatDateTimeline(timestamp!),
            },
        ];
    } else {
        const votesMessages = voteEvents.map((vote) => ({
            message: `Confirmed by`,
            time: formatDateTimeline(vote.timestamp),
            by: vote.by,
        }));

        switch (proposalEvents.length) {
            case 1: {
                const firstMessage = {
                    message: "Deposit submitted",
                    time: formatDateTimeline(proposalEvents[0].timestamp),
                };
                const createdBy = {
                    message: `Proposal created by`,
                    time: formatDateTimeline(proposalEvents[0].timestamp),
                    by: proposalEvents[0].by,
                };

                const waitingForMoreVotesMsg = {
                    message: "Waiting for more votes",
                    time: formatDateTimeline(proposalEvents[0].timestamp),
                };

                if (!voteEvents.length) {
                    timelineMessages = [
                        firstMessage,
                        createdBy,
                        waitingForMoreVotesMsg,
                    ] as any;
                    break;
                } else {
                    timelineMessages = [
                        firstMessage,
                        createdBy,
                        ...votesMessages,
                        waitingForMoreVotesMsg,
                    ] as any;

                    break;
                }
            }
            default: {
                timelineMessages = proposalEvents.reduce((acc: any, proposal, idx) => {
                    let newAcc = acc;
                    if (idx === 0) {
                        newAcc = [
                            {
                                message: "Deposit submitted",
                                time: formatDateTimeline(proposal.timestamp),
                            },
                            {
                                message: `Proposal created by`,
                                time: formatDateTimeline(proposal.timestamp),
                                by: proposalEvents[0].by,
                            },
                            ...votesMessages,
                        ];
                        return newAcc;
                    }

                    if (proposalStatus === 4) {
                        newAcc = [
                            ...newAcc,
                            {
                                message: `Proposal cancel by`,
                                time: formatDateTimeline(proposal.timestamp),
                                by: proposalEvents[0].by,
                            },
                            {
                                message: "Transfer canceled",
                                time: formatDateTimeline(proposal.timestamp),
                            },
                        ];
                        return newAcc;
                    } else if (proposalStatus === 2) {
                        newAcc = [
                            ...newAcc,
                            {
                                message: `Proposal passed by`,
                                time: formatDateTimeline(proposal.timestamp),
                                by: proposalEvents[0].by,
                            },
                            {
                                message: "Waiting for execution",
                                time: formatDateTimeline(proposal.timestamp),
                            },
                        ];
                        return newAcc;
                    } else if (proposalStatus === 3 && proposal.proposalStatus === 3) {
                        newAcc = [
                            ...newAcc,
                            {
                                message: `Proposal passed by`,
                                time: formatDateTimeline(proposal.timestamp),
                                by: proposalEvents[0].by,
                            },
                            {
                                message: `Proposal executed by`,
                                time: formatDateTimeline(proposal.timestamp),
                                by: proposalEvents[0].by,
                            },
                            {
                                message: `Transfer executed on ${toChain?.name}`,
                                time: formatDateTimeline(proposal.timestamp),
                            },
                        ];
                        return newAcc;
                    }
                    return newAcc;
                }, []);
                break;
            }
        }
    }

    return {
        id,
        formatedTransferDate,
        fromAddress,
        formatedAmount,
        fromNetworkName,
        toNetworkName,
        depositTransactionHash,
        fromDomainId,
        toDomainId,
        voteEvents,
        proposalEvents,
        proposalStatus,
        timelineMessages,
        fromChain,
        toChain,
        pillColorStatus,
    };
};
