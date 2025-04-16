import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  NotFoundException,
  Param,
  Post,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { ZodSerializerDto } from 'nestjs-zod';
import path from 'path';
import { UploadFileResDTO, UploadPresignedFileBodyDTO, UploadPresignedFileResDTO } from 'src/routes/media/media.dto';
import { MediaService } from 'src/routes/media/media.service';
import { ParseFilePipeWithUnlink } from 'src/routes/media/parse-file-pipe-with-unlink.pipe';
import { UPLOAD_DIR } from 'src/shared/constants/dir.constant';
import { IsPublic } from 'src/shared/decorators/auth.decorator';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('images/upload')
  @ZodSerializerDto(UploadFileResDTO)
  @UseInterceptors(
    FilesInterceptor('files', 3, {
      limits: {
        fileSize: 2 * 1024 * 1024, //2MB
      },
    }),
  )
  uploadFile(
    @UploadedFiles(
      new ParseFilePipeWithUnlink({
        validators: [
          new MaxFileSizeValidator({ maxSize: 2 * 1024 * 1024 }), //2MB
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|webp)$/ }),
        ],
      }),
    )
    files: Array<Express.Multer.File>,
  ) {
    return this.mediaService.uploadFile(files);
  }

  @Get('static/:filename')
  @IsPublic()
  serveFile(@Param('filename') filename: string, @Res() res: Response) {
    return res.sendFile(path.resolve(UPLOAD_DIR, filename), (error) => {
      if (error) {
        const notFound = new NotFoundException('File not found');

        res.status(notFound.getStatus()).json(notFound.getResponse());
      }
    });
  }

  @Post('images/upload/presigned-url')
  @ZodSerializerDto(UploadPresignedFileResDTO)
  @IsPublic()
  createPresignedUrl(@Body() body: UploadPresignedFileBodyDTO) {
    return this.mediaService.getPresignedUrl(body);
  }
}
