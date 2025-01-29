const vscode = require("vscode");
let cachedFilters = null;

function getFilters(refresh = false) {
  if (cachedFilters && !refresh) {
    return cachedFilters;
  }
  const config = vscode.workspace.getConfiguration("fileReader");
  cachedFilters = config.get("filters") || [];
  return cachedFilters;
}

module.exports = { getFilters };
