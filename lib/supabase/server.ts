/**
 * Backend proxy client for server-side operations
 * Replaces Supabase with direct backend API calls via fetch
 */

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000"

/**
 * Get authorization token from headers or cookies
 */
function getAuthToken() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('access_token')
  }
  return null
}

/**
 * Create a backend API client for server operations
 */
export async function createClient() {
  return {
    /**
     * Mock Supabase auth interface - redirects to backend API
     */
    auth: {
      async getUser() {
        try {
          const token = getAuthToken()
          if (!token) {
            return { data: { user: null }, error: new Error("Not authenticated") }
          }
          
          const response = await fetch(`${BACKEND_URL}/api/auth/me`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          })
          
          if (!response.ok) {
            return { data: { user: null }, error: new Error("Failed to get user") }
          }
          
          const user = await response.json()
          return { data: { user }, error: null }
        } catch (error) {
          return { data: { user: null }, error }
        }
      },
      
      async signUp(credentials: any) {
        try {
          const response = await fetch(`${BACKEND_URL}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
              name: credentials.options?.data?.full_name || 'User',
            }),
          })
          
          if (!response.ok) {
            const error = await response.json()
            return { data: null, error: new Error(error.detail || 'Signup failed') }
          }
          
          const data = await response.json()
          return { data: { user: data.user }, error: null }
        } catch (error) {
          return { data: null, error }
        }
      },
      
      async signInWithPassword(credentials: any) {
        try {
          const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials),
          })
          
          if (!response.ok) {
            const error = await response.json()
            return { data: null, error: new Error(error.detail || 'Login failed') }
          }
          
          const data = await response.json()
          // Store tokens in localStorage
          if (typeof window !== 'undefined') {
            localStorage.setItem('access_token', data.access_token)
            localStorage.setItem('refresh_token', data.refresh_token)
          }
          return { data: { user: data.user }, error: null }
        } catch (error) {
          return { data: null, error }
        }
      },
      
      async signOut() {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('access_token')
          localStorage.removeItem('refresh_token')
        }
        return { error: null }
      },
    },
    
    /**
     * Mock database interface - redirects to backend API
     */
    from(table: string) {
      return {
        async select(query: string = '*') {
          const token = getAuthToken()
          if (!token) {
            return { data: null, error: new Error("Not authenticated") }
          }
          
          try {
            // Map table names to backend endpoints
            const endpoint = table === 'deadlines' ? '/api/tasks' : `/api/${table}`
            const response = await fetch(`${BACKEND_URL}${endpoint}`, {
              headers: {
                'Authorization': `Bearer ${token}`,
              },
            })
            
            if (!response.ok) {
              return { data: null, error: new Error(`Failed to fetch ${table}`) }
            }
            
            const data = await response.json()
            return { data, error: null }
          } catch (error) {
            return { data: null, error }
          }
        },
        
        async insert(data: any) {
          const token = getAuthToken()
          if (!token) {
            return { data: null, error: new Error("Not authenticated") }
          }
          
          try {
            const endpoint = '/api/tasks'
            const response = await fetch(`${BACKEND_URL}${endpoint}`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(data),
            })
            
            if (!response.ok) {
              return { data: null, error: new Error("Insert failed") }
            }
            
            const result = await response.json()
            return { data: result, error: null }
          } catch (error) {
            return { data: null, error }
          }
        },
        
        eq(field: string, value: any) {
          return this
        },
      }
    },
  }
}

export { createClient as createServerClient }
