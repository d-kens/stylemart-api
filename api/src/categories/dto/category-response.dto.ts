import { Category } from "src/entities/category.entity";
import { ApiProperty } from "@nestjs/swagger";

export class CategoryResponseDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    description: string;

    @ApiProperty()
    parentCategoryId: string | null;

    constructor(category: Category) {
        this.id = category.id;
        this.name = category.name;
        this.description = category.description;
        this.parentCategoryId = category.parentCategory?.id || null;
    }
}