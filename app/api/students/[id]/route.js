import connectMongoDB from "@/lib/db";
import Student from "@/models/Student";

// GET one student
export async function GET(_, { params }) {
  await connectMongoDB();
  const student = await Student.findById(params.id);
  return new Response(JSON.stringify(student), { status: 200 });
}

// UPDATE
export async function PUT(request, { params }) {
  await connectMongoDB();
  const updatedData = await request.json();
  const updatedStudent = await Student.findByIdAndUpdate(params.id, updatedData, { new: true });

  if (!updatedStudent) {
    return new Response(JSON.stringify({ error: "Student not found" }), { status: 404 });
  }

  return new Response(JSON.stringify(updatedStudent), { status: 200 });
}

// DELETE
export async function DELETE(_, { params }) {
  await connectMongoDB();
  const deletedStudent = await Student.findByIdAndDelete(params.id);

  if (!deletedStudent) {
    return new Response(JSON.stringify({ error: "Student not found" }), { status: 404 });
  }

  return new Response(JSON.stringify({ message: "Student deleted" }), { status: 200 });
}
