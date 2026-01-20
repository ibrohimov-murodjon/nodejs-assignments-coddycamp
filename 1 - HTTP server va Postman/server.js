const http = require("http");

let students = [
  { name: "Ali", age: 20 },
  { name: "Vali", age: 22 },
];

let stats = {
  totalRequests: 0,
  lastRequestTime: null,
};

const server = http.createServer((req, res) => {
  stats.totalRequests++;
  stats.lastRequestTime = new Date().toISOString();

  const { method, url } = req;

  if (method === "GET" && url === "/students") {
    console.log("[GET /students] HANDLER START");

    setTimeout(() => {
      console.log("[GET /students] TIMEOUT CALLBACK");
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ students }));
    }, 500);
  } else if (method === "POST" && url === "/students") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      try {
        const newStudent = JSON.parse(body);

        if (!newStudent.name || !newStudent.age) {
          throw new Error("Missing fields");
        }

        students.push(newStudent);

        setImmediate(() => {
          console.log(
            "[POST /students] AFTER PARSING BODY (SETIMMEDIATE/SETTIMEOUT 0)"
          );
        });

        res.writeHead(201, { "Content-Type": "application/json" });
        res.end(JSON.stringify(students));
      } catch (err) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "INVALID JSON" }));
      }
    });
  } else if (method === "GET" && url === "/stats") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        totalRequests: stats.totalRequests,
        studentsCount: students.length,
        lastRequestTime: stats.lastRequestTime,
      })
    );
  } else if (method !== "GET" && url === "/students") {
    res.writeHead(405, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "METHOD NOT ALLOWED" }));
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "NOT FOUND" }));
  }
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server ${PORT}-portda ishlamoqda...`);
});
