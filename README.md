# create-package

This action creates a zip file for distribution.

## Inputs

### `files`

**Required** A newline-separated list of files to read.

### `output-file`

The path to the output zip file to be written. Default is `./release.zip`.

## Outputs

### `output`

The path to the written zip file.