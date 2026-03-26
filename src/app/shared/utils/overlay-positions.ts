import { ConnectionPositionPair } from '@angular/cdk/overlay';

export const OverlayPositionCreators = {
  'top-start': (offset = 0, panelClass = '') =>
    new ConnectionPositionPair(
      { originX: 'start', originY: 'top' },
      { overlayX: 'start', overlayY: 'bottom' },
      0,
      -offset,
      panelClass,
    ),
  top: (offset = 0, panelClass = '') =>
    new ConnectionPositionPair(
      { originX: 'center', originY: 'top' },
      { overlayX: 'center', overlayY: 'bottom' },
      0,
      -offset,
      panelClass,
    ),
  'top-end': (offset = 0, panelClass = '') =>
    new ConnectionPositionPair(
      { originX: 'end', originY: 'top' },
      { overlayX: 'end', overlayY: 'bottom' },
      0,
      -offset,
      panelClass,
    ),
  'bottom-start': (offset = 0, panelClass = '') =>
    new ConnectionPositionPair(
      { originX: 'start', originY: 'bottom' },
      { overlayX: 'start', overlayY: 'top' },
      0,
      offset,
      panelClass,
    ),
  bottom: (offset = 0, panelClass = '') =>
    new ConnectionPositionPair(
      { originX: 'center', originY: 'bottom' },
      { overlayX: 'center', overlayY: 'top' },
      0,
      offset,
      panelClass,
    ),
  'bottom-end': (offset = 0, panelClass = '') =>
    new ConnectionPositionPair(
      { originX: 'end', originY: 'bottom' },
      { overlayX: 'end', overlayY: 'top' },
      0,
      offset,
      panelClass,
    ),
  'left-start': (offset = 0, panelClass = '') =>
    new ConnectionPositionPair(
      { originX: 'start', originY: 'top' },
      { overlayX: 'end', overlayY: 'top' },
      -offset,
      0,
      panelClass,
    ),
  left: (offset = 0, panelClass = '') =>
    new ConnectionPositionPair(
      { originX: 'start', originY: 'center' },
      { overlayX: 'end', overlayY: 'center' },
      -offset,
      0,
      panelClass,
    ),
  'left-end': (offset = 0, panelClass = '') =>
    new ConnectionPositionPair(
      { originX: 'start', originY: 'bottom' },
      { overlayX: 'end', overlayY: 'bottom' },
      -offset,
      0,
      panelClass,
    ),
  'right-start': (offset = 0, panelClass = '') =>
    new ConnectionPositionPair(
      { originX: 'end', originY: 'top' },
      { overlayX: 'start', overlayY: 'top' },
      offset,
      0,
      panelClass,
    ),
  right: (offset = 0, panelClass = '') =>
    new ConnectionPositionPair(
      { originX: 'end', originY: 'center' },
      { overlayX: 'start', overlayY: 'center' },
      offset,
      0,
      panelClass,
    ),
  'right-end': (offset = 0, panelClass = '') =>
    new ConnectionPositionPair(
      { originX: 'end', originY: 'bottom' },
      { overlayX: 'start', overlayY: 'bottom' },
      offset,
      0,
      panelClass,
    ),
};

export type OverlayPositions = keyof typeof OverlayPositionCreators;
