import { Injectable, isDevMode } from '@angular/core';
import { Post } from './view-item/view-item.component';
import { DateService } from '#app/shared/date.service';
import { api } from '#configs/api';

@Injectable({
  providedIn: 'root',
})
export class TodosService {
  constructor(private dateService: DateService) {}

  transform(post: Post) {
    return {
      ...post,
      link: `/todos/${post.id}`,
      createdAt: this.dateService.format(post.created_at),
      author: post.user
        ? {
            name: `${post.user.firstName} ${post.user.lastName}`,
            link: `/user/${post.user.id}`,
            image: '/assets/person.png',
          }
        : undefined,
      keywords: post.labels?.map((el) => ({
        text: el,
        link: `/todos/label/${encodeURIComponent(el)}`,
      })),
    };
  }
}
