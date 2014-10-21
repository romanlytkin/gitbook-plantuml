var count = 0;
var spawn = require('child_process').spawn;
var fs = require('fs');

function parseUml(page) {
    uml = page.content.match(/^```uml((.*\n)+?)?```$/igm);
    if (uml) {
        fs.writeFileSync("./alluml.uml", uml);
    }
}

function execFile(command, args, callback) {
    var prc = spawn(command, args);
    prc.stdout.on('data', function(data) {
        console.log(data.toString());
    });

    prc.stderr.on('data', function(data) {
        console.log(data.toString());
    });

    prc.on('close', function(code) {
        if ("function" === typeof callback) callback(!!code);
    });
};

module.exports = {
    book: {
        assets: "./book",
        js: [
            "test.js"
        ],
        css: [
            "test.css"
        ],
        html: {
            "html:start": function() {
                return "<!-- Start book " + this.options.title + " -->"
            },
            "html:end": function() {
                return "<!-- End of book " + this.options.title + " -->"
            },

            "head:start": "<!-- head:start -->",
            "head:end": "<!-- head:end -->",

            "body:start": "<!-- body:start -->",
            "body:end": "<!-- body:end -->"
        }
    },
    hooks: {
        // For all the hooks, this represent the current generator

        // This is called before the book is generated
        "init": function() {
            console.log("init gitbook-plantUML!");
        },

        // This is called after the book generation
        "finish": function() {
            console.log("finish gitbook-plantUML!");
        },

        // The following hooks are called for each page of the book
        // and can be used to change page content (html, data or markdown)


        // Before parsing markdown
        "page:before": function(page) {
            // page.path is the path to the file
            // page.content is a string with the file markdown content
            parseUml(page);
            var lines = fs.readFileSync('alluml.uml', 'utf8').split('```,');
            //UML
            debugger;
            try {
                execFile('java', ['-jar',
                    'plantuml.jar',
                    '-tsvg',
                    'alluml.uml',
                    '-o',
                    './assets/images/uml/'
                ]);
            } catch (e) {};
            for (var i = 0; i < lines.length; i++) {
                if (i == 0) {
                    page.content = page.content.replace(lines[i], '![](../assets/images/uml/alluml.svg)');
                    continue;
                }
                if (i < 10) {
                    page.content = page.content.replace(lines[i], '![](../assets/images/uml/alluml_00' + i + '.svg)');
                    continue;
                }
                if (i >= 10 && i < 100) {
                    page.content = page.content.replace(lines[i], '![](../assets/images/uml/alluml_0' + i + '.svg)');
                    continue;
                }
                if (i >= 100) {
                    page.content = page.content.replace(lines[i], '![](../assets/images/uml/alluml_' + i + '.svg)');
                    continue;
                }
            };
            page.content = page.content.replace(/```/g, '');
            // Example:
            //page.content = "# Title\n" + page.content;

            return page;
        },

        // Before html generation
        "page": function(page) {
            // page.path is the path to the file
            // page.sections is a list of parsed sections

            // Example:
            //page.sections.unshift({type: "normal", content: "<h1>Title</h1>"})

            return page;
        },

        // After html generation
        "page:after": function(page) {
            // page.path is the path to the file
            // page.content is a string with the html output

            // Example:
            //page.content = "<h1>Title</h1>\n" + page.content;
            // -> This title will be added before the html tag so not visible in the browser

            return page;
        }
    }
};