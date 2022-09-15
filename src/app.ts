import { NftRetriever } from "../services/nft-retriever";
import schedule from "node-schedule";
import { NftUpdator } from "../services/nft-updator";

class SolanaMetaUpdater {
    private mode: 'once' | 'schedule';
    private frequency: number;
    private nftRetriever: NftRetriever;
    private nftUpdator: NftUpdator;

    constructor(mode: 'once' | 'schedule', scheduleFrequency = 5000) {
        this.mode = mode;
        this.frequency = scheduleFrequency;
        this.nftRetriever = new NftRetriever();
        this.nftUpdator = new NftUpdator();

        schedule.scheduleJob('*/5 * * * * *',   () => {
            this.startProcess();
        });
    }

    async startProcess() : Promise<void> {
        try {
            console.log('START PROCESS', this.frequency, this.mode);

            const nftToProcessList = await this.nftRetriever.getNftsToProcess(); // GET NFTS TO BURN FROM TENSEI API

            const processResult = await this.nftUpdator.processNftList(nftToProcessList); // PROCESS THOSE NFTS

            console.log('PROCESS ENDED', processResult)
        } catch (e: any) {
            console.log(`Process stoped: ${e}`);
        }
    }

}

const mainProgram = new SolanaMetaUpdater('once');