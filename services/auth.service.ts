import { Session } from "@supabase/supabase-js";
import { ROLE } from "../constants/role.constant";
import { TAuthUser, TPayloadResendSignUpVerificationMail, TPayloadResetPassword, TPayloadSendForgotPasswordMail, TPayloadSignIn, TPayloadSignUp, TPayloadVerifyOtp } from "../types/auth.type";
import { FileHandler } from "../utilities/file-handler";
import { supabase } from "../utilities/supabase";
import { findUserActiveSubscription } from "./subscription.service";

export async function signInWithPasswordSupabase(
    payload: TPayloadSignIn
  ): Promise<{ session: Session; user: TAuthUser }> { 
    const { data, error } = await supabase.auth.signInWithPassword(payload)
  
    if (error) throw error
  
    const { data: user, error: _error } = await supabase
      .from("user_profiles")
      .select(
        "id, email, firstName:first_name, lastName: last_name, name, role, profilePicture:avatar_url"
      )
      .eq("email", payload.email)
      .is("deleted_at", null)
      .single<TAuthUser>()
  
    if (_error) throw _error
  
    if (user.profilePicture)
      user.profilePicture = (new FileHandler()).readFile({ filePath: user.profilePicture })
  
    return {
      session: data.session,
      user,
    }
  }

  export async function verifyOtp(payload: TPayloadVerifyOtp): Promise<{ user: TAuthUser | null; session: Session | null }> {
    const { data, error } = await supabase.auth.verifyOtp(payload)
    if (error) throw error


    const { data: user, error: _error } = await supabase
      .from("user_profiles")
      .select(
        "id, email, firstName:first_name, lastName: last_name, name, role, profilePicture:avatar_url"
      )
      .eq("id", data.user!.id)
      .is("deleted_at", null)
      .single<TAuthUser>()
  
    if (_error) throw _error

    return {
      user: user,
      session: data.session as Session,
    }
  }
  
  export async function signUp(payload: TPayloadSignUp): Promise<void> {
    const name = payload.lastName
      ? `${payload.firstName} ${payload.lastName}`
      : payload.firstName
  
    const { error } = await supabase.auth.signUp({
      email: payload.email,
      password: payload.password,
      options: {
        data: {
          first_name: payload.firstName,
          last_name: payload.lastName,
          phone_number: payload.phoneNumber,
          role: ROLE.ATHLETE,
          name,
        },
      },
    })
    if (error) throw error
  }
  
  export async function resendSignupVerificationMail({
    email,
  }: TPayloadResendSignUpVerificationMail): Promise<void> {
    const { error } = await supabase.auth.resend({
      email,
      type: "signup",
    })
    if (error) throw error
  }
  
  export async function sendForgotPasswordMail({
    email,
    redirectTo,
  }: TPayloadSendForgotPasswordMail): Promise<void> {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    })
    if (error) throw error
  }
  
  export async function resetPassword({
    password,
  }: TPayloadResetPassword): Promise<void> {
    const { error } = await supabase.auth.updateUser({
      password,
    })
    if (error) throw error
  }
  
  export async function signOut(): Promise<void> {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }
  
  export async function getCurrentUser(): Promise<TAuthUser> {
    const { data, error } = await supabase.auth.getUser()

    if (error) throw error
  
    const user = await getUserProfile({ userId: data.user.id })
  
    return {
        ...user,
        subscription: await findUserActiveSubscription(user.id)
    }
  }
  
  export async function getUserProfile(payload: { userId: string }): Promise<TAuthUser> {
    const { data, error } = await supabase
      .from("user_profiles")
      .select(
        "id,firstName:first_name,lastName:last_name,name,profilePicture:avatar_url,role,paymentGatewayId:payment_gateway_id,gender,dateOfBirth:date_of_birth,phoneNumber:phone"
      )
      .eq("id", payload.userId)
      .is("deleted_at", null)
      .single()
      .overrideTypes<TAuthUser>()
  
    if (error) throw error
  
    return data
  }
  
  export async function authSuccessCallback(): Promise<TAuthUser> {
    const authenticatedUser = await getCurrentUser()
  
    // Fire and forget — don't block the auth flow
    supabase
      .from("user_profiles")
      .update({
        last_login: new Date().toISOString(),
        ...(!authenticatedUser.role && { role: "coach" }),
      })
      .eq("id", authenticatedUser.id)
      .then(({ error }) => {
        if (error) console.error("Failed to update last_login:", error)
      })
  
    return {
      ...authenticatedUser,
      role: authenticatedUser.role || "coach",
    }
  }
  