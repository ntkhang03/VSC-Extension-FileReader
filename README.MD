# 📂 File Reader Extension
This Visual Studio Code extension provides context menu options to read files from folders or selected files.

## 🚀 Features

- Read files in a selected folder.
- Read selected files.
- Apply filters to include or exclude specific files.
- View the directory structure in a tree format.

## 🛠️ Installation
### From the Marketplace
1. Open the Extensions view by pressing `Ctrl+Shift+X`.
2. Search for `File Reader` in the Extensions view search box.
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
5.  Install the extension:
	 - Open the Extensions view by pressing `Ctrl+Shift+X`.
	 - Click on the `...` icon and choose `Install from VSIX...`.
	 - Select the generated `.vsix` file in the `out` directory.



## 📋 Usage

1. Open the folder containing the files you want to read in VS Code.
2. `Right-click` on a folder or selected files in the Explorer context menu.
3. Choose `Read files in this folder` or `Read selected files`.
4. Optionally, select a filter to apply.

## ⚙️ Configuration

You can define filters to include or exclude specific files. Add the following configuration in your VS Code settings:

```json
"fileReader.filters": [
  {
    "name": "Example Filter",
    "include": ["**/*.js"],
    "exclude": ["**/node_modules/**"]
  }
]
```

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

## 🧑‍💻 Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## 📄 License

This project is licensed under the MIT [License](LICENSE).
