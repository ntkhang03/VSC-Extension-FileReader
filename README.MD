# 📂 File Reader Extension

This Visual Studio Code extension provides context menu options to read files from folders or selected files.

## 🚀 Features

- Read files in a selected folder.
- Read selected files/folders in the Explorer view.
- Read files from a text selection in the editor.
- Apply filters to include or exclude specific files.
- View the directory structure in a tree format.

## 🛠️ Installation

### From the Marketplace

1. Open the Extensions view by pressing `Ctrl+Shift+X`.
2. Search for `File Reader` in the Extensions view search box or click [here](https://marketplace.visualstudio.com/items?itemName=ntkhang03.file-reader).
3. Click on the Install button.
4. Reload the window to enable the extension.

### From a VSIX file

1. Clone the repository:
   ```sh
   git clone https://github.com/ntkhang03/file-reader-extension.git
   ```
2. Navigate to the project directory:
   ```sh
   cd file-reader-extension
   ```
3. Install dependencies:
   ```sh
   npm install
   ```
4. Package the extension:
   ```sh
   npm run package
   ```
5. Install the extension:
   - Open the Extensions view by pressing `Ctrl+Shift+X`.
   - Click on the `...` icon and choose `Install from VSIX...`.
   - Select the generated `.vsix` file in the `out` directory.

## 📋 Usage

1. Open the folder containing the files you want to read in VS Code.

- **Method 1:** `Right-click` on a `folder or file` in the Explorer context menu and click `Read selected files/folders`.
<!-- - Chọn nhiều file/folder, sau đó nhấn chuột phải vào 1 trong các file được chọn và chọn `Read selected files/folders`. -->
- **Method 2:** Choose multiple files/folders in the Explorer, then `Right-click` on one of the selected files/folders and select `Read selected files/folders`.
- **Method 3:** `Select text containing file paths`, then `Right-click` and choose `Read files from text selection`.

2. (Optionally) select a filter to apply.
3. The extension will read the files and display their contents in a new editor tab.

## ⚙️ Configuration

### Filters

You can define filters to include or exclude specific files. Add the following configuration in your VS Code settings:

```json
"fileReader.filters": [
  {
    "name": "Example Filter",
    "include": ["**/*.js"], // optional - filter to include files
    "exclude": ["**/node_modules/**"], // optional - filter to exclude files
    "removeCommonPath": true, // optional - remove common path from file path
    "outputTemplate": "=====\n{{filePath}}\n=====\n{{content}}\n" // optional - custom output template for each file
  }
]
```

### Default Filter

You can set a default filter to be applied when reading files. Add the following configuration in your VS Code settings:

```json
"fileReader.defaultFilter": "FILTER_NAME"
```

Make sure to replace `FILTER_NAME` with the name of the filter you want to use.

## 📄 Example

Here is an example of how the directory structure and file contents will be displayed:

```
Directory Structure:
└── folder1/
│   ├── file1.txt
│   └── subfolder1/
│       └── file2.txt
└── folder2/
│   ├── file3.txt
│   └── subfolder2/
│       ├── file4.txt
│       └── file5.txt
└── folder3/
│   └── file1.txt
└── file6.txt
└── folder4/
    └── dir/
        └── test.txt

================================================
File: folder1/file1.txt
================================================
<file content>

================================================
File: folder1/subfolder1/file2.txt
================================================
<file content>

...
```

## 📷 Screenshots

- **Read selected files/folders**
  ![Screenshot](/screenshots/read-multiple-files-folders.png)

- **Read files from text selection**
  ![Screenshot](/screenshots/read-files-from-text-selection.png)

- **Example output**
  ![Screenshot](/screenshots/example-output.png)

## 🧑‍💻 Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## 📄 License

This project is licensed under the MIT [License](LICENSE).
