import fs from 'fs';
import lowdb from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';
import md5File from 'md5-file';
import path from 'path';
import client from 'scp2';
import { resolve } from 'dns';

const dbFile = path.join(process.cwd(), 'file.json');

const adapter = new FileSync(dbFile);
const db = lowdb(adapter);

interface ApplyOptionInterface {
  code: string;
  file: string;
  next: () => {};
}

interface FileObj {
  path: string;
  bg: string;
  bgName: string;
}

interface ConfigOptions {
  debugMode: Boolean;
  delDistImg: Boolean;
  limit: Number;
  time: Boolean;
  host: String;
  password: String;
  username: String;
  url: String;
  dirPath: String;
}

interface UploadImgOptions {
  config: ConfigOptions;
}

class FileUpload {
  private options: UploadImgOptions;
  constructor(options: UploadImgOptions) {
    this.options = options;

    this.options.config = {
      ...{
        debugMode: false,
        delDistImg: true,
        limit: 1024,
        time: true
      },
      ...this.options.config
    };
  }
  public UploadResoureFile(): void {

    const config = this.options.config;
    const { debugMode, host, password, username, url, dirPath } = config;
    const ReadFiles = (filePath: string, handerFile: any) => {
      let state = fs.statSync(filePath);
        if (state.isFile()) {
          handerFile && handerFile(filePath)

        } else if (state.isDirectory()) {
          //是文件夹
          //先读取
          let files = fs.readdirSync(filePath);
          files.forEach(file => {
            ReadFiles(path.join(filePath, file), handerFile);
          });
        }

    };
    const donotdeletefilePaths: Array<any> = []
    const assetPath = path.join(process.cwd(), 'dist','assets');

    const handerle = (filePath: string) => {
      if (!/\.(jpg|png|jpeg)$/.test(filePath)) {
        let filecode = fs.readFileSync(filePath, {
          encoding: 'utf-8'
        });
        const donotDelete = /(?<!\/)assets\/[^\.]+(.png|.jpeg|.svg|.jpg|.mp3)/gi;
        const bgPaths = filecode.match(donotDelete) || [];
        bgPaths.forEach(item => {
            donotdeletefilePaths.push(path.join(rootPath,item))
        })
        filecode = filecode.replace(/(\/|\.)+assets\//gi, url + '');
        fs.writeFileSync(filePath,filecode);
      }
    }
    const rootPath = path.join(process.cwd(), 'dist');
    ReadFiles(rootPath, handerle);

    const deleteFile =(filePath: string) => {
      if(!donotdeletefilePaths.some(item => item === filePath) && fs.existsSync(filePath)){
          fs.unlinkSync(filePath);
      }
    }

    client.scp(
      assetPath,
      {
        host,
        username,
        path: dirPath,
        password,
      },
      function(err: any) {
        if (err) {
          console.error(err);
          return;
        }
        ReadFiles(assetPath, deleteFile)
        console.log('Deploy success!');
    })

  }
}

export default FileUpload;
