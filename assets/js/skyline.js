"use strict";
// Skyline.js
document.addEventListener('DOMContentLoaded', function onDomContentLoaded() {
    document.querySelectorAll('.spoiler').forEach(function (spoilerEl) {
        var parentElement = spoilerEl.parentElement;
        if (parentElement == null) {
            return;
        }
        var isBlock = spoilerEl.classList.contains('block') || ['blockquote', 'div'].includes(spoilerEl.tagName.toLowerCase());
        var warningType = isBlock ? 'DIV' : 'SPAN';
        var checkboxEl = document.createElement('INPUT');
        var labelEl = document.createElement('LABEL');
        var warningEl = document.createElement(warningType);
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
    document.querySelectorAll('.fullscreen-able').forEach(function (fullscreenAble) {
        fullscreenAble.addEventListener('click', function () {
            if (!document.fullscreenElement && fullscreenAble.requestFullscreen) {
                fullscreenAble.requestFullscreen().catch(function (err) { return console.warn(err); });
            }
            else if (document.fullscreenElement && document.exitFullscreen) {
                document.exitFullscreen().catch(function (err) { return console.warn(err); });
            }
        });
    });
});
