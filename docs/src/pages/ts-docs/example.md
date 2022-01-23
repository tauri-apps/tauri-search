# Example of TsDoc JSON

- +++ JSON generated
    ```ts
	"id": 0,
	"name": "@tauri-apps/api",
	"kind": 1,
	"kindString": "Project",
	"flags": {},
	"comment": {
		"shortText": "The Tauri API allows you to interface with the backend layer.",
		"text": "This module exposes all other modules as an object where the key is the module name, and the value is the module exports.",
		"tags": [
			{
				"tag": "example",
				"text": "\n```typescript\nimport { app, dialog, event, fs, globalShortcut } from '@tauri-apps/api'\n```"
			}
		]
	},
	"children": [
		{
			"id": 1,
			"name": "app",
			"kind": 4,
			"kindString": "Namespace",
			"flags": {},
			"comment": {
				"shortText": "Get application metadata.",
				"text": "This package is also accessible with `window.__TAURI__.app` when `tauri.conf.json > build > withGlobalTauri` is set to true."
			},
			"children": [
				{
					"id": 2,
					"name": "getName",
					"kind": 64,
					"kindString": "Function",
					"flags": {},
					"sources": [
						{
							"fileName": "app.ts",
							"line": 33,
							"character": 15
						}
					],
					"signatures": [
						{
							"id": 3,
							"name": "getName",
							"kind": 4096,
							"kindString": "Call signature",
							"flags": {},
							"comment": {
								"shortText": "Gets the application name.",
								"returns": "A promise resolving to application name.\n"
							},
							"type": {
								"type": "reference",
								"typeArguments": [
									{
										"type": "intrinsic",
										"name": "string"
									}
								],
								"name": "Promise"
							}
						}
					]
				},
            ],
        },
    ]
    ```

