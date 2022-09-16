import assert from 'assert';
import { MetaplexService } from '../services/metaplex-service';
  
describe("Metaplex Services", () => {
    let metaplexService: MetaplexService;
    let testMint = 'HtbB2P1Pn5mC7r2sBkixzFJ9NM6uuoLxAmWS47fPe51D';
    let testMetadata = 'https://ipfs.io/ipfs/bafybeiezeeu37shlzjtau3bols6oxiomhpaylyr2ykannwqk3s4i7wdbom/453.json';

  before(async () => {
    metaplexService = new MetaplexService();
  });
  
  after(async () => {

  });
      
  describe("Update Metadata", () => {
    beforeEach(() => {
      
    });

    after(async () => {
      
    });
      
    it("Update NFT", async () => {
        const metaplexNft = await metaplexService.getNft(testMint);

        if (metaplexNft === null) {
            assert.fail(`Couldn't get NFT from Metaplex`);
        } 

        const updatedNft = await metaplexService.updateMetadata(metaplexNft, testMetadata);

        assert.equal(updatedNft, true);
    }).timeout(30000);
  });

});