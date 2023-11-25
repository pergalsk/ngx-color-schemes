import {
  NgModule,
  Optional,
  SkipSelf,
  ModuleWithProviders,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxColorSchemesComponent } from './ngx-color-schemes.component';
import { ColorSchemeConfig } from './ngx-color-schemes.types';

@NgModule({
  declarations: [NgxColorSchemesComponent],
  imports: [CommonModule],
  exports: [NgxColorSchemesComponent],
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
