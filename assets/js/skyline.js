"use strict";
// Skyline.js
document.addEventListener('DOMContentLoaded', function onDomContentLoaded() {
    document.querySelectorAll('.spoiler').forEach(function (spoilerEl) {
        var parentElement = spoilerEl.parentElement;
        if (parentElement == null) {
            return;
        }
        var isBlock = spoilerEl.classList.contains('block') || ['blockquote', 'div'].includes(spoilerEl.tagName.toLowerCase());
        var warningType = isBlock ? 'DETAILS' : 'SPAN';
        var warningEl = document.createElement(warningType);
        if (isBlock) {
            var summaryEl = document.createElement('SUMMARY');
            summaryEl.appendChild(document.createTextNode('Spoiler'));
            warningEl.appendChild(summaryEl);
            warningEl.classList.add('block');
            parentElement.insertBefore(warningEl, spoilerEl);
            parentElement.removeChild(spoilerEl);
            warningEl.appendChild(spoilerEl);
            summaryEl.classList.add('spoiler-warning');
        }
        else {
            var labelEl = document.createElement('LABEL');
            var checkboxEl = document.createElement('INPUT');
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
