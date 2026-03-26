import {
  ConnectionPositionPair,
  Overlay,
  OverlayRef,
  PositionStrategy,
  ScrollStrategy,
} from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import {
  ComponentRef,
  Directive,
  ElementRef,
  HostListener,
  OnDestroy,
  TemplateRef,
  ViewContainerRef,
  computed,
  inject,
  input,
  output,
} from '@angular/core';

import { Subscription, filter, take } from 'rxjs';

import { OverlayPositionCreators, OverlayPositions } from '@shared/utils';
import { TooltipTriggerType } from './constants';
import { TooltipComponent } from './tooltip.component';

@Directive({
  selector: '[appTooltip]',
})
export class AsTooltipDirective implements OnDestroy {
  #overlay = inject(Overlay);
  #elementRef = inject(ElementRef);
  #viewContainer = inject(ViewContainerRef);

  appTooltip = input('');
  appTooltipContent = input<TemplateRef<unknown>>();
  appTooltipPosition = input<OverlayPositions>('bottom-start');
  appTooltipTriggerBehavior = input<TooltipTriggerType>(TooltipTriggerType.Hover);
  appTooltipOnlyDesktop = input(false);
  appTooltipWidth = input<number>();

  appTooltipOpen = output<ComponentRef<TooltipComponent>>();
  appTooltipClose = output();

  isMobileView = computed(() => false);
  isClickBehavior = computed(
    () => this.appTooltipTriggerBehavior() === TooltipTriggerType.Click || this.isMobileView(),
  );
  isDisabled = computed(() => false);

  private overlayRef: OverlayRef | null = null;
  private attachedComponentRef?: ComponentRef<TooltipComponent>;
  private outsideClickSubscription?: Subscription;

  @HostListener('click')
  showOnClick(): void {
    if (this.isDisabled() || !this.isClickBehavior()) {
      return;
    }

    this.attachTooltip();
  }

  @HostListener('mouseenter')
  showOnHover(): void {
    if (this.isDisabled() || this.isClickBehavior()) {
      return;
    }

    this.attachTooltip();
  }

  @HostListener('mouseleave', ['$event.relatedTarget'])
  hideOnHover(relatedTarget: EventTarget | null): void {
    const tooltipElement = this.attachedComponentRef?.location.nativeElement;

    if (this.isClickBehavior() || tooltipElement?.contains(relatedTarget)) {
      return;
    }

    this.removeTooltipMouseleaveListener();
    this.detachTooltip();
  }

  ngOnDestroy(): void {
    this.removeTooltipMouseleaveListener();
    this.detachTooltip();
  }

  private attachTooltip(): void {
    const panelClass = ['tooltip-overlay-pane'];

    if (!this.overlayRef) {
      this.overlayRef = this.#overlay.create({
        panelClass,
        backdropClass: 'tooltip-overlay-backdrop',
        hasBackdrop: this.isMobileView(),
        positionStrategy: this.getPositionStrategy(),
        scrollStrategy: this.getScrollStrategy(),
      });
    } else {
      this.overlayRef.updatePositionStrategy(this.getPositionStrategy());
    }

    if (this.overlayRef.hasAttached()) {
      return;
    }

    this.outsideClickSubscription = this.overlayRef._outsidePointerEvents
      .pipe(
        filter(
          (event) =>
            !this.overlayRef?.overlayElement.contains(event.target as Node) &&
            !this.#elementRef.nativeElement.contains(event.target),
        ),
        take(1),
      )
      .subscribe(() => {
        this.detachTooltip();
      });

    const component = new ComponentPortal(TooltipComponent, this.#viewContainer);
    this.attachedComponentRef = this.overlayRef.attach(component);

    this.attachedComponentRef.setInput('text', this.appTooltip());
    this.attachedComponentRef.setInput('content', this.appTooltipContent());
    this.attachedComponentRef.setInput('width', this.appTooltipWidth());

    this.addTooltipMouseleaveListener();

    this.appTooltipOpen.emit(this.attachedComponentRef);
  }

  private detachTooltip(): void {
    this.outsideClickSubscription?.unsubscribe();
    this.overlayRef?.detach();
    this.appTooltipClose.emit();
  }

  private getPositionStrategy(): PositionStrategy {
    const fallbackPoint = { x: 0, y: 0 };

    return this.#overlay
      .position()
      .flexibleConnectedTo(this.#elementRef || fallbackPoint)
      .setOrigin(this.#elementRef || fallbackPoint)
      .withFlexibleDimensions(true)
      .withPositions(this.getPositions())
      .withGrowAfterOpen(true);
  }

  private getScrollStrategy(): ScrollStrategy {
    return this.isMobileView()
      ? this.#overlay.scrollStrategies.block()
      : this.#overlay.scrollStrategies.reposition();
  }

  private getPositions(): ConnectionPositionPair[] {
    const resultPositions = [OverlayPositionCreators[this.appTooltipPosition()]()];

    Object.entries(OverlayPositionCreators)
      .sort(([aKey], [bKey]) => {
        if (this.appTooltipPosition().includes(aKey.split('-')[0])) {
          return -1;
        }

        if (this.appTooltipPosition().includes(bKey.split('-')[0])) {
          return 1;
        }

        return 0;
      })
      .forEach(([key, positionCreator]) => {
        if (key === this.appTooltipPosition()) {
          return;
        }

        resultPositions.push(positionCreator());
      });

    return resultPositions;
  }

  private handleTooltipMouseleave = (): void => {
    this.removeTooltipMouseleaveListener();
    this.detachTooltip();
  };

  private addTooltipMouseleaveListener(): void {
    if (this.isClickBehavior()) {
      return;
    }

    this.attachedComponentRef?.location.nativeElement.addEventListener(
      'mouseleave',
      this.handleTooltipMouseleave,
    );
  }

  private removeTooltipMouseleaveListener(): void {
    if (this.isClickBehavior()) {
      return;
    }

    this.attachedComponentRef?.location.nativeElement.removeEventListener(
      'mouseleave',
      this.handleTooltipMouseleave,
    );
  }
}
