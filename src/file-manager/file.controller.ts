import {
  Controller,
  Get,
  InternalServerErrorException,
  Post,
  Body,
  UseInterceptors,
  UploadedFiles,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  Req,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import * as path from 'path';
import { FileManagerService } from './file-manager.service';
import { ConfigService } from '@nestjs/config';

@Controller('file')
export class FileController {
  constructor(
    private readonly fileService: FileManagerService,
    private readonly configService: ConfigService,
  ) {}
  private get publicDir(): string {
    const publicUploadPath =
      this.configService.get<string>('PUBLIC_UPLOAD_PATH');

    return path.resolve(process.cwd(), publicUploadPath);
  }

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  create(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 10 * 1024 * 1024,
          }),
          new FileTypeValidator({
            fileType: '.(png|jpeg|jpg|webp|gif|svg)',
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.fileService.uploadImageCKEditor(file);
  }

  @Post('/public')
  @UseInterceptors(FilesInterceptor('files', 1000))
  createPublic(
    @UploadedFiles()
    files: Express.Multer.File[],

    @Body('paths')
    paths: string[] | string,
  ) {
    return this.fileService.uploadPublic(
      files,
      Array.isArray(paths) ? paths : [paths],
    );
  }

  @Get('/public')
  async getPublicTree() {
    try {
      return {
        path: 'public',
        tree: await this.fileService.buildTree(this.publicDir),
      };
    } catch (error) {
      throw new InternalServerErrorException('Unable to read public directory');
    }
  }
}
