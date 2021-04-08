// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as sharp from 'sharp';

export function activate(context: vscode.ExtensionContext) {
	vscode.commands.executeCommand('setContext', 'html-image.supportedExtname', [
		'.png',
		'.jpeg', '.jpg',
		'.webp',
		'.gif',
		'.svg'
	  ]);
	  
	let disposable = vscode.commands.registerCommand('html-image.insertImgTag', (file) => {
		const editor = vscode.window.activeTextEditor;
		const relativePath = vscode.workspace.asRelativePath(file.path);
		if (editor) {
			sharp(file.path).metadata().then(metadata => {
				editor.edit(editBuilder => {
					const selection = editor.selection;
					const text = `<img src="${relativePath}" loading="lazy" decoding="async" width="${metadata.width}" height="${metadata.height}>`;
					if (selection.isEmpty) {
						editBuilder.insert(editor.selection.start, text);
					} else {
						editBuilder.replace(editor.selection, text);
					}
				});
			})
		}
	});

	context.subscriptions.push(disposable);
}
