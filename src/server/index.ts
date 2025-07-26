
import { users as UserSchema, checkIns as CheckInSchema } from "../db/schema";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json());

// Mock database
const users: any[] = [];
const checkIns: any[] = [];

// Endpoint: Register User
app.post("/api/register", (req, res) => {
  const validation = UserSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({ error: validation.error.errors });
  }

  // Check if the userId already exists
  const existingUser = users.find((u) => u.userId === validation.data.userId);
  if (existingUser) {
    return res.status(409).json({ message: "User ID already exists." });
  }

  users.push(validation.data);
  res.status(201).json({ message: "User registered successfully!" });
});

// Endpoint: Check-In
app.post("/api/checkin", (req, res) => {
  const validation = CheckInSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({ error: validation.error.errors });
  }

  checkIns.push(validation.data);
  res.status(201).json({ message: "Check-In successful!" });
});

// Endpoint: Verify User Login
app.post("/api/login", (req, res) => {
  const { userId, password } = req.body;

  // Check if the user exists
  const user = users.find((u) => u.userId === userId && u.password === password);

  if (!user) {
    return res.status(401).json({ message: "Invalid user ID or password." });
  }

  res.status(200).json({ message: "Login successful!", user });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
