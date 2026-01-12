export interface ITrackerSyncer {
  syncTracker: (params: {}) => Promise<void>;
}
