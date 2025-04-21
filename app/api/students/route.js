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


// UPDATE STUDENT (PUT)
export async function PUT(request, { params }) {
  try {
    console.log("Parsing request parameters...");
    const { id } = params;
    console.log("Request parameters parsed:", id);

    console.log("Parsing request body...");
    const updatedData = await request.json();
    console.log("Request body parsed:", updatedData);

    console.log("Connecting to MongoDB...");
    await connectMongoDB();
    console.log("Connected to MongoDB. Updating student...");

    const updatedStudent = await Student.findByIdAndUpdate(id, updatedData, { new: true });
    if (!updatedStudent) {
      console.log("Student not found for update.");
      return new Response(JSON.stringify({ error: "Student not found" }), { status: 404 });
    }

    console.log("Student updated successfully:", updatedStudent);
    return new Response(JSON.stringify(updatedStudent), { status: 200 });
  } catch (error) {
    console.error("Error updating student:", error);
    return new Response(JSON.stringify({ error: "Update failed" }), { status: 500 });
  }
}

// DELETE STUDENT
export async function DELETE(request, { params }) {
  try {
    console.log("Parsing request parameters...");
    const { id } = params;
    console.log("Request parameters parsed:", id);

    console.log("Connecting to MongoDB...");
    await connectMongoDB();
    console.log("Connected to MongoDB. Deleting student...");

    const deletedStudent = await Student.findByIdAndDelete(id);
    if (!deletedStudent) {
      console.log("Student not found for deletion.");
      return new Response(JSON.stringify({ error: "Student not found" }), { status: 404 });
    }

    console.log("Student deleted successfully:", deletedStudent);
    return new Response(JSON.stringify({ message: "Student deleted" }), { status: 200 });
  } catch (error) {
    console.error("Error deleting student:", error);
    return new Response(JSON.stringify({ error: "Delete failed" }), { status: 500 });
  }
}
