import { Category } from "src/entities/category.entity";

export class CategoryResponseDto {
    id: string;
    name: string;
    description: string;
    parentCategoryId: string | null;

    constructor(category: Category) {
        this.id = category.id;
        this.name = category.name;
        this.description = category.description;
        this.parentCategoryId = category.parentCategory?.id || null;
    }
}