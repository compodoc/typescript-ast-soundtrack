import * as ts from 'typescript';

import { ANTHEMS } from './anthems';

document.addEventListener("DOMContentLoaded", function() {
    require.config({ paths: { 'vs': 'node_modules/monaco-editor/min/vs' } });
    require(['vs/editor/editor.main'], onLoaded);
});

let onLoaded = () => {
    var editor = monaco.editor.create(document.querySelector('.editor'), {
        value: `import { Component, Input, EventEmitter } from '@angular/core';

@Component({
  selector: 'todo',
  templateUrl: './todo.component.html'
})
export class TodoComponent {
  @Input()
  todo;

  @Output()
  myEvent = new EventEmitter();

  @HostBinding('class.valid')
  isValid;

  @HostListener('click', ['$event'])
  onClick(e) {}

  constructor() {}

  updateStatus(status: boolean) {
    todo.status = status;
  }
}
  `,
        language: 'typescript',
        theme: 'vs-dark'
    });

    let syntaxKindToNote = (kind: number) => {
        let result;
        // Kinds:
        // 149 : PropertyDeclaration
        // 151 : MethodDeclaration
        // 152 : Constructor
        // 229 : ClassDeclaration
        switch (kind) {
            case 149:
                result = 'C4';
                break;
            case 151:
                result = 'D4';
                break;
        }
        return result;
    }

    let parseClass = (classDeclaration: ts.Node) => {
        if (classDeclaration.members && classDeclaration.members.length > 0) {
            classDeclaration.members.map(member => {
                if (member.kind === 149 || member.kind === 151) {
                    if (member.decorators && member.decorators.length >= 1) {
                        let note = '',
                            length;
                        // 0 : length
                        // 1 : Angular decorator
                        if (member.decorators[0].expression.arguments.length > 0) {
                            length = parseInt(member.decorators[0].expression.arguments[0].text);
                        } else {
                            length = 1;
                        }
                        if (member.decorators.length > 1) {
                            switch (member.decorators[1].expression.expression.text) {
                                case 'Input':
                                    note = 'E4'
                                    break;
                                case 'Output':
                                    note = 'F4'
                                    break;
                                case 'HostBinding':
                                    note = 'G4'
                                    break;
                                case 'HostListener':
                                    note = 'A4'
                                    break;
                                case 'ContentChild':
                                    note = 'B4'
                                    break;
                                case 'ContentChildren':
                                    note = 'C5'
                                    break;
                                case 'ViewChild':
                                    note = 'D5'
                                    break;
                                case 'ViewChildren':
                                    note = 'E5'
                                    break;
                            }
                        } else {
                            note = syntaxKindToNote(member.kind);
                        }
                        notes.push({
                            note: note,
                            length: length,
                            start: (<any>window).ts.getLineAndCharacterOfPosition(currentFile, member.pos).line,
                            end: (<any>window).ts.getLineAndCharacterOfPosition(currentFile, member.name.end).line
                        });
                    }
                }
            });
        }
    };

    let notes = [];

    /*
        Note length :
        - 0 : very short 250
        - 1 : short 500
        - 2 : normal 750
        - 3 : long 1000
     */

    let noteLengthInSeconds = (length) => {
        return (length * 250) + 250;
    }

    let getSourceFileDecorators = function(srcFile: ts.SourceFile): void {
        (<any>window).ts.forEachChild(srcFile, (node: ts.Node) => {
            if (node.kind !== 238 &&
                node.kind !== 207 &&
                node.kind !== 1) {
                if (node.kind === 229) {
                    parseClass(node);
                }
            }
        });
        let i = 0,
            len = notes.length;
        let loop = () => {
            if (i < len) {
                triggerKeyboard(notes[i].note, noteLengthInSeconds(notes[i].length));
                editorDecorations = editor.deltaDecorations([], [
                	{
                        range: new monaco.Range(notes[i].start,1,notes[i].end,1),
                        options: {
                            isWholeLine: true,
                            linesDecorationsClassName: 'lineDecoration'
                        }}
                ]);
                setTimeout(() => {
                    editorDecorations = editor.deltaDecorations(editorDecorations, []);
                    i++;
                    loop();
                }, noteLengthInSeconds(notes[i].length))
            }
        };

        loop();
    }

    let $btn = document.querySelector('button'),
        currentFile: ts.SourceFile;

    $btn.addEventListener('click', () => {
        notes = [];
        currentFile = (<any>window).ts.createSourceFile('demo.ts', editor.getValue(), 1, false);
        getSourceFileDecorators(currentFile);
    });

    let $select = document.querySelector('#anthem-selection');

    $select.addEventListener('change', (e) => {
        editor.setValue(ANTHEMS[e.target.value]);
    });

    var keyboard = new QwertyHancock({
        id: 'keyboard',
        width: 400,
        height: 150,
        octaves: 2,
        startNote: 'C4',
        hoverColour: '#3c3c3c'
    });

    let editorDecorations;

    /* = editor.deltaDecorations([], [
    	{ range: new monaco.Range(3,1,5,1), options: { isWholeLine: true, linesDecorationsClassName: 'lineDecoration' }}
    ]);

    setTimeout(function() {
        editorDecorations = editor.deltaDecorations(editorDecorations, []);
    }, 2000);*/

    (<any>window).AudioContext = (<any>window).AudioContext || (<any>window).webkitAudioContext;

    let context = new AudioContext();

    let masterGain = context.createGain();
    let nodes: OscillatorNode[] = [];

    masterGain.gain.value = 0.3;
    masterGain.connect(context.destination);

    keyboard.keyDown = function(note: string, frequency: number) {
        var oscillator = context.createOscillator();
        oscillator.type = 'sine';
        oscillator.frequency.value = frequency;
        oscillator.connect(masterGain);
        oscillator.start(0);
        nodes.push(oscillator);
    };

    keyboard.keyUp = function(note: string, frequency: number) {
        var new_nodes = [];
        for (var i = 0; i < nodes.length; i++) {
            if (Math.round(nodes[i].frequency.value) === Math.round(frequency)) {
                nodes[i].stop(0);
                nodes[i].disconnect();
            } else {
                new_nodes.push(nodes[i]);
            }
        }
        nodes = new_nodes;
    };

    let triggerKeyboard = function(key: string, length) {
        document.querySelector(`#keyboard li[id="${key}"]`).dispatchEvent(new MouseEvent('mousedown', {
            view: window,
            bubbles: true,
            cancelable: true
        }));
        setTimeout(() => {
            document.querySelector(`#keyboard li[id="${key}"]`).dispatchEvent(new MouseEvent('mouseup', {
                view: window,
                bubbles: true,
                cancelable: true
            }))
        }, length);
    }
}
