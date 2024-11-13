import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";


export class CreateCategoryDto {
    @ApiProperty({ 
        description: 'The name of the category',
    })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({
        description: 'The description of the category',
    })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({
        description: 'The ID of the parent category',
    })
    @IsOptional()
    @IsString()
    parentCategoryId?: string;
}