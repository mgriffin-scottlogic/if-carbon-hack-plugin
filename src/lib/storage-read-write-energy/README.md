# Storage Read Write Energy

This plugin allows you to estimate the energy required to read/write data to a storage device, amount of data and drive type

## Parameters

### Plugin Config

Not Needed

### Inputs

- `duration`: Length of time the it will take to read/write the data
- `storage/drive-read-write-power`: Power of the drive(s), when reading/writing, used in Watts
- `storage/drive-read-write-speed`: Read/write speed of storage device used in GB/s
- `storage/data-transfer`: Amount of data to be read/written in GB

### Returns

An array containing:

- `duration`: Length of time the it will take to read/write the data
- `storage/drive-read-write-power`: Power of the drive(s), when reading/writing, used in Watts
- `storage/drive-read-write-speed`: Read/write speed of storage device used in GB/s
- `storage/data-transfer`: Amount of data to be read/written in GB
- `storage/energy`: The energy apportioned to reading/writing data in kWh

### Errors

Can throw errors in the following situations:

- Any of `duration`, `storage/drive-read-write-power`, `storage/drive-read-write-speed` or `storage/data-transfer` are not present in the input.
- Any of `duration`, `storage/drive-read-write-power`, `storage/drive-read-write-speed` or `storage/data-transfer` are not numbers.
- Any of `duration`, `storage/drive-read-write-power`, `storage/drive-read-write-speed` or `storage/data-transfer` are not positive.

## IF Implementation

To avoid tying the plugin to any point in time data, it requires the individual drive details to be passed in.Calculates the minimum time that that data could be written/read in, using:

$$\frac{data\text-transfer}{drive\text-read\text-write\text-speed} = min \space time$$

If this is greater than the provided duration it will use this instead. The formula for energy estimation is then:

$$\frac{drive\text-read\text-write\text-power}{1000} \times \frac{duration}{60 \times 60} = energy$$

Where $\frac{drive\text-read\text-write\text-power}{1000}$ gives a figure for kW and $\frac{duration}{60 \times 60}$ gives the time in hours. 

## Unit tests

Unit tests available [here](../../__tests__/unit/lib/storage-read-write-energy.test.ts)

## Example manifest

Example manifest available [here](../../../examples/storage-read-write-energy.yml)