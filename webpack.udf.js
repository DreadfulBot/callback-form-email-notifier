const path = require('path');

function getNodeEnv() {
	return process.env.NODE_ENV;
}

function isDev() {
	return getNodeEnv().localeCompare('development') === 0;
}

function getLocalIpAddress() {
	const os = require('os');
	const ifaces = os.networkInterfaces();

	let localIpAddress = 'localhost';

	let targetIfaces = ifaces['Ethernet'] !== undefined ? ifaces['Ethernet'] :
		ifaces['Беспроводная сеть 2'] !== undefined ? ifaces ['Беспроводная сеть 2'] : undefined;

	if(!targetIfaces) {
		return localIpAddress;
	}

	let iface = targetIfaces.find((iface) => {
		return iface.family === 'IPv4';
	});

	if(!iface) {
		return localIpAddress;
	}

	localIpAddress = iface.address;

	return localIpAddress;
}

module.exports = {
	/* user defined functions */
	isDev: isDev(),
	localIpAddress: getLocalIpAddress(),

	/* aliases */
	nodePath: path.resolve(__dirname, './node_modules'),
	NODE_ENV: getNodeEnv(),
};