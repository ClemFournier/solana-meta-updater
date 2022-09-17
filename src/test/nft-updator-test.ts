import assert from 'assert';
import { NftUpdator } from '../services/nft-updator';

require('dotenv').config({path:'../config/.env'});
  
describe("NFT Updator", () => {
    let nftUpdator: NftUpdator;

    before(async () => {
        nftUpdator = new NftUpdator();
    });
    
    after(async () => {

    });
      
    it("No NFT, should return 0 errors & 0 processing", async () => {
        const processedNft = await nftUpdator.processNftList([]);
        assert.equal(processedNft.processing.length + processedNft.errors.length, 0);
    });

    it("One NFT without metadata info, should 1 errors & 0 processing", async () => {
        if (!process.env.TEST_MINT) {
            assert.fail('Parameters wrong');
        }
        const processedNft = await nftUpdator.processNftList([{
            metadataToUpdate: undefined,
            mint: process.env.TEST_MINT
        }]);
        assert.equal(processedNft.processing.length, 0);
        assert.equal(processedNft.errors.length, 1);
    });

    it("One NFT with good arguments, should 0 error & 1 processing", async () => {
        if (!process.env.TEST_MINT || !process.env.TEST_METADATA) {
            assert.fail('Parameters wrong');
        }
        const processedNft = await nftUpdator.processNftList([{
            metadataToUpdate: process.env.TEST_METADATA,
            mint: process.env.TEST_MINT
        }]);
        assert.equal(processedNft.processing.length, 1);
        assert.equal(processedNft.errors.length, 0);
    });

});