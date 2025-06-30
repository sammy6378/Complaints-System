import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { ApiResponse, createResponse } from 'src/utils/responseHandler';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(
    createCategoryDto: CreateCategoryDto,
  ): Promise<ApiResponse<Category>> {
    try {
      const newCategory = this.categoryRepository.create(createCategoryDto);
      const savedCategory = await this.categoryRepository.save(newCategory);
      return createResponse(savedCategory, 'Category created successfully');
    } catch (error) {
      console.error('Error creating category:', error);
      throw new Error('Failed to create category');
    }
  }

  async findAll(): Promise<ApiResponse<Category[]>> {
    try {
      const categories = await this.categoryRepository.find({
        relations: ['complaints'],
        order: { created_at: 'DESC' },
      });
      return createResponse(categories, 'Categories retrieved successfully');
    } catch (error) {
      console.error('Error retrieving categories:', error);
      throw new Error('Failed to retrieve categories');
    }
  }

  async findOne(id: string): Promise<ApiResponse<Category> | string> {
    try {
      const category = await this.categoryRepository.findOneBy({
        category_id: id,
      });
      if (!category) {
        return `Category with id ${id} not found`;
      }
      return createResponse(category, 'Category found successfully');
    } catch (error) {
      console.error('Error finding category:', error);
      throw new Error('Failed to find category');
    }
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<ApiResponse<Category> | string> {
    try {
      const existing = await this.categoryRepository.findOneBy({
        category_id: id,
      });
      if (!existing) {
        return `Category with id ${id} not found`;
      }
      await this.categoryRepository.update(id, updateCategoryDto);
      return this.findOne(id);
    } catch (error) {
      console.error('Error updating category:', error);
      throw new Error('Failed to update category');
    }
  }

  async remove(id: string): Promise<string> {
    try {
      const result = await this.categoryRepository.delete(id);
      if (result.affected === 0) {
        return `Category with id ${id} not found`;
      }
      return `Category with id ${id} deleted successfully`;
    } catch (error) {
      console.error('Error deleting category:', error);
      throw new Error('Failed to delete category');
    }
  }
}
