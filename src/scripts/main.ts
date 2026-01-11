import { CardInstances } from '../card/instances';

const main = async (): Promise<void> => {
  const { boosterPackSets } = await CardInstances.boosterPackSetRetriever.retrieveBoosterPackSets(
    {},
  );
  // console.log(boosterPackSets);
};

main().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
