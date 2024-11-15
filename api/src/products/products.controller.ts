import { BadRequestException, Controller, Get, Param, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ProductsService } from './products.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { response, Response } from 'express';


@Controller('products')
export class ProductsController {
    constructor(
        private productsService: ProductsService
    ){}

    @Post()
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './uploads/products',
            filename: (req, file, callback) => {
                const name: string = file.originalname.split('.')[0];
                const fileExtension: string = file.originalname.split('.')[1];
                const newFileName: string = name.split(" ").join("_")+"_"+Date.now()+"."+fileExtension;

                callback(null, newFileName);
            }
        }),
        fileFilter: (req, file, callback) => {
            if(!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
                return callback(
                    new BadRequestException('Unsupported file format. Only JPEG, PNG, GIF and JPG are allowed.'), false
                )
            }

            callback(null, true)
        }
    }))
    createProduct(@UploadedFile() file: Express.Multer.File) {
        console.log(file)
    }

    @Get('image/:filename')
    async getProductImage(@Param('filename') filename, @Res() res: Response): Promise<void> {
        res.sendFile( filename, {root: './uploads/products',});
    }

}
