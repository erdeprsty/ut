# UT-Client

Universitas Terbuka API Client

## Instalasi

Anda dapat menginstal package ini dengan perintah berikut:

```bash
  npm install @maserde/ut-client
```

## Usage/Examples

Anda dapat mengimport library ini sebagai berikut:

```javascript
const UT = require("@maserde/ut-client");
```

Anda juga dapat mengimport library ini sebagai module menggunakan Ecmascript sebagai berikut:

```javascript
import UT from "@maserde/ut-client";
```

Contoh penggunaan library untuk authentikasi ke fitur E-Learning Universitas Terbuka

```javascript
const utClient = new UT();
const utElearning = utClient.createElearning();
utElearning.auth("YOUR_USERNAME", "YOUR_PASSWORD").then(() => {
	console.log(`E-Learning session: ${utElearning.session}, E-Learning key: ${utElearning.sessionKey}`);
});
```
