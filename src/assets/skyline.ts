// Skyline.js
document.addEventListener('DOMContentLoaded', function onDomContentLoaded() {
	document.querySelectorAll('.spoiler').forEach(spoilerEl => {
		const parentElement = spoilerEl.parentElement;
		if (parentElement == null) {
			return;
		}
		const isBlock = spoilerEl.classList.contains('block') || ['blockquote', 'div'].includes(spoilerEl.tagName.toLowerCase());
		const warningType = isBlock ? 'DIV' : 'SPAN';
		const checkboxEl = document.createElement('INPUT') as HTMLInputElement;
		const labelEl = document.createElement('LABEL') as HTMLLabelElement;
		const warningEl = document.createElement(warningType) as HTMLSpanElement;
		checkboxEl.type = 'checkbox';
		checkboxEl.classList.add('spoiler-checkbox');
		labelEl.classList.add('spoiler-label');
		warningEl.classList.add('spoiler-warning');
		if (isBlock) {
			warningEl.classList.add('block');
			labelEl.classList.add('block');
		}
		warningEl.append(document.createTextNode(' (spoiler) '));
		parentElement.insertBefore(labelEl, spoilerEl);
		parentElement.removeChild(spoilerEl);
		labelEl.appendChild(checkboxEl);
		labelEl.appendChild(warningEl);
		labelEl.appendChild(spoilerEl);
	});

	document.querySelectorAll('.fullscreen-able').forEach(fullscreenAble => {
		fullscreenAble.addEventListener('click', () => {
			if(!document.fullscreenElement && fullscreenAble.requestFullscreen) {
				fullscreenAble.requestFullscreen().catch(err => console.warn(err));
			} else if(document.fullscreenElement && document.exitFullscreen) {
				document.exitFullscreen().catch(err => console.warn(err));
			}
		});
	});
});
