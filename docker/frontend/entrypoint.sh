#!/bin/sh

# Run npm install
npm install

# Execute the command passed to the container
exec "$@"