# Ramboll Resilio

This plugin allows you to estimate the energy required to store data in the cloud, based on the amount of data and storage time.

## Parameters

## Plugin Config

Not Needed

### Inputs

- `duration`: Length of time the data will be stored in seconds
- `storage/data-stored`: Amount of data stored in GB

## Returns

An array containing:

- `duration`: Length of time the data will be stored in seconds
- `storage/data-stored`: Amount of data stored in GB
- `storage/energy`: The energy apportioned to the stored data in kWh

## IF Implementation

Based on Ramboll and Resilio paper available here: [Assessment of the energy footprint of digital actions and services](https://op.europa.eu/en/publication-detail/-/publication/d3b6c0a1-1171-11ee-b12e-01aa75ed71a1)

This particular estimate is based on Google's own storage figures, using the storage allocated per user and annual energy consumption by user. The paper notes that the amount of storage is arbitrary and the energy consumption relies on information from the company whose services it is trying to model. The figures used in the estimation are:

$$\frac{2.2kWh}{15GB} = 0.147 kWh/GB$$
