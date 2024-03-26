
# Cloud Storage Metadata

This plugin allows you to determine the replication factor for cloud storage, based on vendor, service and usage type.

## Parameters

## Plugin Config

Not Needed

### Inputs

- `cloud/vendor`: the cloud platform provider, e.g. `aws`
- `cloud/service`: the name of the service being used, e.g. `s3`
- `cloud/usage-type`: the usage type for the service, e.g. `Reduced Redundancy Storage - RRS` (optional)

## Returns

An array containing:

- `cloud/vendor`: echo input `vendor`
- `cloud/service`: echo input `service`
- `cloud/usage-type`: echo input `usage-type` (optional)
- `storage/replication-factor`: Amount of times stored data is replicated for given vendor/service/usage-type combination

## IF Implementation

IF implements this plugin using data from Cloud Carbon Footprint. 

Cloud Storage Metadata currently implements only for AWS 's3', Azure 'blob-storage' and GCP 'cloud-storage.