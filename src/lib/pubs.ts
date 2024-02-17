type Subscriber = {
	fn: (args: any) => void;
	context?: string;
};
type SubsObject<T extends string> = Record<T, Subscriber[]>;

export function pubs<TEvent extends string>(events: TEvent[]) {
	const subs = events.reduce((acc, val) => ({ ...acc, [val]: [] }), {} as SubsObject<TEvent>);

	function publish<TData>(event: TEvent, data?: TData) {
		subs[event].forEach((sub) => sub.fn(data));
	}

	function on(event: TEvent, fn: Subscriber['fn'], context?: Subscriber['context']) {
		subs[event].push({ fn, context });
	}

	function off(context: string) {
		events.forEach((evt) => {
			subs[evt] = subs[evt].filter((sub) => sub.context !== context);
		});
	}

	return { publish, on, off };
}
