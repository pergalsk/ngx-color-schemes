import {
  NgModule,
  Optional,
  SkipSelf,
  ModuleWithProviders,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxIconDarkComponent } from './icon-dark';
import { NgxIconLightComponent } from './icon-light';
import { NgxIconSystemComponent } from './icon-system';
import { NgxColorSchemesComponent } from './ngx-color-schemes.component';
import { ColorSchemeConfig } from './ngx-color-schemes.types';

@NgModule({
  imports: [
    CommonModule,
    NgxIconDarkComponent,
    NgxIconLightComponent,
    NgxIconSystemComponent,
    NgxColorSchemesComponent,
  ],
  exports: [
    NgxIconDarkComponent,
    NgxIconLightComponent,
    NgxIconSystemComponent,
    NgxColorSchemesComponent,
  ],
})
export class NgxColorSchemesModule {
  constructor(@Optional() @SkipSelf() parentModule: NgxColorSchemesModule) {
    if (parentModule) {
      throw new Error(
        'NgxColorSchemesModule is already loaded. Import it in the AppModule only.'
      );
    }
  }

  static forRoot(
    config: ColorSchemeConfig
  ): ModuleWithProviders<NgxColorSchemesModule> {
    return {
      ngModule: NgxColorSchemesModule,
      providers: [{ provide: ColorSchemeConfig, useValue: config }],
    };
  }
}
