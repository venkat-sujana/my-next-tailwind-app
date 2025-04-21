// app/api/students/[id]/route.js

import connectMongoDB from "@/lib/db";
import Student from "@/models/Student";

// UPDATE STUDENT (PUT)
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const updatedData = await request.json();
    await connectMongoDB();
    const updatedStudent = await Student.findByIdAndUpdate(id, updatedData, { new: true });
    if (!updatedStudent) {
      return new Response(JSON.stringify({ error: "Student not found" }), { status: 404 });
    }
    return new Response(JSON.stringify(updatedStudent), { status: 200 });
  } catch (error) {
    console.error("Error updating student:", error);
    return new Response(JSON.stringify({ error: "Update failed" }), { status: 500 });
  }
}

// DELETE STUDENT
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    await connectMongoDB();
    const deletedStudent = await Student.findByIdAndDelete(id);
    if (!deletedStudent) {
      return new Response(JSON.stringify({ error: "Student not found" }), { status: 404 });
    }
    return new Response(JSON.stringify({ message: "Student deleted" }), { status: 200 });
  } catch (error) {
    console.error("Error deleting student:", error);
    return new Response(JSON.stringify({ error: "Delete failed" }), { status: 500 });
  }
}
