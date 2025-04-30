//app/api/lecturers/route.js
// This API route handles GET and POST requests for lecturers
import connectMongoDB from "@/lib/db";
import Lecturer from "@/models/Lecturer";

export async function GET() {
  try {
    await connectMongoDB();
    const lecturers = await Lecturer.find().select(
      'lecturerName fatherName qualification subject phone email gender caste dateOfJoining address createdAt updatedAt'
    ).lean();
    
    return new Response(JSON.stringify(lecturers), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error("GET https://my-next-tailwind-app-inky.vercel.app/api/lecturers error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch lecturers", details: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function POST(request) {
  try {
    await connectMongoDB();
    const data = await request.json();

    // Validate required fields
    const requiredFields = ['lecturerName', 'fatherName', 'email', 'phone', 'gender', 'caste'];
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
      return new Response(
        JSON.stringify({ 
          error: "Missing required fields", 
          missingFields 
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Create new lecturer
    const newLecturer = await Lecturer.create(data);
    
    return new Response(JSON.stringify(newLecturer), { 
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error("POST https://my-next-tailwind-app-inky.vercel.app/api/lecturers error:", error);
    
    let errorMessage = "Failed to create lecturer";
    if (error.code === 11000) {
      errorMessage = error.message.includes('email') ? 
        "Email already exists" : "Phone number already exists";
    }

    return new Response(
      JSON.stringify({ error: errorMessage, details: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}