

export class GameDisplay {
  private slots: HTMLElement[];
  constructor(private display: HTMLElement) {
    this.slots = Array.from(display.querySelectorAll<HTMLElement>('[index]'));
  }
  show() {
    this.display.classList.remove('hidden');
  }
  hide() {
    this.display.classList.add('hidden');
  }
  pause() {
    this.display.style.pointerEvents = 'none';
  }
  resume() {
    this.display.style.pointerEvents = 'all';
  }
  markPosition(index: number, marker: string) {
    this.slots[index].innerHTML = marker;
  }
  reset() {
    this.slots.forEach((slot) => {
      slot.innerHTML = ""
    })
  }
}
