# create-package

This action creates a zip file for distribution.

## Inputs

### `config`

The path to the configuration JSON file; must be in this format:

`outputPath`: the path to the output zip file

`entries`: An array of objects that follow the specified schema:

`type`: Must be one of `"glob"`, `"file"`, or `"directory"`

`source`: The path to the source glob, file, or directory

`destination`: The path to put the selected file(s) into, inside the zip file

## Outputs

### `output`

The path to the written zip file.