const ts = require('typescript');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'src');

const files = [];
function walk(dir) {
  const items = fs.readdirSync(dir);
  for (const it of items) {
    const full = path.join(dir, it);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) walk(full);
    else if (full.endsWith('.ts') || full.endsWith('.tsx') || full.endsWith('.js') || full.endsWith('.jsx')) files.push(full);
  }
}
walk(SRC);

const declMap = new Map(); // name -> {count, file, node}
const results = [];

for (const file of files) {
  const src = fs.readFileSync(file, 'utf8');
  const sf = ts.createSourceFile(file, src, ts.ScriptTarget.ESNext, true);

  function visit(node) {
    if (ts.isFunctionDeclaration(node) && node.name) {
      const name = node.name.text;
      const count = node.parameters.length;
      declMap.set(name, {count, file});
    } else if (ts.isVariableStatement(node)) {
      node.declarationList.declarations.forEach(d => {
        if (d.name && d.initializer && ts.isIdentifier(d.name) === false) {
          // ignore
        }
        if (d.name && ts.isIdentifier(d.name) && d.initializer && ts.isArrowFunction(d.initializer)) {
          const name = d.name.text;
          const count = d.initializer.parameters.length;
          declMap.set(name, {count, file});
        }
      });
    }
    ts.forEachChild(node, visit);
  }
  visit(sf);
}

for (const file of files) {
  const src = fs.readFileSync(file, 'utf8');
  const sf = ts.createSourceFile(file, src, ts.ScriptTarget.ESNext, true);

  function visit(node) {
    if (ts.isCallExpression(node)) {
      const expr = node.expression;
      if (ts.isIdentifier(expr)) {
        const name = expr.text;
        const args = node.arguments.length;
        if (declMap.has(name)) {
          const decl = declMap.get(name);
          if (decl.count !== args) {
            results.push({file, line: sf.getLineAndCharacterOfPosition(node.getStart()).line + 1, name, declCount: decl.count, args});
          }
        }
      }
    }
    ts.forEachChild(node, visit);
  }
  visit(sf);
}

if (results.length === 0) {
  console.log('No mismatched calls found.');
} else {
  console.log('Mismatched calls:');
  for (const r of results) console.log(`${r.file}:${r.line} -> ${r.name} declared ${r.declCount} params but called with ${r.args}`);
}
