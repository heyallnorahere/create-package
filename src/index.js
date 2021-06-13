const fs = require("fs");
const core = require("@actions/core");
const github = require("@actions/github");
const files = core.getInput("files");
