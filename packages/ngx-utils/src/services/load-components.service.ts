import {
  ComponentFactoryResolver,
  ComponentRef,
  Injectable,
  Renderer2,
  RendererFactory2,
  ViewContainerRef,
} from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoadComponentsService {
  renderer: Renderer2;
  constructor(private rendererFactory: RendererFactory2) {
    // in services we use RendererFactory2 to create Renderer2 instance
    // todo: or pass the Renderer2 instance from the component to reuse it
    // https://stackoverflow.com/a/47925259
    this.renderer = this.rendererFactory.createRenderer(null, null);
  }

  /**
   * dynamically load Angular components  into the template
   * https://angular.io/guide/dynamic-component-loader
   *
   * @function load
   * @param  component the component to be dynamically loaded
   * @param  placeholder reference to the container where the dynamically loaded component will be injected
   * @param  inputs  inputs to be passed to the loaded component.
   * @returns the loaded component, so you can access it in the host component
   * @example https://stackblitz.com/edit/angular-ivy-kformh
   */

  /*
    notes:
      - placeholder example:
         <ng-template #placeholder>
         OR <ng-template dynamic-load-directive>
         @ViewChild('placeholder', {read: ViewContainerRef, static: true}) placeholder: ViewContainerRef;
     */

  // todo: placeholder: ViewContainerRef|ElementRef|...
  load(
    // todo: Angular component type
    // https://stackoverflow.com/questions/45823393/type-of-angular-components
    component: any,
    placeholder: ViewContainerRef,
    inputs: { [key: string]: any } = {}
  ): ComponentRef<any> {
    // create the component and append to the placeholder in the template
    placeholder.clear();
    // todo: .createComponent<component type>()
    let componentReference = placeholder.createComponent<any>(component);

    // todo: componentRef.instance = inputs; not working
    if (inputs) {
      for (let k in inputs) {
        if (inputs.hasOwnProperty(k)) {
          // todo: <ComponentType>componentRef.instance
          componentReference.instance[k] = inputs[k];
        }
      }
    }

    /*
    // to control the loaded component use `componentRef.location.nativeElement`
    let el = componentRef.location.nativeElement as HTMLElement;
    el.appendChild(...);
    */

    return componentReference;
  }
}
