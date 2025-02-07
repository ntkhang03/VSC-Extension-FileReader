const vscode = require("vscode");
const { handleReadMultipleFiles } = require("./handlers");
const { getFilters } = require("./settings");

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "fileReader.readFilesInFolder",
      handleReadMultipleFiles
    ),
    vscode.commands.registerCommand(
      "fileReader.readSelectedFiles",
      handleReadMultipleFiles
    ),
    vscode.workspace.onDidChangeConfiguration(() => {
      // Loops through the filters
      // Check:
      // + if there is removeCommonPath but the value is not a boolean
      // + if there is outputTemplate but the value is not a string, or does not have {{filePath}} and {{content}}

      const filters = getFilters(true); // Refresh filters cache
      for (const filter of filters) {
        // check name required and unique
        if (!filter.hasOwnProperty("name")) {
          vscode.window.showErrorMessage(
            `Filter name is required for all filters`
          );
          break;
        }

        if (typeof filter.name !== "string") {
          vscode.window.showErrorMessage(
            `Invalid value for name in filter: ${filter.name}, must be a string`
          );
          break;
        }

        if (
          filter.hasOwnProperty("removeCommonPath") &&
          typeof filter.removeCommonPath !== "boolean"
        ) {
          vscode.window.showErrorMessage(
            `Invalid value for removeCommonPath in filter: ${filter.name}, must be a boolean`
          );
          break;
        }

        if (
          filter.hasOwnProperty("outputTemplate") &&
          (typeof filter.outputTemplate !== "string" ||
            !filter.outputTemplate.includes("{{filePath}}") ||
            !filter.outputTemplate.includes("{{content}}"))
        ) {
          vscode.window.showErrorMessage(
            `Invalid value for outputTemplate in filter: ${filter.name}, must be a string and contain {{filePath}} and {{content}}`
          );
          break;
        }
      }
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("fileReader.openFilterSettings", () => {
      vscode.commands.executeCommand(
        "workbench.action.openSettings",
        "fileReader.filters"
      );
    })
  );
}

function deactivate() {}

module.exports = {
  activate,
  deactivate
};
