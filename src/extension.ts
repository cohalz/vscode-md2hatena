'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { writeFile, readFile } from 'fs';
import { tmpdir } from 'os';
import { exec } from 'child_process';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "md2hatena" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('extension.md2hatena', async () => {
        // The code you place here will be executed every time your command is executed

        let basePath = tmpdir()+"/";
        let fileName = "tmp";

        let filePath = basePath+fileName;

        let command = "md2hatena " + filePath + ".md" + " > " + filePath + ".hatena";
        let editor = vscode.window.activeTextEditor;

        if(!editor) return;

        let doc = editor.document;

        let selection = editor.selection;
        
        // 選択範囲が空であれば全てを選択範囲にする
        if(editor.selection.isEmpty){
            let startPos = new vscode.Position(0, 0);
            let endPos = new vscode.Position(doc.lineCount - 1, 10000);
            selection = new vscode.Selection(startPos, endPos);
        }

        let text = doc.getText(selection); 

        // ファイル書き出し -> 変換 -> 読み出しで変更
        writeFile(filePath + ".md", text, (err) => {
            exec(command, (error,stdout,stderr) => {
                readFile(filePath + ".hatena", (err, data) => {
                    if(!editor) return;
                    editor.edit(edit => {
                        edit.replace(selection, "" + data);
                    });
                });
            });
        });
    });

    context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
}