import { NftRetriever } from "../services/nft-retriever";
import schedule from "node-schedule";
import { NftUpdator } from "../services/nft-updator";

export class SolanaMetaUpdater {
    private mode: 'once' | 'schedule';
    private frequency: number;
    private nftRetriever: NftRetriever;
    private nftUpdator: NftUpdator;
    private scheduleJob: schedule.Job;

    constructor(mode: 'once' | 'schedule', scheduleFrequency = 5000) {
        this.mode = mode;
        this.frequency = scheduleFrequency;
        this.nftRetriever = new NftRetriever();
        this.nftUpdator = new NftUpdator();
        this.scheduleJob = new schedule.Job('updator-process');

        switch (mode) {
            case 'once':
                this.startProcess();
                break;
            case 'schedule':
                this.scheduleJob = schedule.scheduleJob(`*/${scheduleFrequency/1000} * * * * *`, () => {
                    this.startProcess();
                });
                break;
            default:
                console.log('Wrong mode argument');
        }
    }

    async startProcess() : Promise<void> {
        try {
            const nftToProcessList = await this.nftRetriever.getNftsToProcess(); // GET NFTS TO BURN FROM TENSEI API

            if (!nftToProcessList || nftToProcessList.length === 0) return;

            const processResult = await this.nftUpdator.processNftList(nftToProcessList); // PROCESS THOSE NFTS

        } catch (e: any) {
            console.log(`Process stoped: ${e}`);
        }
    }

    async stopProcess() : Promise<void> {
        await schedule.gracefulShutdown();
    }

    getProcessStatus(): number {
        return Object.keys(schedule.scheduledJobs).length;
    }

    getProcessName(): string {
        return this.scheduleJob.name;
    }

    getParameters(): {mode: string, frequency?: number} {
        return {mode: this.mode, frequency: this.frequency};
    }

}

// const mainProgram = new SolanaMetaUpdater('once');