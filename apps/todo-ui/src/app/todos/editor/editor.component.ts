import { Component, isDevMode } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { Board, BoardComponent } from '#app/shared/board/board.component';
import { HttpClient } from '@angular/common/http';
import { FormComponent, SubmitEvent } from '#app/shared/form/form.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { QuillConfig, QuillModule } from 'ngx-quill';
import {
  FormlyChipsMatComponent,
  FormlyQuillMatComponent,
} from '@engineers/ngx-formly-mat';
import { ActivatedRoute } from '@angular/router';
import { of, tap } from 'rxjs';
import { api } from '#configs/api';
import { Post } from '../view-item/view-item.component';

export const suggestedLabels = ['task', 'work', 'shopping', 'gym', 'food'];

export const quillConfig: QuillConfig = {
  modules: {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{ header: [false, 2, 3, 4] }, { size: ['small', false, 'large'] }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ script: 'sub' }, { script: 'super' }],
      [{ direction: 'rtl' }, { direction: 'ltr' }],
      [{ color: [] }, { background: [] }],
      [{ align: [] }],
      ['link', 'image', 'video'],
      ['clean'],
    ],
    syntax: true,
  },
  placeholder: 'create a note ...',
  debug: isDevMode() ? 'log' : 'error',
  sanitize: true,
};

@Component({
  selector: 'app-posts-editor',
  standalone: true,
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.scss',
  imports: [
    CommonModule,
    BoardComponent,
    FormComponent,
    MatProgressSpinnerModule,
    QuillModule,
  ],
})
export default class PostsEditorComponent {
  fields?: FormlyFieldConfig[];
  loading = true;
  message?: Board;
  model: { [key: string]: any } = {};
  id?: string | null;

  constructor(
    private http: HttpClient,
    private activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe({
      next: (params) => {
        this.loading = true;
        this.id = params.get('id');
        this.getData().subscribe({
          next: () => {
            this.fields = [
              {
                key: 'content',
                type: FormlyQuillMatComponent,
                props: {
                  required: true,
                  ...quillConfig,
                },
              },
              {
                key: 'labels',
                type: FormlyChipsMatComponent,
                props: {
                  required: true,
                  placeholder: 'add labels...',
                  autoComplete: (value: string) => {
                    value = value?.trim().toLowerCase();
                    return !value || value === ''
                      ? suggestedLabels
                      : // rearrange elements
                        // put the matched elements at the top and non-matched at the end
                        suggestedLabels.reduce(
                          (acc, el) => {
                            el.toLowerCase().includes(value)
                              ? acc.unshift(el)
                              : acc.push(el);
                            return acc;
                          },
                          <string[]>[],
                        );
                  },
                },
              },
            ];
            this.loading = false;
          },
          error: (err) => {
            this.message = {
              text: `${err} <hr /><a href="/">view All notes</a>`,
              status: 'error',
            };
          },
        });
      },
    });
  }

  getData() {
    return this.id
      ? this.http.get<Post>(`api/todo/${this.id}`).pipe(
          tap((res) => {
            if (!res) throw new Error(`this note doesn't exist`);
            this.model = res;
          }),
        )
      : of({});
  }

  onSubmit(ev: SubmitEvent): void {
    this.loading = true;
    (this.id
      ? this.http.patch<{ id: string }>(`api/todo/${this.id}`, ev.data)
      : this.http.post<{ id: string }>('api/todo', ev.data)
    )
      .subscribe({
        next: (res) => {
          if (!this.id && !res.id) {
            this.message = {
              status: 'error',
              text: 'failed! no id returned',
            };
            return;
          }
          this.message = {
            status: 'ok',
            text: `the note is created successfully. <a href="/todos/${
              res.id || this.id
            }">view</a> | <a href="/todos/editor/${
              this.id || res.id
            }">Edit</a>`,
          };
          !this.id && ev.form.reset();
        },
        error: (err) => {
          if (isDevMode()) console.error(err);
          this.message = {
            status: 'error',
            text: err.error?.message || err.message || err.error || err,
          };
        },
      })
      .add(() => {
        this.loading = false;
        window.scroll({ top: 0, behavior: 'smooth' });
      });
  }
}
