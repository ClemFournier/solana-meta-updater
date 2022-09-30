import { NftRetriever } from "./services/nft-retriever";
import schedule from "node-schedule";
import { NftUpdator } from "./services/nft-updator";
import { NftsService } from "./services/nfts-service";

require('dotenv').config({path:'./config/.env'});

export class SolanaMetaUpdater {
    private mode: 'once' | 'schedule';
    private frequency: number;
    private collectionId: string | undefined;
    private nftsService: NftsService;
    private nftRetriever: NftRetriever;
    private nftUpdator: NftUpdator;
    private scheduleJob: schedule.Job;

    constructor(mode: 'once' | 'schedule', scheduleFrequency = 5000) {
        this.mode = mode;
        this.frequency = scheduleFrequency;
        this.collectionId = process.env.COLLECTION_ID;

        if (!this.collectionId) {
            throw('Enviromenent variables incorrect for SolanaMetaUpdater');
        }

        this.nftsService = new NftsService();
        this.nftRetriever = new NftRetriever(this.nftsService);
        this.nftUpdator = new NftUpdator(this.nftsService);
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
                console.log(`${new Date().toLocaleString()} - Wrong mode argument`);
        }
    }

    async startProcess() : Promise<void> {
        try {
            if (!this.collectionId) {
                throw('Enviromenent variables incorrect for SolanaMetaUpdater');
            }

            const nftToProcessList = await this.nftRetriever.getNftsToProcess(this.collectionId);

            if (!nftToProcessList || nftToProcessList.length === 0) return;

            const processResult = await this.nftUpdator.processNftList(nftToProcessList);

            const numberProcessed = processResult.filter(res => res.processed).length;

            if (numberProcessed > 0) {
                console.log(`${new Date().toLocaleString()} - ${processResult.filter(res => res.processed).length} processed.`);
            }

        } catch (e: any) {
            console.log(`${new Date().toLocaleString()} - Process stoped: ${e}`);
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

const mode = process.env.MODE;

if (!mode || (mode !== 'once' && mode !== 'schedule')) {
    throw('Enviromenent variables incorrect');
}

const mainProgram = new SolanaMetaUpdater(mode);