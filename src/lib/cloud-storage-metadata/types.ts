type UsageTypeReplicationFactor = {
  usageTypeMatchers: string[];
  replicationFactor: number;
};

export type ServiceReplicationFactor = {
  usageTypeFactors?: UsageTypeReplicationFactor[];
  replicationFactor: number;
};
