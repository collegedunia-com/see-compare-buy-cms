import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { S3Client } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import { mkdir, writeFile } from 'fs/promises';
import { dirname, resolve, sep } from 'path';
import {
  validatePublicFile,
  validatePublicPaths,
} from './file-upload.validator';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class FileManagerService {
  private s3: S3Client;

  logger = new Logger('FileManagerService');

  constructor(private configService: ConfigService) {
    const accessKeyId = this.configService.get('AWS_ACCESS_KEY_ID');
    const secretAccessKey = this.configService.get('AWS_SECRET_ACCESS_KEY');
    const region = this.configService.get('AWS_REGION');
    const endPoint = this.configService.get('AWS_ENDPOINT');
    const userName = this.configService.get('AWS_USER_NAME');

    if (!accessKeyId || !secretAccessKey || !region || !endPoint || !userName) {
      throw new Error('AWS environment variables are not set');
    }

    this.s3 = new S3Client({
      region,
      endpoint: endPoint,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
      customUserAgent: userName,
    });
  }

  async uploadImageCKEditor(file: any) {
    try {
      const path = await this.upload(file, 'news', true);
      return {
        default: path,
        url: `${this.configService.get('AWS_CLOUDFRONT_URL')}${path}`,
      };
    } catch (error) {
      this.logger.error(error);
    }
  }

  async upload(
    file: any,
    remoteFolderPath: string = '',
    isRandomName: boolean = false,
  ) {
    try {
      let { originalname } = file;

      if (isRandomName) {
        const extension = originalname.split('.').pop() || '';
        originalname = `${uuidv4()}.${extension}`;
      }

      const bucketS3 = this.configService.get('AWS_BUCKET_NAME');
      await this.uploadS3(
        file.buffer,
        remoteFolderPath,
        bucketS3,
        originalname,
      );

      if (remoteFolderPath) {
        return `${remoteFolderPath}/${originalname}`;
      } else {
        return `${originalname}`;
      }
    } catch (error) {
      this.logger.error(error);
    }
  }

  async uploadS3(
    file: any,
    folderPath: string,
    bucket: string,
    key: string,
    acl: string = 'public-read',
  ) {
    if (folderPath || folderPath !== '') {
      key = `${folderPath}/${key}`;
    } else {
      key = `${key}`;
    }

    try {
      const params = {
        Bucket: bucket,
        Key: key,
        Body: file,
        // Acl: acl
      };
      return await this.s3.send(new PutObjectCommand(params));
    } catch (error) {
      throw error;
    }
  }

  async uploadPublic(files: Express.Multer.File[], paths: string[]) {
    if (!files?.length) {
      throw new BadRequestException('No files uploaded');
    }

    if (!paths || paths.length !== files.length) {
      throw new BadRequestException('Files and paths count must match');
    }

    const normalizedPaths = validatePublicPaths(paths);

    const uploadRoot = resolve(
      this.configService.getOrThrow('PUBLIC_UPLOAD_PATH'),
    );

    const publicUrl = this.configService.getOrThrow('PUBLIC_UPLOAD_URL');

    const uploaded = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const relativePath = normalizedPaths[i];

      validatePublicFile(file);

      const filePath = resolve(uploadRoot, relativePath);

      if (!filePath.startsWith(uploadRoot + sep)) {
        throw new BadRequestException('Invalid file path');
      }

      await mkdir(dirname(filePath), {
        recursive: true,
      });

      await writeFile(filePath, file.buffer);

      uploaded.push({
        path: relativePath,
        url: `${publicUrl}/${relativePath}`,
      });
    }

    return {
      message: 'Files uploaded successfully',
      files: uploaded,
    };
  }

  async buildTree(dir: string): Promise<any[]> {
    const entries = await fs.readdir(dir, {
      withFileTypes: true,
    });

    const tree = [];

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        tree.push({
          name: entry.name,
          type: 'directory',
          children: await this.buildTree(fullPath),
        });
      } else if (entry.isFile()) {
        tree.push({
          name: entry.name,
          type: 'file',
        });
      }
    }

    return tree;
  }
}
