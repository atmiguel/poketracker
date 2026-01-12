import { TrackerConstants } from '../tracker/constants';
import { TrackerSyncer } from '../tracker/impls/tracker-syncer';

const main = async (): Promise<void> => {
  const trackerSyncer = TrackerSyncer.create({ spreadsheetId: TrackerConstants.ADRIAN_SPREADSHEET_ID });
  await trackerSyncer.syncTracker({});
};

main().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
