export class TurnIndicator {
  constructor(private node: HTMLElement) { }
  setTurn(index: number) {
    const spans = this.node.querySelectorAll('span');
    spans[0].setAttribute('class', index === 0 ? 'active' : '')
    spans[1].setAttribute('class', index === 1 ? 'active' : '')
  }
  show() {
    this.node.classList.remove('hidden');
  }
  hide() {
    this.node.classList.add('hidden');
  }
}
