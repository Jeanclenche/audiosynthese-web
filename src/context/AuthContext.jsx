import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [customer, setCustomer] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchCustomer = useCallback(async (userId) => {
    const { data } = await supabase
      .from('customers')
      .select('*')
      .eq('auth_user_id', userId)
      .single()
    setCustomer(data)
  }, [])

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) fetchCustomer(session.user.id)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchCustomer(session.user.id)
      } else {
        setCustomer(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [fetchCustomer])

  async function signIn(email, password) {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
  }

  async function signUp({ email, password, fullName, phone, companyName, billingAddress, shippingAddress, shippingSameAsBilling }) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    })
    if (error) throw error

    const authUserId = data.user?.id
    if (!authUserId) return data // email confirmation required, no user yet

    // Check if a customer with this email already exists (previous web order without account)
    const { data: existing } = await supabase
      .from('customers')
      .select('id')
      .eq('email', email)
      .is('auth_user_id', null)
      .single()

    if (existing) {
      // Link existing customer to auth user
      const { error: updateErr } = await supabase
        .from('customers')
        .update({
          auth_user_id: authUserId,
          full_name: fullName,
          phone: phone || '',
          company_name: companyName || '',
          billing_address: billingAddress || '',
          shipping_address: shippingSameAsBilling ? billingAddress : (shippingAddress || ''),
          shipping_same_as_billing: shippingSameAsBilling ?? true,
        })
        .eq('id', existing.id)
      if (updateErr) throw updateErr
    } else {
      // Create new customer
      const { error: insertErr } = await supabase
        .from('customers')
        .insert({
          auth_user_id: authUserId,
          full_name: fullName,
          email,
          phone: phone || '',
          company_name: companyName || '',
          billing_address: billingAddress || '',
          shipping_address: shippingSameAsBilling ? billingAddress : (shippingAddress || ''),
          shipping_same_as_billing: shippingSameAsBilling ?? true,
        })
      if (insertErr) throw insertErr
    }

    await fetchCustomer(authUserId)
    return data
  }

  async function signOut() {
    await supabase.auth.signOut()
    setUser(null)
    setCustomer(null)
  }

  async function updateProfile(updates) {
    if (!customer) return
    const { error } = await supabase
      .from('customers')
      .update(updates)
      .eq('id', customer.id)
    if (error) throw error
    setCustomer(prev => ({ ...prev, ...updates }))
  }

  return (
    <AuthContext.Provider value={{ user, customer, loading, signIn, signUp, signOut, updateProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
