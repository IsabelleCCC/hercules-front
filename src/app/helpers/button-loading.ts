export class ButtonLoading {
	private button: HTMLButtonElement;
	private loadingIcon: string = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"/></span>`;
	private btnHTML: string;

	constructor(button: HTMLButtonElement) {
		this.btnHTML = button.innerHTML;
		button.disabled = true;
		button.innerHTML = this.loadingIcon;
		this.button = button;
	}

	remove(): void {
		this.button.innerHTML = this.btnHTML;
		this.button.disabled = false;
	}
}
