import { Injectable, Inject, Optional } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import {
  Observable,
  Observer,
  Subject,
  BehaviorSubject,
  combineLatest,
  Unsubscribable,
} from 'rxjs';
import {
  distinctUntilChanged,
  startWith,
  map,
  pairwise,
  filter,
} from 'rxjs/operators';
import {
  ColorSchemeClasses,
  ColorSchemeConfig,
  SCHEMES,
  Scheme,
  SystemScheme,
  UserScheme,
} from './ngx-color-schemes.types';

@Injectable({ providedIn: 'root' })
export class NgxColorSchemesService {
  public readonly systemSchemeChange: Observable<SystemScheme>;
  public readonly userSchemeChange: Observable<UserScheme>;
  public readonly schemeChange: Observable<Scheme>;

  private readonly userSchemeSubject;

  private readonly storageKey: string = 'color-scheme-preference';
  private readonly mediaQuery: string = '(prefers-color-scheme: dark)';

  private readonly schemeClasses: ColorSchemeClasses = {
    lightSchemeClass: 'light-scheme',
    darkSchemeClass: 'dark-scheme',
  };

  constructor(
    @Inject(DOCUMENT) private document: Document,
    @Optional() config?: ColorSchemeConfig
  ) {
    if (config?.lightSchemeClass && config?.darkSchemeClass) {
      this.schemeClasses = {
        lightSchemeClass: config.lightSchemeClass,
        darkSchemeClass: config.darkSchemeClass,
      };
    }
    if (config?.storageKey) {
      this.storageKey = config.storageKey;
    }

    this.systemSchemeChange = new Observable<SystemScheme>(
      this.systemSchemeObservableFn.bind(this)
    ).pipe(distinctUntilChanged());

    this.userSchemeSubject = new BehaviorSubject<UserScheme>(
      this.loadUserScheme()
    );
    this.userSchemeChange = this.userSchemeSubject.pipe(distinctUntilChanged());

    this.schemeChange = combineLatest([
      this.systemSchemeChange,
      this.userSchemeChange,
    ]).pipe(
      startWith<[SystemScheme, UserScheme]>([
        this.getSystemPreference(),
        this.loadUserScheme(),
      ]),
      distinctUntilChanged(this.distinctArrSchemes),
      pairwise(),
      map(this.chooseSchemeValue),
      filter(
        (scheme: Scheme): boolean =>
          scheme === SCHEMES.LIGHT || scheme === SCHEMES.DARK
      )
    );
  }

  getScheme(): SystemScheme | UserScheme {
    return this.loadUserScheme() || this.getSystemPreference();
  }

  setLightScheme(): void {
    this.setUserScheme(SCHEMES.LIGHT);
  }

  setDarkScheme(): void {
    this.setUserScheme(SCHEMES.DARK);
  }

  setSystemScheme(): void {
    this.setUserScheme(SCHEMES.SYSTEM);
  }

  // Usage: Use this method for application scheme initialization
  // in root app component ngOnInit or ngAfterViewInit.
  setPreferredScheme(): void {
    const className: string | null = localStorage.getItem(this.storageKey);
    if (
      className == null ||
      !this.document?.documentElement ||
      this.document.documentElement.classList.contains(className)
    ) {
      return;
    }
    this.document.documentElement.classList.add(className);
  }

  getSystemPreference(): SystemScheme {
    return window.matchMedia(this.mediaQuery).matches
      ? SCHEMES.DARK
      : SCHEMES.LIGHT;
  }

  setUserScheme(scheme: UserScheme): void {
    const className: string | null = this.getClassName(scheme);
    this.document.documentElement.classList.remove(...this.classList);
    className && this.document.documentElement.classList.add(className);
    this.storeUserScheme(className);
    this.userSchemeSubject.next(scheme);
  }

  private get classList(): string[] {
    return Object.values(this.schemeClasses);
  }

  private getClassName(scheme: UserScheme): string | null {
    if (scheme === SCHEMES.LIGHT) {
      return this.schemeClasses.lightSchemeClass;
    }
    if (scheme === SCHEMES.DARK) {
      return this.schemeClasses.darkSchemeClass;
    }
    return null;
  }

  private getSchemeName(className?: string | null): UserScheme {
    if (className === this.schemeClasses.lightSchemeClass) {
      return SCHEMES.LIGHT;
    }
    if (className === this.schemeClasses.darkSchemeClass) {
      return SCHEMES.DARK;
    }
    return SCHEMES.SYSTEM;
  }

  private systemSchemeObservableFn(
    observer: Observer<SystemScheme>
  ): Unsubscribable {
    observer.next(this.getSystemPreference()); // initial emit

    const handleChange = (event: MediaQueryListEvent): void => {
      const scheme: SystemScheme = event.matches ? SCHEMES.DARK : SCHEMES.LIGHT;
      observer.next(scheme);
    };

    const prefersSchemeDark: MediaQueryList = window.matchMedia(
      this.mediaQuery
    );
    prefersSchemeDark.addEventListener('change', handleChange);

    return {
      unsubscribe(): void {
        prefersSchemeDark.removeEventListener('change', handleChange);
      },
    };
  }

  private loadUserScheme(): UserScheme {
    const className: string | null = localStorage.getItem(this.storageKey);
    return this.getSchemeName(className);
  }

  private storeUserScheme(scheme?: string | null): void {
    if (!scheme) {
      localStorage.removeItem(this.storageKey);
      return;
    }
    if (!this.classList.includes(scheme)) {
      return;
    }
    localStorage.setItem(this.storageKey, scheme);
  }

  private distinctArrSchemes(
    prev: [SystemScheme, UserScheme],
    curr: [SystemScheme, UserScheme]
  ): boolean {
    return prev[0] === curr[0] && prev[1] === curr[1];
  }

  private chooseSchemeValue([[prevSys, prevUsr], [nextSys, nextUsr]]: [
    [SystemScheme, UserScheme],
    [SystemScheme, UserScheme]
  ]): Scheme {
    // set 'SYSTEM' as null for better handling
    const _nextUsr = nextUsr === SCHEMES.SYSTEM ? null : nextUsr;
    const _prevUsr = prevUsr === SCHEMES.SYSTEM ? null : prevUsr;

    if (
      (_prevUsr !== _nextUsr && _prevUsr && _nextUsr) ||
      (_prevUsr !== _nextUsr && prevSys !== _nextUsr && !_prevUsr)
    ) {
      return _nextUsr || SCHEMES.SYSTEM;
    }

    if (
      (prevSys !== nextSys && !_prevUsr && !_nextUsr) ||
      (_prevUsr !== _nextUsr && _prevUsr !== nextSys && !_nextUsr)
    ) {
      return nextSys || SCHEMES.SYSTEM;
    }

    return SCHEMES.SYSTEM;
  }
}
