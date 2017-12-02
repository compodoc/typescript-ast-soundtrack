import * as ts from 'typescript';

document.addEventListener("DOMContentLoaded", function() {
    require.config({ paths: { 'vs': 'libs/monaco-editor/min/vs' } });
    require(['vs/editor/editor.main'], onLoaded);
});

let onLoaded = () => {
    var editor = monaco.editor.create(document.querySelector('.editor'), {
        value: `import { Component, Input } from '@angular/core';

@Component({
  selector: 'todo',
  templateUrl: './todo.component.html'
})
export class TodoComponent {
  @Input()
  todo;

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
        switch(kind) {
            case 229:
            case 265:
              result = 'C4';
              break;
            case 238:
              result = 'D4';
              break;
            case 1:
              result = 'B4';
              break;
        }
        return result;
    }

    let getSourceFileDecorators = function(srcFile: ts.SourceFile): void {
        window.ts.forEachChild(srcFile, (node: ts.Node) => {
            console.log(node)
            // Kinds:
            // 238 : ImportDeclaration
            // 229 : ClassDeclaration
            // 147 : Decorator
            // 152 : Constructor
            // 149 : PropertyDeclaration
            // 151 : MethodDeclaration
            triggerKeyboard(syntaxKindToNote(node.kind))
        });
    }

    let $btn = document.querySelector('button');

    $btn.addEventListener('click', () => {
        console.log(editor.getValue());

        console.log(window.ts)

        let file: ts.SourceFile = window.ts.createSourceFile('demo.ts', editor.getValue(), ts.ScriptTarget.ES5, false);
        console.log(file)
        getSourceFileDecorators(file);
    });

    var keyboard = new QwertyHancock({
        id: 'keyboard',
        width: 400,
        height: 150,
        octaves: 1,
        startNote: 'C4',
        hoverColour: '#3c3c3c'
    });

    window.AudioContext = window.AudioContext || window.webkitAudioContext;

    let context = new AudioContext();

    let masterGain = context.createGain();
    let nodes: OscillatorNode[] = [];

    masterGain.gain.value = 0.3;
    masterGain.connect(context.destination);

    keyboard.keyUp = function(note: string, frequency: number) {
      console.log(note)
        var oscillator = context.createOscillator();
        oscillator.type = 'square';
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

    /*setTimeout(() => {
        triggerKeyboard('C4')
    }, 2000);
    setTimeout(() => {
        triggerKeyboard('D4')
    }, 3000);*/
}
