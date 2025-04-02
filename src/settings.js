const vscode = require("vscode");

function getFilters() {
  const config = vscode.workspace.getConfiguration("fileReader");
  return config.get("filters") || [];
}

function getDefaultFilterName() {
  const config = vscode.workspace.getConfiguration("fileReader");
  const defaultFilterName = config.get("defaultFilter");
  return defaultFilterName;
}

module.exports = { getFilters, getDefaultFilterName };
