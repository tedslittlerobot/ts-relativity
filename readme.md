TS Relativity
=============

Simply replaces absolute project-level paths in import statements with relative ones.

Converts the following:

```typescript
// build/index.js
import hello from 'src/hello.js';

// build/monkey/banana.js
import eat from 'src/monkey/actions.js'

// build/very/very/nested/directory/foobar.js
import * from 'src/helpers/baz.js'
```

Into:

```typescript
// build/index.js
import hello from './hello.js';

// build/monkey/banana.js
import eat from '../monkey/actions.js'

// build/very/very/nested/directory/foobar.js
import * from '../../../../helpers/baz.js'
```

## Usage:

### Via `npx`

Given your TS source files are in `./src`, and you are building to `./dist`:

```bash
npx @tedslittlerobot/ts-relativity src dist
```

### Within `package.json` scripts

Install locally first:

```bash
npm i -D @tedslittlerobot/ts-relativity
```

Then use its bin name (`ts-relativity`) or alias (`ts-rel`):

```json
{
  "scripts": {
    "build": "tsc && ts-relativity src dist", // using full package name
    "build": "tsc && ts-rel src dist" // or using a shorter alias
  }
}
```
