import * as vscode from 'vscode';
import * as cp from 'child_process';
import * as fs from 'fs';

export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand('extension.createNewReport', async () => {
		const fileUri = await vscode.window.showOpenDialog({
			canSelectFiles: false,
			canSelectFolders: true,
			canSelectMany: false,
			openLabel: 'Создать отчёт'
		});
		if (!fileUri){
			return;
		}
		const cloneUrl = "https://github.com/olekzonder/LaTeX-Mirea-Template.git";
		const folderPath = fileUri[0].fsPath;
		const cmd = `git clone ${cloneUrl} '${folderPath}'`;

		cp.exec(cmd, (err, stdout, stderr) => {
			if (err) {
				vscode.window.showErrorMessage("Не удалось загрузить шаблон из репозитория: " + err.message);
			} else {
				vscode.window.showQuickPick(['Открыть в текущем окне', 'Открыть в новом окне']).then((choice) => {
				if (choice == 'Открыть в текущем окне'){
					vscode.commands.executeCommand('vscode.openFolder', vscode.Uri.file(folderPath), false);
					fs.rmdirSync(`${folderPath}/.git`,{recursive: true});
				} else if (choice == 'Открыть в новом окне'){
					vscode.commands.executeCommand('vscode.openFolder', vscode.Uri.file(folderPath), true);
					fs.rmdirSync(`${folderPath}/.git`,{recursive: true});
				}
			})
			}
		});
	});
context.subscriptions.push(disposable);
}

export function deactivate() {}