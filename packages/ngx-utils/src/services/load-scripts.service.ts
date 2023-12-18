import { Inject, Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';

export interface LoadReturn {
  // the source link i.e. `<script src="$source" />`
  source: string;
  attributes: { [key: string]: any };
  type: 'script' | 'css' | 'link' | 'module';
  // the target element that the script is loaded inside
  // default: head or body
  parent: HTMLElement;
  // the loaded element, i.e. the script or link
  element: HTMLElement;
}

@Injectable({ providedIn: 'root' })
export class NgxLoadService {
  private renderer: Renderer2;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private rendererFactory: RendererFactory2
  ) {
    // we cannot use Rendere2 directly in services, use RendererFactory2 to create it.
    // instead of constructor(private renderer: Renderer2){}
    // https://stackoverflow.com/a/47924814/12577650
    this.renderer = this.rendererFactory.createRenderer(null, null);
  }
  /**
   * dynamically inject and load scripts
   * and returns a promise, so dependencies can be loaded in order
   * similar to @engineers/dom:load() but uses renderer2
   *
   * @param source
   * @param type
   * @param attributes
   * @param parent
   * @returns
   * @example load adsense
   * ngxLoadService.load(
   *   '//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js',
   *   {id: 'ca-pub-9687007734660221'}
   *  )
   */
  // todo: import from @engineers/dom/load()
  // needs to replace document.* with this.renderer.*
  load(
    source: string,
    attributes: { [key: string]: any } = {},
    type?: 'script' | 'css' | 'link' | 'module',
    parent?: HTMLElement
  ): Promise<LoadReturn> {
    return new Promise((resolve, reject) => {
      if (!type) {
        let fileExtension = (source.split('.').pop() || '').toLowerCase();
        if (fileExtension === 'js') {
          type = 'script';
        } else if (fileExtension === 'mjs') {
          type = 'module';
        }
        // style sheet
        else if (['css', 'scss', 'less', 'sass'].includes(fileExtension)) {
          type = 'css';
        }
        // web fonts
        else if (['EOT', 'TTF', 'WOFF', 'WOFF2'].includes(fileExtension)) {
          type = 'link';
        } else {
          type = 'link';
        }
      }

      if (type === 'css') {
        type = 'link';
        attributes.rel = 'stylesheet';
        attributes.type = 'text/css';
      }

      if (type === 'link') {
        attributes.href = source;
        // https://developer.mozilla.org/en-US/docs/Web/HTML/Preloading_content#Cross-origin_fetches
        attributes.crossorigin = true;
      } else if (type === 'script' || type === 'module') {
        attributes.src = source;
        // `type = 'text/javascript'` is no more required
        attributes.type = type === 'module' ? type : 'text/javascript';
      }

      if (!('async' in attributes)) {
        attributes.async = true;
      }

      // use Renderer2 (through RendererFactory in services) instead of document.createElement()
      // https://stackoverflow.com/a/59789482/12577650
      // https://stackoverflow.com/a/47924814/12577650
      // https://www.coditty.com/code/angular-component-dynamically-load-external-javascript
      // https://www.positronx.io/using-renderer2-angular/
      // https://www.tektutorialshub.com/angular/renderer2-angular/
      // let el: HTMLElement = this.document.createElement(type === 'link' ? 'link' : 'script');
      let element: HTMLElement = this.renderer.createElement(
        type === 'link' ? 'link' : 'script'
      );
      for (let key in attributes) {
        if (attributes.hasOwnProperty(key)) {
          this.renderer.setAttribute(element, key, attributes[key]);
        }
      }

      // todo: load().then() doesn't work
      // todo: remove listener after loaded
      // equivalent to el.addEventListener()
      this.renderer.listen(element, 'load', () => {
        // console.log(`loaded: ${source}`);
        resolve({
          source,
          attributes,
          type: type!,
          element,
          parent: parent!,
        });
      });

      this.renderer.listen(element, 'error', (error: any) => {
        reject({
          error,
          source,
          attributes,
          type: type!,
          element,
          parent: parent!,
        });
      });

      this.renderer.appendChild(
        parent || this.document.head || this.document.body,
        element
      );

      /* console.log({
        el,
        head: this.document.head,
      }); */
    });
  }
}
