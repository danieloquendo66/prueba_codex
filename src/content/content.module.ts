import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogPost } from './entities/blog-post.entity';
import { PortfolioItem } from './entities/portfolio-item.entity';
import { ContentService } from './content.service';
import { ContentController } from './content.controller';

@Module({
  imports: [TypeOrmModule.forFeature([BlogPost, PortfolioItem])],
  providers: [ContentService],
  controllers: [ContentController],
})
export class ContentModule {}