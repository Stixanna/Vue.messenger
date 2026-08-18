interface MenuSize {
  width: number;
  height: number;
}

interface GetDynamicMenuPositionParams {
  event: MouseEvent;
  container: HTMLElement;
  menuSize: MenuSize;
  isZeroMenu: boolean;
}

interface MenuPosition {
  top: number;
  left: number;
}

export function getDynamicMenuPosition({
  event,
  container,
  menuSize,
  isZeroMenu,
}: GetDynamicMenuPositionParams): MenuPosition {
  const containerRect = container.getBoundingClientRect();

  const cursorX = event.clientX - containerRect.left;
  const cursorY = event.clientY - containerRect.top;

  const x = cursorX + container.scrollLeft;
  const y = cursorY + container.scrollTop;

  const fitsRight =
    cursorX + menuSize.width <= container.clientWidth;

  const fitsLeft =
    cursorX - menuSize.width >= 0;

  const fitsBottom =
    cursorY + menuSize.height <= container.clientHeight;

  const fitsTop =
    cursorY - menuSize.height >= 0;

  let top: number;
  let left: number;

  if (fitsBottom) {
    top = y + 8;
  } else if (fitsTop) {
    top = y - (menuSize.height - 32);
  } else {
    top = Math.max(
      container.scrollTop,
      y - menuSize.height / 2,
    );
  }

  if (fitsRight) {
    left = x + 5;
  } else if (fitsLeft) {
    left = x - menuSize.width - 5;
  } else {
    left = Math.max(
      container.scrollLeft,
      x - menuSize.width / 2,
    );
  }

  if (isZeroMenu) {
    top -= 56;
  }

  return {
    top,
    left,
  };
}