import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { validateStudentData, sanitizeStudentData } from '@/lib/validation'

// GET all students
export async function GET() {
  try {
    const students = await prisma.student.findMany({
      orderBy: {
        createdAt: 'asc'
      }
    })
    return NextResponse.json(students)
  } catch (error) {
    console.error('Error fetching students:', error)
    return NextResponse.json({ error: 'Failed to fetch students' }, { status: 500 })
  }
}

// POST create new student
export async function POST(request) {
  try {
    const body = await request.json()
    
    // Sanitize input data
    const sanitizedData = sanitizeStudentData(body)
    
    // Validate input data
    const validation = validateStudentData(sanitizedData)
    if (!validation.isValid) {
      return NextResponse.json({ 
        error: 'Validation failed', 
        validationErrors: validation.errors 
      }, { status: 400 })
    }

    const { studentId, name, email, phone } = sanitizedData

    // Check if student ID or email already exists
    const existingStudent = await prisma.student.findFirst({
      where: {
        OR: [
          { studentId: studentId },
          { email: email }
        ]
      }
    })

    if (existingStudent) {
      return NextResponse.json({ 
        error: existingStudent.studentId === studentId 
          ? 'Student ID already exists' 
          : 'Email address already exists'
      }, { status: 400 })
    }

    const student = await prisma.student.create({
      data: {
        studentId,
        name,
        email,
        phone
      }
    })

    return NextResponse.json(student, { status: 201 })
  } catch (error) {
    console.error('Error creating student:', error)
    if (error.code === 'P2002') {
      return NextResponse.json({ 
        error: 'Student ID or email already exists' 
      }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to create student' }, { status: 500 })
  }
}