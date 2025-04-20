import connectMongoDB from "../../../lib/db";
import Student from "../../../models/Student";


export async function GET() {
  try {
    console.log("Connecting to MongoDB...");
    await connectMongoDB();
    console.log("Connected to MongoDB. Fetching all students...");
    const students = await Student.find({});
    console.log("All students fetched:", students);
    return new Response(JSON.stringify(students), { status: 200 });
  } catch (error) {
    console.error("Error in GET request:", error);
    return new Response(JSON.stringify({ error: "Fetch failed" }), { status: 500 });
  }
}

export async function POST(request) {
  try {
    console.log("Connecting to MongoDB...");
    await connectMongoDB();
    console.log("Connected to MongoDB. Parsing request body...");
    const body = await request.json();
    console.log("Request body parsed:", body);
    console.log("Creating new student...");
    const newStudent = await Student.create(body);
    console.log("New student created:", newStudent);
    return new Response(JSON.stringify(newStudent), { status: 201 });
  } catch (error) {
    console.error("Error in POST request:", error);
    return new Response(JSON.stringify({ error: "Create failed" }), { status: 500 });
  }
}
