export function deepRound(n: number) {
	return Math.round(n * 1000000) / 1000000;
}

export function isElement(body: any, name: string) {
	return body.userData.name === name;
}
