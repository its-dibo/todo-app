import { isPlatformBrowser } from '@angular/common';
import { HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { PLATFORM_ID, inject } from '@angular/core';
import { api } from '#configs/api';

export function ApiInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
  let platform = inject(PLATFORM_ID);

  let clonedRequest = req.clone({
    url: `${api.baseUrl}/${req.url
      // remove the prefix '/' if it existing
      .replace(/^\//, '')
      // add apiVersion to urls that starts with /api, but doesn't include a version
      .replace(/^api\/(?!v\d\.\d\/)(.+)/, `api/${api.version}/$1`)}`,
    setHeaders: {
      Authorization: isPlatformBrowser(platform)
        ? `Bearer ${localStorage?.getItem('auth_token')}`
        : '',
    },
  });
  return next(clonedRequest);
}
