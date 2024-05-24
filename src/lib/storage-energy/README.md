# Storage Energy

This plugin allows you to estimate the energy required to store data, based on the amount of data, storage time and drive type.

## Parameters

### Plugin Config

Not Needed

### Inputs

- `duration`: Length of time the data will be stored in seconds
- `storage/drive-size`: Size of the drive(s) used in GB
- `storage/drive-power`: Power of the drive(s) used in Watts
- `storage/data-stored`: Amount of data stored in GB
- `storage/replication-factor`: the amount of times that the data is replicated (optional - defaults to 1)

### Returns

An array containing:

- `duration`: Length of time the data will be stored in seconds
- `storage/drive-size`: Size of the drive(s) used in GB
- `storage/drive-power`: Power of the drive(s) used in Watts
- `storage/data-stored`: Amount of data stored in GB
- `storage/replication-factor`: the amount of times that the data is replicated (optional - defaults to 1)
- `storage/energy`: The energy apportioned to the stored data in kWh

### Errors

Can throw errors in the following situations:

- Any of `duration`, `storage/drive-size`, `storage/drive-power` or `storage/data-stored` are not present in the input.
- Any of `duration`, `storage/drive-size`, `storage/drive-power`, `storage/data-stored` or `storage/replication-factor` are not numbers.
- Any of `duration`, `storage/drive-size`, `storage/drive-power`, `storage/data-stored` or `storage/replication-factor` are not positive.

## IF Implementation

Takes some inspiration from Cloud Carbon Footprint's [methodology](https://www.cloudcarbonfootprint.org/docs/methodology#storage) for storage. To avoid tying the plugin to any point in time data, it requires the individual drive details to be passed in. The formula for energy estimation is then:

$$\frac{drive\text-power}{drive\text-size \times 1000} \times \frac{data\text-stored \times replication\text-factor \times duration}{60 \times 60} = energy$$

Where $\frac{drive\text-power}{drive\text-size \times 1000}$ gives a figure for kWh per GB-hr stored and $\frac{data\text-stored \times replication\text-factor \times duration}{60 \times 60}$ gives the total number of GB-hours.

## Unit tests

Unit tests available [here](../../__tests__/unit/lib/storage-energy.test.ts)

## Example manifest

Example manifest available [here](../../../examples/storage-energy.yml)