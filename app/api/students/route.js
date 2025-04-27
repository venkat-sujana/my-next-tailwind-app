import connectMongoDB from "@/lib/db";
import Student from "@/models/Student";

export async function GET() {
  console.log("GET http://localhost:3000/api/students");
  await connectMongoDB();
  const students = await Student.find().select('name email age branch rollNumber admissionYear gender caste'); // Explicitly select fields
  return new Response(JSON.stringify(students), { status: 200 });
}

export async function POST(request) {
  await connectMongoDB();
  const data = await request.json();
  
  // Validation for required fields (including gender and caste)
  if (!data.gender || !data.caste) {
    return new Response(
      JSON.stringify({ error: "Gender and Caste are required fields" }),
      { status: 400 }
    );
  }

  const newStudent = await Student.create(data);
  return new Response(JSON.stringify(newStudent), { status: 201 });
}




