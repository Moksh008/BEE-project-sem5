import mongoose from "mongoose";
const uri=process.argv[2];
const conn=await mongoose.connect(uri,{serverSelectionTimeoutMS:15000});
console.log("CONNECTED host:", conn.connection.host, "| db:", conn.connection.name);
const ping=await conn.connection.db.admin().command({ping:1});
console.log("PING:", JSON.stringify(ping));
const cols=await conn.connection.db.listCollections().toArray();
console.log("collections:", cols.map(c=>c.name).join(", ")||"(none yet)");
for (const m of ["User","Score","Question"]) { const M=mongoose.models[m]; console.log(m+" count =", await M.countDocuments()); }
console.log("DB_NAME:", conn.connection.name);
await mongoose.disconnect();
console.log("RESULT: OK");
