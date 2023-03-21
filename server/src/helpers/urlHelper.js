const buildUrl = (targetUrl, hostname, pathname, params) => {
	const url = new URL(targetUrl);
	url.hostname = hostname;
	url.pathname = pathname;
	for (const [key, value] of Object.entries(params)) {
		url.searchParams.set(key, value);
	}
	return url;
};

module.exports = {
	buildUrl,
}