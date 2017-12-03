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

  status: string;

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
            case 152:
                result = 'D4';
                break;
            case 229:
                result = 'E4';
                break;
        }
        return result;
    }

    let parseClass = (classDeclaration: ts.Node) => {
        if (classDeclaration.members && classDeclaration.members.length > 0) {
            classDeclaration.members.map(member => {
                if (member.kind === 149 || member.kind === 151) {
                    if (member.decorators && member.decorators.length === 1) {
                        let note = '';
                        switch (member.decorators[0].expression.expression.text) {
                            case 'Input':
                                note = 'F4'
                                break;
                            case 'Output':
                                note = 'G4'
                                break;
                            case 'HostBinding':
                                note = 'A4'
                                break;
                            case 'HostListener':
                                note = 'B4'
                                break;
                        }
                        notes.push(note)
                    } else {
                        notes.push(syntaxKindToNote(member.kind))
                    }
                } else {
                    notes.push(syntaxKindToNote(member.kind))
                }
            });
        }
    };

    let notes = [];

    let getSourceFileDecorators = function(srcFile: ts.SourceFile): void {
        (<any>window).ts.forEachChild(srcFile, (node: ts.Node) => {
            console.log(node, node.kind)
            if (node.kind !== 238 &&
                node.kind !== 207 &&
                node.kind !== 1) {
                notes.push(syntaxKindToNote(node.kind));
                if (node.kind === 229) {
                    parseClass(node);
                }
            }
        });
        console.log(notes);
        let i = 0,
            len = notes.length;
        let loop = () => {
            if (i < len) {
                triggerKeyboard(notes[i])
                setTimeout(() => {
                    i++;
                    loop();
                }, 250)
            }
        };

        loop();
    }

    let $btn = document.querySelector('button');

    $btn.addEventListener('click', () => {
        notes = [];
        let file: ts.SourceFile = (<any>window).ts.createSourceFile('demo.ts', editor.getValue(), 1, false);
        console.log(file)
        getSourceFileDecorators(file);
    });

    let $select = document.querySelector('#anthem-selection');

    $select.addEventListener('change', (e) => {
        console.log('select change: ', e.target.value);
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

    editor.deltaDecorations([], [
    	{ range: new monaco.Range(3,1,5,1), options: { isWholeLine: true, linesDecorationsClassName: 'lineDecoration' }}
    ]);

    (<any>window).AudioContext = (<any>window).AudioContext || (<any>window).webkitAudioContext;

    let context = new AudioContext();

    let masterGain = context.createGain();
    let nodes: OscillatorNode[] = [];

    masterGain.gain.value = 0.3;
    masterGain.connect(context.destination);

    keyboard.keyUp = function(note: string, frequency: number) {
        console.log(note);
        var oscillator = context.createOscillator();
        oscillator.type = 'sine';
        oscillator.frequency.value = frequency;
        oscillator.connect(masterGain);
        oscillator.start(0);
        nodes.push(oscillator);
        setTimeout(() => {
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
        }, 150);

    };

    let triggerKeyboard = function(key: string) {
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
        }, 100);
    }
}
