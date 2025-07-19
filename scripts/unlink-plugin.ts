import fs from 'fs';
import path from 'path';

const pluginDir = path.resolve(__dirname, '../Find-and-replace.sketchplugin');

if (fs.existsSync(pluginDir) && fs.lstatSync(pluginDir).isSymbolicLink()) {
  fs.unlinkSync(pluginDir);
  console.log('Unlinked symlink:', pluginDir);
} else {
  console.log('No symlink found:', pluginDir);
}
