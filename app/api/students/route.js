//app/api/students/route.js
import connectMongoDB from "@/lib/db";
import Student from "@/models/Student";

export async function GET() {
  console.log("GET https://my-next-tailwind-app-inky.vercel.app/api/students");
  console.log("Connecting to MongoDB...");
  await connectMongoDB();
  console.log("Connected to MongoDB");
  console.log("Fetching students...");
  const students = await Student.find().select('name  email  age  branch  rollNumber  admissionYear gender  caste'); // Explicitly select fields
  console.log("Fetched students:", students);
  return new Response(JSON.stringify(students), { status: 200 });
}

export async function POST(request) {
  console.log("POST https://my-next-tailwind-app-inky.vercel.app/api/students");
  console.log("Connecting to MongoDB...");
  await connectMongoDB();
  console.log("Connected to MongoDB");

  const data = await request.json();
  console.log("Received data:", data);

  // Validation for required fields (including gender and caste)
  if (!data.gender || !data.caste) {
    console.log("Validation failed: Gender and Caste are required fields");
    return new Response(
      JSON.stringify({ error: "Gender and Caste are required fields" }),
      { status: 400 }
    );
  }

  try {
    const newStudent = await Student.create(data);
    console.log("Student created:", newStudent);
    return new Response(JSON.stringify(newStudent), { status: 201 });
  } catch (error) {
    console.error("Error creating student:", error);
    return new Response(
      JSON.stringify({ error: "Failed to create student" }),
      { status: 500 }
    );
  }
}
