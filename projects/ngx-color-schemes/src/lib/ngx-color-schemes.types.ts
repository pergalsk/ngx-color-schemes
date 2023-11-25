export interface ColorSchemeClasses {
  lightSchemeClass: string;
  darkSchemeClass: string;
}

export interface NgxIconAbstract {
  // size?: number;
}

export abstract class ColorSchemeConfig {
  lightSchemeClass: string;
  darkSchemeClass: string;
  storageKey?: string;

  constructor(lightSchemeClass: string, darkSchemeClass: string) {
    this.lightSchemeClass = lightSchemeClass;
    this.darkSchemeClass = darkSchemeClass;
  }
}

export enum SCHEMES {
  SYSTEM = 'SYSTEM',
  LIGHT = 'LIGHT',
  DARK = 'DARK',
}

export type SystemScheme = SCHEMES.LIGHT | SCHEMES.DARK; // @TODO optimize
export type UserScheme = SCHEMES.LIGHT | SCHEMES.DARK | SCHEMES.SYSTEM;
export type Scheme = SCHEMES.LIGHT | SCHEMES.DARK | SCHEMES.SYSTEM; // @TODO optimize
