import 'dotenv/config'
import app from "./app.js";
import { DBconnect } from './DB/DBconnect.js';


const PORT = process.env.SERVER_PORT;
DBconnect().then(() => {
    app.listen(PORT, () => {
        console.log(`Server URL: http://localhost:${PORT}`);
})
}).catch((error) => {
    console.log('MongoDB Connection Failled');
    console.log("Server",error);
})