class Dialog {
    constructor(dialogElement, options) {
        const defaultOptions = {
            closable: true,
        };

        this.dialog = dialogElement;
        this.isOpen = false;
        this.options = Object.assign({}, defaultOptions, options);

        this.dialog.addEventListener('close', () => {
            setTimeout(() => {
                this.dialog.style.display = 'none';
                this.isOpen = false;
            }, 200);
        });

        if (this.options.closable) {
            this.dialog.addEventListener('click', function (e) {
                if (!e.target.closest('div')) {
                    e.target.close();
                }
            });
        }
    }

    open() {
        if (this.isOpen) return;
        document.querySelector('main').style.transformOrigin = `50% calc(${window.scrollY}px + 40vh)`;
        this.isOpen = true;
        this.dialog.style.display = 'block';
        this.dialog.showModal();
    }
}

class Menu {
    constructor(menuElement) {
        this.menu = menuElement;
        this.dialog = this.menu.querySelector('dialog');
        this.triggers = this.menu.querySelectorAll('.openMenu');
        this.isOpen = false;

        this.triggers.forEach((trigger) => {
            trigger.addEventListener('click', () => {
                if (this.isOpen) return;

                this.dialog.show();
                this.dialog.insertAdjacentHTML('afterend', '<aside aria-hidden="true" class="js-backdrop"></aside>');

                setTimeout(() => {
                    this.isOpen = true;
                }, 10);
            });
        });

        function removeBackdrop() {
            document.querySelector('.js-backdrop').remove();
        }

        this.dialog.addEventListener('close', () => {
            this.isOpen = false;
            removeBackdrop();
        });

        document.addEventListener('click', (e) => {
            const inside = e.composedPath().includes(this.dialog);

            if (!inside && this.isOpen) {
                this.dialog.close();
                removeBackdrop();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.dialog.close();
                removeBackdrop();
            }
        });
    }
}

const Haptic = {
    error: function () {
        try {
            navigator.vibrate([16, 80, 16, 80, 30, 80, 16]);
        } catch (e) { }
    },
    success: function () {
        try {
            navigator.vibrate([30, 90, 20]);
        } catch (e) { }
    }
};