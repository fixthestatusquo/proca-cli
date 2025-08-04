import { Command } from '#src/procaCommand.mjs';
import fs from 'fs';
import path from 'path';

export default class FolderConfig extends Command {
  static summary = 'Check and create config folders';
  static description = `Check if the PROCA_CONFIG_FOLDER is set up, if it is, check if subfolders org,target/source target/server/ target/public campaign email/actionpage email/html email/mjml exists and create if not`;

  async run() {
    const configFolder = process.env.PROCA_CONFIG_FOLDER;

    if (!configFolder) {
      this.error('PROCA_CONFIG_FOLDER environment variable is not set.');
    }

    const subfolders = [
      'org',
      'target/source',
      'target/server',
      'target/public',
      'campaign',
      'email/actionpage',
      'email/html',
      'email/mjml'
    ];

    this.log(`Checking config folder at ${configFolder}`);

    subfolders.forEach(subfolder => {
      const fullPath = path.join(configFolder, subfolder);
      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
        this.log(`🆕 ${fullPath}`);
      } else {
        this.log(`✅ ${fullPath}`);
      }
    });

    this.log('Config folder check complete.');
  }
}
