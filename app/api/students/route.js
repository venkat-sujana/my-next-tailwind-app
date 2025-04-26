import  connectMongoDB  from "@/lib/db";
import  Student  from "@/models/Student";

export async function GET() {
  console.log("GET https://my-next-tailwind-app-inky.vercel.app/api/students");
  await connectMongoDB();
  console.log("Connected to MongoDB");
  const students = await Student.find();
  console.log("Found", students.length, "students");
  return new Response(JSON.stringify(students), { status: 200 });
}

export async function POST(request) {
  console.log("POST https://my-next-tailwind-app-inky.vercel.app/api/students");
  await connectMongoDB();
  console.log("Connected to MongoDB");
  const data = await request.json();
  console.log("Received student data:", data);
  const newStudent = await Student.create(data);
  console.log("Created new student with id", newStudent._id);
  return new Response(JSON.stringify(newStudent), { status: 201 });
}




