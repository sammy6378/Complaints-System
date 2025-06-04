import { Injectable } from '@nestjs/common';
import { CreateStateDto } from './dto/create-state.dto';
import { UpdateStateDto } from './dto/update-state.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { State } from './entities/state.entity';
import { Repository } from 'typeorm';
import { ApiResponse, createResponse } from 'src/utils/responseHandler';

@Injectable()
export class StatesService {
  constructor(
    @InjectRepository(State)
    private stateRepository: Repository<State>,
  ) {}

  async create(createStateDto: CreateStateDto): Promise<ApiResponse<State>> {
    try {
      const state = this.stateRepository.create(createStateDto);
      const savedState = await this.stateRepository.save(state);
      return createResponse(savedState, 'State created successfully');
    } catch (error) {
      console.error('Error creating state:', error);
      throw new Error('Failed to create state');
    }
  }

  async findAll(): Promise<ApiResponse<State[]>> {
    try {
      const states = await this.stateRepository.find();
      return createResponse(states, 'States retrieved successfully');
    } catch (error) {
      console.error('Error retrieving states:', error);
      throw new Error('Failed to retrieve states');
    }
  }

  async findOne(id: string): Promise<ApiResponse<State> | string> {
    try {
      const state = await this.stateRepository.findOneBy({ state_id: id });
      if (!state) {
        return `State with id ${id} not found`;
      }
      return createResponse(state, 'State retrieved successfully');
    } catch (error) {
      console.error('Error retrieving state:', error);
      throw new Error('Failed to retrieve state');
    }
  }

  async update(
    id: string,
    updateStateDto: UpdateStateDto,
  ): Promise<ApiResponse<State> | string> {
    try {
      const existing = await this.stateRepository.findOneBy({ state_id: id });
      if (!existing) {
        return `State with id ${id} not found`;
      }

      await this.stateRepository.update(id, updateStateDto);
      return this.findOne(id);
    } catch (error) {
      console.error('Error updating state:', error);
      throw new Error('Failed to update state');
    }
  }

  async remove(id: string): Promise<string> {
    try {
      const result = await this.stateRepository.delete(id);
      if (result.affected === 0) {
        return `State with id ${id} not found`;
      }
      return `State with id ${id} deleted successfully`;
    } catch (error) {
      console.error('Error deleting state:', error);
      throw new Error('Failed to delete state');
    }
  }
}
