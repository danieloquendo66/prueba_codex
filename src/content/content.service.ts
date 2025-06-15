import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BlogPost } from './entities/blog-post.entity';
import { PortfolioItem } from './entities/portfolio-item.entity';
import { CreateBlogPostDto } from './dto/create-blog-post.dto';
import { CreatePortfolioItemDto } from './dto/create-portfolio-item.dto';

@Injectable()
export class ContentService {
  constructor(
    @InjectRepository(BlogPost)
    private readonly blogRepo: Repository<BlogPost>,
    @InjectRepository(PortfolioItem)
    private readonly portfolioRepo: Repository<PortfolioItem>,
  ) {}

  // Blog posts
  createPost(dto: CreateBlogPostDto) {
    const post = this.blogRepo.create(dto);
    return this.blogRepo.save(post);
  }
  getPosts() {
    return this.blogRepo.find();
  }
  async getPost(id: string) {
    const post = await this.blogRepo.findOne({ where: { id } });
    if (!post) throw new NotFoundException(`Post ${id} not found`);
    return post;
  }

  // Portfolio items
  createItem(dto: CreatePortfolioItemDto) {
    const item = this.portfolioRepo.create(dto);
    return this.portfolioRepo.save(item);
  }
  getItems() {
    return this.portfolioRepo.find();
  }
  async getItem(id: string) {
    const item = await this.portfolioRepo.findOne({ where: { id } });
    if (!item) throw new NotFoundException(`Item ${id} not found`);
    return item;
  }
}