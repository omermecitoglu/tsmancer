const fs = require('fs');
const path = require('path');

module.exports = {
  process(sourceText, sourcePath, options) {
    const templateContent = fs.readFileSync(sourcePath, 'utf8');
    return {
      code: `module.exports = ${JSON.stringify(templateContent)};`,
    };
  },
};
