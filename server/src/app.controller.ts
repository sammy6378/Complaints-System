// src/app.controller.ts
import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller('/')
export class AppController {
  @Get()
  getHome(@Res() res: Response) {
    res.send(`
      <h1>Welcome to the Complaints System API</h1>
      <p>Visit <a href="/api/reference">Documentation</a> for API documentation.</p>
      <p>Visit <a href="https://complaints-system-production.up.railway.app">Live</a> Deployed site</p>
    `);
  }
}
