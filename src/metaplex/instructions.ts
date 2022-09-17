import { Sft, UpdateNftInput } from "@metaplex-foundation/js";
import { UpdateMetadataAccountArgsV2 } from "./update";

export const toInstructionData = (
    nftOrSft: Pick<
      Sft,
      | 'address'
      | 'collection'
      | 'creators'
      | 'name'
      | 'symbol'
      | 'uri'
      | 'sellerFeeBasisPoints'
      | 'uses'
    >,
    input: Partial<UpdateNftInput> = {}
  ): UpdateMetadataAccountArgsV2 => {
    const creators =
      input.creators === undefined
        ? nftOrSft.creators
        : input.creators.map((creator) => {
            const currentCreator = nftOrSft.creators.find(({ address }) =>
              address.equals(creator.address)
            );
            return {
              ...creator,
              verified: currentCreator?.verified ?? false,
            };
          });
  
    const currentCollection = nftOrSft.collection
      ? { ...nftOrSft.collection, key: nftOrSft.collection.address }
      : null;
    const newCollection = input.collection
      ? { key: input.collection, verified: false }
      : null;
  
    return {
      updateAuthority: input.newUpdateAuthority ?? null,
      primarySaleHappened: input.primarySaleHappened ?? null,
      isMutable: input.isMutable ?? null,
      data: {
        name: input.name ?? nftOrSft.name,
        symbol: input.symbol ?? nftOrSft.symbol,
        uri: input.uri ?? nftOrSft.uri,
        sellerFeeBasisPoints:
          input.sellerFeeBasisPoints ?? nftOrSft.sellerFeeBasisPoints,
        creators: creators.length > 0 ? creators : null,
        uses: input.uses === undefined ? nftOrSft.uses : input.uses,
        collection:
          input.collection === undefined ? currentCollection : newCollection,
      },
    };
  };
  