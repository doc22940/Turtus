# Turt.us-lib

These are core packages, utils, and modules that are used throughout the services.

This package extrapolates the core functionality of turtus and serves as a starting point for several adapters which allow you to plug in your own services/databases/etc. (E.g. using firebase, mongodb, or postgres for your database).

## Installation 

Currently this package is not on any registry and can only be obtained via github:

```bash
yarn add https://github.com/Khauri/turtus-lib
```

You can also clone the github and use `yarn link` (see Development section)

## Development

Currently the easiest way to develop this package is by using yarn link. 

Clone this repository and inside the root folder run:

```bash
yarn link
```

Now inside the project folder of the service you intend to work on simply run

```bash
yarn link turtus
```

You should not be able to edit files and have the changes reflected immediately.

**IMPORTANT** This will not work inside the virtual browser when running inside a docker container. For now the only way to test this is to publish a new package version. Furtunately, this package is designed to work on browser and node clients, so the virtual browser shouldn't require any special treatment.

Publish a new version to a git repository, test that it works by updating the url in the `package.json`, then change it back before submitting the PR. If anyone has a better method I'd love to hear it.

## Publishing a new version

Before pushing to github make sure to update the package version

```
yarn version [--major] [--minor] [--patch]
```