'use strict';

angular.module('gisto.filter.codeLanguage', []).filter('codeLanguage', function () {

        var languages = {
            null: "text",
            "ABAP": "abap",
            "ActionScript": "actionscript",
            "Ada": "ada",
            "ASP": "vbscript",
            "ApacheConf": "text",
            "Assembly": "assembly_x86",
            "AutoHotkey": "autohotkey",
            "Batchfile": "batchfile",
            "C": "c_cpp",
            "C#": "csharp",
            "C++": "c_cpp",
            "Clojure": "clojure",
            "CoffeeScript": "coffee",
            "ColdFusion": "coldfusion",
            "Common Lisp": "lisp",
            "CSS": "css",
            "D": "d ",
            "Dart": "dart",
            "Diff": "diff",
            "DOT": "dot",
            "Erlang": "erlang",
            "Forth": "forth",
            "Go": "golang",
            "Groovy": "groovy",
            "Haml": "haml",
            "Haskell": "haskell",
            "Haxe": "haxe",
            "HTML": "html",
            "HTML+Django": "html",
            "HTML+ERB": "html",
            "HTML+PHP": "html",
            "INI": "ini",
            "Java": "java",
            "Java Server Pages": "jsp",
            "JavaScript": "javascript",
            "JSON": "json",
            "Julia": "julia",
            "Less": "less",
            "LiveScript": "livescript",
            "Lua": "lua",
            "Makefile": "makefile",
            "Markdown": "markdown",
            "Matlab": "matlab ",
            "Nginx": "json ",
            "Objective-C": "objectivec",
            "OCaml": "ocaml",
            "Perl": "perl",
            "PHP": "php",
            "PowerShell": "powershell",
            "Prolog": "prolog",
            "Python": "python",
            "R": "r",
            "RHTML": "rhtml",
            "Ruby": "ruby",
            "Rust": "rust",
            "Sass": "sass",
            "Scala": "scala",
            "Scheme": "scheme",
            "SCSS": "scss",
            "Shell": "sh",
            "SQL": "sql",
            "Tcl": "tcl",
            "TeX": "tex",
            "Text": "text",
            "Textile": "textile",
            "TOML": "toml",
            "Twig": "twig",
            "TypeScript": "typescript",
            "XML": "xml",
            "XQuery": "xquery",
            "YAML": "yaml"
        };

        return function (input) {
            return languages.hasOwnProperty(input) ? languages[input] : 'text';
        };
    });