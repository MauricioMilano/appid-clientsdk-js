const PopupError = require('./errors/PopupError');
const IFrameController = require('./IFrameController');
class PopupController {
	constructor({w = window} = {}) {
		this.window = w;
		this.popup = new IFrameController();

	};

	init(popupConfig){
		this.popupConfig = popupConfig;
	}

	open(url) {
		const h = this.popupConfig.height;
		const w = this.popupConfig.width;
		const type = this.popupConfig.iframe?this.popupConfig.iframe:"popup";
		const left = (window.screen.width - w) / 2;
		const top = (window.screen.height - h) / 2;
		// this.popup = this.window.open(url, type, `left=${left},top=${top},width=${w},height=${h},resizable,scrollbars=yes,status=1`);
		this.popup.open(url)
		if (!this.popup) {
			throw new PopupError('Unable to open popup')
		}
	};

	navigate(url) {
		this.popup.location.href = url;
	};

	close() {
		this.popup.close();
	}

	async waitForMessage({messageType}) {
		return new Promise((resolve, reject) => {
			const timer = setInterval(() => {
				if(this.popup.closed) {
					clearInterval(timer);
					reject(new PopupError('Popup closed'));
				}
			}, 1000);
			window.addEventListener('message', (message) => {
				if (!message.data || message.data.type !== messageType) {
					return;
				}

				resolve(message);
			});
		});
	}
}
module.exports = PopupController;
