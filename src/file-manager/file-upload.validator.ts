import { BadRequestException } from '@nestjs/common';

export function validatePublicFile(file: Express.Multer.File) {
  if (file.size > 50 * 1024 * 1024) {
    throw new BadRequestException(`${file.originalname} exceeds 50 MB`);
  }

  if (
    !/\.(png|jpeg|jpg|webp|gif|svg|avif|pdf|html|js)$/i.test(file.originalname)
  ) {
    throw new BadRequestException(`Invalid file type: ${file.originalname}`);
  }
}

export function validatePublicPaths(paths: string[]) {
  const foldersByLevel = new Map<number, string>();

  for (const path of paths) {
    const normalized = path.replace(/\\/g, '/');

    if (
      normalized.startsWith('/') ||
      normalized.includes('../') ||
      normalized.includes('/..') ||
      normalized.includes('./') ||
      normalized.includes('//')
    ) {
      throw new BadRequestException('Invalid file path');
    }

    const parts = normalized.split('/');

    const folders = parts.slice(0, -1);

    if (folders.length > 3) {
      throw new BadRequestException('Maximum 3 folder levels allowed');
    }

    folders.forEach((folder, index) => {
      const existingFolder = foldersByLevel.get(index);

      if (existingFolder && existingFolder !== folder) {
        throw new BadRequestException(
          `Only one folder is allowed at level ${index + 1}`,
        );
      }

      foldersByLevel.set(index, folder);
    });
  }

  return paths.map((path) => path.replace(/\\/g, '/'));
}
