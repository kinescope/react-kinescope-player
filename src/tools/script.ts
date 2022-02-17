export function loadScript(src: string, id: string) {
	return new Promise<boolean>(function (resolve, reject) {
		let script = document.createElement('script');
		script.id = id;
		script.src = src;
		script.addEventListener('load', function () {
			resolve(true);
		});
		script.addEventListener('error', function (e) {
			reject(e);
		});
		document.body.appendChild(script);
	});
}
