// app/api/students/[id]/route.js
import connectMongoDB from "@/lib/db";
import Student from "@/models/Student";

// GET one student (with new fields)
export async function GET(_, { params }) {
  await connectMongoDB();
  const student = await Student.findById(params.id).select('name email gender caste age branch rollNumber admissionYear');
  if (!student) {
    return new Response(JSON.stringify({ error: "Student not found" }), { status: 404 });
  }
  return new Response(JSON.stringify(student), { status: 200 });
}

// UPDATE (with gender/caste support)
export async function PUT(request, { params }) {
  await connectMongoDB();
  const updatedData = await request.json();
  
  // Validate required fields
  if (updatedData.gender === undefined || updatedData.caste === undefined) {
    return new Response(
      JSON.stringify({ error: "Gender and Caste cannot be empty" }),
      { status: 400 }
    );
  }

  const updatedStudent = await Student.findByIdAndUpdate(
    params.id,
    updatedData,
    { new: true }
  );

  if (!updatedStudent) {
    return new Response(JSON.stringify({ error: "Student not found" }), { status: 404 });
  }
  return new Response(JSON.stringify(updatedStudent), { status: 200 });
}

// DELETE (unchanged)
export async function DELETE(_, { params }) {
  await connectMongoDB();
  const deletedStudent = await Student.findByIdAndDelete(params.id);
  if (!deletedStudent) {
    return new Response(JSON.stringify({ error: "Student not found" }), { status: 404 });
  }
  return new Response(JSON.stringify({ message: "Student deleted" }), { status: 200 });
}
