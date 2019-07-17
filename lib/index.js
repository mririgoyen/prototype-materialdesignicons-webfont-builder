const fs = require('fs').promises;
const path = require('path');
const tmp = require('tmp');
const chalk = require('chalk');
const webfont = require('webfont').default;
const mdiMeta = require('@mdi/svg/meta');

const FONT_FILE_NAME = 'materialdesignicons-webfont';

const currateIcons = async () => {
  const tempDir = tmp.dirSync();
  const svgSource = path.resolve(__dirname, '../node_modules/@mdi/svg/svg/');
  await Promise.all(mdiMeta.map(icon => fs.copyFile(`${svgSource}/${icon.name}.svg`, `${tempDir.name}/u${icon.codepoint}-${icon.name}.svg`)));
  const dirContents = await fs.readdir(tempDir.name);
  return dirContents.map(icon => `${tempDir.name}/${icon}`);
};

const generateFonts = async files => {
  const webfontResult = await webfont({ files });
  const fontOutputPath = path.resolve(__dirname, '../fonts/');

  await fs.writeFile(`${fontOutputPath}/${FONT_FILE_NAME}.ttf`, webfontResult.ttf);
  console.log(`${chalk.green('[SUCCESS]')} ${FONT_FILE_NAME}.ttf written successfully.`);

  await fs.writeFile(`${fontOutputPath}/${FONT_FILE_NAME}.eot`, webfontResult.eot);
  console.log(`${chalk.green('[SUCCESS]')} ${FONT_FILE_NAME}.eot written successfully.`);

  await fs.writeFile(`${fontOutputPath}/${FONT_FILE_NAME}.woff`, webfontResult.woff);
  console.log(`${chalk.green('[SUCCESS]')} ${FONT_FILE_NAME}.woff written successfully.`);

  await fs.writeFile(`${fontOutputPath}/${FONT_FILE_NAME}.woff2`, webfontResult.woff2);
  console.log(`${chalk.green('[SUCCESS]')} ${FONT_FILE_NAME}.woff2 written successfully.`);
};

(async () => {
  try {
    const files = await currateIcons();
    await generateFonts(files);
  } catch (err) {
    console.error(`${chalk.red('[ERROR]')} ${err}`);
    process.exit(1);
  }
})();
