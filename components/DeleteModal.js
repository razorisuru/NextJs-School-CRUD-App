'use client'

import { useActionState, useEffect, useRef } from 'react'
import toast from 'react-hot-toast'

export default function DeleteModal({ 
  isOpen, 
  onClose, 
  student, 
  onSuccess 
}) {
  const modalRef = useRef(null)

  // Delete action using React 19's useActionState
  async function deleteStudent() {
    try {
      const response = await fetch(`/api/students/${student.id}`, {
        method: 'DELETE'
      })

      const result = await response.json()

      if (!response.ok) {
        return { error: result.error || 'Something went wrong' }
      }

      toast.success('Student deleted successfully!')
      onSuccess()
      onClose()
      
      return { success: true }
    } catch (error) {
      console.error('Error deleting student:', error)
      return { error: 'Network error. Please try again.' }
    }
  }

  const [state, action, isPending] = useActionState(deleteStudent, { error: null })

  // Close modal on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen || !student) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
      <div 
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 animate-slide-up"
      >
        <div className="p-6">
          <div className="flex items-center mb-4">
            <div className="flex-shrink-0 w-10 h-10 mx-auto flex items-center justify-center rounded-full bg-red-100">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5C2.962 18.333 3.924 20 5.464 20z" />
              </svg>
            </div>
          </div>
          
          <h3 className="text-lg font-medium text-gray-900 text-center mb-2">
            Delete Student
          </h3>
          
          <p className="text-sm text-gray-500 text-center mb-6">
            Are you sure you want to delete <span className="font-medium text-gray-900">{student.name}</span>? 
            This action cannot be undone.
          </p>

          {state?.error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
              {state.error}
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
              disabled={isPending}
            >
              Cancel
            </button>
            
            <form action={action} className="flex-1">
              <button
                type="submit"
                disabled={isPending}
                className="w-full px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isPending ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Deleting...
                  </div>
                ) : (
                  'Delete Student'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}