import { Paginated } from './pagination.interface';
import { Request } from 'express';
import { Inject, Injectable } from '@nestjs/common';
import { CreatePaginationDto } from './dto/create-pagination.dto';
import { REQUEST } from '@nestjs/core';
import { ObjectLiteral, Repository } from 'typeorm';

@Injectable()
export class PaginationProvider {
  constructor(
    @Inject(REQUEST)
    private readonly request: Request,
  ) {}
  async paginatedQuery<T extends ObjectLiteral>(
    paginatedQuery: CreatePaginationDto,
    repository: Repository<T>,
  ) {
    const page = paginatedQuery.page ?? 1;
    const limit = paginatedQuery.limit ?? 10;

    // get all data
    const results = await repository.find({
      skip: (page - 1) * limit,
      take: limit,
    });

    // new url
    const baseUrl =
      this.request.protocol + '://' + this.request.headers.host + '/';

    const newUrl = new URL(this.request.url, baseUrl);
    const totalItems = await repository.count();
    const totalPages = Math.ceil(totalItems / limit);
    const itemsPerPage = limit;

    const nextPage = paginatedQuery.page === totalPages ? page : page + 1;
    const prevPage = paginatedQuery.page === 1 ? page : page - 1;

    const finalResponse: Paginated<T> = {
      data: results,
      meta: {
        totalItems: totalItems,
        itemsPerPage: itemsPerPage,
        totalPages: totalPages,
        currentPage: page,
      },
      links: {
        first: `${newUrl.origin}${newUrl.pathname}?limit=${limit}&page=${page}`,
        next: `${newUrl.origin}${newUrl.pathname}?limit=${limit}&page=${nextPage}`,
        previous: `${newUrl.origin}${newUrl.pathname}?limit=${limit}&page=${prevPage}`,
        last: `${newUrl.origin}${newUrl.pathname}?limit=${limit}&page=${totalPages}`,
        current: `${newUrl.origin}${newUrl.pathname}?limit=${limit}&page=${page}`,
      },
    };
    return finalResponse;
  }
}
