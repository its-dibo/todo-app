import { Component, Inject, isDevMode } from '@angular/core';
import { CommonModule, DOCUMENT, PlatformLocation } from '@angular/common';
import { Article, NgxContentCardComponent } from '@engineers/ngx-cards-mat';
import { Board, BoardComponent } from '#app/shared/board/board.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Html2textPipe, MetaService } from '@engineers/ngx-utils';
import { MatIconModule } from '@angular/material/icon';
import { TodosService } from '../todo.service';

export interface Post {
  id: string;
  created_at: string;
  updated_at: string;
  user?: { id: string; firstName: string; lastName: string };
  content: string;
  labels: string[];
}

@Component({
  selector: 'app-view-item',
  standalone: true,
  imports: [
    CommonModule,
    NgxContentCardComponent,
    BoardComponent,
    MatProgressSpinnerModule,
    MatIconModule,
    RouterModule,
  ],
  providers: [Html2textPipe],
  templateUrl: './view-item.component.html',
  styleUrl: './view-item.component.scss',
})
export default class ViewItemComponent {
  data: Article;
  message: Board;
  loading = true;

  constructor(
    private http: HttpClient,
    private activatedRoute: ActivatedRoute,
    private metaService: MetaService,
    private todosService: TodosService,
    private html2text: Html2textPipe,
    private location: PlatformLocation,
    @Inject(DOCUMENT) private document: Document,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params) => {
      this.http
        .get<Post>(`api/todo/${params.get('id')}`)
        .subscribe({
          next: (res) => {
            if (!res.id) {
              this.message = {
                status: 'error',
                text: 'cannot find the requested todo note <br /><a href="/">view all notes</a>',
              };
              return;
            }
            this.data = this.todosService.transform(res);
            let contentElement = this.document.createElement('div');
            // eslint-disable-next-line @microsoft/sdl/no-inner-html
            contentElement.innerHTML = this.data.content!;

            this.metaService.updateTags({
              title: <string>(
                [...contentElement.childNodes]
                  ?.find((el) => el.textContent)
                  ?.textContent?.slice(0, 300)
              ),
              description: this.html2text
                .transform(this.data.content)
                .slice(0, 700),
              url: this.data.link,
              image: 'assets/images/todo.png',
              baseUrl: `${this.location.protocol}//${this.location.hostname}`,
            });
          },
          error: (error) => {
            this.message = {
              status: 'error',
              text: error.message || error,
            };
            if (isDevMode()) console.error(error);
          },
        })
        .add(() => {
          this.loading = false;
        });
    });
  }
}
