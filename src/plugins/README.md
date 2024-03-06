# How to add plugins

Add a plugin component or object in the corresponding group represented as folders.

```ts
// plugins/myPluginGroup/myNewPlugin.ts
const MyNewPlugin = {
    ...
};
export default MyNewPlugin;
```

Edit `index.ts` to export your new plugin in the corresponding group

```ts
import MyNewPlugin from './myPluginGroup/myNewPlugin';
...
export const MyPluginGroupPlugins = [
    {
        id: 'MyNewPlugin', // must be unique in a group
        Component: MyNewPlugin,
    },
];
```

Defining and adding a group of plugins needs to add some code in the target component

```tsx
import { FunctionComponent } from 'react';
// Plugins
import { MyPluginGroupPlugins } from '../plugins';
//...

const MyPluggableComponent: FunctionComponent = () => {
    //...
    return (
        <>
            {/*...*/}
            {MyPluginGroupPlugins.map((plugin) => {
                return <plugin.Component key={plugin.id} />;
            })}
            {/*...*/}
        </>
    );
};
```

# How to overwrite translations

Add your private translations to the following files to complete or overwrite existing translations

-   `src/plugins/translations/en.json`
-   `src/plugins/translations/fr.json`
