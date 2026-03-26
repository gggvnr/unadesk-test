import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { inject, Injectable, InjectionToken, Injector, StaticProvider, Type } from '@angular/core';
import { OverlayPositionCreators } from '@shared/utils';

export const FLOATING_PANEL_DATA = new InjectionToken<unknown>('FLOATING_PANEL_DATA');
export const FLOATING_PANEL_REF = new InjectionToken<OverlayRef>('FLOATING_PANEL_REF');

@Injectable({ providedIn: 'root' })
export class FloatingPanelService {
  #overlay = inject(Overlay);
  #injector = inject(Injector);

  private overlayRef: OverlayRef | null = null;

  show<T>(
    component: Type<T>,
    x: number,
    y: number,
    data?: unknown,
    providers: StaticProvider[] = [],
  ): OverlayRef {
    const positionStrategy = this.createPosition(x, y);

    if (!this.overlayRef) {
      this.overlayRef = this.#overlay.create({
        positionStrategy,
        scrollStrategy: this.#overlay.scrollStrategies.reposition(),
      });
    } else {
      this.overlayRef.updatePositionStrategy(positionStrategy);
    }

    if (this.overlayRef.hasAttached()) {
      this.overlayRef?.detach();
    }

    const injector = Injector.create({
      providers: [
        { provide: FLOATING_PANEL_DATA, useValue: data },
        { provide: FLOATING_PANEL_REF, useValue: this.overlayRef },
        ...providers,
      ],
      parent: this.#injector,
    });

    const portal = new ComponentPortal(component, null, injector);
    this.overlayRef.attach(portal);

    this.overlayRef.updatePosition();

    return this.overlayRef;
  }

  move(x: number, y: number) {
    if (!this.overlayRef) return;

    this.overlayRef.updatePositionStrategy(this.createPosition(x, y));
    this.overlayRef.updatePosition();
  }

  hide() {
    this.overlayRef?.detach();
  }

  private createPosition(x: number, y: number) {
    return this.#overlay
      .position()
      .flexibleConnectedTo({ x, y })
      .withPositions([OverlayPositionCreators['bottom-start']()])
      .withPush(true);
  }
}
