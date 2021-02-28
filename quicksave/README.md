# @rbxts/quicksave

[![NPM](https://nodei.co/npm/@rbxts/quicksave.png)](https://npmjs.org/package/@rbxts/quicksave)

Typings for [evaera's quicksave package](https://github.com/evaera/quicksave)

## Example Usage
```ts
const collection = quicksave.createCollection("data", {
	schema: {
		money: t.number,
		items: t.array(t.number),
	},
	defaultData: {
		money: 500,
		items: [],
	},
});

collection.getDocument("player").andThen((document) => {
	document.set("money", 1000);

	document.set(
		"items",
		document.get("items").map((item) => (item += 10)),
	);

	// NAUGHTY! not allowed!
	document.get("momey");

	document.set("money", [50]);
});
```

## Installation
```
npm i @rbxts/quicksave
```

## Changelog