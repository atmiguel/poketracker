import { BoosterPackSetRetriever } from '../card/impls/booster-pack-set-retriever';

const main = async (): Promise<void> => {
  const { boosterPackSets } = await BoosterPackSetRetriever.getInstance().retrieveBoosterPackSets(
    {},
  );
  console.log(boosterPackSets);
};

main().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
