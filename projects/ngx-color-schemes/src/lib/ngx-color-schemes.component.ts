import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ComponentRef,
  Input,
  OnDestroy,
  Type,
  ViewChild,
  ViewContainerRef,
  inject,
} from '@angular/core';
import { Subscription } from 'rxjs';
import {
  SCHEMES,
  UserScheme,
  NgxIconAbstract,
} from './ngx-color-schemes.types';
import { NgxColorSchemesService } from './ngx-color-schemes.service';
import { NgxIconDarkComponent } from './icon-dark';
import { NgxIconLightComponent } from './icon-light';
import { NgxIconSystemComponent } from './icon-system';

@Component({
  selector: 'ngx-color-schemes',
  template: `<ng-container #container></ng-container>`,
  host: {
    '(click)': 'onClick()',
  },
  styles: [':host { display: inline-block; cursor: pointer }'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxColorSchemesComponent implements AfterViewInit, OnDestroy {
  @Input()
  size: number = 32;

  @ViewChild('container', { read: ViewContainerRef })
  container!: ViewContainerRef;

  cdr: ChangeDetectorRef = inject(ChangeDetectorRef);

  ngxColorSchemesService: NgxColorSchemesService = inject(
    NgxColorSchemesService
  );

  scheme: UserScheme = SCHEMES.SYSTEM;

  schemeChange$: Subscription =
    this.ngxColorSchemesService.userSchemeChange.subscribe(
      (scheme: UserScheme) => {
        this.scheme = scheme;
        this.createIcon();
      }
    );

  schemeMap = new Map<UserScheme, NgxIconAbstract>([
    [SCHEMES.LIGHT, NgxIconLightComponent],
    [SCHEMES.DARK, NgxIconDarkComponent],
    [SCHEMES.SYSTEM, NgxIconSystemComponent],
  ]);

  onClick(): void {
    this.setNextScheme();
  }

  setNextScheme(): void {
    this.ngxColorSchemesService.setUserScheme(this.getNextScheme());
  }

  getNextScheme(): UserScheme {
    const keys: UserScheme[] = [...this.schemeMap.keys()];
    const index: number = keys.indexOf(this.scheme);
    const nextIndex: number = (index + 1) % keys.length;
    return keys[nextIndex];
  }

  createIcon(): void {
    if (!this.container) {
      return;
    }

    const iconComponent = this.schemeMap.get(
      this.scheme
    ) as Type<NgxIconAbstract>;

    this.container.clear();

    // @todo optimize types
    const componentRef: ComponentRef<
      NgxIconDarkComponent | NgxIconLightComponent | NgxIconSystemComponent
    > = this.container.createComponent<
      NgxIconDarkComponent | NgxIconLightComponent | NgxIconSystemComponent
    >(iconComponent);
    // componentRef.setInput('size', this.size); // @todo after upgrade to angular 14.1.0+
    componentRef.instance.size = this.size;
    this.cdr.detectChanges();
  }

  ngAfterViewInit(): void {
    this.createIcon();
  }

  ngOnDestroy(): void {
    this.schemeChange$.unsubscribe();
  }
}
