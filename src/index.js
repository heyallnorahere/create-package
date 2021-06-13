const fs = require("fs");
const archiver = require("archiver");
const core = require("@actions/core");
const github = require("@actions/github");
const os = require("os");
var config = JSON.parse(fs.readFileSync(core.getInput("config")));
const output = fs.createWriteStream(config.outputPath);
// this creates a hash map of variables to be referenced by "%{<name>}"
function createVariableMap() {
    var variableMap = new Map();
    var platform = os.platform();
    if (platform === "darwin") {
        platform = "macosx";
    }
    variableMap.set("platform", platform);
    config.variables.forEach(variable => {
        variableMap.set(variable.name, variable.value);
    });
    return variableMap;
}
// parses a string with the map returned by createVariableMap()
function parseString(str, variables) {
    var newString = str;
    for (var [key, value] of variables.entries()) {
        var search = "%{" + key + "}";
        newString = newString.replace(new RegExp(search, "g"), value);
    }
    return newString;
}
const archive = archiver("zip", {
    zlib: {
        level: 9
    }
});
output.on("close", function() {
    console.log("Wrote " + archive.pointer() + " total bytes");
});
archive.pipe(output);
var variables = createVariableMap();
config.entries.forEach(file => {
    console.log("Adding " + file.source + " into zip file at location \"" + file.destination + "\" (" + file.type + ")");
    switch (file.type) {
        case "glob":
            archive.glob(parseString(file.source, variables), null, { prefix: parseString(file.destination, variables) });
            break;
        case "file":
            archive.file(parseString(file.source, variables), { name: parseString(file.destination, variables) });
            break;
        case "directory":
            archive.directory(parseString(file.source, variables), parseString(file.destination, variables));
            break;
        case "text":
            archive.append(parseString(file.source, variables), { name: parseString(file.destination, variables) });
            break;
    }
});
archive.finalize();
core.setOutput("path", config.outputPath);