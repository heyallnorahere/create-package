const fs = require("fs");
const archiver = require("archiver");
const core = require("@actions/core");
const github = require("@actions/github");
var config = JSON.parse(fs.readFileSync(core.getInput("config")));
const output = fs.createWriteStream(config.outputPath);
const archive = archiver("zip", {
    zlib: {
        level: 9
    }
});
output.on("close", function() {
    console.log("Wrote " + archive.pointer() + " total bytes");
});
archive.pipe(output);
config.entries.forEach(file => {
    switch (file.type) {
        case "glob":
            archive.glob(file.source, null, { prefix: file.destination });
            break;
        case "file":
            archive.file(file.source, { name: file.destination });
            break;
        case "directory":
            archive.directory(file.source, file.destination);
            break;
    }
});
archive.finalize();
core.setOutput("path", config.outputPath);