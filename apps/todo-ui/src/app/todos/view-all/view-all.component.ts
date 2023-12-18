import { Component, Inject } from '@angular/core';
import { CommonModule, DOCUMENT, PlatformLocation } from '@angular/common';
import { Article } from '@engineers/ngx-cards-mat';
import { Board, BoardComponent } from '#app/shared/board/board.component';
import { HttpClient } from '@angular/common/http';
import { Html2textPipe, MetaService } from '@engineers/ngx-utils';
import { Post } from '../view-item/view-item.component';
import { NgxContentCardComponent } from '@engineers/ngx-cards-mat/src/cards.component/cards.component';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { api } from '#configs/api';
import { meta } from '#configs/meta';
import { TodosService } from '../todo.service';

@Component({
  selector: 'app-todo-view-all',
  standalone: true,
  templateUrl: './view-all.component.html',
  styleUrl: './view-all.component.scss',
  imports: [
    CommonModule,
    BoardComponent,
    NgxContentCardComponent,
    MatListModule,
    MatProgressSpinnerModule,
    RouterModule,
  ],
  providers: [Html2textPipe],
})
export default class TodoViewAllComponent {
  data: Article[];
  count: number;
  loading = true;
  message?: Board;
  label: string | null;

  constructor(
    private http: HttpClient,
    private metaService: MetaService,
    private todosService: TodosService,
    private activatedRoute: ActivatedRoute,
    private html2text: Html2textPipe,
    private location: PlatformLocation,
    @Inject(DOCUMENT) private document: Document,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe({
      next: (params) => {
        this.label = params.get('label');
        this.http
          .get<{ data: Post[]; count: number }>(
            `api/todo${
              this.label ? `/label/${encodeURIComponent(this.label)}` : ''
            }`,
          )
          .subscribe({
            next: (res) => {
              this.data = res?.data?.map((el) =>
                this.todosService.transform(el),
              );
              this.count = res?.count;
              this.metaService.updateTags({
                ...meta,
                url: this.label
                  ? `/label/${encodeURIComponent(this.label)}`
                  : '',
                baseUrl: `${this.location.protocol}//${this.location.hostname}`,
              });
            },
            error: (err) => {
              this.message = {
                status: 'error',
                text: `error! ${err.message || err}`,
              };
            },
          })
          .add(() => (this.loading = false));
      },
    });
  }
}
