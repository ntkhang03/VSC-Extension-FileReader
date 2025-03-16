const vscode = require("vscode");
const fs = require("fs");
const { handleReadMultipleFiles } = require("./handlers");

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  const diagnosticCollection =
    vscode.languages.createDiagnosticCollection("fileReader");
  context.subscriptions.push(diagnosticCollection);

  vscode.commands.executeCommand("setContext", "fileReader.selectionCount", 2);

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "fileReader.readSelectedFiles",
      handleReadMultipleFiles
    ),
    vscode.commands.registerCommand(
      "fileReader.readFilesFromTextSelection",
      async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
          return;
        }

        // Xóa các lỗi cũ trước khi kiểm tra
        diagnosticCollection.clear();

        const selection = editor.selection;
        const selectedText = editor.document.getText(selection).trim();
        if (!selectedText) {
          return;
        }

        const filePaths = selectedText
          .split("\n")
          .map((line) => line.trim())
          .filter((line) => line);

        if (filePaths.length === 0) {
          return;
        }

        const nonExistentFiles = [];
        filePaths.forEach((filePath, index) => {
          if (!fs.existsSync(filePath)) {
            // Đánh dấu lỗi trên dòng tương ứng trong vùng chọn
            const startPos = new vscode.Position(
              selection.start.line + index,
              0
            );
            const endPos = new vscode.Position(
              selection.start.line + index,
              filePath.length
            );
            const range = new vscode.Range(startPos, endPos);
            const diagnostic = new vscode.Diagnostic(
              range,
              `File not found: ${filePath}`,
              vscode.DiagnosticSeverity.Error
            );
            nonExistentFiles.push(diagnostic);
          }
        });

        if (nonExistentFiles.length > 0) {
          diagnosticCollection.set(editor.document.uri, nonExistentFiles);
          // Hiển thị thông báo lỗi cho người dùng
          vscode.window.showErrorMessage(
            `Some files do not exist. Check the problems tab for more details.`
          );
        }

        // Nếu không có file lỗi, tiến hành đọc file
        if (nonExistentFiles.length === 0) {
          handleReadMultipleFiles(
            null,
            filePaths.map((fp) => vscode.Uri.file(fp))
          );
        }
      }
    ),
    vscode.workspace.onDidChangeTextDocument((event) => {
      // Xóa tất cả Diagnostic khi file được chỉnh sửa
      diagnosticCollection.delete(event.document.uri);
    }),
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
