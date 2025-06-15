import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { ContentService } from './content.service';
import { CreateBlogPostDto } from './dto/create-blog-post.dto';
import { CreatePortfolioItemDto } from './dto/create-portfolio-item.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller()
export class ContentController {
  constructor(private readonly service: ContentService) {}

  // Blog posts
  @Post('blog/posts')
  createPost(@Body() dto: CreateBlogPostDto) {
    return this.service.createPost(dto);
  }
  @Get('blog/posts')
  getPosts() {
    return this.service.getPosts();
  }
  @Get('blog/posts/:id')
  getPost(@Param('id') id: string) {
    return this.service.getPost(id);
  }

  // Portfolio items
  @Post('portfolio/items')
  createItem(@Body() dto: CreatePortfolioItemDto) {
    return this.service.createItem(dto);
  }
  @Get('portfolio/items')
  getItems() {
    return this.service.getItems();
  }
  @Get('portfolio/items/:id')
  getItem(@Param('id') id: string) {
    return this.service.getItem(id);
  }
}