import { AdenaWallet } from "../types";

declare global {
	interface Window {
		adena: AdenaWallet | undefined;
	}
}

export const getAdena = (): AdenaWallet => {
	const adena = window.adena;

	// Check if adena is installed as an extension
	if (!adena) {
		window.open("https://adena.app/", "_blank");

		throw new Error("Adena not installed");
	}
	return adena;
};
