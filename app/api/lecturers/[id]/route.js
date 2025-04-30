import connectMongoDB from "@/lib/db";
import Lecturer from "@/models/Lecturer";
import { z } from "zod";
import mongoose from "mongoose";

// Zod schema for validation
const lecturerUpdateSchema = z.object({
  lecturerName: z.string().min(2).optional(),
  fatherName: z.string().min(2).optional(),
  email: z.string().email().optional(),
  phone: z.string().regex(/^\d{10}$/).optional(),
  gender: z.enum(["Male", "Female", "Other"]).optional(),
  caste: z.enum(["OC", "SC", "ST", "BC", "Other"]).optional(),
  qualification: z.string().optional(),
  subject: z.enum(["Maths", "Physics", /* ... */]).optional(),
  dateOfJoining: z.string().datetime().optional(),
  address: z.string().optional(),
});

export async function GET(_, { params }) {
  try {
    await connectMongoDB();

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return new Response(
        JSON.stringify({ error: "Invalid lecturer ID format" }),
        { status: 400 }
      );
    }

    const lecturer = await Lecturer.findById(params.id).select(
      'lecturerName fatherName qualification subject phone email gender caste dateOfJoining address createdAt updatedAt'
    ).lean();

    if (!lecturer) {
      return new Response(
        JSON.stringify({ error: "Lecturer not found" }),
        { status: 404 }
      );
    }

    return new Response(JSON.stringify(lecturer), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' } 
    });
  } catch (error) {
    console.error(`GET https://my-next-tailwind-app-inky.vercel.app/api/lecturers/${params.id} error:`, error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch lecturer", details: error.message }),
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    await connectMongoDB();

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return new Response(
        JSON.stringify({ error: "Invalid lecturer ID format" }),
        { status: 400 }
      );
    }

    const updatedData = await request.json();
    const validatedData = lecturerUpdateSchema.parse(updatedData);

    const updatedLecturer = await Lecturer.findByIdAndUpdate(
      params.id,
      validatedData,
      { new: true, runValidators: true }
    ).select('lecturerName fatherName qualification subject phone email gender caste dateOfJoining address createdAt updatedAt');

    if (!updatedLecturer) {
      return new Response(
        JSON.stringify({ error: "Lecturer not found" }),
        { status: 404 }
      );
    }

    return new Response(JSON.stringify(updatedLecturer), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' } 
    });
  } catch (error) {
    console.error(`PUT https://my-next-tailwind-app-inky.vercel.app/api/lecturers/${params.id} error:`, error);
    
    let errorMessage = "Failed to update lecturer";
    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({ error: "Validation failed", details: error.errors }),
        { status: 400 }
      );
    }
    if (error.code === 11000) {
      errorMessage = error.message.includes('email') ? 
        "Email already exists" : "Phone number already exists";
    }

    return new Response(
      JSON.stringify({ error: errorMessage, details: error.message }),
      { status: 500 }
    );
  }
}

export async function DELETE(_, { params }) {
  try {
    await connectMongoDB();

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return new Response(
        JSON.stringify({ error: "Invalid lecturer ID format" }),
        { status: 400 }
      );
    }

    const deletedLecturer = await Lecturer.findByIdAndDelete(params.id);

    if (!deletedLecturer) {
      return new Response(
        JSON.stringify({ error: "Lecturer not found" }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ message: "Lecturer deleted successfully" }),
      { status: 200 }
    );
  } catch (error) {
    console.error(`DELETE https://my-next-tailwind-app-inky.vercel.app/api/lecturers/${params.id} error:`, error);
    return new Response(
      JSON.stringify({ error: "Failed to delete lecturer", details: error.message }),
      { status: 500 }
    );
  }
}