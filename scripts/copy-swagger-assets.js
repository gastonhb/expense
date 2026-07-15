const fs = require('fs');
const path = require('path');

const swaggerUiExpressDir = path.dirname(require.resolve('swagger-ui-express'));
const sourceDir = path.dirname(require.resolve('swagger-ui-dist/package.json', {
  paths: [swaggerUiExpressDir]
}));
const targetDir = path.resolve(__dirname, '../public/api-docs');
const assets = [
  'swagger-ui.css',
  'swagger-ui-bundle.js',
  'swagger-ui-standalone-preset.js'
];

fs.mkdirSync(targetDir, { recursive: true });

for (const asset of assets) {
  fs.copyFileSync(path.join(sourceDir, asset), path.join(targetDir, asset));
}

console.log(`Swagger UI assets copied to ${targetDir}`);
