// Skyline.js
document.addEventListener('DOMContentLoaded', function onDomContentLoaded() {
	document.querySelectorAll('.spoiler').forEach(spoilerEl => {
		const parentElement = spoilerEl.parentElement;
		if (parentElement == null) {
			return;
		}
		const isBlock = spoilerEl.classList.contains('block') || ['blockquote', 'div'].includes(spoilerEl.tagName.toLowerCase());
		const warningType = isBlock ? 'DETAILS' : 'SPAN';
		const warningEl = document.createElement(warningType) as HTMLSpanElement;
		if (isBlock) {
			const summaryEl = document.createElement('SUMMARY') as HTMLElement;
			summaryEl.appendChild(document.createTextNode('Spoiler'));
			warningEl.appendChild(summaryEl);
			warningEl.classList.add('block');
			parentElement.insertBefore(warningEl, spoilerEl);
			parentElement.removeChild(spoilerEl);
			warningEl.appendChild(spoilerEl);
			summaryEl.classList.add('spoiler-warning');
		} else {
			const labelEl = document.createElement('LABEL') as HTMLLabelElement;
			const checkboxEl = document.createElement('INPUT') as HTMLInputElement;
			checkboxEl.type = 'checkbox';
			checkboxEl.classList.add('spoiler-checkbox');
			labelEl.appendChild(checkboxEl);
			labelEl.classList.add('spoiler-label');
			labelEl.classList.add('block');
			warningEl.append(document.createTextNode(' (spoiler) '));
			parentElement.insertBefore(labelEl, spoilerEl);
			parentElement.removeChild(spoilerEl);
			labelEl.appendChild(warningEl);
			labelEl.appendChild(spoilerEl);
			warningEl.classList.add('spoiler-warning');
		}
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
