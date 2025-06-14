import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { validateStudentData, sanitizeStudentData } from '@/lib/validation'

// GET single student
export async function GET(request, { params }) {
  try {
    const { id } = await params
    const student = await prisma.student.findUnique({
      where: { id: parseInt(id) }
    })

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 })
    }

    return NextResponse.json(student)
  } catch (error) {
    console.error('Error fetching student:', error)
    return NextResponse.json({ error: 'Failed to fetch student' }, { status: 500 })
  }
}

// PUT update student
export async function PUT(request, { params }) {
  try {
    const { id } = await params
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

    // Check if student exists
    const existingStudent = await prisma.student.findUnique({
      where: { id: parseInt(id) }
    })

    if (!existingStudent) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 })
    }

    const { studentId, name, email, phone } = sanitizedData

    // Check if studentId or email conflicts with other students
    const conflictingStudent = await prisma.student.findFirst({
      where: {
        AND: [
          { id: { not: parseInt(id) } },
          {
            OR: [
              { studentId: studentId },
              { email: email }
            ]
          }
        ]
      }
    })

    if (conflictingStudent) {
      return NextResponse.json({ 
        error: conflictingStudent.studentId === studentId 
          ? 'Student ID already exists' 
          : 'Email address already exists'
      }, { status: 400 })
    }

    const updatedStudent = await prisma.student.update({
      where: { id: parseInt(id) },
      data: {
        studentId,
        name,
        email,
        phone
      }
    })

    return NextResponse.json(updatedStudent)
  } catch (error) {
    console.error('Error updating student:', error)
    if (error.code === 'P2002') {
      return NextResponse.json({ 
        error: 'Student ID or email already exists' 
      }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to update student' }, { status: 500 })
  }
}

// DELETE student
export async function DELETE(request, { params }) {
  try {
    const { id } = await params

    // Check if student exists
    const existingStudent = await prisma.student.findUnique({
      where: { id: parseInt(id) }
    })

    if (!existingStudent) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 })
    }

    await prisma.student.delete({
      where: { id: parseInt(id) }
    })

    return NextResponse.json({ message: 'Student deleted successfully' })
  } catch (error) {
    console.error('Error deleting student:', error)
    return NextResponse.json({ error: 'Failed to delete student' }, { status: 500 })
  }
}