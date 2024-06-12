import UT from "./index";
import fs from 'fs/promises';
// "048802507", "VxNntaU50"
const main = async () => {
    const utClient = new UT();
    const elearning = utClient.createElearning({
        credential: {
            username: "048802507",
            password: "VxNntaU50",
        },
    });
    await elearning.authenticate();
    const res = await elearning.getUser().catch((err) => console.log(err));
    await fs.writeFile('index.html', res);
};
main();
