import { Injectable } from '@nestjs/common';
import { CreateSubcategoryDto } from './dto/create-subcategory.dto';
import { UpdateSubcategoryDto } from './dto/update-subcategory.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subcategory } from './entities/subcategory.entity';
import { Category } from 'src/categories/entities/category.entity';
import { ApiResponse, createResponse } from 'src/utils/responseHandler';

@Injectable()
export class SubcategoriesService {
  constructor(
    @InjectRepository(Subcategory)
    private subCategoryRepository: Repository<Subcategory>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async create(
    createSubcategoryDto: CreateSubcategoryDto,
  ): Promise<ApiResponse<Subcategory>> {
    try {
      const category = await this.categoryRepository.findOneBy({
        category_id: createSubcategoryDto.categoryId,
      });
      if (!category) {
        throw new Error(
          `Category with id ${createSubcategoryDto.categoryId} not found`,
        );
      }

      const subcategory = this.subCategoryRepository.create({
        ...createSubcategoryDto,
        category,
      });

      const saved = await this.subCategoryRepository.save(subcategory);
      return createResponse(saved, 'Subcategory created successfully');
    } catch (error) {
      console.error('Error creating subcategory:', error);
      throw new Error('Failed to create subcategory');
    }
  }

  async findAll(): Promise<ApiResponse<Subcategory[]>> {
    try {
      const subcategories = await this.subCategoryRepository.find({
        relations: ['category'],
      });
      return createResponse(
        subcategories,
        'Subcategories retrieved successfully',
      );
    } catch (error) {
      console.error('Error retrieving subcategories:', error);
      throw new Error('Failed to retrieve subcategories');
    }
  }

  async findOne(id: string): Promise<ApiResponse<Subcategory> | string> {
    try {
      const subcategory = await this.subCategoryRepository.findOne({
        where: { id },
        relations: ['category'],
      });

      if (!subcategory) {
        return `Subcategory with id ${id} not found`;
      }

      return createResponse(subcategory, 'Subcategory found successfully');
    } catch (error) {
      console.error('Error finding subcategory:', error);
      throw new Error('Failed to find subcategory');
    }
  }

  async update(
    id: string,
    updateSubcategoryDto: UpdateSubcategoryDto,
  ): Promise<ApiResponse<Subcategory> | string> {
    try {
      const existing = await this.subCategoryRepository.findOneBy({ id });
      if (!existing) {
        return `Subcategory with id ${id} not found`;
      }

      // If category is being updated, validate new category
      if (updateSubcategoryDto.categoryId) {
        const category = await this.categoryRepository.findOneBy({
          category_id: updateSubcategoryDto.categoryId,
        });
        if (!category) {
          throw new Error(
            `Category with id ${updateSubcategoryDto.categoryId} not found`,
          );
        }

        updateSubcategoryDto['category'] = category;
        delete updateSubcategoryDto['categoryId'];
      }

      await this.subCategoryRepository.update(id, updateSubcategoryDto);
      return this.findOne(id);
    } catch (error) {
      console.error('Error updating subcategory:', error);
      throw new Error('Failed to update subcategory');
    }
  }

  async remove(id: string): Promise<ApiResponse<string | null>> {
    try {
      const result = await this.subCategoryRepository.delete(id);
      if (result.affected === 0) {
        return createResponse(null, `Subcategory with id ${id} not found`);
      }
      return createResponse(
        null,
        `Subcategory with id ${id} deleted successfully`,
      );
    } catch (error) {
      console.error('Error deleting subcategory:', error);
      throw new Error('Failed to delete subcategory');
    }
  }
}
