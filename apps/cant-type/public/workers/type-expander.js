/* eslint-disable */
// Web worker that uses the TypeScript compiler to expand type aliases.

var ts = null;
var ready = false;

try {
  importScripts("/workers/typescript.min.js");
  ts = self.ts;
  ready = true;
} catch (err) {
  // Will report on first message
}

self.onmessage = function (e) {
  var msg = e.data;

  if (msg.kind === "ping") {
    self.postMessage({ kind: "ready", ok: ready });
    return;
  }

  if (msg.kind !== "expand") return;

  if (!ready) {
    self.postMessage({
      kind: "result",
      requestId: msg.requestId,
      types: [],
      error: "TypeScript compiler failed to load.",
    });
    return;
  }

  try {
    var result = expandTypes(msg.code);
    self.postMessage({
      kind: "result",
      requestId: msg.requestId,
      types: result.types,
      error: result.error,
    });
  } catch (err) {
    self.postMessage({
      kind: "result",
      requestId: msg.requestId,
      types: [],
      error: err.message || "Unknown error",
    });
  }
};

function expandTypes(code) {
  var fileName = "input.ts";
  var sourceFile = ts.createSourceFile(
    fileName,
    code,
    ts.ScriptTarget.Latest,
    true,
  );

  var host = {
    getSourceFile: function (name) {
      if (name === fileName) return sourceFile;
      return ts.createSourceFile(name, "", ts.ScriptTarget.Latest, true);
    },
    getDefaultLibFileName: function () {
      return "lib.d.ts";
    },
    writeFile: function () {},
    getCurrentDirectory: function () {
      return "/";
    },
    getCanonicalFileName: function (name) {
      return name;
    },
    useCaseSensitiveFileNames: function () {
      return true;
    },
    getNewLine: function () {
      return "\n";
    },
    fileExists: function (name) {
      return name === fileName;
    },
    readFile: function () {
      return "";
    },
  };

  var program = ts.createProgram(
    [fileName],
    {
      target: ts.ScriptTarget.Latest,
      strict: true,
      noEmit: true,
    },
    host,
  );

  var checker = program.getTypeChecker();
  var types = [];

  var diagnostics = []
    .concat(program.getSyntacticDiagnostics(sourceFile))
    .concat(program.getSemanticDiagnostics(sourceFile));

  ts.forEachChild(sourceFile, function visit(node) {
    if (ts.isTypeAliasDeclaration(node)) {
      var name = node.name.text;
      var type = checker.getTypeAtLocation(node.name);
      var flags =
        ts.TypeFormatFlags.NoTruncation |
        ts.TypeFormatFlags.MultilineObjectLiterals |
        ts.TypeFormatFlags.InTypeAlias;
      var expanded = checker.typeToString(type, node, flags);
      types.push({ name: name, expanded: expanded });
    }
    ts.forEachChild(node, visit);
  });

  var error = undefined;
  var realErrors = diagnostics.filter(function (d) {
    return d.category === ts.DiagnosticCategory.Error;
  });
  if (realErrors.length > 0 && types.length === 0) {
    error = realErrors
      .map(function (d) {
        return ts.flattenDiagnosticMessageText(d.messageText, "\n");
      })
      .join("\n");
  }

  return { types: types, error: error };
}
