# Universitas Terbuka API

Universitas Terbuka API - Indonesia Open University API

## Installation

```bash
  npm install @maserde/ut
```

## Usage/Examples

importing package to your project using CommonJS

```javascript
const UT = require("@maserde/ut");
```

importing package to your project using EcmaScript

```javascript
import UT from "@maserde/ut";
```

authenticate E-learning account

```javascript
const ut = new UT();
const elearning = ut.createElearning();
utElearning.authenticate("YOUR_USERNAME", "YOUR_PASSWORD").then(() => {
	const { session, sessionKey } = elearning.credentials;
	console.log(`E-Learning session: ${session}, E-Learning key: ${sessionKey}`);
});
```
