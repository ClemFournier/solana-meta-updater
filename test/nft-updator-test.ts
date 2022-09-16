import assert from 'assert';
import { NftUpdator } from '../services/nft-updator';
  
describe("NFT Updator", () => {
    let nftUpdator: NftUpdator;
    let testMint = 'HtbB2P1Pn5mC7r2sBkixzFJ9NM6uuoLxAmWS47fPe51D';
    let testMetadata = 'https://ipfs.io/ipfs/bafybeiezeeu37shlzjtau3bols6oxiomhpaylyr2ykannwqk3s4i7wdbom/453.json';

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
        const processedNft = await nftUpdator.processNftList([{
            metadataToUpdate: undefined,
            mint: testMint
        }]);
        assert.equal(processedNft.processing.length, 0);
        assert.equal(processedNft.errors.length, 1);
    });

    it("One NFT with good arguments, should 0 error & 1 processing", async () => {
        const processedNft = await nftUpdator.processNftList([{
            metadataToUpdate: testMetadata,
            mint: testMint
        }]);
        assert.equal(processedNft.processing.length, 1);
        assert.equal(processedNft.errors.length, 0);
    });

});