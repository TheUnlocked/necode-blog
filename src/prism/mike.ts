import type Prism from 'prismjs';
import { Syntax } from 'refractor';

const mike: Syntax = ((prism: typeof Prism) => {
    prism.languages.mike = {
        twoAt: /@@(?:ERROR|WARN|!)/,
        comment: /\/\/.*/,
        string: {
            pattern: /(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
            greedy: true
        },
        keyword: [
            /\b(?:state|param|let|debug|type)\b/,
        ],
        'keyword.control-flow': /\b(?:on|if|else)\b/,
        number: [
            /\b[+-]?[0-9]+\b/, // int
            /\b[+-]?[0-9]*(?:[0-9]\.|\.[0-9]+(?:[eE][+-]?[0-9]+)?|[0-9][eE][+-]?[0-9]+)\b/, //float
        ],
        boolean: /\b(?:true|false)\b/,
        "class-name": [
            /\b(?:int|float|string|boolean|unit|option)\b/,
            /\b_*[A-Z]\w*\b/,
        ],
        function: {
            pattern: /\b\w+(?=\()/,
        },
        variable: [
            /\b(?:int|float|string|boolean|unit|option)\b/,
            /\b\w+\b/,
        ],
        punctuation: /[+\-*/<>=!&|:(){}[\];,.]/,
    };
}) as any;

mike.displayName = 'MiKe';

export default mike;