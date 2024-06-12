import App from "@/core/app";
import { isNode } from "@/helpers/platform";

if (!isNode())
	throw new Error("This code should only be run in Node.js environment.");

export default App;
